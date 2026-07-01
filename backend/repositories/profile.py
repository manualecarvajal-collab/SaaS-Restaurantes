import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.profile import Profile
from repositories.base import BaseRepository
from schemas.profile import ProfileCreate, ProfileUpdate, ProfileResponse


class ProfileRepository(BaseRepository[Profile, ProfileCreate, ProfileUpdate, ProfileResponse]):
    def __init__(self, db: AsyncSession):
        super().__init__(Profile, ProfileResponse, db)

    async def get_by_email(self, email: str) -> ProfileResponse | None:
        stmt = select(Profile).where(Profile.email == email)
        result = await self.db.execute(stmt)
        instance = result.scalar_one_or_none()
        if instance is None:
            return None
        return await self._to_response(instance)

    async def get_by_restaurant(self, restaurant_id: uuid.UUID) -> list[ProfileResponse]:
        return await self.list(restaurant_id=restaurant_id)

    async def get_by_role(self, role: str) -> list[ProfileResponse]:
        return await self.list(role=role)
