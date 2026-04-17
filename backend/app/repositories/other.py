from __future__ import annotations

from psycopg.rows import dict_row

from app.db import pool

from app.utils.build_url import build_post_url, build_image_url, build_original_url


async def fetch_other_list(current_user_id: int | None = None) -> list[dict]:
    post_query = """
        SELECT
            id,
            title,
            posted_at
        FROM post_data
        WHERE pokemon_id IS NULL
        ORDER BY posted_at DESC, id DESC
    """

    illust_query = """
        SELECT
            i.id AS illust_id,
            i.post_tag,
            i.image_tag,
            i.view_count,

            CASE
                WHEN %(current_user_id)s::BIGINT IS NULL THEN FALSE
                WHEN EXISTS (
                    SELECT 1
                    FROM illust_like l2
                    WHERE l2.illust_id = i.id
                      AND l2.user_id = %(current_user_id)s::BIGINT
                ) THEN TRUE
                ELSE FALSE
            END AS liked_by_user,

            (
                SELECT COUNT(*)
                FROM illust_like l
                WHERE l.illust_id = i.id
            ) AS like_count,

            (
                SELECT COUNT(*)
                FROM illust_comment c
                WHERE c.illust_id = i.id
            ) AS comment_count

        FROM illust_data i
        WHERE i.post_id = %(post_id)s
        ORDER BY i.id ASC
    """

    async with pool.connection() as conn:
        async with conn.cursor(row_factory=dict_row) as cur:
            await cur.execute(post_query)
            post_rows = await cur.fetchall()

            result = []

            for post in post_rows:
                await cur.execute(
                    illust_query,
                    {
                        "post_id": post["id"],
                        "current_user_id": current_user_id,
                    },
                )
                illust_rows = await cur.fetchall()

                illusts = [
                    {
                        "id": row["illust_id"],
                        "postUrl": build_post_url(row["post_tag"]),
                        "imageUrl": build_image_url(row["image_tag"]),
                        "likeCount": int(row["like_count"] or 0),
                        "viewCount": int(row["view_count"] or 0),
                        "commentCount": int(row["comment_count"] or 0),
                        "likedByUser": bool(row["liked_by_user"]),
                    }
                    for row in illust_rows
                ]

                result.append(
                    {
                        "id": int(post["id"]),
                        "kind": "other",
                        "name": post["title"] or "",
                        "postedAt": post["posted_at"].isoformat(),
                        "illusts": illusts,
                    }
                )

    return result


async def fetch_other_detail(
    post_id: int,
    current_user_id: int | None = None,
) -> dict | None:
    post_query = """
        SELECT
            id,
            title,
            post_tag,
            posted_at
        FROM post_data
        WHERE id = %(post_id)s
          AND pokemon_id IS NULL
        LIMIT 1
    """

    illust_query = """
        SELECT
            i.id AS illust_id,
            i.post_tag,
            i.image_tag,
            i.view_count,

            CASE
                WHEN %(current_user_id)s::BIGINT IS NULL THEN FALSE
                WHEN EXISTS (
                    SELECT 1
                    FROM illust_like l2
                    WHERE l2.illust_id = i.id
                      AND l2.user_id = %(current_user_id)s::BIGINT
                ) THEN TRUE
                ELSE FALSE
            END AS liked_by_user,

            (
                SELECT COUNT(*)
                FROM illust_like l
                WHERE l.illust_id = i.id
            ) AS like_count,

            (
                SELECT COUNT(*)
                FROM illust_comment c
                WHERE c.illust_id = i.id
            ) AS comment_count

        FROM illust_data i
        WHERE i.post_id = %(post_id)s
        ORDER BY i.id ASC
    """

    comment_query = """
        SELECT
            c.id,
            c.content,
            c.posted_at,
            u.display_name
        FROM illust_comment c
        LEFT JOIN user_data u
          ON u.id = c.user_id
        WHERE c.illust_id = %(illust_id)s
        ORDER BY c.posted_at ASC, c.id ASC
    """

    async with pool.connection() as conn:
        async with conn.cursor(row_factory=dict_row) as cur:
            await cur.execute(post_query, {"post_id": post_id})
            post = await cur.fetchone()

            if post is None:
                return None

            await cur.execute(
                illust_query,
                {
                    "post_id": post_id,
                    "current_user_id": current_user_id,
                },
            )
            illust_rows = await cur.fetchall()

            illusts: list[dict] = []

            for row in illust_rows:
                await cur.execute(comment_query, {"illust_id": row["illust_id"]})
                comment_rows = await cur.fetchall()

                comments = [
                    {
                        "id": comment["id"],
                        "content": comment["content"],
                        "postedAt": comment["posted_at"],
                        "displayUserName": comment["display_name"],
                    }
                    for comment in comment_rows
                ]

                illusts.append(
                    {
                        "id": row["illust_id"],
                        "postUrl": build_post_url(post["post_tag"]),
                        "imageUrl": build_image_url(row["image_tag"]),
                        "postedAt": post["posted_at"],
                        "likeCount": int(row["like_count"] or 0),
                        "viewCount": int(row["view_count"] or 0),
                        "commentCount": int(row["comment_count"] or 0),
                        "likedByUser": bool(row["liked_by_user"]),
                        "comments": comments,
                    }
                )

    return {
        "id": int(post["id"]),
        "kind": "other",
        "name": post["title"] or "",
        "postedAt": post["posted_at"],
        "illusts": illusts,
    }