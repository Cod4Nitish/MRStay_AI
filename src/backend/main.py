from fastapi import FastAPI

from src.backend.api.health import router as health_router
from src.backend.api.chat import router as chat_router
from src.backend.api.property import router as property_router
from src.backend.api.lead import router as lead_router
from src.backend.api.agent import router as agent_router
from src.backend.api.system import router as system_router

app = FastAPI(
    title="MRStay AI"
)

app.include_router(health_router)
app.include_router(chat_router)
app.include_router(property_router)
app.include_router(lead_router)
app.include_router(agent_router)
app.include_router(system_router)