import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from repositories.commission import CommissionRepository
from schemas.commission import CommissionResponse


class CommissionService:
    def __init__(self, db: AsyncSession):
        self.repo = CommissionRepository(db)

    async def create_for_order(self, order_id: uuid.UUID, restaurant_id: uuid.UUID) -> CommissionResponse:
        return await self.repo.create_from_data(restaurant_id, order_id)

    async def get_by_restaurant(self, restaurant_id: uuid.UUID) -> list[CommissionResponse]:
        return await self.repo.get_by_restaurant(restaurant_id)

    async def get_total_by_restaurant(self, restaurant_id: uuid.UUID) -> float:
        return await self.repo.get_total_by_restaurant(restaurant_id)

    async def get_total_global(self) -> float:
        return await self.repo.get_total_commissions()
