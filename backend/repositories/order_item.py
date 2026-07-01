import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.order_item import OrderItem
from schemas.order_item import OrderItemCreate, OrderItemResponse


class OrderItemRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def _to_response(self, instance: OrderItem) -> OrderItemResponse:
        return OrderItemResponse.model_validate(instance)

    async def create(self, data: OrderItemCreate, order_id: uuid.UUID) -> OrderItemResponse:
        instance = OrderItem(
            order_id=order_id,
            menu_item_id=data.menu_item_id,
            menu_item_name=data.menu_item_name,
            quantity=data.quantity,
            unit_price=data.unit_price,
            subtotal=data.subtotal,
            notes=data.notes,
        )
        self.db.add(instance)
        await self.db.flush()
        return await self._to_response(instance)

    async def create_many(self, items: list[OrderItemCreate], order_id: uuid.UUID) -> list[OrderItemResponse]:
        results = []
        for item in items:
            result = await self.create(item, order_id)
            results.append(result)
        return results

    async def get_by_order(self, order_id: uuid.UUID) -> list[OrderItemResponse]:
        stmt = select(OrderItem).where(OrderItem.order_id == order_id)
        result = await self.db.execute(stmt)
        instances = result.scalars().all()
        return [await self._to_response(inst) for inst in instances]
