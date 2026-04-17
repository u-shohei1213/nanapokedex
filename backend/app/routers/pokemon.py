from fastapi import APIRouter, Cookie

from app.core.exceptions import NotFoundError
from app.repositories.pokemon import fetch_pokemon_detail, fetch_pokemon_list
from app.repositories.user import fetch_user_id_by_guest_token
from app.schemas.pokemon import PokemonDetailResponse, PokemonListItemResponse

router = APIRouter(prefix="/pokemon", tags=["pokemon"])


@router.get("", response_model=list[PokemonListItemResponse])
async def get_pokemon_list(guest_token: str | None = Cookie(default=None)):
    current_user_id = None

    if guest_token:
        current_user_id = await fetch_user_id_by_guest_token(guest_token=guest_token)

    return await fetch_pokemon_list(current_user_id=current_user_id)


@router.get("/{pokemon_id}", response_model=PokemonDetailResponse)
async def get_pokemon_detail(
    pokemon_id: int,
    guest_token: str | None = Cookie(default=None),
):
    current_user_id = None

    if guest_token:
        current_user_id = await fetch_user_id_by_guest_token(guest_token=guest_token)

    detail = await fetch_pokemon_detail(
        pokemon_id=pokemon_id,
        current_user_id=current_user_id,
    )

    if detail is None:
        raise NotFoundError("Pokemon not found")

    return detail