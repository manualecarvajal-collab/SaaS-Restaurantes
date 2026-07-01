import uuid
from datetime import datetime

from pydantic import BaseModel


class TableBase(BaseModel):
    restaurant_id: uuid.UUID
    table_number: int
    qr_token: str
    is_active: bool = True


class TableCreate(TableBase):
    pass


class TableUpdate(BaseModel):
    table_number: int | None = None
    qr_token: str | None = None
    is_active: bool | None = None


class TableResponse(TableBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
