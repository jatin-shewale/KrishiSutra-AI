from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    APP_NAME: str = "KrishiSutraAI"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    MONGO_URI: str = "mongodb://localhost:27017/krishisutra"
    MONGO_DB_NAME: str = "krishisutra"

    POSTGRES_URI: Optional[str] = None

    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "llama3"

    FAISS_INDEX_PATH: str = "./data/faiss_index"
    CHROMA_PATH: str = "./data/chroma"

    SCRAPE_INTERVAL_HOURS: int = 6
    USER_AGENT: str = "KrishiSutra/1.0"
    ENABLE_SCHEDULER: bool = True

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
