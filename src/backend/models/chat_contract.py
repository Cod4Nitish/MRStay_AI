from pydantic import BaseModel
from typing import List, Optional

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatContext(BaseModel):
    history: List[ChatMessage] = []

class ChatRequest(BaseModel):
    tenant_id: str
    conversation_id: str
    session_id: str
    message: str
    context: ChatContext

class LeadSignal(BaseModel):
    detected: bool
    confidence: float

class ChatResponse(BaseModel):
    reply: str
    agent_used: str
    sources: List[str] = []
    lead_signal: Optional[LeadSignal] = None