import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from api.deps import get_current_admin, get_current_superadmin
from core.database import get_db
from schemas.commission import CommissionResponse
from schemas.profile import ProfileResponse
from services.commission import CommissionService

router = APIRouter()


@router.get("/restaurant/{restaurant_id}", response_model=list[CommissionResponse])
async def list_commissions(
    restaurant_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _: ProfileResponse = Depends(get_current_admin),
):
    service = CommissionService(db)
    return await service.get_by_restaurant(restaurant_id)


@router.get("/restaurant/{restaurant_id}/total")
async def get_commission_total(
    restaurant_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _: ProfileResponse = Depends(get_current_admin),
):
    service = CommissionService(db)
    total = await service.get_total_by_restaurant(restaurant_id)
    return {"restaurant_id": str(restaurant_id), "total": total, "currency": "USD"}


@router.get("/global/total")
async def get_global_commission_total(
    db: AsyncSession = Depends(get_db),
    _: ProfileResponse = Depends(get_current_superadmin),
):
    service = CommissionService(db)
    total = await service.get_total_global()
    return {"total": total, "currency": "USD"}
