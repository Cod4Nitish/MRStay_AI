"""
==========================================================
MRStay AI
Enterprise Database Connection
==========================================================
"""

import logging
from typing import Any, Dict

from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker

from src.backend.config.settings import DATABASE_URL

logger = logging.getLogger(__name__)

# ==========================================================
# SQLAlchemy Base
# ==========================================================

Base = declarative_base()

# ==========================================================
# Database Engine
# ==========================================================

logger.info("=" * 60)
logger.info("Initializing Database Connection")
logger.info("=" * 60)

ENGINE = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=3600,
    pool_size=10,
    max_overflow=20,
    echo=False,
    future=True
)

# ==========================================================
# Session Factory
# ==========================================================

SessionLocal = sessionmaker(
    bind=ENGINE,
    autoflush=False,
    autocommit=False,
    expire_on_commit=False
)

logger.info("Database Engine Created Successfully")

# ==========================================================
# Dependency
# ==========================================================

def get_db():

    db = SessionLocal()

    try:

        yield db

    finally:

        db.close()

# ==========================================================
# Database Health Check
# ==========================================================

def health() -> Dict[str, Any]:

    try:

        with ENGINE.connect() as connection:

            connection.execute(
                text("SELECT 1")
            )

        return {

            "success": True,

            "database": "connected"

        }

    except Exception as e:

        logger.exception(e)

        return {

            "success": False,

            "error": str(e)

        }

# ==========================================================
# Database Statistics
# ==========================================================

def statistics() -> Dict[str, Any]:

    return {

        "database_url": DATABASE_URL,

        "pool_size": ENGINE.pool.size(),

        "checked_in_connections":
            ENGINE.pool.checkedin(),

        "checked_out_connections":
            ENGINE.pool.checkedout()

    }

# ==========================================================
# Create Tables
# ==========================================================

def create_tables() -> None:

    logger.info("Creating Database Tables...")

    Base.metadata.create_all(
        bind=ENGINE
    )

    logger.info("Database Tables Created Successfully")

# ==========================================================
# Drop Tables
# ==========================================================

def drop_tables() -> None:

    logger.warning(
        "Dropping All Database Tables..."
    )

    Base.metadata.drop_all(
        bind=ENGINE
    )

    logger.info(
        "Database Tables Dropped Successfully"
    )

# ==========================================================
# CLI
# ==========================================================

if __name__ == "__main__":

    logging.basicConfig(level=logging.INFO)

    print("\nHealth")
    print(health())

    print("\nStatistics")
    print(statistics())