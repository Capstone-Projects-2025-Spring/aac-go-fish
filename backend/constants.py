from pydantic_settings import BaseSettings

FRONTEND_URL = "http://localhost:3000"


class Settings(BaseSettings):
    """App settings."""

    env: str = "dev"

    log_level: str = "DEBUG"


settings = Settings()
