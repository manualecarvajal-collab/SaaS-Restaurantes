import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import ENUM as PGEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.base import Base, PKMixin, TimestampMixin

# Native Postgres enum created by migrations/001_create_tables.sql.
# create_type=False: the type already exists, SQLAlchemy must not try to emit it.
ORDER_STATUS_VALUES = (
    "PENDING",
    "PAYMENT_SENT",
    "CONFIRMED",
    "PREPARING",
    "READY",
    "DELIVERED",
    "CANCELLED",
)

ORDER_STATUS_ENUM = PGEnum(
    *ORDER_STATUS_VALUES,
    name="order_status",
    create_type=False,
    validate_strings=True,
)


class Order(PKMixin, TimestampMixin, Base):
    __tablename__ = "orders"

    restaurant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("restaurants.id", ondelete="CASCADE"), nullable=False
    )
    table_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("tables.id"), nullable=False
    )
    status: Mapped[str] = mapped_column(
        ORDER_STATUS_ENUM,
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
    # OrderResponse embeds both collections, so they are loaded eagerly.
    # Without lazy="selectin" pydantic's model_validate triggers a lazy load
    # outside the async context and the request dies with MissingGreenlet.
    items: Mapped[list["OrderItem"]] = relationship(  # noqa: F821
        "OrderItem", back_populates="order", lazy="selectin"
    )
    payments: Mapped[list["Payment"]] = relationship(  # noqa: F821
        "Payment", back_populates="order", lazy="selectin"
    )
    status_history: Mapped[list["OrderStatusHistory"]] = relationship(  # noqa: F821
        "OrderStatusHistory", back_populates="order"
    )
    commissions: Mapped[list["Commission"]] = relationship(  # noqa: F821
        "Commission", back_populates="order"
    )
