import os
from pathlib import Path
from pydantic_settings import BaseSettings
from typing import Optional
from dotenv import load_dotenv

# Ensure both local and root .env are loaded
_base_dir = Path(__file__).resolve().parent.parent.parent
load_dotenv(_base_dir.parent / ".env")
load_dotenv(_base_dir / ".env")

def _clean_env(key: str, default: Optional[str] = None) -> Optional[str]:
    val = os.getenv(key)
    if val is None or not val.strip():
        return default
    cleaned = val.strip().strip('"').strip("'")
    return cleaned if cleaned else default

class Settings(BaseSettings):
    PROJECT_NAME: str = "SANKALP AI Marketing Employee"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = _clean_env("SECRET_KEY", "sankalp_super_secret_jwt_key_2026_autonomous_ai")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database
    DATABASE_URL: str = _clean_env("DATABASE_URL", "sqlite:///./sankalp.db")
    
    # AI Providers
    AI_PROVIDER: str = _clean_env("AI_PROVIDER", "mock")  # mock | gemini | groq
    GEMINI_API_KEY: Optional[str] = _clean_env("GEMINI_API_KEY")
    GROQ_API_KEY: Optional[str] = _clean_env("GROQ_API_KEY")
    
    # Social Integrations
    INSTAGRAM_CLIENT_ID: Optional[str] = _clean_env("INSTAGRAM_CLIENT_ID")
    INSTAGRAM_CLIENT_SECRET: Optional[str] = _clean_env("INSTAGRAM_CLIENT_SECRET")
    INSTAGRAM_REDIRECT_URI: str = _clean_env("INSTAGRAM_REDIRECT_URI", "http://localhost:8000/social-accounts/instagram/callback")
    
    YOUTUBE_CLIENT_ID: Optional[str] = _clean_env("YOUTUBE_CLIENT_ID")
    YOUTUBE_CLIENT_SECRET: Optional[str] = _clean_env("YOUTUBE_CLIENT_SECRET")
    YOUTUBE_REDIRECT_URI: str = _clean_env("YOUTUBE_REDIRECT_URI", "http://localhost:8000/social-accounts/youtube/callback")
    
    # Storage & Redis
    STORAGE_URL: Optional[str] = _clean_env("STORAGE_URL", "local")
    REDIS_URL: Optional[str] = _clean_env("REDIS_URL", "redis://localhost:6379/0")
    
    @property
    def sanitized_youtube_client_id(self) -> Optional[str]:
        if not self.YOUTUBE_CLIENT_ID:
            return None
        # Remove any accidental http://, https://, or trailing slashes
        cid = self.YOUTUBE_CLIENT_ID.replace("http://", "").replace("https://", "").strip("/")
        return cid

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()

