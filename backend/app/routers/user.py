from app.core.config import settings

from fastapi import APIRouter, Cookie, HTTPException, Response, status

from app.repositories.user import (
    attach_guest_token_to_user,
    check_password,
    create_guest_user,
    fetch_login_user,
    fetch_user_by_guest_token,
    generate_guest_token,
    register_user_from_guest,
    update_display_name_by_guest_token,
)
from app.schemas.user import (
    CurrentUserResponse,
    RandomDisplayNameResponse,
    UserDisplayNameUpdateRequest,
    UserLoginRequest,
    UserRegisterRequest,
)
from app.utils.name_generator import generate_random_name
from app.core.exceptions import NotFoundError, UnauthorizedError

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=CurrentUserResponse)
async def get_current_user(guest_token: str | None = Cookie(default=None)):
    if not guest_token:
        raise NotFoundError("User not found")

    user = await fetch_user_by_guest_token(guest_token=guest_token)

    if user is None:
        raise NotFoundError("User not found")
    
    return user


@router.post("/guest", response_model=CurrentUserResponse)
async def create_or_restore_guest_user(
    response: Response,
    guest_token: str | None = Cookie(default=None),
):
    # cookieがあり、対応するユーザーも存在するならそのまま返す
    if guest_token:
        existing_user = await fetch_user_by_guest_token(guest_token=guest_token)
        if existing_user is not None:
            return existing_user

    # 無ければ新規作成
    new_guest_token = generate_guest_token()
    user = await create_guest_user(guest_token=new_guest_token)

    response.set_cookie(
        key="guest_token",
        value=new_guest_token,
        httponly=True,
        samesite=settings.COOKIE_SAMESITE,
        secure=settings.COOKIE_SECURE,
        path="/",
    )

    return user


@router.get("/random-display-name", response_model=RandomDisplayNameResponse)
async def get_random_display_name():
    return {"displayUserName": generate_random_name()}


@router.post("/register", response_model=CurrentUserResponse)
async def register_user(
    body: UserRegisterRequest,
    guest_token: str | None = Cookie(default=None),
):
    if not guest_token:
        raise UnauthorizedError("Guest user not found")

    user = await register_user_from_guest(
        guest_token=guest_token,
        login_id=body.loginId,
        password=body.password,
        display_name=body.displayName,
    )

    if user is None:
        raise NotFoundError("Guest user not found")

    return user


@router.post("/login", response_model=CurrentUserResponse)
async def login_user(
    body: UserLoginRequest,
    response: Response,
):
    user = await fetch_login_user(login_id=body.loginId)

    if user is None:
        raise UnauthorizedError("Invalid loginId or password")

    password_hash = user["password_hash"]
    if password_hash is None or not check_password(body.password, password_hash):
        raise UnauthorizedError("Invalid loginId or password")

    new_guest_token = generate_guest_token()
    result = await attach_guest_token_to_user(
        user_id=user["id"],
        guest_token=new_guest_token,
    )

    response.set_cookie(
        key="guest_token",
        value=new_guest_token,
        httponly=True,
        samesite=settings.COOKIE_SAMESITE,
        secure=settings.COOKIE_SECURE,
        path="/",
    )

    return result


@router.patch("/me/display-name", response_model=CurrentUserResponse)
async def update_display_name(
    body: UserDisplayNameUpdateRequest,
    guest_token: str | None = Cookie(default=None),
):
    if not guest_token:
        raise UnauthorizedError("User not found")

    user = await update_display_name_by_guest_token(
        guest_token=guest_token,
        display_name=body.displayName,
    )

    if user is None:
        raise NotFoundError("User not found")

    return user