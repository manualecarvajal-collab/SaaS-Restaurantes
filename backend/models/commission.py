import uuid

from sqlalchemy import ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.base import Base, PKMixin


class Commission(PKMixin, Base):
    __tablename__ = "commissions"

    restaurant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("restaurants.id"), nullable=False
    )
    order_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("orders.id"), unique=True, nullable=False
    )
    amount: Mapped[float] = mapped_column(nullable=False, default=0.10)
    currency: Mapped[str] = mapped_column(String, default="USD")

    restaurant: Mapped["Restaurant"] = relationship(  # noqa: F821
        "Restaurant", back_populates="commissions"
    )
    order: Mapped["Order"] = relationship(  # noqa: F821
        "Order", back_populates="commissions"
    )
