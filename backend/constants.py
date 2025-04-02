from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """App settings."""

    env: str = "dev"
    frontend_url: str = "http://localhost:3000"
    log_level: str = "DEBUG"


settings = Settings()
