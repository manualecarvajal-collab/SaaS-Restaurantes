import uuid

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from core.supabase import get_user_by_token
from repositories.profile import ProfileRepository
from schemas.profile import ProfileResponse

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db),
) -> ProfileResponse:
    token = credentials.credentials

    # Validate token with Supabase Auth
    user_data = await get_user_by_token(token)
    if user_data is None or user_data.get("id") is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    # Get the local profile
    repo = ProfileRepository(db)
    profile = await repo.get_by_id(uuid.UUID(user_data["id"]))
    if profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User profile not found",
        )
    return profile


async def get_current_admin(
    current_user: ProfileResponse = Depends(get_current_user),
) -> ProfileResponse:
    if current_user.role not in ("admin", "superadmin"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return current_user


async def get_current_superadmin(
    current_user: ProfileResponse = Depends(get_current_user),
) -> ProfileResponse:
    if current_user.role != "superadmin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Superadmin access required",
        )
    return current_user
