import uuid

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession


class DashboardRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_global_stats(self) -> dict:
        query = text("""
            SELECT
                (SELECT COUNT(*) FROM restaurants) AS total_restaurants,
                (SELECT COUNT(*) FROM orders) AS total_orders,
                (SELECT COUNT(*) FROM orders WHERE status IN ('CONFIRMED','PREPARING','READY','DELIVERED')) AS completed_orders,
                (SELECT COUNT(*) FROM orders WHERE status IN ('PENDING','PAYMENT_SENT','CANCELLED')) AS incomplete_orders,
                (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status IN ('CONFIRMED','PREPARING','READY','DELIVERED')) AS total_revenue,
                (SELECT COUNT(*) FROM commissions) AS total_commission_count,
                (SELECT COALESCE(SUM(amount), 0) FROM commissions) AS total_commissions
        """)
        result = await self.db.execute(query)
        row = result.fetchone()
        return {
            "total_restaurants": row[0] or 0,
            "total_orders": row[1] or 0,
            "completed_orders": row[2] or 0,
            "incomplete_orders": row[3] or 0,
            "total_revenue": float(row[4] or 0),
            "total_commission_count": row[5] or 0,
            "total_commissions": float(row[6] or 0),
        }

    async def get_orders_by_status(self) -> list[dict]:
        query = text("""
            SELECT status, COUNT(*) AS count
            FROM orders
            GROUP BY status
            ORDER BY status
        """)
        result = await self.db.execute(query)
        return [{"status": row[0], "count": row[1]} for row in result.fetchall()]

    async def get_restaurant_summaries(self) -> list[dict]:
        query = text("""
            SELECT
                r.id::text,
                r.name,
                r.slug,
                COALESCE(o_stats.total_orders, 0) AS total_orders,
                COALESCE(o_stats.completed_orders, 0) AS completed_orders,
                COALESCE(o_stats.pending_orders, 0) AS pending_orders,
                COALESCE(o_stats.cancelled_orders, 0) AS cancelled_orders,
                COALESCE(o_stats.total_revenue, 0) AS total_revenue,
                r.commission_count,
                COALESCE(c.total_commissions, 0) AS commission_total
            FROM restaurants r
            LEFT JOIN (
                SELECT
                    restaurant_id,
                    COUNT(*) AS total_orders,
                    COUNT(*) FILTER (WHERE status IN ('CONFIRMED','PREPARING','READY','DELIVERED')) AS completed_orders,
                    COUNT(*) FILTER (WHERE status IN ('PENDING','PAYMENT_SENT')) AS pending_orders,
                    COUNT(*) FILTER (WHERE status = 'CANCELLED') AS cancelled_orders,
                    COALESCE(SUM(total_amount) FILTER (WHERE status IN ('CONFIRMED','PREPARING','READY','DELIVERED')), 0) AS total_revenue
                FROM orders
                GROUP BY restaurant_id
            ) o_stats ON r.id = o_stats.restaurant_id
            LEFT JOIN (
                SELECT restaurant_id, COALESCE(SUM(amount), 0) AS total_commissions
                FROM commissions
                GROUP BY restaurant_id
            ) c ON r.id = c.restaurant_id
            ORDER BY r.name
        """)
        result = await self.db.execute(query)
        rows = result.fetchall()
        return [
            {
                "id": row[0],
                "name": row[1],
                "slug": row[2],
                "total_orders": row[3] or 0,
                "completed_orders": row[4] or 0,
                "pending_orders": row[5] or 0,
                "cancelled_orders": row[6] or 0,
                "total_revenue": float(row[7] or 0),
                "commission_count": row[8] or 0,
                "commission_total": float(row[9] or 0),
            }
            for row in rows
        ]

    async def get_orders_by_status_for_restaurant(self, restaurant_id: uuid.UUID) -> list[dict]:
        query = text("""
            SELECT status, COUNT(*) AS count
            FROM orders
            WHERE restaurant_id = :restaurant_id
            GROUP BY status
            ORDER BY status
        """)
        result = await self.db.execute(query, {"restaurant_id": restaurant_id})
        return [{"status": row[0], "count": row[1]} for row in result.fetchall()]

    async def get_recent_orders(self, limit: int = 20) -> list[dict]:
        query = text("""
            SELECT
                o.id::text,
                o.restaurant_id::text,
                r.name AS restaurant_name,
                o.table_id::text,
                t.table_number,
                o.status,
                o.total_amount,
                o.diner_name,
                o.created_at::text
            FROM orders o
            JOIN restaurants r ON r.id = o.restaurant_id
            JOIN tables t ON t.id = o.table_id
            ORDER BY o.created_at DESC
            LIMIT :limit
        """)
        result = await self.db.execute(query, {"limit": limit})
        rows = result.fetchall()
        return [
            {
                "id": row[0],
                "restaurant_id": row[1],
                "restaurant_name": row[2],
                "table_id": row[3],
                "table_number": row[4],
                "status": row[5],
                "total_amount": float(row[6]),
                "diner_name": row[7],
                "created_at": row[8],
            }
            for row in rows
        ]

    async def get_restaurant_detail_stats(self, restaurant_id: uuid.UUID) -> dict | None:
        query = text("""
            SELECT
                r.id::text,
                r.name,
                r.slug,
                COALESCE(o_stats.total_orders, 0) AS total_orders,
                COALESCE(o_stats.completed_orders, 0) AS completed_orders,
                COALESCE(o_stats.pending_orders, 0) AS pending_orders,
                COALESCE(o_stats.cancelled_orders, 0) AS cancelled_orders,
                COALESCE(o_stats.total_revenue, 0) AS total_revenue,
                r.commission_count,
                COALESCE(c.total_commissions, 0) AS commission_total
            FROM restaurants r
            LEFT JOIN (
                SELECT
                    restaurant_id,
                    COUNT(*) AS total_orders,
                    COUNT(*) FILTER (WHERE status IN ('CONFIRMED','PREPARING','READY','DELIVERED')) AS completed_orders,
                    COUNT(*) FILTER (WHERE status IN ('PENDING','PAYMENT_SENT')) AS pending_orders,
                    COUNT(*) FILTER (WHERE status = 'CANCELLED') AS cancelled_orders,
                    COALESCE(SUM(total_amount) FILTER (WHERE status IN ('CONFIRMED','PREPARING','READY','DELIVERED')), 0) AS total_revenue
                FROM orders
                GROUP BY restaurant_id
            ) o_stats ON r.id = o_stats.restaurant_id
            LEFT JOIN (
                SELECT restaurant_id, COALESCE(SUM(amount), 0) AS total_commissions
                FROM commissions
                GROUP BY restaurant_id
            ) c ON r.id = c.restaurant_id
            WHERE r.id = :restaurant_id
        """)
        result = await self.db.execute(query, {"restaurant_id": restaurant_id})
        row = result.fetchone()
        if row is None or row[0] is None:
            return None
        return {
            "id": row[0],
            "name": row[1],
            "slug": row[2],
            "total_orders": row[3] or 0,
            "completed_orders": row[4] or 0,
            "pending_orders": row[5] or 0,
            "cancelled_orders": row[6] or 0,
            "total_revenue": float(row[7] or 0),
            "commission_count": row[8] or 0,
            "commission_total": float(row[9] or 0),
        }
