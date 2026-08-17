"""
==========================================================
MRStay AI
Enterprise Configuration
Version : 2.0
==========================================================
"""

import os

from pathlib import Path
from dotenv import load_dotenv

# ==========================================================
# Project Root
# ==========================================================

BASE_DIR = Path(__file__).resolve().parents[3]

# ==========================================================
# Load Environment
# ==========================================================

ENV_FILE = BASE_DIR / ".env"

load_dotenv(ENV_FILE, override=True)

# ==========================================================
# Project Information
# ==========================================================

PROJECT_NAME = "MRStay AI"

VERSION = "2.0.0"

ENVIRONMENT = os.getenv(
    "ENVIRONMENT",
    "development"
)

DEBUG = ENVIRONMENT.lower() == "development"

# ==========================================================
# API Keys
# ==========================================================

GEMINI_API_KEY = os.getenv(
    "GEMINI_API_KEY",
    ""
)

# ==========================================================
# Database
# ==========================================================

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    ""
)

# ==========================================================
# ChromaDB
# ==========================================================

CHROMA_DB_PATH = os.getenv(
    "CHROMA_DB_PATH",
    str(
        BASE_DIR /
        "src/backend/data/chroma_db"
    )
)

# ==========================================================
# Documents
# ==========================================================

DOCUMENTS_PATH = os.getenv(
    "DOCUMENTS_PATH",
    str(
        BASE_DIR /
        "src/backend/data/documents"
    )
)

# ==========================================================
# Security
# ==========================================================

SECRET_KEY = os.getenv(
    "SECRET_KEY",
    "mrstay-development-secret"
)

# ==========================================================
# Server
# ==========================================================

HOST = os.getenv(
    "HOST",
    "0.0.0.0"
)

PORT = int(
    os.getenv(
        "PORT",
        8000
    )
)

# ==========================================================
# Logging
# ==========================================================

LOG_LEVEL = os.getenv(
    "LOG_LEVEL",
    "INFO"
)

# ==========================================================
# Enterprise Startup Check
# ==========================================================

print("=" * 65)
print("MRStay AI Enterprise Configuration")
print("=" * 65)

print(f"Environment : {ENVIRONMENT}")
print(f"Debug Mode  : {DEBUG}")
print(f"Project     : {PROJECT_NAME}")
print(f"Version     : {VERSION}")

print(
    "Gemini Key  :",
    "Loaded [OK]" if GEMINI_API_KEY else "Missing [MISSING]"
)

print(
    "Database    :",
    "Configured [OK]" if DATABASE_URL else "Not Configured [WARN]"
)

print(f"ChromaDB    : {CHROMA_DB_PATH}")

print(f"Documents   : {DOCUMENTS_PATH}")

print("=" * 65)