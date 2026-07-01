import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from repositories.table import TableRepository
from schemas.table import TableCreate, TableUpdate, TableResponse


class TableService:
    def __init__(self, db: AsyncSession):
        self.repo = TableRepository(db)

    async def list_by_restaurant(self, restaurant_id: uuid.UUID) -> list[TableResponse]:
        return await self.repo.get_by_restaurant(restaurant_id)

    async def get_active_tables(self, restaurant_id: uuid.UUID) -> list[TableResponse]:
        return await self.repo.get_active_tables(restaurant_id)

    async def get_by_id(self, id: uuid.UUID) -> TableResponse | None:
        return await self.repo.get_by_id(id)

    async def get_by_qr_token(self, qr_token: str) -> TableResponse | None:
        return await self.repo.get_by_qr_token(qr_token)

    async def create(self, data: TableCreate) -> TableResponse:
        return await self.repo.create(data)

    async def update(self, id: uuid.UUID, data: TableUpdate) -> TableResponse | None:
        return await self.repo.update(id, data)

    async def delete(self, id: uuid.UUID) -> bool:
        return await self.repo.delete(id)
