from pydantic import BaseModel


class RecentOrder(BaseModel):
    id: str
    restaurant_id: str
    restaurant_name: str
    table_id: str
    table_number: int
    status: str
    total_amount: float
    diner_name: str | None = None
    created_at: str


class ProvisionRequest(BaseModel):
    restaurant_name: str
    restaurant_slug: str
    admin_email: str
    admin_password: str
    admin_full_name: str
    table_count: int = 5


class ProvisionResponse(BaseModel):
    restaurant_id: str
    admin_id: str
    table_ids: list[str]
    message: str


class RestaurantSummary(BaseModel):
    id: str
    name: str
    slug: str
    total_orders: int
    completed_orders: int
    pending_orders: int
    cancelled_orders: int
    total_revenue: float
    commission_count: int
    commission_total: float


class OrdersByStatus(BaseModel):
    status: str
    count: int


class GlobalDashboardResponse(BaseModel):
    total_restaurants: int
    total_orders: int
    completed_orders: int
    incomplete_orders: int
    total_revenue: float
    total_commissions: float
    orders_by_status: list[OrdersByStatus]
    restaurants: list[RestaurantSummary]


class RestaurantDashboardResponse(BaseModel):
    id: str
    name: str
    slug: str
    total_orders: int
    completed_orders: int
    pending_orders: int
    cancelled_orders: int
    total_revenue: float
    commission_count: int
    commission_total: float
    orders_by_status: list[OrdersByStatus]
