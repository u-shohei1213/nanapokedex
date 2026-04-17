from __future__ import annotations

import secrets

from psycopg.rows import dict_row
from psycopg.errors import UniqueViolation

from app.core.exceptions import ConflictError
from app.db import pool
from app.utils.name_generator import generate_random_name
from app.utils.security import hash_password, verify_password


async def fetch_user_by_guest_token(guest_token: str) -> dict | None:
    query = """
        SELECT
            id,
            display_name,
            is_guest,
            is_admin
        FROM user_data
        WHERE guest_token = %(guest_token)s
        LIMIT 1
    """

    params = {"guest_token": guest_token}

    async with pool.connection() as conn:
        async with conn.cursor(row_factory=dict_row) as cur:
            await cur.execute(query, params)
            row = await cur.fetchone()

    if row is None:
        return None

    return {
        "userId": row["id"],
        "displayUserName": row["display_name"],
        "isGuest": row["is_guest"],
        "isAdmin": row["is_admin"],
    }


async def fetch_user_id_by_guest_token(guest_token: str) -> int | None:
    query = """
        SELECT id
        FROM user_data
        WHERE guest_token = %(guest_token)s
        LIMIT 1
    """

    params = {"guest_token": guest_token}

    async with pool.connection() as conn:
        async with conn.cursor(row_factory=dict_row) as cur:
            await cur.execute(query, params)
            row = await cur.fetchone()

    if row is None:
        return None

    return int(row["id"])


async def create_guest_user(guest_token: str) -> dict:
    display_name = generate_random_name()

    query = """
        INSERT INTO user_data (
            guest_token,
            login_id,
            password_hash,
            display_name,
            is_guest,
            is_admin,
            created_at,
            updated_at
        )
        VALUES (
            %(guest_token)s,
            NULL,
            NULL,
            %(display_name)s,
            TRUE,
            FALSE,
            NOW(),
            NOW()
        )
        RETURNING
            id,
            display_name,
            is_guest,
            is_admin
    """

    params = {
        "guest_token": guest_token,
        "display_name": display_name,
    }

    async with pool.connection() as conn:
        async with conn.cursor(row_factory=dict_row) as cur:
            await cur.execute(query, params)
            row = await cur.fetchone()
            await conn.commit()

    return {
        "userId": row["id"],
        "displayUserName": row["display_name"],
        "isGuest": row["is_guest"],
        "isAdmin": row["is_admin"],
    }


async def register_user_from_guest(
    guest_token: str,
    login_id: str,
    password: str,
    display_name: str | None,
) -> dict | None:
    password_hash = hash_password(password)

    final_display_name = display_name.strip() if display_name else ""
    if not final_display_name:
        final_display_name = generate_random_name()

    query = """
        UPDATE user_data
        SET
            login_id = %(login_id)s,
            password_hash = %(password_hash)s,
            display_name = %(display_name)s,
            is_guest = FALSE,
            updated_at = NOW()
        WHERE guest_token = %(guest_token)s
        RETURNING
            id,
            display_name,
            is_guest,
            is_admin
    """

    params = {
        "guest_token": guest_token,
        "login_id": login_id,
        "password_hash": password_hash,
        "display_name": final_display_name,
    }

    try:
        async with pool.connection() as conn:
            async with conn.cursor(row_factory=dict_row) as cur:
                await cur.execute(query, params)
                row = await cur.fetchone()
                await conn.commit()
    except UniqueViolation:
        raise ConflictError("This loginId is already in use")

    if row is None:
        return None

    return {
        "userId": row["id"],
        "displayUserName": row["display_name"],
        "isGuest": row["is_guest"],
        "isAdmin": row["is_admin"],
    }


async def fetch_login_user(login_id: str) -> dict | None:
    query = """
        SELECT
            id,
            display_name,
            is_guest,
            is_admin,
            password_hash
        FROM user_data
        WHERE login_id = %(login_id)s
        LIMIT 1
    """

    params = {"login_id": login_id}

    async with pool.connection() as conn:
        async with conn.cursor(row_factory=dict_row) as cur:
            await cur.execute(query, params)
            row = await cur.fetchone()

    if row is None:
        return None

    return dict(row)


async def attach_guest_token_to_user(user_id: int, guest_token: str) -> dict:
    query = """
        UPDATE user_data
        SET
            guest_token = %(guest_token)s,
            updated_at = NOW()
        WHERE id = %(user_id)s
        RETURNING
            id,
            display_name,
            is_guest,
            is_admin
    """

    params = {
        "guest_token": guest_token,
        "user_id": user_id,
    }

    async with pool.connection() as conn:
        async with conn.cursor(row_factory=dict_row) as cur:
            await cur.execute(query, params)
            row = await cur.fetchone()
            await conn.commit()

    return {
        "userId": row["id"],
        "displayUserName": row["display_name"],
        "isGuest": row["is_guest"],
        "isAdmin": row["is_admin"],
    }


async def update_display_name_by_guest_token(
    guest_token: str,
    display_name: str | None,
) -> dict | None:
    final_display_name = display_name.strip() if display_name else ""
    if not final_display_name:
        final_display_name = generate_random_name()

    query = """
        UPDATE user_data
        SET
            display_name = %(display_name)s,
            updated_at = NOW()
        WHERE guest_token = %(guest_token)s
        RETURNING
            id,
            display_name,
            is_guest,
            is_admin
    """

    params = {
        "guest_token": guest_token,
        "display_name": final_display_name,
    }

    async with pool.connection() as conn:
        async with conn.cursor(row_factory=dict_row) as cur:
            await cur.execute(query, params)
            row = await cur.fetchone()
            await conn.commit()

    if row is None:
        return None

    return {
        "userId": row["id"],
        "displayUserName": row["display_name"],
        "isGuest": row["is_guest"],
        "isAdmin": row["is_admin"],
    }


def generate_guest_token() -> str:
    return secrets.token_urlsafe(32)


def check_password(password: str, password_hash: str) -> bool:
    return verify_password(password, password_hash)