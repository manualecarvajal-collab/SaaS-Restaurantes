"""
Seed runner: creates auth users + runs seed data against Supabase.

Usage:
    uv run scripts/seed.py

Requires:
    SUPABASE_URL, SUPABASE_SERVICE_KEY in .env
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from httpx import Client, Timeout

load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")

if not SUPABASE_URL or not SERVICE_KEY:
    print("ERROR: SUPABASE_URL and SUPABASE_SERVICE_KEY must be set")
    sys.exit(1)

MIGRATIONS_DIR = Path(__file__).parent.parent / "migrations"

# Fixed UUIDs for seed users (match IDs referenced in 003_seed_data.sql)
SUPERADMIN_ID = "00000000-0000-0000-0000-000000000001"
ADMIN_ID = "00000000-0000-0000-0000-000000000002"
RESTAURANT_ID = "11111111-1111-1111-1111-111111111111"


def execute_sql(sql: str, description: str) -> None:
    url = f"{SUPABASE_URL}/sql/v1/sql"
    headers = {
        "apikey": SERVICE_KEY,
        "Authorization": f"Bearer {SERVICE_KEY}",
        "Content-Type": "application/json",
    }

    with Client(timeout=Timeout(30.0)) as client:
        response = client.post(url, headers=headers, json={"query": sql})

    if response.status_code == 200:
        print(f"  OK: {description}")
    else:
        body = response.text[:500]
        print(f"  WARN: {description} -> {response.status_code}: {body}")


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
    restaurant_id: str = "NULL",
) -> None:
    rid = f"'{restaurant_id}'" if restaurant_id != "NULL" else "NULL"
    sql = f"""
    INSERT INTO profiles (id, email, full_name, role, restaurant_id)
    VALUES ('{user_id}', '{email}', '{full_name}', '{role}', {rid})
    ON CONFLICT (id) DO NOTHING;
    """
    execute_sql(sql, f"Profile '{email}'")


def main() -> None:
    print("=" * 50)
    print("SUPABASE SEED RUNNER")
    print("=" * 50)

    print("\n--- Creating Auth Users ---")
    create_auth_user("superadmin@example.com", "SuperAdmin123!", SUPERADMIN_ID)
    create_auth_user("admin@lacocina.com", "Admin123!", ADMIN_ID)

    print("\n--- Creating Profiles ---")
    create_profile(
        SUPERADMIN_ID, "superadmin@example.com",
        "Super Admin", "superadmin",
    )
    create_profile(
        ADMIN_ID, "admin@lacocina.com",
        "Manuel Admin", "admin",
        RESTAURANT_ID,
    )

    print("\n--- Running Seed Data ---")
    seed_file = MIGRATIONS_DIR / "003_seed_data.sql"
    if seed_file.exists():
        sql = seed_file.read_text(encoding="utf-8")
        execute_sql(sql, "003_seed_data.sql")
    else:
        print("  SKIP: 003_seed_data.sql not found")

    print("\n" + "=" * 50)
    print("Seed completed successfully")
    print("=" * 50)
    print()
    print("Credentials (for testing):")
    print("  SuperAdmin: superadmin@example.com / SuperAdmin123!")
    print("  Admin:      admin@lacocina.com / Admin123!")
    print()
    print("Restaurant: La Cocina de Don Manuel")
    print("  Slug: la-cocina-don-manuel")
    print("  QR tokens: A1B2C3, D4E5F6, G7H8I9, J0K1L2, M3N4O5")


if __name__ == "__main__":
    main()
