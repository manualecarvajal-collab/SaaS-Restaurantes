import uuid

from sqlalchemy import update as sa_update
from sqlalchemy.ext.asyncio import AsyncSession

from core.security import get_password_hash
from models.profile import Profile

from repositories.dashboard import DashboardRepository
from schemas.dashboard import (
    GlobalDashboardResponse,
    OrdersByStatus,
    ProvisionRequest,
    ProvisionResponse,
    RecentOrder,
    RestaurantDashboardResponse,
    RestaurantSummary,
)
from schemas.restaurant import RestaurantCreate
from schemas.table import TableCreate
from services.restaurant import RestaurantService
from services.table import TableService


class DashboardService:
    def __init__(self, db: AsyncSession):
        self.repo = DashboardRepository(db)

    async def get_global_dashboard(self) -> GlobalDashboardResponse:
        stats = await self.repo.get_global_stats()
        orders_by_status = await self.repo.get_orders_by_status()
        restaurants = await self.repo.get_restaurant_summaries()

        return GlobalDashboardResponse(
            total_restaurants=stats["total_restaurants"],
            total_orders=stats["total_orders"],
            completed_orders=stats["completed_orders"],
            incomplete_orders=stats["incomplete_orders"],
            total_revenue=stats["total_revenue"],
            total_commissions=stats["total_commissions"],
            orders_by_status=[OrdersByStatus(**o) for o in orders_by_status],
            restaurants=[RestaurantSummary(**r) for r in restaurants],
        )

    async def get_recent_orders(self, limit: int = 20) -> list[RecentOrder]:
        rows = await self.repo.get_recent_orders(limit)
        return [RecentOrder(**r) for r in rows]

    async def get_restaurant_dashboard(self, restaurant_id: uuid.UUID) -> RestaurantDashboardResponse | None:
        stats = await self.repo.get_restaurant_detail_stats(restaurant_id)
        if stats is None:
            return None
        orders_by_status = await self.repo.get_orders_by_status_for_restaurant(restaurant_id)
        return RestaurantDashboardResponse(
            **stats,
            orders_by_status=[OrdersByStatus(**o) for o in orders_by_status],
        )

    async def provision_restaurant(self, data: ProvisionRequest) -> ProvisionResponse:
        restaurant_service = RestaurantService(self.db)
        table_service = TableService(self.db)

        restaurant = await restaurant_service.create(
            RestaurantCreate(name=data.restaurant_name, slug=data.restaurant_slug)
        )
        admin_id = uuid.uuid4()
        hashed = get_password_hash(data.admin_password)
        from models.profile import Profile
        admin = Profile(
            id=admin_id,
            email=data.admin_email,
            full_name=data.admin_full_name,
            hashed_password=hashed,
            role="admin",
            restaurant_id=restaurant.id,
            is_active=True,
        )
        self.db.add(admin)
        await self.db.flush()

        table_ids = []
        for i in range(1, data.table_count + 1):
            qr_token = uuid.uuid4().hex[:8].upper()
            table = await table_service.create(
                TableCreate(
                    restaurant_id=restaurant.id,
                    table_number=i,
                    qr_token=qr_token,
                )
            )
            table_ids.append(str(table.id))

        return ProvisionResponse(
            restaurant_id=str(restaurant.id),
            admin_id=str(admin_id),
            table_ids=table_ids,
            message=f"Restaurant '{data.restaurant_name}' created with {data.table_count} tables and admin '{data.admin_email}'",
        )
