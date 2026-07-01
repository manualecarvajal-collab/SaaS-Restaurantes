import uuid

from pydantic import BaseModel


class OrderItemCreate(BaseModel):
    menu_item_id: uuid.UUID
    menu_item_name: str
    quantity: int = 1
    unit_price: float
    subtotal: float
    notes: str | None = None


class OrderItemResponse(OrderItemCreate):
    id: uuid.UUID
    order_id: uuid.UUID

    model_config = {"from_attributes": True}
