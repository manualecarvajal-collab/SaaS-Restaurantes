import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from repositories.menu_category import MenuCategoryRepository
from repositories.menu_item import MenuItemRepository
from schemas.menu_category import (
    MenuCategoryCreate,
    MenuCategoryUpdate,
    MenuCategoryResponse,
)
from schemas.menu_item import MenuItemCreate, MenuItemUpdate, MenuItemResponse


class MenuService:
    def __init__(self, db: AsyncSession):
        self.category_repo = MenuCategoryRepository(db)
        self.item_repo = MenuItemRepository(db)

    # Categories
    async def list_categories(self, restaurant_id: uuid.UUID) -> list[MenuCategoryResponse]:
        return await self.category_repo.get_by_restaurant(restaurant_id)

    async def list_active_categories(self, restaurant_id: uuid.UUID) -> list[MenuCategoryResponse]:
        return await self.category_repo.get_active_by_restaurant(restaurant_id)

    async def get_category(self, id: uuid.UUID) -> MenuCategoryResponse | None:
        return await self.category_repo.get_by_id(id)

    async def create_category(self, data: MenuCategoryCreate) -> MenuCategoryResponse:
        return await self.category_repo.create(data)

    async def update_category(self, id: uuid.UUID, data: MenuCategoryUpdate) -> MenuCategoryResponse | None:
        return await self.category_repo.update(id, data)

    async def delete_category(self, id: uuid.UUID) -> bool:
        return await self.category_repo.delete(id)

    # Items
    async def list_items(self, restaurant_id: uuid.UUID) -> list[MenuItemResponse]:
        return await self.item_repo.get_by_restaurant(restaurant_id)

    async def list_available_items(self, restaurant_id: uuid.UUID) -> list[MenuItemResponse]:
        return await self.item_repo.get_available_by_restaurant(restaurant_id)

    async def list_items_by_category(self, category_id: uuid.UUID) -> list[MenuItemResponse]:
        return await self.item_repo.get_by_category(category_id)

    async def get_item(self, id: uuid.UUID) -> MenuItemResponse | None:
        return await self.item_repo.get_by_id(id)

    async def create_item(self, data: MenuItemCreate) -> MenuItemResponse:
        return await self.item_repo.create(data)

    async def update_item(self, id: uuid.UUID, data: MenuItemUpdate) -> MenuItemResponse | None:
        return await self.item_repo.update(id, data)

    async def delete_item(self, id: uuid.UUID) -> bool:
        return await self.item_repo.delete(id)
