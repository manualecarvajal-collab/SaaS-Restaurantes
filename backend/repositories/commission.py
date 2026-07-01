import uuid
from typing import Any

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from models.commission import Commission
from schemas.commission import CommissionResponse


class CommissionRepository:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.model = Commission
        self.response_schema = CommissionResponse

    async def _to_response(self, instance: Commission) -> CommissionResponse:
        return self.response_schema.model_validate(instance)

    async def list(self, **filters: Any) -> list[CommissionResponse]:
        stmt = select(self.model)
        for key, value in filters.items():
            if hasattr(self.model, key):
                stmt = stmt.where(getattr(self.model, key) == value)
        result = await self.db.execute(stmt)
        instances = result.scalars().all()
        return [await self._to_response(inst) for inst in instances]

    async def create_from_data(self, restaurant_id: uuid.UUID, order_id: uuid.UUID,
                                amount: float = 0.10, currency: str = "USD") -> CommissionResponse:
        instance = Commission(
            restaurant_id=restaurant_id,
            order_id=order_id,
            amount=amount,
            currency=currency,
        )
        self.db.add(instance)
        await self.db.flush()
        return await self._to_response(instance)

    async def get_by_restaurant(self, restaurant_id: uuid.UUID) -> list[CommissionResponse]:
        return await self.list(restaurant_id=restaurant_id)

    async def get_total_by_restaurant(self, restaurant_id: uuid.UUID) -> float:
        stmt = select(func.sum(Commission.amount)).where(
            Commission.restaurant_id == restaurant_id
        )
        result = await self.db.execute(stmt)
        total = result.scalar()
        return float(total) if total else 0.0

    async def get_total_commissions(self) -> float:
        stmt = select(func.sum(Commission.amount))
        result = await self.db.execute(stmt)
        total = result.scalar()
        return float(total) if total else 0.0
