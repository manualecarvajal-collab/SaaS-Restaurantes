"""
Seed runner: creates the auth users and loads the seed data into Supabase.

Run from the backend/ directory so that backend/.env is picked up:

    uv run python scripts/seed.py

Auth users are created with the Supabase Auth Admin API (the only supported
way to create them with a fixed id). The seed SQL is executed over a direct
PostgreSQL connection with asyncpg.

Requires:
    SUPABASE_URL, SUPABASE_SERVICE_KEY, DATABASE_URL,
    SEED_SUPERADMIN_PASSWORD, SEED_ADMIN_PASSWORD  (all in backend/.env)
"""

import asyncio
import os
import sys
from pathlib import Path

from dotenv import load_dotenv
from httpx import Client, Timeout

load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")
DATABASE_URL = os.environ.get("DATABASE_URL", "")

# Passwords are NOT hardcoded: this repository is public. Set them in backend/.env.
SUPERADMIN_PASSWORD = os.environ.get("SEED_SUPERADMIN_PASSWORD", "")
ADMIN_PASSWORD = os.environ.get("SEED_ADMIN_PASSWORD", "")

if not SUPABASE_URL or not SERVICE_KEY:
    print("ERROR: SUPABASE_URL and SUPABASE_SERVICE_KEY must be set")
    sys.exit(1)
if not DATABASE_URL:
    print("ERROR: DATABASE_URL must be set")
    sys.exit(1)
if not SUPERADMIN_PASSWORD or not ADMIN_PASSWORD:
    print("ERROR: SEED_SUPERADMIN_PASSWORD and SEED_ADMIN_PASSWORD must be set")
    print("       Add them to backend/.env before running the seed.")
    sys.exit(1)

MIGRATIONS_DIR = Path(__file__).parent.parent / "migrations"

# Fixed UUIDs for seed users (match the ids referenced in 003_seed_data.sql)
SUPERADMIN_ID = "00000000-0000-0000-0000-000000000001"
# Id of the admin account in the live project, kept so a reseed reproduces it.
ADMIN_ID = "748f4186-c1d0-4ad3-bb2a-98c0e39c69c2"
RESTAURANT_ID = "11111111-1111-1111-1111-111111111111"


def dsn() -> str:
    """DATABASE_URL without the SQLAlchemy driver prefix asyncpg rejects."""
    return DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://")


def execute_sql(sql: str, description: str, params: tuple = ()) -> None:
    """Run one SQL statement over a direct PostgreSQL connection."""
    import asyncpg

    async def run() -> None:
        conn = await asyncpg.connect(dsn(), statement_cache_size=0)
        try:
            await conn.execute(sql, *params)
        finally:
            await conn.close()

    try:
        asyncio.run(run())
    except Exception as exc:  # noqa: BLE001 - report and continue with the rest
        print(f"  WARN: {description} -> {type(exc).__name__}: {exc}")
    else:
        print(f"  OK: {description}")


def create_auth_user(
    email: str,
    password: str,
    user_id: str,
    email_confirm: bool = True,
) -> bool:
    """Create a user in Supabase Auth via Admin API."""
    url = f"{SUPABASE_URL}/auth/v1/admin/users"
    headers = {
        "apikey": SERVICE_KEY,
        "Authorization": f"Bearer {SERVICE_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "email": email,
        "password": password,
        "email_confirm": email_confirm,
        "user_metadata": {"user_id": user_id},
    }

    with Client(timeout=Timeout(15.0)) as client:
        response = client.post(url, headers=headers, json=payload)

    if response.status_code == 200:
        print(f"  OK: Auth user '{email}' created")
        return True
    elif response.status_code == 422:
        print(f"  SKIP: Auth user '{email}' already exists (or email taken)")
        return True
    else:
        print(f"  WARN: Auth user '{email}' -> {response.status_code}: {response.text[:300]}")
        return False


def create_profile(
    user_id: str,
    email: str,
    full_name: str,
    role: str,
    restaurant_id: str | None = None,
) -> None:
    execute_sql(
        """
        INSERT INTO profiles (id, email, full_name, role, restaurant_id)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (id) DO NOTHING;
        """,
        f"Profile '{email}'",
        (user_id, email, full_name, role, restaurant_id),
    )


def main() -> None:
    print("=" * 50)
    print("SUPABASE SEED RUNNER")
    print("=" * 50)

    print("\n--- Creating Auth Users ---")
    create_auth_user("superadmin@example.com", SUPERADMIN_PASSWORD, SUPERADMIN_ID)
    create_auth_user("admin@admin.com", ADMIN_PASSWORD, ADMIN_ID)

    print("\n--- Creating Profiles ---")
    create_profile(
        SUPERADMIN_ID, "superadmin@example.com",
        "Super Admin", "superadmin",
    )
    create_profile(
        ADMIN_ID, "admin@admin.com",
        "Manuel Admin", "admin",
        RESTAURANT_ID,
    )

    print("\n--- Running Seed Data ---")
    seed_file = MIGRATIONS_DIR / "003_seed_data.sql"
    if seed_file.exists():
        execute_sql(seed_file.read_text(encoding="utf-8"), "003_seed_data.sql")
    else:
        print("  SKIP: 003_seed_data.sql not found")

    print("\n" + "=" * 50)
    print("Seed completed successfully")
    print("=" * 50)
    print()
    print("Users created (passwords come from SEED_*_PASSWORD in backend/.env):")
    print("  SuperAdmin: superadmin@example.com")
    print("  Admin:      admin@admin.com")
    print()
    print("Restaurant: La Cocina de Don Manuel")
    print("  Slug: la-cocina-don-manuel")
    print("  QR tokens: A1B2C3, D4E5F6, G7H8I9, J0K1L2, M3N4O5")


if __name__ == "__main__":
    main()
