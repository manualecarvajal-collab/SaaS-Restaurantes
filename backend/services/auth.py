import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from core.supabase import sign_in_with_password, create_auth_user, get_user_by_token
from repositories.profile import ProfileRepository
from schemas.auth import LoginRequest, SignupRequest, Token
from schemas.profile import ProfileCreate, ProfileResponse


class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.profile_repo = ProfileRepository(db)

    async def login(self, request: LoginRequest) -> Token | None:
        # Authenticate via Supabase Auth
        session = await sign_in_with_password(request.email, request.password)
        if session is None or session.get("access_token") is None:
            return None

        return Token(access_token=session["access_token"])

    async def signup(self, request: SignupRequest) -> ProfileResponse:
        # 1. Create user in Supabase Auth
        auth_user = await create_auth_user(
            email=request.email,
            password=request.password,
            email_confirm=True,
        )
        if auth_user is None:
            raise ValueError("Failed to create auth user")

        # 2. Create profile in our database with the Supabase user ID
        rid = uuid.UUID(request.restaurant_id) if request.restaurant_id else None
        profile_data = ProfileCreate(
            id=uuid.UUID(auth_user["id"]),
            email=request.email,
            full_name=request.full_name,
            role="admin",
            restaurant_id=rid,
        )
        profile = await self.profile_repo.create(profile_data)
        return profile

    async def get_profile_by_token(self, token: str) -> ProfileResponse | None:
        """Get the user's profile from a Supabase JWT token."""
        user_data = await get_user_by_token(token)
        if user_data is None:
            return None
        profile = await self.profile_repo.get_by_id(uuid.UUID(user_data["id"]))
        return profile
