"""Supabase client utilities.

Provides two clients:
- supabase: anon-key client for user-facing operations (sign-in)
- supabase_admin: service-role client for admin operations (create users, validate tokens)
"""

from __future__ import annotations

import logging
from typing import Any

from supabase import create_client, Client

from core.config import get_settings

logger = logging.getLogger(__name__)

settings = get_settings()

# User-facing client (anon key)
_supabase: Client | None = None

# Admin client (service_role key)
_supabase_admin: Client | None = None


def get_supabase() -> Client:
    """Get the user-facing Supabase client (anon key)."""
    global _supabase
    if _supabase is None:
        _supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
    return _supabase


def get_supabase_admin() -> Client:
    """Get the admin Supabase client (service_role key)."""
    global _supabase_admin
    if _supabase_admin is None:
        _supabase_admin = create_client(
            settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY
        )
    return _supabase_admin


async def sign_in_with_password(email: str, password: str) -> dict[str, Any] | None:
    """Sign in a user with email and password via Supabase Auth.

    Returns the session dict with access_token if successful, None otherwise.
    """
    try:
        client = get_supabase()
        result = client.auth.sign_in_with_password(
            {"email": email, "password": password}
        )
        if result and result.session:
            return {
                "access_token": result.session.access_token,
                "refresh_token": result.session.refresh_token,
                "user_id": result.user.id if result.user else None,
            }
        return None
    except Exception as e:
        logger.error("sign_in_with_password failed", exc_info=e)
        return None


async def get_user_by_email(email: str) -> dict[str, Any] | None:
    """Look up a user by email via Supabase Auth admin API.

    Returns the user dict if found, None otherwise.
    """
    try:
        client = get_supabase_admin()
        users = client.auth.admin.list_users()
        if isinstance(users, list):
            for user in users:
                if getattr(user, 'email', None) == email:
                    return {"id": user.id, "email": user.email}
        return None
    except Exception as e:
        logger.error("get_user_by_email failed", exc_info=e)
        return None


async def create_auth_user(email: str, password: str, email_confirm: bool = True) -> dict[str, Any] | None:
    """Create a new user in Supabase Auth (admin operation).

    Returns the user dict if successful, None otherwise.
    """
    try:
        client = get_supabase_admin()
        result = client.auth.admin.create_user({
            "email": email,
            "password": password,
            "email_confirm": email_confirm,
        })
        if result and result.user:
            return {
                "id": result.user.id,
                "email": result.user.email,
            }
        return None
    except Exception as e:
        logger.error("create_auth_user failed", exc_info=e)
        return None


async def get_user_by_token(jwt_token: str) -> dict[str, Any] | None:
    """Validate a JWT token and return the user info.

    Returns the user dict if valid, None otherwise.
    """
    try:
        client = get_supabase_admin()
        result = client.auth.get_user(jwt=jwt_token)
        if result and result.user:
            return {
                "id": result.user.id,
                "email": result.user.email,
            }
        return None
    except Exception as e:
        logger.error("get_user_by_token failed", exc_info=e)
        return None


async def sign_out(jwt_token: str) -> bool:
    """Sign out a user by revoking their session."""
    try:
        client = get_supabase_admin()
        client.auth.admin.sign_out(jwt=jwt_token)
        return True
    except Exception as e:
        logger.error("sign_out failed", exc_info=e)
        return False
