import uuid

from sqlalchemy import Boolean, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.base import Base, PKMixin, TimestampMixin


class Restaurant(PKMixin, TimestampMixin, Base):
    __tablename__ = "restaurants"

    name: Mapped[str] = mapped_column(String, nullable=False)
    slug: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    logo_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    commission_count: Mapped[int] = mapped_column(Integer, default=0)

    profiles: Mapped[list["Profile"]] = relationship(  # noqa: F821
        "Profile", back_populates="restaurant"
    )
    tables: Mapped[list["Table"]] = relationship(  # noqa: F821
        "Table", back_populates="restaurant"
    )
    menu_categories: Mapped[list["MenuCategory"]] = relationship(  # noqa: F821
        "MenuCategory", back_populates="restaurant"
    )
    menu_items: Mapped[list["MenuItem"]] = relationship(  # noqa: F821
        "MenuItem", back_populates="restaurant"
    )
    orders: Mapped[list["Order"]] = relationship(  # noqa: F821
        "Order", back_populates="restaurant"
    )
    payments: Mapped[list["Payment"]] = relationship(  # noqa: F821
        "Payment", back_populates="restaurant"
    )
    commissions: Mapped[list["Commission"]] = relationship(  # noqa: F821
        "Commission", back_populates="restaurant"
    )
