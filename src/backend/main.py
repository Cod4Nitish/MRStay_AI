from fastapi import FastAPI

from src.backend.api.health import router as health_router

app = FastAPI(
    title="MRStay AI"
)

app.include_router(health_router)