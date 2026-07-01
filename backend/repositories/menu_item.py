import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.menu_item import MenuItem
from repositories.base import BaseRepository
from schemas.menu_item import MenuItemCreate, MenuItemUpdate, MenuItemResponse


class MenuItemRepository(BaseRepository[MenuItem, MenuItemCreate, MenuItemUpdate, MenuItemResponse]):
    def __init__(self, db: AsyncSession):
        super().__init__(MenuItem, MenuItemResponse, db)

    async def get_by_restaurant(self, restaurant_id: uuid.UUID) -> list[MenuItemResponse]:
        stmt = (
            select(MenuItem)
            .where(MenuItem.restaurant_id == restaurant_id)
            .order_by(MenuItem.sort_order)
        )
        result = await self.db.execute(stmt)
        instances = result.scalars().all()
        return [await self._to_response(inst) for inst in instances]

    async def get_by_category(self, category_id: uuid.UUID) -> list[MenuItemResponse]:
        stmt = (
            select(MenuItem)
            .where(MenuItem.category_id == category_id)
            .order_by(MenuItem.sort_order)
        )
        result = await self.db.execute(stmt)
        instances = result.scalars().all()
        return [await self._to_response(inst) for inst in instances]

    async def get_available_by_restaurant(self, restaurant_id: uuid.UUID) -> list[MenuItemResponse]:
        stmt = (
            select(MenuItem)
            .where(
                MenuItem.restaurant_id == restaurant_id,
                MenuItem.is_available == True,
            )
            .order_by(MenuItem.sort_order)
        )
        result = await self.db.execute(stmt)
        instances = result.scalars().all()
        return [await self._to_response(inst) for inst in instances]
