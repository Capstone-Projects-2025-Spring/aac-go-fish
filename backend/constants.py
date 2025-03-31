from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """App settings."""

    env: str = "dev"

    log_level: str = "DEBUG"


settings = Settings()
