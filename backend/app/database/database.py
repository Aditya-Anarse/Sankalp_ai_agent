from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from ..core.config import settings

# Handle SQLite vs PostgreSQL connections cleanly
connect_args = {"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}

engine_kwargs = {"connect_args": connect_args, "echo": False}
if not settings.DATABASE_URL.startswith("sqlite"):
    engine_kwargs.update({"pool_pre_ping": True, "pool_recycle": 300})

engine = create_engine(
    settings.DATABASE_URL,
    **engine_kwargs
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
