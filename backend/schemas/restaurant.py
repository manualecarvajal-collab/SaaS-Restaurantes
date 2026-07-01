import uuid
from datetime import datetime

from pydantic import BaseModel


class RestaurantBase(BaseModel):
    name: str
    slug: str
    logo_url: str | None = None
    is_active: bool = True


class RestaurantCreate(RestaurantBase):
    pass


class RestaurantUpdate(BaseModel):
    name: str | None = None
    slug: str | None = None
    logo_url: str | None = None
    is_active: bool | None = None


class RestaurantResponse(RestaurantBase):
    id: uuid.UUID
    commission_count: int = 0
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
