from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """App settings."""

    env: str = "dev"


settings = Settings()
