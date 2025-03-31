from pydantic_settings import BaseSettings

FRONTEND_URL = "http://localhost:3000"

class Settings(BaseSettings):
    """App settings."""

    env: str = "prod"


settings = Settings()
