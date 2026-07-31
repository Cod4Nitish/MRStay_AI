from fastapi import APIRouter

router = APIRouter(
    prefix="/health",
    tags=["Health"]
)


@router.get("/")
def health_check():
    return {
        "status": "ok",
        "services": {
            "fastapi": "healthy",
            "gemini": "not_configured",
            "chromadb": "not_connected",
            "postgres": "not_connected",
            "redis": "not_connected"
        }
    }