from pydantic_settings import BaseSettings
from pathlib import Path


class Settings(BaseSettings):
    model_name: str = "qwen3:1.7b"
    ollama_host: str = "http://localhost:11434"
    temperature: float = 0.7
    top_p: float = 0.9
    top_k: int = 40
    repeat_penalty: float = 1.15
    max_tokens: int = 4096
    context_window: int = 8192
    chroma_db_path: str = str(Path(__file__).parent.parent / "memory" / "chromadb")
    data_dir: str = str(Path(__file__).parent.parent / "data")
    log_level: str = "INFO"

    class Config:
        env_file = ".env"
        env_prefix = "ALI_"


settings = Settings()
