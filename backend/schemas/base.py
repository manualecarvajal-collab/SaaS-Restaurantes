import uuid
from datetime import datetime

from pydantic import BaseModel


class PaginatedResponse(BaseModel):
    items: list
    total: int
    page: int = 1
    per_page: int = 20


class OrderStatusHistoryCreate(BaseModel):
    order_id: uuid.UUID
    from_status: str | None = None
    to_status: str
    changed_by: uuid.UUID | None = None
    notes: str | None = None


class OrderStatusHistoryResponse(BaseModel):
    id: uuid.UUID
    order_id: uuid.UUID
    from_status: str | None = None
    to_status: str
    changed_by: uuid.UUID | None = None
    notes: str | None = None
    created_at: datetime

    model_config = {"from_attributes": True}
