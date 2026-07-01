import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from api.deps import get_current_admin
from core.database import get_db
from schemas.menu_category import MenuCategoryCreate, MenuCategoryResponse, MenuCategoryUpdate
from schemas.menu_item import MenuItemCreate, MenuItemResponse, MenuItemUpdate
from schemas.profile import ProfileResponse
from services.menu import MenuService

router = APIRouter()


# ============== Categories ==============

@router.get("/categories/restaurant/{restaurant_id}", response_model=list[MenuCategoryResponse])
async def list_categories(
    restaurant_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    service = MenuService(db)
    return await service.list_categories(restaurant_id)


@router.get("/categories/restaurant/{restaurant_id}/active", response_model=list[MenuCategoryResponse])
async def list_active_categories(
    restaurant_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    service = MenuService(db)
    return await service.list_active_categories(restaurant_id)


@router.get("/categories/{category_id}", response_model=MenuCategoryResponse)
async def get_category(
    category_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    service = MenuService(db)
    result = await service.get_category(category_id)
    if result is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    return result


@router.post("/categories", response_model=MenuCategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(
    data: MenuCategoryCreate,
    db: AsyncSession = Depends(get_db),
    _: ProfileResponse = Depends(get_current_admin),
):
    service = MenuService(db)
    return await service.create_category(data)


@router.patch("/categories/{category_id}", response_model=MenuCategoryResponse)
async def update_category(
    category_id: uuid.UUID,
    data: MenuCategoryUpdate,
    db: AsyncSession = Depends(get_db),
    _: ProfileResponse = Depends(get_current_admin),
):
    service = MenuService(db)
    result = await service.update_category(category_id, data)
    if result is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    return result


@router.delete("/categories/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(
    category_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _: ProfileResponse = Depends(get_current_admin),
):
    service = MenuService(db)
    deleted = await service.delete_category(category_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")


# ============== Items ==============

@router.get("/items/restaurant/{restaurant_id}", response_model=list[MenuItemResponse])
async def list_items(
    restaurant_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    service = MenuService(db)
    return await service.list_items(restaurant_id)


@router.get("/items/restaurant/{restaurant_id}/available", response_model=list[MenuItemResponse])
async def list_available_items(
    restaurant_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    service = MenuService(db)
    return await service.list_available_items(restaurant_id)


@router.get("/items/category/{category_id}", response_model=list[MenuItemResponse])
async def list_items_by_category(
    category_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    service = MenuService(db)
    return await service.list_items_by_category(category_id)


@router.get("/items/{item_id}", response_model=MenuItemResponse)
async def get_item(
    item_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    service = MenuService(db)
    result = await service.get_item(item_id)
    if result is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    return result


@router.post("/items", response_model=MenuItemResponse, status_code=status.HTTP_201_CREATED)
async def create_item(
    data: MenuItemCreate,
    db: AsyncSession = Depends(get_db),
    _: ProfileResponse = Depends(get_current_admin),
):
    service = MenuService(db)
    return await service.create_item(data)


@router.patch("/items/{item_id}", response_model=MenuItemResponse)
async def update_item(
    item_id: uuid.UUID,
    data: MenuItemUpdate,
    db: AsyncSession = Depends(get_db),
    _: ProfileResponse = Depends(get_current_admin),
):
    service = MenuService(db)
    result = await service.update_item(item_id, data)
    if result is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    return result


@router.delete("/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_item(
    item_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _: ProfileResponse = Depends(get_current_admin),
):
    service = MenuService(db)
    deleted = await service.delete_item(item_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
