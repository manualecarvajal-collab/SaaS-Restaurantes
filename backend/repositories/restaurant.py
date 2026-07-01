from sqlalchemy.ext.asyncio import AsyncSession

from models.restaurant import Restaurant
from repositories.base import BaseRepository
from schemas.restaurant import RestaurantCreate, RestaurantUpdate, RestaurantResponse


class RestaurantRepository(BaseRepository[Restaurant, RestaurantCreate, RestaurantUpdate, RestaurantResponse]):
    def __init__(self, db: AsyncSession):
        super().__init__(Restaurant, RestaurantResponse, db)
