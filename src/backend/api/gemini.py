"""
MRStay AI
Gemini API Routes
"""

from fastapi import APIRouter
from pydantic import BaseModel

from src.backend.services.gemini_service import gemini_service
from src.backend.services.mock_ai_service import mock_ai_service

router = APIRouter(
    prefix="/api/gemini",
    tags=["Gemini AI"]
)


class ChatRequest(BaseModel):
    prompt: str


@router.get("/test")
async def test_gemini():
    """
    Test Gemini API Connection
    """

    # Try Real Gemini
    result = gemini_service.generate(
        "Reply with only: Gemini connection successful."
    )

    provider = "Google Gemini"

    # Fallback to Mock AI
    if not result["success"]:
        print("⚠ Gemini unavailable. Switching to Mock AI...")
        result = mock_ai_service.generate(
            "Gemini connection successful."
        )
        provider = "Mock AI"

    return {
        "success": True,
        "provider": provider,
        "response": result["response"]
    }


@router.post("/chat")
async def chat_with_gemini(request: ChatRequest):
    """
    Send Prompt to Gemini
    """

    # Try Real Gemini
    result = gemini_service.generate(request.prompt)

    provider = "Google Gemini"

    # Fallback to Mock AI
    if not result["success"]:
        print("⚠ Gemini unavailable. Switching to Mock AI...")
        result = mock_ai_service.generate(request.prompt)
        provider = "Mock AI"

    return {
        "success": True,
        "provider": provider,
        "response": result["response"]
    }