import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from api.deps import get_current_admin, get_current_user
from core.database import get_db
from schemas.order import OrderCreate, OrderResponse, OrderUpdate, OrderStatusUpdate
from schemas.profile import ProfileResponse
from services.order import OrderService

router = APIRouter()


@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(
    data: OrderCreate,
    db: AsyncSession = Depends(get_db),
):
    service = OrderService(db)
    return await service.create(data)


@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    service = OrderService(db)
    result = await service.get_by_id(order_id)
    if result is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return result


@router.get("/restaurant/{restaurant_id}", response_model=list[OrderResponse])
async def list_orders_by_restaurant(
    restaurant_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _: ProfileResponse = Depends(get_current_admin),
):
    service = OrderService(db)
    return await service.list_by_restaurant(restaurant_id)


@router.get("/restaurant/{restaurant_id}/pending", response_model=list[OrderResponse])
async def list_pending_orders(
    restaurant_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _: ProfileResponse = Depends(get_current_admin),
):
    service = OrderService(db)
    return await service.list_pending(restaurant_id)


@router.get("/table/{table_id}", response_model=list[OrderResponse])
async def list_orders_by_table(
    table_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    service = OrderService(db)
    return await service.list_by_table(table_id)


@router.patch("/{order_id}", response_model=OrderResponse)
async def update_order(
    order_id: uuid.UUID,
    data: OrderUpdate,
    db: AsyncSession = Depends(get_db),
):
    service = OrderService(db)
    result = await service.update(order_id, data)
    if result is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return result


@router.patch("/{order_id}/status", response_model=OrderResponse)
async def update_order_status(
    order_id: uuid.UUID,
    data: OrderStatusUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: ProfileResponse = Depends(get_current_admin),
):
    service = OrderService(db)
    result = await service.update_status_with_commission(
        order_id, data, changed_by=current_user.id,
    )
    if result is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return result
