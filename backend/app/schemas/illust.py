from datetime import datetime

from pydantic import BaseModel, Field


class IllustLikeResponse(BaseModel):
    likedByUser: bool
    likeCount: int


class IllustViewResponse(BaseModel):
    viewCount: int


class IllustCommentCreateRequest(BaseModel):
    commentText: str = Field(min_length=1, max_length=500)


class IllustCommentResponse(BaseModel):
    id: int
    content: str
    postedAt: datetime
    displayUserName: str | None = None