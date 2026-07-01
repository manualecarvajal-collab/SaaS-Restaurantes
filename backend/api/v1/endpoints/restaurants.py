import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from api.deps import get_current_admin, get_current_superadmin
from core.database import get_db
from schemas.profile import ProfileResponse
from schemas.restaurant import RestaurantCreate, RestaurantResponse, RestaurantUpdate
from services.restaurant import RestaurantService

router = APIRouter()


@router.get("/", response_model=list[RestaurantResponse])
async def list_restaurants(
    db: AsyncSession = Depends(get_db),
    _: ProfileResponse = Depends(get_current_superadmin),
):
    service = RestaurantService(db)
    return await service.list()


@router.get("/{restaurant_id}", response_model=RestaurantResponse)
async def get_restaurant(
    restaurant_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _: ProfileResponse = Depends(get_current_admin),
):
    service = RestaurantService(db)
    result = await service.get_by_id(restaurant_id)
    if result is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Restaurant not found")
    return result


@router.post("/", response_model=RestaurantResponse, status_code=status.HTTP_201_CREATED)
async def create_restaurant(
    data: RestaurantCreate,
    db: AsyncSession = Depends(get_db),
    _: ProfileResponse = Depends(get_current_superadmin),
):
    service = RestaurantService(db)
    return await service.create(data)


@router.patch("/{restaurant_id}", response_model=RestaurantResponse)
async def update_restaurant(
    restaurant_id: uuid.UUID,
    data: RestaurantUpdate,
    db: AsyncSession = Depends(get_db),
    _: ProfileResponse = Depends(get_current_superadmin),
):
    service = RestaurantService(db)
    result = await service.update(restaurant_id, data)
    if result is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Restaurant not found")
    return result


@router.delete("/{restaurant_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_restaurant(
    restaurant_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _: ProfileResponse = Depends(get_current_superadmin),
):
    service = RestaurantService(db)
    deleted = await service.delete(restaurant_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Restaurant not found")
