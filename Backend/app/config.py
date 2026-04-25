from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    APP_NAME: str = "KrishiSutraAI"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    SECRET_KEY: str = "krishisutra-dev-secret"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    MONGO_URI: str = "mongodb://localhost:27017/krishisutra"
    MONGO_DB_NAME: str = "krishisutra"

    POSTGRES_URI: Optional[str] = None

    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "mistral"
    ENABLE_OLLAMA_SUMMARY: bool = True
    OLLAMA_SUMMARY_TIMEOUT_SECONDS: int = 8
    ENABLE_DISEASE_AI_EXPLANATION: bool = True
    DISEASE_AI_TIMEOUT_SECONDS: int = 8
    ENABLE_COPILOT_OLLAMA: bool = True
    COPILOT_TIMEOUT_SECONDS: int = 6
    RAG_TIMEOUT_SECONDS: int = 10
    ENABLE_SIMULATION_AI: bool = True
    SIMULATION_AI_TIMEOUT_SECONDS: int = 8

    FAISS_INDEX_PATH: str = "./data/faiss_index"
    CHROMA_PATH: str = "./data/chroma"

    SCRAPE_INTERVAL_HOURS: int = 6
    USER_AGENT: str = "KrishiSutra/1.0"
    ENABLE_SCHEDULER: bool = True

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @field_validator("DEBUG", mode="before")
    @classmethod
    def parse_debug_value(cls, value):
        if isinstance(value, str):
            normalized = value.strip().lower()
            if normalized in {"release", "prod", "production", "false", "0", "no", "off"}:
                return False
            if normalized in {"debug", "dev", "development", "true", "1", "yes", "on"}:
                return True
        return value

settings = Settings()
