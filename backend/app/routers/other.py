from fastapi import APIRouter, Cookie

from app.core.exceptions import NotFoundError
from app.repositories.other import fetch_other_detail, fetch_other_list
from app.repositories.user import fetch_user_id_by_guest_token
from app.schemas.other import OtherDetailResponse, OtherListItemResponse

router = APIRouter(prefix="/other", tags=["other"])


@router.get("", response_model=list[OtherListItemResponse])
async def get_other_list(guest_token: str | None = Cookie(default=None)):
    current_user_id = None

    if guest_token:
        current_user_id = await fetch_user_id_by_guest_token(guest_token)

    return await fetch_other_list(current_user_id)


@router.get("/{post_id}", response_model=OtherDetailResponse)
async def get_other_detail(
    post_id: int,
    guest_token: str | None = Cookie(default=None),
):
    current_user_id = None

    if guest_token:
        current_user_id = await fetch_user_id_by_guest_token(guest_token=guest_token)

    detail = await fetch_other_detail(
        post_id=post_id,
        current_user_id=current_user_id,
    )

    if detail is None:
        raise NotFoundError("Other post not found")

    return detail