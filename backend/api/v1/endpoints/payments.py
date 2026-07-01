import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from api.deps import get_current_admin
from core.database import get_db
from schemas.payment import PaymentCreate, PaymentResponse
from schemas.profile import ProfileResponse
from services.payment import PaymentService

router = APIRouter()


@router.post("/", response_model=PaymentResponse, status_code=status.HTTP_201_CREATED)
async def submit_payment(
    data: PaymentCreate,
    db: AsyncSession = Depends(get_db),
):
    service = PaymentService(db)
    return await service.create(data)


@router.get("/{payment_id}", response_model=PaymentResponse)
async def get_payment(
    payment_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    service = PaymentService(db)
    result = await service.get_by_id(payment_id)
    if result is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payment not found")
    return result


@router.get("/order/{order_id}", response_model=list[PaymentResponse])
async def get_payments_by_order(
    order_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    service = PaymentService(db)
    return await service.get_by_order(order_id)


@router.get("/restaurant/{restaurant_id}/pending", response_model=list[PaymentResponse])
async def get_pending_payments(
    restaurant_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _: ProfileResponse = Depends(get_current_admin),
):
    service = PaymentService(db)
    return await service.get_pending_by_restaurant(restaurant_id)


@router.post("/{payment_id}/verify", response_model=PaymentResponse)
async def verify_payment(
    payment_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: ProfileResponse = Depends(get_current_admin),
):
    service = PaymentService(db)
    result = await service.confirm_payment(payment_id, verified_by=current_user.id)
    if result is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payment not found")
    return result


@router.post("/{payment_id}/reject", response_model=PaymentResponse)
async def reject_payment(
    payment_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: ProfileResponse = Depends(get_current_admin),
):
    service = PaymentService(db)
    result = await service.reject_payment(payment_id, verified_by=current_user.id)
    if result is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payment not found")
    return result
