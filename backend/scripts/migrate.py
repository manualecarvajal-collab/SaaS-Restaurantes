"""
Migration runner: executes SQL files against Supabase.

Tries:
  1. Direct PostgreSQL connection (asyncpg) via DATABASE_URL
  2. Supabase SQL API (deprecated, may fail on newer projects)
  3. Falls back to printing SQL for manual execution in Supabase Dashboard

Usage:
    uv run scripts/migrate.py
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

MIGRATIONS_DIR = Path(__file__).parent.parent / "migrations"


def run_via_db(sql: str) -> bool:
    """Try running SQL via direct database connection."""
    try:
        import asyncio
        import asyncpg

        async def run():
            dsn = os.environ.get("DATABASE_URL", "")
            if "5432" in dsn:
                dsn = dsn.replace(":5432/", ":6543/")
            conn = await asyncpg.connect(dsn, timeout=10)
            try:
                await conn.execute(sql)
            finally:
                await conn.close()

        asyncio.run(run())
        return True
    except Exception as e:
        print(f"    DB connection failed: {e}")
        return False


def run_via_api(sql: str) -> bool:
    """Try running SQL via Supabase SQL API."""
    try:
        from httpx import Client

        url = os.environ.get("SUPABASE_URL", "")
        key = os.environ.get("SUPABASE_SERVICE_KEY", "")
        if not url or not key:
            return False

        api_url = f"{url}/sql/v1/sql"
        headers = {
            "apikey": key,
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
        }
        with Client(timeout=15) as client:
            response = client.post(api_url, headers=headers, json={"query": sql})

        if response.status_code == 200:
            return True
        print(f"    API returned {response.status_code}: {response.text[:200]}")
        return False
    except Exception as e:
        print(f"    API call failed: {e}")
        return False


def run_migration(filename: str) -> None:
    filepath = MIGRATIONS_DIR / filename
    if not filepath.exists():
        print(f"  SKIP: {filename} not found")
        return

    sql = filepath.read_text(encoding="utf-8")
    print(f"\n--- Running: {filename} ---")

    if run_via_db(sql):
        print(f"  OK via DB: {filename}")
        return

    if run_via_api(sql):
        print(f"  OK via API: {filename}")
        return

    print(f"  FALLBACK: Could not run {filename} automatically.")
    print(f"  Copy the SQL below and run it in Supabase Dashboard > SQL Editor:")
    print(f"  {'=' * 60}")
    print(sql)
    print(f"  {'=' * 60}")


def main() -> None:
    print("=" * 50)
    print("SUPABASE MIGRATION RUNNER")
    print("=" * 50)

    run_migration("001_create_tables.sql")
    run_migration("002_rls_policies.sql")

    print("\n" + "=" * 50)
    print("Migration process complete")
    print("=" * 50)


if __name__ == "__main__":
    main()
