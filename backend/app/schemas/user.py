from pydantic import BaseModel, Field


class CurrentUserResponse(BaseModel):
    userId: int
    displayUserName: str | None = None
    isGuest: bool
    isAdmin: bool


class RandomDisplayNameResponse(BaseModel):
    displayUserName: str


class UserRegisterRequest(BaseModel):
    loginId: str = Field(min_length=1, max_length=100)
    password: str = Field(min_length=1, max_length=100)
    displayName: str | None = Field(default=None, max_length=100)


class UserLoginRequest(BaseModel):
    loginId: str = Field(min_length=1, max_length=100)
    password: str = Field(min_length=1, max_length=100)


class UserDisplayNameUpdateRequest(BaseModel):
    displayName: str | None = Field(default=None, max_length=100)