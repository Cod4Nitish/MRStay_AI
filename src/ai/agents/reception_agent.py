import logging
from typing import Any, Dict, Optional

from src.ai.agents.base_agent import BaseAgent
from src.ai.llm.gemini_client import GeminiClient

logger = logging.getLogger(__name__)


class ReceptionAgent(BaseAgent):
    """
    Handles greetings, small talk, and generic FAQ-style
    messages that don't need property-specific RAG lookup.

    Performance note: pure greetings ("hi", "hello") are matched
    deterministically and answered instantly WITHOUT calling
    Gemini. This is intentional — a greeting has no informational
    content, so spending 4+ seconds on an LLM round-trip for it
    is wasted latency. Anything beyond a bare greeting still goes
    to Gemini for a proper, grounded reply.
    """

    agent_name = "reception_agent"

    SYSTEM_INSTRUCTION = (
        "You are the friendly reception assistant for MRStay AI, "
        "a real estate sales platform. Keep replies short "
        "(1-2 sentences), and gently guide them toward asking "
        "about specific properties, pricing, or booking a site "
        "visit. Do not invent property details."
    )

    # Exact/near-exact greeting phrases — matched only when the
    # message is JUST a greeting (short, no other content), so we
    # don't accidentally short-circuit something like
    # "hi, what's the price of 7th Avenue?"
    _GREETING_PHRASES = {
        "hi", "hii", "hiii", "hello", "hey", "hola",
        "good morning", "good afternoon", "good evening",
        "namaste", "namaskar", "yo"
    }

    _GREETING_RESPONSE = (
        "Hello and welcome to MRStay AI! 👋 "
        "Are you looking for property details, pricing, "
        "or want to schedule a site visit?"
    )

    _MAX_WORDS_FOR_GREETING_SHORTCUT = 4

    def __init__(self, llm_client: Optional[GeminiClient] = None):
        super().__init__()
        self.llm = llm_client or GeminiClient()

        self.stats.update({
            "instant_greetings": 0,
            "llm_handled": 0
        })

    # ======================================================
    # Greeting Detection
    # ======================================================

    def _is_pure_greeting(self, message: str) -> bool:
        """
        True only for short messages that are essentially just a
        greeting — not for greetings attached to a real question.
        """

        cleaned = message.strip().lower().strip("!.,? ")

        if not cleaned:
            return False

        if cleaned in self._GREETING_PHRASES:
            return True

        # Allow short combos like "hi there", "hey good morning"
        word_count = len(cleaned.split())

        if word_count <= self._MAX_WORDS_FOR_GREETING_SHORTCUT:
            words = set(cleaned.split())
            if words & self._GREETING_PHRASES or any(
                phrase in cleaned for phrase in self._GREETING_PHRASES
            ):
                return True

        return False

    # ======================================================
    # Handle
    # ======================================================

    def handle(
        self,
        message: str,
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:

        if self._is_pure_greeting(message):

            self.stats["instant_greetings"] += 1

            return {
                "response": self._GREETING_RESPONSE,
                "sources": [],
                "metadata": {"method": "instant_template"}
            }

        # Anything beyond a bare greeting (general FAQ, small talk
        # with substance) still goes through Gemini.
        self.stats["llm_handled"] += 1

        response_text = self.llm.generate(
            prompt=message,
            system_instruction=self.SYSTEM_INSTRUCTION,
            temperature=0.5,
            max_output_tokens=200
        )

        return {
            "response": response_text,
            "sources": [],
            "metadata": {"method": "llm"}
        }