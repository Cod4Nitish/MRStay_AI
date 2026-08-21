from fastapi import FastAPI

from src.backend.api.health import router as health_router
from src.backend.api.chat import router as chat_router
from src.backend.api.property import router as property_router
from src.backend.api.lead import router as lead_router
from src.backend.api.agent import router as agent_router
from src.backend.api.system import router as system_router
from src.backend.api.rag import router as rag_router

from fastapi.middleware.cors import CORSMiddleware
from src.backend.api.gemini import router as gemini_router

app = FastAPI(
    title="MRStay AI"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "null"
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(chat_router)
app.include_router(property_router)
app.include_router(lead_router)
app.include_router(agent_router)
app.include_router(system_router)
app.include_router(rag_router)
app.include_router(gemini_router)