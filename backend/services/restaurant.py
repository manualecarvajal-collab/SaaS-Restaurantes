import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from repositories.restaurant import RestaurantRepository
from schemas.restaurant import RestaurantCreate, RestaurantUpdate, RestaurantResponse


class RestaurantService:
    def __init__(self, db: AsyncSession):
        self.repo = RestaurantRepository(db)

    async def list(self) -> list[RestaurantResponse]:
        return await self.repo.list()

    async def get_by_id(self, id: uuid.UUID) -> RestaurantResponse | None:
        return await self.repo.get_by_id(id)

    async def create(self, data: RestaurantCreate) -> RestaurantResponse:
        return await self.repo.create(data)

    async def update(self, id: uuid.UUID, data: RestaurantUpdate) -> RestaurantResponse | None:
        return await self.repo.update(id, data)

    async def delete(self, id: uuid.UUID) -> bool:
        return await self.repo.delete(id)
