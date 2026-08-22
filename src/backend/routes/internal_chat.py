from fastapi import APIRouter, Depends
from ..middleware.internal_auth import verify_internal_key
from ..models.chat_contract import ChatRequest, ChatResponse

router = APIRouter()

@router.post("/internal/chat", response_model=ChatResponse, dependencies=[Depends(verify_internal_key)])
async def internal_chat(payload: ChatRequest):
    return ChatResponse(
        reply=f"Received: {payload.message}",
        agent_used="stub",
        sources=[],
    )