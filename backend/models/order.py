import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.base import Base, PKMixin, TimestampMixin


class Order(PKMixin, TimestampMixin, Base):
    __tablename__ = "orders"

    restaurant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("restaurants.id", ondelete="CASCADE"), nullable=False
    )
    table_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("tables.id"), nullable=False
    )
    status: Mapped[str] = mapped_column(
        String,
        default="PENDING",
        nullable=False,
    )
    total_amount: Mapped[float] = mapped_column(nullable=False, default=0)
    diner_name: Mapped[str | None] = mapped_column(String, nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    confirmed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    restaurant: Mapped["Restaurant"] = relationship(  # noqa: F821
        "Restaurant", back_populates="orders"
    )
    table: Mapped["Table"] = relationship(  # noqa: F821
        "Table", back_populates="orders"
    )
    items: Mapped[list["OrderItem"]] = relationship(  # noqa: F821
        "OrderItem", back_populates="order"
    )
    payments: Mapped[list["Payment"]] = relationship(  # noqa: F821
        "Payment", back_populates="order"
    )
    status_history: Mapped[list["OrderStatusHistory"]] = relationship(  # noqa: F821
        "OrderStatusHistory", back_populates="order"
    )
    commissions: Mapped[list["Commission"]] = relationship(  # noqa: F821
        "Commission", back_populates="order"
    )
