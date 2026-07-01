import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.payment import Payment
from repositories.base import BaseRepository
from schemas.payment import PaymentCreate, PaymentUpdate, PaymentResponse


class PaymentRepository(BaseRepository[Payment, PaymentCreate, PaymentUpdate, PaymentResponse]):
    def __init__(self, db: AsyncSession):
        super().__init__(Payment, PaymentResponse, db)

    async def get_by_order(self, order_id: uuid.UUID) -> list[PaymentResponse]:
        return await self.list(order_id=order_id)

    async def get_by_restaurant(self, restaurant_id: uuid.UUID) -> list[PaymentResponse]:
        return await self.list(restaurant_id=restaurant_id)

    async def get_pending_payments(self, restaurant_id: uuid.UUID) -> list[PaymentResponse]:
        stmt = select(Payment).where(
            Payment.restaurant_id == restaurant_id,
            Payment.status == "PENDING",
        )
        result = await self.db.execute(stmt)
        instances = result.scalars().all()
        return [await self._to_response(inst) for inst in instances]

    async def verify_payment(self, id: uuid.UUID, verified_by: uuid.UUID) -> PaymentResponse | None:
        from datetime import datetime, timezone
        from sqlalchemy import update

        stmt = (
            update(Payment)
            .where(Payment.id == id)
            .values(
                status="VERIFIED",
                verified_by=verified_by,
                verified_at=datetime.now(timezone.utc),
            )
            .returning(Payment)
        )
        result = await self.db.execute(stmt)
        await self.db.flush()
        instance = result.scalar_one_or_none()
        if instance is None:
            return None
        return await self._to_response(instance)

    async def reject_payment(self, id: uuid.UUID, verified_by: uuid.UUID) -> PaymentResponse | None:
        from datetime import datetime, timezone
        from sqlalchemy import update

        stmt = (
            update(Payment)
            .where(Payment.id == id)
            .values(
                status="REJECTED",
                verified_by=verified_by,
                verified_at=datetime.now(timezone.utc),
            )
            .returning(Payment)
        )
        result = await self.db.execute(stmt)
        await self.db.flush()
        instance = result.scalar_one_or_none()
        if instance is None:
            return None
        return await self._to_response(instance)
