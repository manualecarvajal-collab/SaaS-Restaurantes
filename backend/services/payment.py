import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from repositories.payment import PaymentRepository
from schemas.payment import PaymentCreate, PaymentUpdate, PaymentResponse
from services.order import OrderService


class PaymentService:
    def __init__(self, db: AsyncSession):
        self.repo = PaymentRepository(db)
        self.order_service = OrderService(db)
        self.db = db

    async def create(self, data: PaymentCreate) -> PaymentResponse:
        payment = await self.repo.create(data)

        from schemas.order import OrderStatusUpdate
        await self.order_service.update_status(
            data.order_id,
            OrderStatusUpdate(status="PAYMENT_SENT"),
        )

        return payment

    async def get_by_id(self, id: uuid.UUID) -> PaymentResponse | None:
        return await self.repo.get_by_id(id)

    async def get_by_order(self, order_id: uuid.UUID) -> list[PaymentResponse]:
        return await self.repo.get_by_order(order_id)

    async def get_pending_by_restaurant(self, restaurant_id: uuid.UUID) -> list[PaymentResponse]:
        return await self.repo.get_pending_payments(restaurant_id)

    async def verify_payment(self, id: uuid.UUID, verified_by: uuid.UUID) -> PaymentResponse | None:
        return await self.repo.verify_payment(id, verified_by)

    async def reject_payment(self, id: uuid.UUID, verified_by: uuid.UUID) -> PaymentResponse | None:
        return await self.repo.reject_payment(id, verified_by)

    async def confirm_payment(self, id: uuid.UUID, verified_by: uuid.UUID) -> PaymentResponse | None:
        payment = await self.repo.verify_payment(id, verified_by)
        if payment:
            from schemas.order import OrderStatusUpdate
            order_service = OrderService(self.db)
            await order_service.update_status_with_commission(
                payment.order_id,
                OrderStatusUpdate(status="CONFIRMED"),
                changed_by=verified_by,
            )
        return payment
