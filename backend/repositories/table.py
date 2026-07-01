import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.table import Table
from repositories.base import BaseRepository
from schemas.table import TableCreate, TableUpdate, TableResponse


class TableRepository(BaseRepository[Table, TableCreate, TableUpdate, TableResponse]):
    def __init__(self, db: AsyncSession):
        super().__init__(Table, TableResponse, db)

    async def get_by_restaurant(self, restaurant_id: uuid.UUID) -> list[TableResponse]:
        return await self.list(restaurant_id=restaurant_id)

    async def get_active_tables(self, restaurant_id: uuid.UUID) -> list[TableResponse]:
        stmt = select(Table).where(
            Table.restaurant_id == restaurant_id,
            Table.is_active == True,
        )
        result = await self.db.execute(stmt)
        instances = result.scalars().all()
        return [await self._to_response(inst) for inst in instances]

    async def get_by_qr_token(self, qr_token: str) -> TableResponse | None:
        stmt = select(Table).where(Table.qr_token == qr_token)
        result = await self.db.execute(stmt)
        instance = result.scalar_one_or_none()
        if instance is None:
            return None
        return await self._to_response(instance)
