from fastapi import APIRouter, Cookie

from app.core.exceptions import NotFoundError, UnauthorizedError
from app.repositories.user import fetch_user_id_by_guest_token
from app.repositories.illust import (
    create_comment,
    create_like,
    delete_like,
    increment_view_count,
)
from app.schemas.illust import (
    IllustCommentCreateRequest,
    IllustCommentResponse,
    IllustLikeResponse,
    IllustViewResponse,
)

router = APIRouter(prefix="/illusts", tags=["illusts"])


@router.post("/{illust_id}/likes", response_model=IllustLikeResponse)
async def post_like(
    illust_id: int,
    guest_token: str | None = Cookie(default=None),
):
    if not guest_token:
        raise UnauthorizedError("User not found")

    current_user_id = await fetch_user_id_by_guest_token(guest_token=guest_token)
    if current_user_id is None:
        raise UnauthorizedError("User not found")

    result = await create_like(illust_id=illust_id, user_id=current_user_id)
    if result is None:
        raise NotFoundError("Illust not found")

    return result


@router.delete("/{illust_id}/likes", response_model=IllustLikeResponse)
async def remove_like(
    illust_id: int,
    guest_token: str | None = Cookie(default=None),
):
    if not guest_token:
        raise UnauthorizedError("User not found")

    current_user_id = await fetch_user_id_by_guest_token(guest_token=guest_token)
    if current_user_id is None:
        raise UnauthorizedError("User not found")

    result = await delete_like(illust_id=illust_id, user_id=current_user_id)
    if result is None:
        raise NotFoundError("Illust not found")

    return result


@router.post("/{illust_id}/views", response_model=IllustViewResponse)
async def post_view(illust_id: int):
    result = await increment_view_count(illust_id=illust_id)
    if result is None:
        raise NotFoundError("Illust not found")

    return result


@router.post("/{illust_id}/comments", response_model=IllustCommentResponse)
async def post_comment(
    illust_id: int,
    body: IllustCommentCreateRequest,
    guest_token: str | None = Cookie(default=None),
):
    if not guest_token:
        raise UnauthorizedError("User not found")

    current_user_id = await fetch_user_id_by_guest_token(guest_token=guest_token)
    if current_user_id is None:
        raise UnauthorizedError("User not found")

    result = await create_comment(
        illust_id=illust_id,
        user_id=current_user_id,
        comment_text=body.commentText,
    )
    if result is None:
        raise NotFoundError("Illust not found")

    return result

