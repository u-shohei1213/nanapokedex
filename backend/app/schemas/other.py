from datetime import datetime
from typing import Literal
from pydantic import BaseModel, Field


class IllustCommentCreateRequest(BaseModel):
    commentText: str = Field(min_length=1, max_length=5000)


class OtherCommentResponse(BaseModel):
    id: int
    content: str
    postedAt: datetime
    displayUserName: str | None = None


class OtherIllustSummaryResponse(BaseModel):
    id: int
    postUrl: str
    imageUrl: str
    likeCount: int
    viewCount: int
    commentCount: int
    likedByUser: bool


class OtherListItemResponse(BaseModel):
    id: int
    kind: Literal["other"]
    name: str
    postedAt: str
    illusts: list[OtherIllustSummaryResponse]


class IllustLikeResponse(BaseModel):
    likedByUser: bool
    likeCount: int


class OtherIllustDetailResponse(BaseModel):
    id: int
    postUrl: str
    imageUrl: str
    postedAt: datetime
    likeCount: int
    viewCount: int
    commentCount: int
    likedByUser: bool
    comments: list[OtherCommentResponse]


class OtherDetailResponse(BaseModel):
    id: int
    kind: Literal["other"]
    name: str
    postedAt: datetime
    illusts: list[OtherIllustDetailResponse]