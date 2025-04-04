from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """App settings."""

    env: str = "dev"
    frontend_url: str = "http://localhost"
    log_level: str = "DEBUG"


settings = Settings()
