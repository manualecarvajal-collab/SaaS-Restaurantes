import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from api.deps import get_current_superadmin
from core.database import get_db
from core.supabase import create_auth_user
from schemas.profile import AdminCreate, ProfileResponse, ProfileUpdate
from schemas.profile import ProfileCreate
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
    # 1. Create user in Supabase Auth
    auth_user = await create_auth_user(
        email=data.email,
        password=data.password,
        email_confirm=True,
    )
    if auth_user is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create auth user",
        )

    # 2. Create profile in our database
    profile_data = ProfileCreate(
        id=uuid.UUID(auth_user["id"]),
        email=data.email,
        full_name=data.full_name,
        role="admin",
        restaurant_id=data.restaurant_id,
    )
    service = ProfileService(db)
    return await service.create(profile_data)


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

    # Use Supabase Auth admin API to update password
    from core.supabase import get_supabase_admin
    client = get_supabase_admin()
    client.auth.admin.update_user_by_id(
        str(profile_id),
        {"password": password},
    )
    return {"message": "Password reset successfully"}
