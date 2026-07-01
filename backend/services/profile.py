import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from repositories.profile import ProfileRepository
from schemas.profile import ProfileCreate, ProfileUpdate, ProfileResponse


class ProfileService:
    def __init__(self, db: AsyncSession):
        self.repo = ProfileRepository(db)

    async def get_by_id(self, id: uuid.UUID) -> ProfileResponse | None:
        return await self.repo.get_by_id(id)

    async def get_by_email(self, email: str) -> ProfileResponse | None:
        return await self.repo.get_by_email(email)

    async def list_by_restaurant(self, restaurant_id: uuid.UUID) -> list[ProfileResponse]:
        return await self.repo.get_by_restaurant(restaurant_id)

    async def list_by_role(self, role: str) -> list[ProfileResponse]:
        return await self.repo.get_by_role(role)

    async def create(self, data: ProfileCreate) -> ProfileResponse:
        return await self.repo.create(data)

    async def update(self, id: uuid.UUID, data: ProfileUpdate) -> ProfileResponse | None:
        return await self.repo.update(id, data)
