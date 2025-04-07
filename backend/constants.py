from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """App settings."""

    env: str = "demo"
    frontend_url: str = "http://localhost"
    log_level: str = "DEBUG"


settings = Settings()
