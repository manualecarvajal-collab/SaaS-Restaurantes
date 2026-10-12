"""
Migration runner: executes the SQL files in migrations/ against Supabase.

Connects straight to PostgreSQL with asyncpg using DATABASE_URL, so it works
with the Supabase Session Pooler. Run from the backend/ directory so that
backend/.env is picked up:

    uv run python scripts/migrate.py
    uv run python scripts/migrate.py --dry-run

Notes:
  - The Session Pooler (port 5432) is supported. Do NOT rewrite the port to
    6543: the transaction pooler there does not support the prepared
    statements asyncpg relies on.
  - 000_full_schema.sql and full_schema.sql are consolidated dumps of the
    numbered migrations, so they are skipped to avoid running the same DDL
    twice. They stay in the repo for reference.
  - This is a bootstrap runner for an EMPTY database. The SQL is not
    idempotent: 001 raises on an existing order_status type, 002 on existing
    policies and 003 on duplicate seed rows. Each file runs as one implicit
    transaction, so a file that fails leaves nothing behind, but running this
    against an already-populated database will report failures for 001-003.
"""

import argparse
import asyncio
import os
import sys
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

MIGRATIONS_DIR = Path(__file__).parent.parent / "migrations"

# Consolidated dumps, not part of the numbered sequence.
CONSOLIDATED = {"000_full_schema.sql", "full_schema.sql"}


def migration_files() -> list[Path]:
    """Numbered migrations, in filename order."""
    return [
        path
        for path in sorted(MIGRATIONS_DIR.glob("*.sql"))
        if path.name not in CONSOLIDATED
    ]


def database_url() -> str:
    url = os.environ.get("DATABASE_URL", "")
    if not url:
        print("ERROR: DATABASE_URL is not set (check backend/.env)")
        sys.exit(1)
    # asyncpg does not understand the SQLAlchemy driver prefix.
    return url.replace("postgresql+asyncpg://", "postgresql://")


async def apply(path: Path, dsn: str) -> None:
    import asyncpg

    sql = path.read_text(encoding="utf-8")
    # statement_cache_size=0 keeps the connection usable behind poolers.
    conn = await asyncpg.connect(dsn, statement_cache_size=0)
    try:
        await conn.execute(sql)
    finally:
        await conn.close()


async def run(dry_run: bool) -> int:
    files = migration_files()
    if not files:
        print(f"No .sql files found in {MIGRATIONS_DIR}")
        return 1

    if dry_run:
        print("DRY RUN - nothing will be executed. Files that would run:")
        for path in files:
            print(f"  - {path.name} ({path.stat().st_size} bytes)")
        return 0

    dsn = database_url()
    failures = 0
    for path in files:
        print(f"\n--- {path.name} ---")
        try:
            await apply(path, dsn)
        except Exception as exc:  # noqa: BLE001 - report and keep going
            failures += 1
            print(f"  FAILED: {type(exc).__name__}: {exc}")
        else:
            print("  OK")
    return 1 if failures else 0


def main() -> None:
    parser = argparse.ArgumentParser(description="Run SQL migrations against Supabase.")
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="List the migrations that would run, without executing them.",
    )
    args = parser.parse_args()

    print("=" * 50)
    print("SUPABASE MIGRATION RUNNER")
    print("=" * 50)

    code = asyncio.run(run(args.dry_run))

    print("\n" + "=" * 50)
    print("Migration process complete" if code == 0 else "Migration process FAILED")
    print("=" * 50)
    sys.exit(code)


if __name__ == "__main__":
    main()
