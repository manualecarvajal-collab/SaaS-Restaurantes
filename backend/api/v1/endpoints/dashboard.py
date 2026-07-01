import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from api.deps import get_current_admin, get_current_superadmin
from core.database import get_db
from schemas.dashboard import (
    GlobalDashboardResponse,
    ProvisionRequest,
    ProvisionResponse,
    RecentOrder,
    RestaurantDashboardResponse,
)
from schemas.profile import ProfileResponse
from services.dashboard import DashboardService

router = APIRouter()

# Schemas for inline use
from pydantic import BaseModel
from datetime import datetime


class RecentOrdersResponse(BaseModel):
    orders: list[RecentOrder]
    total: int


@router.get("/global", response_model=GlobalDashboardResponse)
async def get_global_dashboard(
    db: AsyncSession = Depends(get_db),
    _: ProfileResponse = Depends(get_current_superadmin),
):
    service = DashboardService(db)
    return await service.get_global_dashboard()


@router.get("/recent-orders", response_model=RecentOrdersResponse)
async def get_recent_orders(
    limit: int = Query(default=20, le=100),
    db: AsyncSession = Depends(get_db),
    _: ProfileResponse = Depends(get_current_superadmin),
):
    service = DashboardService(db)
    orders = await service.get_recent_orders(limit)
    return RecentOrdersResponse(orders=orders, total=len(orders))


@router.get("/restaurant/{restaurant_id}", response_model=RestaurantDashboardResponse)
async def get_restaurant_dashboard(
    restaurant_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _: ProfileResponse = Depends(get_current_admin),
):
    service = DashboardService(db)
    result = await service.get_restaurant_dashboard(restaurant_id)
    if result is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Restaurant not found")
    return result


@router.post("/provision", response_model=ProvisionResponse, status_code=status.HTTP_201_CREATED)
async def provision_restaurant(
    data: ProvisionRequest,
    db: AsyncSession = Depends(get_db),
    _: ProfileResponse = Depends(get_current_superadmin),
):
    service = DashboardService(db)
    return await service.provision_restaurant(data)
