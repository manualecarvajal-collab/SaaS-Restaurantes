import uuid
from datetime import datetime

from pydantic import BaseModel


class MenuCategoryBase(BaseModel):
    restaurant_id: uuid.UUID
    name: str
    description: str | None = None
    sort_order: int = 0
    is_active: bool = True


class MenuCategoryCreate(MenuCategoryBase):
    pass


class MenuCategoryUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    sort_order: int | None = None
    is_active: bool | None = None


class MenuCategoryResponse(MenuCategoryBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
