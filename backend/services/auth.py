import uuid

from sqlalchemy import select, update as sa_update
from sqlalchemy.ext.asyncio import AsyncSession

from core.security import create_access_token, get_password_hash, verify_password
from models.profile import Profile
from repositories.profile import ProfileRepository
from schemas.auth import LoginRequest, SignupRequest, Token
from schemas.profile import ProfileCreate, ProfileResponse


class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.profile_repo = ProfileRepository(db)

    async def login(self, request: LoginRequest) -> Token | None:
        stmt = select(Profile).where(Profile.email == request.email)
        result = await self.db.execute(stmt)
        instance = result.scalar_one_or_none()

        if instance is None or not verify_password(request.password, instance.hashed_password):
            return None

        access_token = create_access_token(subject=str(instance.id))
        return Token(access_token=access_token)

    async def signup(self, request: SignupRequest) -> ProfileResponse:
        hashed = get_password_hash(request.password)
        rid = uuid.UUID(request.restaurant_id) if request.restaurant_id else None
        profile_data = ProfileCreate(
            id=uuid.uuid4(),
            email=request.email,
            full_name=request.full_name,
            role="admin",
            restaurant_id=rid,
        )
        profile = await self.profile_repo.create(profile_data)
        stmt = (
            sa_update(Profile)
            .where(Profile.id == profile.id)
            .values(hashed_password=hashed)
        )
        await self.db.execute(stmt)
        await self.db.flush()
        return profile
