# App settings, env loading
"""
MRStay AI
Central Configuration
"""

from pathlib import Path
from dotenv import load_dotenv
import os

# Project Root
BASE_DIR = Path(__file__).resolve().parents[3]

# Load .env
load_dotenv(BASE_DIR / ".env")

# Project Info
PROJECT_NAME = "MRStay AI"
VERSION = "0.1.0"

# Environment
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

# Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Database
DATABASE_URL = os.getenv("DATABASE_URL")

# ChromaDB
CHROMA_DB_PATH = os.getenv(
    "CHROMA_DB_PATH",
    str(BASE_DIR / "src" / "backend" / "data" / "chroma_db")
)

# Documents
DOCUMENTS_PATH = os.getenv(
    "DOCUMENTS_PATH",
    str(BASE_DIR / "src" / "backend" / "data" / "documents")
)