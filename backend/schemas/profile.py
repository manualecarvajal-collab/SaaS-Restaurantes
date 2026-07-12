import uuid
from datetime import datetime

from pydantic import BaseModel, EmailStr


class ProfileBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str = "admin"
    restaurant_id: uuid.UUID | None = None
    is_active: bool = True


class ProfileCreate(BaseModel):
    id: uuid.UUID | None = None
    email: str
    full_name: str
    role: str = "admin"
    restaurant_id: uuid.UUID | None = None
    is_active: bool = True


class AdminCreate(BaseModel):
    email: str
    full_name: str
    password: str
    restaurant_id: uuid.UUID


class SuperAdminCreate(BaseModel):
    email: str
    full_name: str
    password: str


class ProfileUpdate(BaseModel):
    full_name: str | None = None
    is_active: bool | None = None


class ProfileResponse(BaseModel):
    id: uuid.UUID
    email: str
    full_name: str
    role: str
    restaurant_id: uuid.UUID | None = None
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
