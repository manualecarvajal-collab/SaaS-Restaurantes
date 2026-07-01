from fastapi import APIRouter

from api.v1.endpoints import auth, restaurants, tables, menu, orders, payments, commissions

router = APIRouter(prefix="/api/v1")

router.include_router(auth.router, prefix="/auth", tags=["auth"])
router.include_router(restaurants.router, prefix="/restaurants", tags=["restaurants"])
router.include_router(tables.router, prefix="/tables", tags=["tables"])
router.include_router(menu.router, prefix="/menu", tags=["menu"])
router.include_router(orders.router, prefix="/orders", tags=["orders"])
router.include_router(payments.router, prefix="/payments", tags=["payments"])
router.include_router(commissions.router, prefix="/commissions", tags=["commissions"])
