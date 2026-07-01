import uuid
from datetime import datetime

from pydantic import BaseModel


class CommissionBase(BaseModel):
    restaurant_id: uuid.UUID
    order_id: uuid.UUID
    amount: float = 0.10
    currency: str = "USD"


class CommissionResponse(CommissionBase):
    id: uuid.UUID
    created_at: datetime

    model_config = {"from_attributes": True}
