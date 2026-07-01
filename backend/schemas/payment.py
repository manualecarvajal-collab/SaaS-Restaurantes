import uuid
from datetime import datetime

from pydantic import BaseModel


class PaymentBase(BaseModel):
    order_id: uuid.UUID
    restaurant_id: uuid.UUID
    amount: float
    currency: str = "USD"
    bank_reference: str
    payer_phone: str | None = None
    payer_name: str | None = None


class PaymentCreate(PaymentBase):
    pass


class PaymentUpdate(BaseModel):
    status: str
    verified_by: uuid.UUID | None = None


class PaymentResponse(PaymentBase):
    id: uuid.UUID
    status: str
    verified_by: uuid.UUID | None = None
    verified_at: datetime | None = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
