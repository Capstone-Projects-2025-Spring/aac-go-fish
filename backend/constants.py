from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """App settings."""

    env: str = "prod"

    log_level: str = "INFO"


settings = Settings()
