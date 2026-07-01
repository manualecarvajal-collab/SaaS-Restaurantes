import uuid

from sqlalchemy import update as sa_update
from sqlalchemy.ext.asyncio import AsyncSession

from models.order import Order
from repositories.order import OrderRepository
from repositories.order_item import OrderItemRepository
from repositories.order_status_history import OrderStatusHistoryRepository
from schemas.base import OrderStatusHistoryCreate
from schemas.order import OrderCreate, OrderUpdate, OrderResponse, OrderStatusUpdate


class OrderService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.order_repo = OrderRepository(db)
        self.order_item_repo = OrderItemRepository(db)
        self.history_repo = OrderStatusHistoryRepository(db)

    async def create(self, data: OrderCreate) -> OrderResponse:
        order = await self.order_repo.create_order(data)
        total = sum(item.subtotal for item in data.items)

        for item in data.items:
            await self.order_item_repo.create(item, order.id)

        stmt = (
            sa_update(Order)
            .where(Order.id == order.id)
            .values(total_amount=total)
        )
        await self.db.execute(stmt)
        await self.db.flush()

        return await self.order_repo.get_by_id(order.id)

    async def get_by_id(self, id: uuid.UUID) -> OrderResponse | None:
        return await self.order_repo.get_by_id(id)

    async def list_by_restaurant(self, restaurant_id: uuid.UUID) -> list[OrderResponse]:
        return await self.order_repo.get_by_restaurant(restaurant_id)

    async def list_by_table(self, table_id: uuid.UUID) -> list[OrderResponse]:
        return await self.order_repo.get_by_table(table_id)

    async def list_pending(self, restaurant_id: uuid.UUID) -> list[OrderResponse]:
        return await self.order_repo.get_pending_orders(restaurant_id)

    async def update_status(self, id: uuid.UUID, status_update: OrderStatusUpdate,
                            changed_by: uuid.UUID | None = None) -> OrderResponse | None:
        current = await self.order_repo.get_by_id(id)
        if current is None:
            return None

        from_status = current.status
        result = await self.order_repo.update_status(id, status_update)

        if result:
            history_data = OrderStatusHistoryCreate(
                order_id=id,
                from_status=from_status,
                to_status=status_update.status,
                changed_by=changed_by,
            )
            await self.history_repo.create(history_data)

        return result

    async def update(self, id: uuid.UUID, data: OrderUpdate) -> OrderResponse | None:
        return await self.order_repo.update(id, data)

    async def update_status_with_commission(
        self, id: uuid.UUID, status_update: OrderStatusUpdate,
        changed_by: uuid.UUID | None = None,
    ) -> OrderResponse | None:
        result = await self.update_status(id, status_update, changed_by)
        if result and status_update.status == "CONFIRMED":
            from services.commission import CommissionService
            commission_service = CommissionService(self.db)
            await commission_service.create_for_order(result.id, result.restaurant_id)
        return result
