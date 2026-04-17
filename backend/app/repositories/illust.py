from __future__ import annotations

from psycopg.rows import dict_row

from app.db import pool

from app.core.exceptions import BadRequestError


async def create_like(illust_id: int, user_id: int) -> dict | None:
    exists_query = """
        SELECT id
        FROM illust_data
        WHERE id = %(illust_id)s
        LIMIT 1
    """

    insert_query = """
        INSERT INTO illust_like (illust_id, user_id)
        VALUES (%(illust_id)s, %(user_id)s)
        ON CONFLICT (illust_id, user_id) DO NOTHING
    """

    count_query = """
        SELECT COUNT(*) AS like_count
        FROM illust_like
        WHERE illust_id = %(illust_id)s
    """

    params = {
        "illust_id": illust_id,
        "user_id": user_id,
    }

    async with pool.connection() as conn:
        async with conn.cursor(row_factory=dict_row) as cur:
            await cur.execute(exists_query, {"illust_id": illust_id})
            exists_row = await cur.fetchone()

            if exists_row is None:
                return None

            await cur.execute(insert_query, params)
            await cur.execute(count_query, {"illust_id": illust_id})
            count_row = await cur.fetchone()

            await conn.commit()

    return {
        "likedByUser": True,
        "likeCount": int(count_row["like_count"] or 0),
    }


async def delete_like(illust_id: int, user_id: int) -> dict | None:
    exists_query = """
        SELECT id
        FROM illust_data
        WHERE id = %(illust_id)s
        LIMIT 1
    """

    delete_query = """
        DELETE FROM illust_like
        WHERE illust_id = %(illust_id)s
          AND user_id = %(user_id)s
    """

    count_query = """
        SELECT COUNT(*) AS like_count
        FROM illust_like
        WHERE illust_id = %(illust_id)s
    """

    params = {
        "illust_id": illust_id,
        "user_id": user_id,
    }

    async with pool.connection() as conn:
        async with conn.cursor(row_factory=dict_row) as cur:
            await cur.execute(exists_query, {"illust_id": illust_id})
            exists_row = await cur.fetchone()

            if exists_row is None:
                return None

            await cur.execute(delete_query, params)
            await cur.execute(count_query, {"illust_id": illust_id})
            count_row = await cur.fetchone()

            await conn.commit()

    return {
        "likedByUser": False,
        "likeCount": int(count_row["like_count"] or 0),
    }


async def increment_view_count(illust_id: int) -> dict | None:
    update_query = """
        UPDATE illust_data
        SET view_count = COALESCE(view_count, 0) + 1
        WHERE id = %(illust_id)s
        RETURNING view_count
    """

    async with pool.connection() as conn:
        async with conn.cursor(row_factory=dict_row) as cur:
            await cur.execute(update_query, {"illust_id": illust_id})
            row = await cur.fetchone()

            if row is None:
                return None

            await conn.commit()

    return {
        "viewCount": int(row["view_count"] or 0),
    }


async def create_comment(
    illust_id: int,
    user_id: int,
    comment_text: str,
) -> dict | None:
    normalized_comment = comment_text.strip()
    if not normalized_comment:
        raise BadRequestError("Comment text is empty")

    exists_query = """
        SELECT id
        FROM illust_data
        WHERE id = %(illust_id)s
        LIMIT 1
    """

    insert_query = """
        INSERT INTO illust_comment (
            illust_id,
            user_id,
            content,
            posted_at
        )
        VALUES (
            %(illust_id)s,
            %(user_id)s,
            %(content)s,
            NOW()
        )
        RETURNING
            id,
            content,
            posted_at
    """

    user_query = """
        SELECT display_name
        FROM user_data
        WHERE id = %(user_id)s
        LIMIT 1
    """

    params = {
        "illust_id": illust_id,
        "user_id": user_id,
        "content": normalized_comment,
    }

    async with pool.connection() as conn:
        async with conn.cursor(row_factory=dict_row) as cur:
            await cur.execute(exists_query, {"illust_id": illust_id})
            exists_row = await cur.fetchone()

            if exists_row is None:
                return None

            await cur.execute(insert_query, params)
            comment_row = await cur.fetchone()

            await cur.execute(user_query, {"user_id": user_id})
            user_row = await cur.fetchone()

            await conn.commit()

    return {
        "id": int(comment_row["id"]),
        "content": comment_row["content"],
        "postedAt": comment_row["posted_at"],
        "displayUserName": None if user_row is None else user_row["display_name"],
    }