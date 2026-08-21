import logging
from typing import Optional

from fastapi import APIRouter
from pydantic import BaseModel, Field

from src.ai.workflows.agent_orchestrator import AgentOrchestrator

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/chat",
    tags=["Chat"]
)

# Single shared orchestrator instance for the whole app — agents
# (embeddings model, ChromaDB connection, Gemini client) are
# expensive to initialize, so we build this once at import time,
# not per-request.
_orchestrator = AgentOrchestrator()


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, description="Customer's message")
    session_id: Optional[str] = Field(
        None, description="Conversation session ID — omit for a new session"
    )


class ChatResponse(BaseModel):
    success: bool
    response: str
    intent: Optional[str]
    confidence: Optional[str]
    agent_used: Optional[str]
    session_id: str
    latency_ms: int
    sources: list


@router.get("/")
def chat_status():
    return {
        "module": "Chat API Ready",
        "orchestrator_health": _orchestrator.health()
    }


@router.post("/", response_model=ChatResponse)
def send_message(payload: ChatRequest):
    """
    Main customer-facing chat endpoint. Routes the message through
    the Agent Orchestrator (intent detection -> correct agent ->
    grounded response) and returns a structured result the
    frontend can render directly.
    """

    result = _orchestrator.route(
        message=payload.message,
        session_id=payload.session_id
    )

    return result