from __future__ import annotations

from psycopg.rows import dict_row

from app.db import pool

from app.utils.build_url import build_post_url, build_image_url, build_original_url

def _build_types(type1: str | None, type2: str | None) -> list[str]:
    types: list[str] = []

    if type1:
        types.append(type1)
    if type2:
        types.append(type2)

    return types


async def fetch_pokemon_list(current_user_id: int | None = None) -> list[dict]:
    """
    ポケモン一覧を取得する。
    1件 = 1ポケモン。
    そのポケモンに紐づく投稿・画像を illusts 配列として返す。
    """

    pokemon_query = """
        SELECT
            id,
            name,
            subname,
            dex_no,
            type1,
            type2,
            region
        FROM pokemon_data
        WHERE display_flag = TRUE
        ORDER BY dex_no ASC, id ASC
    """

    illust_query = """
        SELECT
            i.id AS illust_id,
            i.post_id,
            i.post_tag,
            i.image_tag,
            i.view_count,

            CASE
                WHEN %(current_user_id)s::bigint IS NULL THEN FALSE
                WHEN EXISTS (
                    SELECT 1
                    FROM illust_like l2
                    WHERE l2.illust_id = i.id
                      AND l2.user_id = %(current_user_id)s::bigint
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

        FROM post_data p
        JOIN illust_data i
          ON i.post_id = p.id
        WHERE p.pokemon_id = %(pokemon_id)s
        ORDER BY p.posted_at DESC, p.id DESC, i.id ASC
    """

    params_template = {"current_user_id": current_user_id}

    async with pool.connection() as conn:
        async with conn.cursor(row_factory=dict_row) as cur:
            await cur.execute(pokemon_query)
            pokemon_rows = await cur.fetchall()

            result: list[dict] = []

            for pokemon in pokemon_rows:
                params = {
                    "pokemon_id": pokemon["id"],
                    "current_user_id": params_template["current_user_id"],
                }

                await cur.execute(illust_query, params)
                illust_rows = await cur.fetchall()

                illusts = [
                    {
                        "id": illust["illust_id"],
                        "postUrl": build_post_url(illust["post_tag"]),
                        "imageUrl": build_image_url(illust["image_tag"]),
                        "likeCount": int(illust["like_count"] or 0),
                        "viewCount": int(illust["view_count"] or 0),
                        "commentCount": int(illust["comment_count"] or 0),
                        "likedByUser": bool(illust["liked_by_user"]),
                    }
                    for illust in illust_rows
                ]

                result.append(
                    {
                        "id": int(pokemon["id"]),
                        "kind": "pokemon",
                        "name": pokemon["name"],
                        "subname": pokemon["subname"],
                        "dexNo": pokemon["dex_no"],
                        "types": _build_types(pokemon["type1"], pokemon["type2"]),
                        "region": pokemon["region"],
                        "illusts": illusts,
                    }
                )

    return result


async def fetch_pokemon_detail(
    pokemon_id: int,
    current_user_id: int | None = None,
) -> dict | None:
    pokemon_query = """
        SELECT
            id,
            name,
            subname,
            dex_no,
            type1,
            type2,
            region
        FROM pokemon_data
        WHERE id = %(pokemon_id)s
        LIMIT 1
    """

    illust_query = """
        SELECT
            i.id AS illust_id,
            p.post_tag,
            p.posted_at,
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

        FROM post_data p
        JOIN illust_data i
          ON i.post_id = p.id
        WHERE p.pokemon_id = %(pokemon_id)s
        ORDER BY p.posted_at DESC, p.id DESC, i.id ASC
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
            await cur.execute(pokemon_query, {"pokemon_id": pokemon_id})
            pokemon = await cur.fetchone()

            if pokemon is None:
                return None

            await cur.execute(
                illust_query,
                {
                    "pokemon_id": pokemon_id,
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
                        "postUrl": build_post_url(row["post_tag"]),
                        "imageUrl": build_image_url(row["image_tag"]),
                        "postedAt": row["posted_at"],
                        "likeCount": int(row["like_count"] or 0),
                        "viewCount": int(row["view_count"] or 0),
                        "commentCount": int(row["comment_count"] or 0),
                        "likedByUser": bool(row["liked_by_user"]),
                        "comments": comments,
                    }
                )

    return {
        "id": int(pokemon["id"]),
        "kind": "pokemon",
        "name": pokemon["name"],
        "subname": pokemon["subname"],
        "dexNo": pokemon["dex_no"],
        "types": _build_types(pokemon["type1"], pokemon["type2"]),
        "region": pokemon["region"],
        "originalUrl": build_original_url(pokemon["dex_no"]),
        "illusts": illusts,
    }