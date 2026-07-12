"""
Seed Auth Users Script.

Creates superadmin and admin users in Supabase Auth + their profile entries
in the profiles table.

Usage: uv run python scripts/seed_auth_users.py
"""

import asyncio
import os
import sys
import uuid

from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker

# Add parent dir to path so we can import core.*
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.config import get_settings
from core.supabase import create_auth_user, get_user_by_email

settings = get_settings()

RESTAURANT_ID = "11111111-1111-1111-1111-111111111111"

SUPERADMIN_EMAIL = "superadmin@example.com"
SUPERADMIN_PASSWORD = "superadmin123"

ADMIN_EMAIL = "admin@lacocina.com"
ADMIN_PASSWORD = "admin123"


def print_header(text: str):
    print(f"\n{'=' * 60}")
    print(f"  {text}")
    print(f"{'=' * 60}")


async def find_or_create_user(email: str, password: str, role: str) -> dict | None:
    """Find existing user by email or create a new one in Supabase Auth."""
    print(f"  → Looking up {role}: {email}...", end=" ")
    existing = await get_user_by_email(email)
    if existing:
        print(f"✅ already exists (id={existing['id'][:8]}...)")
        return existing

    print(f"not found, creating...", end=" ")
    result = await create_auth_user(email=email, password=password, email_confirm=True)
    if result is None:
        print("❌ FAILED")
        return None
    print(f"✅ (id={result['id'][:8]}...)")
    return result


async def create_profile_in_db(
    session: AsyncSession,
    user_id: str,
    email: str,
    full_name: str,
    role: str,
    restaurant_id: str | None = None,
) -> bool:
    """Create a profile entry in the profiles table."""
    try:
        stmt = text("""
            INSERT INTO profiles (id, email, full_name, role, restaurant_id, is_active)
            VALUES (:id, :email, :full_name, :role, :restaurant_id, true)
            ON CONFLICT (id) DO UPDATE SET
                email = :email,
                full_name = :full_name,
                role = :role,
                restaurant_id = :restaurant_id
        """)
        await session.execute(stmt, {
            "id": uuid.UUID(user_id),
            "email": email,
            "full_name": full_name,
            "role": role,
            "restaurant_id": uuid.UUID(restaurant_id) if restaurant_id else None,
        })
        await session.commit()
        print(f"  → Profile for {email}... ✅")
        return True
    except Exception as e:
        await session.rollback()
        print(f"  → Profile for {email}... ❌ {e}")
        return False


async def main():
    print_header("SEED AUTH USERS")

    # 1. Find or create superadmin in Supabase Auth
    superadmin = await find_or_create_user(SUPERADMIN_EMAIL, SUPERADMIN_PASSWORD, "superadmin")

    # 2. Find or create admin in Supabase Auth
    admin = await find_or_create_user(ADMIN_EMAIL, ADMIN_PASSWORD, "admin")

    # 3. Create profiles in database
    print_header("CREATING PROFILES")

    engine = create_async_engine(settings.DATABASE_URL, pool_size=1, max_overflow=0)
    session_maker = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with session_maker() as session:
        if superadmin:
            await create_profile_in_db(
                session=session,
                user_id=superadmin["id"],
                email=SUPERADMIN_EMAIL,
                full_name="Super Admin",
                role="superadmin",
            )

        if admin:
            await create_profile_in_db(
                session=session,
                user_id=admin["id"],
                email=ADMIN_EMAIL,
                full_name="Admin La Cocina",
                role="admin",
                restaurant_id=RESTAURANT_ID,
            )

    await engine.dispose()

    # 4. Summary
    print_header("RESUMEN")
    print(f"  SuperAdmin: {SUPERADMIN_EMAIL} / {SUPERADMIN_PASSWORD}")
    print(f"  Admin:      {ADMIN_EMAIL} / {ADMIN_PASSWORD}")
    print()
    print("  Inicia sesión en http://localhost:3000/admin/login")
    print(f"{'=' * 60}")


if __name__ == "__main__":
    asyncio.run(main())
