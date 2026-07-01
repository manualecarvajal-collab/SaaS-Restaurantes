import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import update as sa_update
from sqlalchemy.ext.asyncio import AsyncSession

from api.deps import get_current_superadmin
from core.database import get_db
from core.security import get_password_hash
from models.profile import Profile
from schemas.profile import AdminCreate, ProfileResponse, ProfileUpdate
from services.profile import ProfileService

router = APIRouter()


@router.get("/", response_model=list[ProfileResponse])
async def list_all_admins(
    db: AsyncSession = Depends(get_db),
    _: ProfileResponse = Depends(get_current_superadmin),
):
    service = ProfileService(db)
    return await service.list_by_role("admin")


@router.get("/restaurant/{restaurant_id}", response_model=list[ProfileResponse])
async def list_admins_by_restaurant(
    restaurant_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _: ProfileResponse = Depends(get_current_superadmin),
):
    service = ProfileService(db)
    return await service.list_by_restaurant(restaurant_id)


@router.post("/", response_model=ProfileResponse, status_code=status.HTTP_201_CREATED)
async def create_admin(
    data: AdminCreate,
    db: AsyncSession = Depends(get_db),
    _: ProfileResponse = Depends(get_current_superadmin),
):
    hashed = get_password_hash(data.password)
    admin_id = uuid.uuid4()
    admin = Profile(
        id=admin_id,
        email=data.email,
        full_name=data.full_name,
        hashed_password=hashed,
        role="admin",
        restaurant_id=data.restaurant_id,
        is_active=True,
    )
    db.add(admin)
    await db.flush()
    service = ProfileService(db)
    return await service.get_by_id(admin_id)


@router.patch("/{profile_id}", response_model=ProfileResponse)
async def update_admin(
    profile_id: uuid.UUID,
    data: ProfileUpdate,
    db: AsyncSession = Depends(get_db),
    _: ProfileResponse = Depends(get_current_superadmin),
):
    service = ProfileService(db)
    result = await service.update(profile_id, data)
    if result is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found")
    return result


@router.post("/{profile_id}/reset-password", status_code=status.HTTP_200_OK)
async def reset_admin_password(
    profile_id: uuid.UUID,
    body: dict,
    db: AsyncSession = Depends(get_db),
    _: ProfileResponse = Depends(get_current_superadmin),
):
    password = body.get("password")
    if not password or len(password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
    hashed = get_password_hash(password)
    stmt = sa_update(Profile).where(Profile.id == profile_id).values(hashed_password=hashed)
    await db.execute(stmt)
    await db.flush()
    return {"message": "Password reset successfully"}
