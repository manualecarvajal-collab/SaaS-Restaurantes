import csv
import io
import uuid

from fastapi import UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from repositories.menu_category import MenuCategoryRepository
from repositories.menu_item import MenuItemRepository
from schemas.menu_category import (
    MenuCategoryCreate,
    MenuCategoryUpdate,
    MenuCategoryResponse,
)
from schemas.menu_item import (
    MenuItemCreate,
    MenuItemImportResult,
    MenuItemImportRow,
    MenuItemUpdate,
    MenuItemResponse,
)


class MenuService:
    def __init__(self, db: AsyncSession):
        self.category_repo = MenuCategoryRepository(db)
        self.item_repo = MenuItemRepository(db)

    # Categories
    async def list_categories(self, restaurant_id: uuid.UUID) -> list[MenuCategoryResponse]:
        return await self.category_repo.get_by_restaurant(restaurant_id)

    async def list_active_categories(self, restaurant_id: uuid.UUID) -> list[MenuCategoryResponse]:
        return await self.category_repo.get_active_by_restaurant(restaurant_id)

    async def get_category(self, id: uuid.UUID) -> MenuCategoryResponse | None:
        return await self.category_repo.get_by_id(id)

    async def create_category(self, data: MenuCategoryCreate) -> MenuCategoryResponse:
        return await self.category_repo.create(data)

    async def update_category(self, id: uuid.UUID, data: MenuCategoryUpdate) -> MenuCategoryResponse | None:
        return await self.category_repo.update(id, data)

    async def delete_category(self, id: uuid.UUID) -> bool:
        return await self.category_repo.delete(id)

    # Items
    async def list_items(self, restaurant_id: uuid.UUID) -> list[MenuItemResponse]:
        return await self.item_repo.get_by_restaurant(restaurant_id)

    async def list_available_items(self, restaurant_id: uuid.UUID) -> list[MenuItemResponse]:
        return await self.item_repo.get_available_by_restaurant(restaurant_id)

    async def list_items_by_category(self, category_id: uuid.UUID) -> list[MenuItemResponse]:
        return await self.item_repo.get_by_category(category_id)

    async def get_item(self, id: uuid.UUID) -> MenuItemResponse | None:
        return await self.item_repo.get_by_id(id)

    async def create_item(self, data: MenuItemCreate) -> MenuItemResponse:
        return await self.item_repo.create(data)

    async def update_item(self, id: uuid.UUID, data: MenuItemUpdate) -> MenuItemResponse | None:
        return await self.item_repo.update(id, data)

    async def delete_item(self, id: uuid.UUID) -> bool:
        return await self.item_repo.delete(id)

    # Import
    async def import_items(
        self, restaurant_id: uuid.UUID, file: UploadFile
    ) -> MenuItemImportResult:
        filename = file.filename or ""
        content = await file.read()

        if filename.endswith(".csv"):
            rows = self._parse_csv(content)
        elif filename.endswith(".xlsx"):
            rows = self._parse_xlsx(content)
        else:
            raise ValueError("Unsupported file format. Use .csv or .xlsx")

        categories = await self.category_repo.get_by_restaurant(restaurant_id)
        cat_map: dict[str, uuid.UUID] = {c.name.lower(): c.id for c in categories}

        result = MenuItemImportResult(imported=0, errors=[])

        for i, row in enumerate(rows, start=1):
            try:
                validated = MenuItemImportRow(**row)
                cat_name = validated.category_name.lower()
                cat_id = cat_map.get(cat_name)
                if cat_id is None:
                    result.errors.append(
                        {"row": i, "error": f"Categoría '{validated.category_name}' no encontrada"}
                    )
                    continue

                item_data = MenuItemCreate(
                    restaurant_id=restaurant_id,
                    category_id=cat_id,
                    name=validated.name,
                    price=validated.price,
                    description=validated.description,
                    image_url=validated.image_url,
                    image_url_2=validated.image_url_2,
                    is_available=validated.is_available,
                )
                await self.item_repo.create(item_data)
                result.imported += 1
            except Exception as e:
                result.errors.append({"row": i, "error": str(e)})

        return result

    def _parse_csv(self, content: bytes) -> list[dict]:
        text = content.decode("utf-8-sig")
        reader = csv.DictReader(io.StringIO(text))
        return [
            self._normalize_row(row) for row in reader
        ]

    def _parse_xlsx(self, content: bytes) -> list[dict]:
        try:
            import openpyxl
        except ImportError:
            raise ImportError("openpyxl is required for .xlsx support. Install it with: uv add openpyxl")

        wb = openpyxl.load_workbook(io.BytesIO(content), read_only=True)
        ws = wb.active
        if ws is None:
            return []

        rows_iter = ws.iter_rows(values_only=True)
        header = [str(c).strip().lower() if c else "" for c in next(rows_iter, [])]
        result = []
        for row in rows_iter:
            record = {}
            for idx, val in enumerate(row):
                if idx < len(header):
                    record[header[idx]] = str(val) if val is not None else ""
            result.append(self._normalize_row(record))
        return result

    def _normalize_row(self, raw: dict) -> dict:
        mapping = {
            "name": "nombre",
            "price": "precio",
            "description": "descripcion",
            "category_name": "categoria",
            "image_url": "foto",
            "image_url_2": "foto_2",
            "is_available": "disponible",
        }
        normalized = {}
        for eng, alternatives in mapping.items():
            alternatives_list = [eng] + [alternatives] if isinstance(alternatives, str) else [eng] + alternatives
            val = None
            for key in alternatives_list:
                v = raw.get(key) or raw.get(key.lower()) or raw.get(key.replace("_", ""))
                if v:
                    val = v
                    break
            if val is not None:
                normalized[eng] = val
        return normalized
