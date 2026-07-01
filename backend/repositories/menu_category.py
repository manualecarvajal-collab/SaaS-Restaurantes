import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.menu_category import MenuCategory
from repositories.base import BaseRepository
from schemas.menu_category import MenuCategoryCreate, MenuCategoryUpdate, MenuCategoryResponse


class MenuCategoryRepository(BaseRepository[MenuCategory, MenuCategoryCreate, MenuCategoryUpdate, MenuCategoryResponse]):
    def __init__(self, db: AsyncSession):
        super().__init__(MenuCategory, MenuCategoryResponse, db)

    async def get_by_restaurant(self, restaurant_id: uuid.UUID) -> list[MenuCategoryResponse]:
        stmt = (
            select(MenuCategory)
            .where(MenuCategory.restaurant_id == restaurant_id)
            .order_by(MenuCategory.sort_order)
        )
        result = await self.db.execute(stmt)
        instances = result.scalars().all()
        return [await self._to_response(inst) for inst in instances]

    async def get_active_by_restaurant(self, restaurant_id: uuid.UUID) -> list[MenuCategoryResponse]:
        stmt = (
            select(MenuCategory)
            .where(
                MenuCategory.restaurant_id == restaurant_id,
                MenuCategory.is_active == True,
            )
            .order_by(MenuCategory.sort_order)
        )
        result = await self.db.execute(stmt)
        instances = result.scalars().all()
        return [await self._to_response(inst) for inst in instances]
