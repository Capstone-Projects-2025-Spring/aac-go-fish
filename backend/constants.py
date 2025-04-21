from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """App settings."""

    env: str = "demo"
    frontend_url: str = "http://localhost:3000"
    log_level: str = "DEBUG"
    code_length: int = 3


settings = Settings()
