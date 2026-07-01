import uuid
from datetime import datetime

from pydantic import BaseModel

from schemas.order_item import OrderItemCreate, OrderItemResponse
from schemas.payment import PaymentResponse


class OrderBase(BaseModel):
    restaurant_id: uuid.UUID
    table_id: uuid.UUID
    diner_name: str | None = None
    notes: str | None = None


class OrderCreate(OrderBase):
    items: list[OrderItemCreate]


class OrderUpdate(BaseModel):
    diner_name: str | None = None
    notes: str | None = None


class OrderStatusUpdate(BaseModel):
    status: str


class OrderResponse(OrderBase):
    id: uuid.UUID
    status: str
    total_amount: float
    confirmed_at: datetime | None = None
    created_at: datetime
    updated_at: datetime
    items: list[OrderItemResponse] = []
    payments: list[PaymentResponse] = []

    model_config = {"from_attributes": True}
