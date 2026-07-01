import uuid
from typing import Any, Generic, TypeVar

from pydantic import BaseModel
from sqlalchemy import delete, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from models.base import Base as SA_Base

ModelType = TypeVar("ModelType", bound=SA_Base)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)
ResponseSchemaType = TypeVar("ResponseSchemaType", bound=BaseModel)


class BaseRepository(Generic[ModelType, CreateSchemaType, UpdateSchemaType, ResponseSchemaType]):
    def __init__(self, model: type[ModelType], response_schema: type[ResponseSchemaType], db: AsyncSession):
        self.model = model
        self.response_schema = response_schema
        self.db = db

    async def _to_response(self, instance: ModelType) -> ResponseSchemaType:
        return self.response_schema.model_validate(instance)

    async def list(self, **filters: Any) -> list[ResponseSchemaType]:
        stmt = select(self.model)
        for key, value in filters.items():
            if hasattr(self.model, key):
                stmt = stmt.where(getattr(self.model, key) == value)
        result = await self.db.execute(stmt)
        instances = result.scalars().all()
        return [await self._to_response(inst) for inst in instances]

    async def get_by_id(self, id: uuid.UUID) -> ResponseSchemaType | None:
        stmt = select(self.model).where(self.model.id == id)
        result = await self.db.execute(stmt)
        instance = result.scalar_one_or_none()
        if instance is None:
            return None
        return await self._to_response(instance)

    async def create(self, data: CreateSchemaType) -> ResponseSchemaType:
        instance = self.model(**data.model_dump())
        self.db.add(instance)
        await self.db.flush()
        return await self._to_response(instance)

    async def update(self, id: uuid.UUID, data: UpdateSchemaType) -> ResponseSchemaType | None:
        values = {k: v for k, v in data.model_dump().items() if v is not None}
        if not values:
            return await self.get_by_id(id)
        stmt = (
            update(self.model)
            .where(self.model.id == id)
            .values(**values)
            .returning(self.model)
        )
        result = await self.db.execute(stmt)
        await self.db.flush()
        instance = result.scalar_one_or_none()
        if instance is None:
            return None
        return await self._to_response(instance)

    async def delete(self, id: uuid.UUID) -> bool:
        stmt = delete(self.model).where(self.model.id == id)
        result = await self.db.execute(stmt)
        await self.db.flush()
        return result.rowcount > 0
