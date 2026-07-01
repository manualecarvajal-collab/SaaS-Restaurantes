import uuid
from datetime import datetime

from pydantic import BaseModel


class MenuItemBase(BaseModel):
    restaurant_id: uuid.UUID
    category_id: uuid.UUID
    name: str
    description: str | None = None
    price: float
    currency: str = "USD"
    image_url: str | None = None
    is_available: bool = True
    sort_order: int = 0


class MenuItemCreate(MenuItemBase):
    pass


class MenuItemUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    price: float | None = None
    currency: str | None = None
    image_url: str | None = None
    is_available: bool | None = None
    sort_order: int | None = None
    category_id: uuid.UUID | None = None


class MenuItemResponse(MenuItemBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
