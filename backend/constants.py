from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """App settings."""

    env: str = "prod"


settings = Settings()
