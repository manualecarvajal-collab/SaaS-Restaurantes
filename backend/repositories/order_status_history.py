import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.order_status_history import OrderStatusHistory
from schemas.base import OrderStatusHistoryCreate


class OrderStatusHistoryRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, data: OrderStatusHistoryCreate) -> None:
        instance = OrderStatusHistory(
            order_id=data.order_id,
            from_status=data.from_status,
            to_status=data.to_status,
            changed_by=data.changed_by,
            notes=data.notes,
        )
        self.db.add(instance)
        await self.db.flush()

    async def get_by_order(self, order_id: uuid.UUID) -> list[dict]:
        stmt = (
            select(OrderStatusHistory)
            .where(OrderStatusHistory.order_id == order_id)
            .order_by(OrderStatusHistory.created_at)
        )
        result = await self.db.execute(stmt)
        instances = result.scalars().all()
        return [
            {
                "id": str(inst.id),
                "order_id": str(inst.order_id),
                "from_status": inst.from_status,
                "to_status": inst.to_status,
                "changed_by": str(inst.changed_by) if inst.changed_by else None,
                "notes": inst.notes,
                "created_at": inst.created_at.isoformat() if inst.created_at else None,
            }
            for inst in instances
        ]
