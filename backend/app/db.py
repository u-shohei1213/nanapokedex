from psycopg_pool import AsyncConnectionPool

from app.core.config import settings


pool = AsyncConnectionPool(
    conninfo=(
        f"dbname={settings.DB_NAME} "
        f"user={settings.DB_USER} "
        f"password={settings.DB_PASSWORD} "
        f"host={settings.DB_HOST} "
        f"port={settings.DB_PORT}"
    ),
    open=False,
)