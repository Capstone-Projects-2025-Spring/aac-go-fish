from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """App settings."""

    env: str = "demo"
    mode: str = "cycle"
    frontend_url: str = "http://localhost"
    log_level: str = "DEBUG"
    json_logs: bool = False
    code_length: int = 3


settings = Settings()
