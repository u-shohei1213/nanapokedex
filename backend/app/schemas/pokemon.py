from datetime import datetime
from typing import Literal

from pydantic import BaseModel


class PokemonCommentResponse(BaseModel):
    id: int
    content: str
    postedAt: datetime
    displayUserName: str | None = None


class PokemonIllustSummaryResponse(BaseModel):
    id: int
    postUrl: str
    imageUrl: str
    likeCount: int
    viewCount: int
    commentCount: int
    likedByUser: bool


class PokemonListItemResponse(BaseModel):
    id: int
    kind: Literal["pokemon"]
    name: str
    subname: str | None = None
    dexNo: str
    types: list[str]
    region: str
    illusts: list[PokemonIllustSummaryResponse]


class PokemonIllustDetailResponse(BaseModel):
    id: int
    postUrl: str
    imageUrl: str
    postedAt: datetime
    likeCount: int
    viewCount: int
    commentCount: int
    likedByUser: bool
    comments: list[PokemonCommentResponse]


class PokemonDetailResponse(BaseModel):
    id: int
    kind: Literal["pokemon"]
    name: str
    subname: str | None = None
    dexNo: str
    types: list[str]
    region: str
    originalUrl: str
    illusts: list[PokemonIllustDetailResponse]