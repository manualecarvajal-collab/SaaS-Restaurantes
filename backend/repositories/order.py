import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.order import Order
from repositories.base import BaseRepository
from schemas.order import OrderCreate, OrderUpdate, OrderResponse, OrderStatusUpdate


class OrderRepository(BaseRepository[Order, OrderCreate, OrderUpdate, OrderResponse]):
    def __init__(self, db: AsyncSession):
        super().__init__(Order, OrderResponse, db)

    async def create_order(self, data: OrderCreate) -> Order:
        instance = Order(
            restaurant_id=data.restaurant_id,
            table_id=data.table_id,
            diner_name=data.diner_name,
            notes=data.notes,
        )
        self.db.add(instance)
        await self.db.flush()
        return instance

    async def get_by_restaurant(self, restaurant_id: uuid.UUID) -> list[OrderResponse]:
        stmt = (
            select(Order)
            .where(Order.restaurant_id == restaurant_id)
            .order_by(Order.created_at.desc())
        )
        result = await self.db.execute(stmt)
        instances = result.scalars().all()
        return [await self._to_response(inst) for inst in instances]

    async def get_by_table(self, table_id: uuid.UUID) -> list[OrderResponse]:
        stmt = (
            select(Order)
            .where(Order.table_id == table_id)
            .order_by(Order.created_at.desc())
        )
        result = await self.db.execute(stmt)
        instances = result.scalars().all()
        return [await self._to_response(inst) for inst in instances]

    async def update_status(self, id: uuid.UUID, status_update: OrderStatusUpdate) -> OrderResponse | None:
        from sqlalchemy import update
        stmt = (
            update(Order)
            .where(Order.id == id)
            .values(status=status_update.status)
            .returning(Order)
        )
        result = await self.db.execute(stmt)
        await self.db.flush()
        instance = result.scalar_one_or_none()
        if instance is None:
            return None
        return await self._to_response(instance)

    async def get_pending_orders(self, restaurant_id: uuid.UUID) -> list[OrderResponse]:
        stmt = (
            select(Order)
            .where(
                Order.restaurant_id == restaurant_id,
                Order.status.in_(["PENDING", "PAYMENT_SENT"]),
            )
            .order_by(Order.created_at.desc())
        )
        result = await self.db.execute(stmt)
        instances = result.scalars().all()
        return [await self._to_response(inst) for inst in instances]
