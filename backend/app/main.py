from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import json
import uuid

from .core.config import settings
from .core.security import get_password_hash
from .database.database import engine, Base, SessionLocal
from .models.models import (
    User, Business, Product, AudienceProfile, BrandProfile, MarketingGoal,
    ContentPreference, SocialAccount, Campaign, ContentAsset, LearningInsight, AgentRun
)
from .api import auth, business, campaigns, content, analytics, learning, agent, social_accounts, calendar, notifications

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SANKALP AI — Autonomous Marketing Employee API",
    description="Backend API powering SANKALP's 7-Agent Autonomous Marketing Employee Engine.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware configuration
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(business.router)
app.include_router(campaigns.router)
app.include_router(content.router)
app.include_router(analytics.router)
app.include_router(learning.router)
app.include_router(agent.router)
app.include_router(social_accounts.router)
app.include_router(calendar.router)
app.include_router(notifications.router)

from .ai.providers import is_ai_configured

@app.on_event("startup")
def log_startup_diagnostics():
    client_id_masked = f"{settings.INSTAGRAM_CLIENT_ID[:4]}...{settings.INSTAGRAM_CLIENT_ID[-4:]}" if settings.INSTAGRAM_CLIENT_ID and len(settings.INSTAGRAM_CLIENT_ID) > 8 else "***"
    print("\n" + "=" * 60)
    print("SANKALP AI — STARTUP CONFIGURATION DIAGNOSTICS")
    print("-" * 60)
    print(f"DATABASE: {settings.DATABASE_URL.split('@')[-1] if '@' in settings.DATABASE_URL else 'local'}")
    print(f"AI_PROVIDER: {settings.AI_PROVIDER}")
    print(f"INSTAGRAM_CLIENT_ID: {client_id_masked}")
    print(f"settings.INSTAGRAM_REDIRECT_URI: {settings.INSTAGRAM_REDIRECT_URI}")
    print(f"settings.YOUTUBE_REDIRECT_URI: {settings.YOUTUBE_REDIRECT_URI}")
    print("=" * 60 + "\n", flush=True)

@app.get("/")
def root():
    return {
        "product": "SANKALP AI",
        "role": "Autonomous AI Marketing Employee for Businesses",
        "status": "operational",
        "engine_version": "2.0.0",
        "agents": [
            "ResearchAgent",
            "StrategyAgent",
            "CreativeAgent",
            "QualityAgent",
            "PublisherAgent",
            "PerformanceAgent",
            "LearningAgent"
        ],
        "documentation": "/docs"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "database": "connected",
        "ai_configured": is_ai_configured(),
        "product": "SANKALP AI"
    }


@app.get("/ai/status")
def ai_status():
    configured = is_ai_configured()
    active_provider = settings.AI_PROVIDER
    if settings.GEMINI_API_KEY:
        active_provider = "gemini"
    elif settings.GROQ_API_KEY:
        active_provider = "groq"
    else:
        active_provider = None

    return {
        "configured": configured,
        "provider": active_provider,
        "message": "AI provider active" if configured else "AI provider is not configured."
    }


