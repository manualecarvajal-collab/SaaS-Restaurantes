import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from api.deps import get_current_admin
from core.database import get_db
from schemas.profile import ProfileResponse
from schemas.table import TableCreate, TableResponse, TableUpdate
from services.table import TableService

router = APIRouter()


@router.get("/restaurant/{restaurant_id}", response_model=list[TableResponse])
async def list_tables(
    restaurant_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _: ProfileResponse = Depends(get_current_admin),
):
    service = TableService(db)
    return await service.list_by_restaurant(restaurant_id)


@router.get("/restaurant/{restaurant_id}/active", response_model=list[TableResponse])
async def list_active_tables(
    restaurant_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _: ProfileResponse = Depends(get_current_admin),
):
    service = TableService(db)
    return await service.get_active_tables(restaurant_id)


@router.get("/{table_id}", response_model=TableResponse)
async def get_table(
    table_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _: ProfileResponse = Depends(get_current_admin),
):
    service = TableService(db)
    result = await service.get_by_id(table_id)
    if result is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Table not found")
    return result


@router.get("/qr/{qr_token}", response_model=TableResponse)
async def get_table_by_qr(
    qr_token: str,
    db: AsyncSession = Depends(get_db),
):
    service = TableService(db)
    result = await service.get_by_qr_token(qr_token)
    if result is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Table not found")
    return result


@router.post("/", response_model=TableResponse, status_code=status.HTTP_201_CREATED)
async def create_table(
    data: TableCreate,
    db: AsyncSession = Depends(get_db),
    _: ProfileResponse = Depends(get_current_admin),
):
    service = TableService(db)
    return await service.create(data)


@router.patch("/{table_id}", response_model=TableResponse)
async def update_table(
    table_id: uuid.UUID,
    data: TableUpdate,
    db: AsyncSession = Depends(get_db),
    _: ProfileResponse = Depends(get_current_admin),
):
    service = TableService(db)
    result = await service.update(table_id, data)
    if result is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Table not found")
    return result


@router.delete("/{table_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_table(
    table_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _: ProfileResponse = Depends(get_current_admin),
):
    service = TableService(db)
    deleted = await service.delete(table_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Table not found")
