class AppError(Exception):
    status_code: int = 400
    detail: str = "Application error"

    def __init__(self, detail: str | None = None):
        if detail is not None:
            self.detail = detail
        super().__init__(self.detail)


class NotFoundError(AppError):
    status_code = 404
    detail = "Resource not found"


class UnauthorizedError(AppError):
    status_code = 401
    detail = "Unauthorized"


class ConflictError(AppError):
    status_code = 409
    detail = "Conflict"


class BadRequestError(AppError):
    status_code = 400
    detail = "Bad request"