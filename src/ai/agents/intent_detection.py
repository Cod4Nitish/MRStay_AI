import logging
import re
from typing import Any, Dict, Optional

from src.ai.llm.gemini_client import GeminiClient

logger = logging.getLogger(__name__)


# ==============================================================
# Supported Intents
# ==============================================================
INTENT_CATEGORIES = {
    "property_query": (
        "Questions about a specific property — configurations, "
        "pricing, amenities, possession status, location, RERA, "
        "floor plans, project details."
    ),
    "greeting": (
        "Greetings or small talk with no informational request — "
        "hi, hello, how are you, thanks, bye."
    ),
    "lead_capture": (
        "User is sharing or offering to share contact details, "
        "or asking to schedule a site visit / callback."
    ),
    "human_handoff": (
        "Complex negotiation, legal questions, complaints, or "
        "explicit requests to talk to a human agent."
    ),
    "general_faq": (
        "Generic questions about the company, process, or "
        "anything not tied to a specific property and not "
        "covered by the other categories."
    )
}

DEFAULT_INTENT = "general_faq"

_FALLBACK_KEYWORDS = {
    "greeting": ["hi", "hello", "hey", "namaste", "thanks", "thank you", "bye"],
    "lead_capture": ["call me", "site visit", "my number", "contact me", "callback"],
    "human_handoff": ["talk to human", "agent please", "complaint", "not happy", "legal"],
}

_GREETING_ONLY_PHRASES = {
    "hi", "hii", "hiii", "hello", "hey", "hola", "yo",
    "good morning", "good afternoon", "good evening",
    "namaste", "namaskar"
}

# Patterns that suggest a message is a short follow-up answer
# (budget figure, phone number, a bare name) rather than a new
# topic — used only to decide whether to keep a lead_capture
# conversation going, never to force lead_capture from scratch.
_BUDGET_PATTERN = re.compile(
    r"\b\d+(\.\d+)?\s*(lakh|lac|crore|cr|k|thousand)\b|₹\s*\d+", re.IGNORECASE
)
_PHONE_PATTERN = re.compile(r"\b\d{10}\b|\+?\d{2,3}[\s-]?\d{10}\b")
_SHORT_ANSWER_WORD_LIMIT = 6


class IntentDetector:
    """
    ==========================================================
    MRStay AI
    Intent Detection Agent

    Classifies an incoming customer message into one of the
    fixed INTENT_CATEGORIES so the Agent Orchestrator can route
    it to the correct downstream agent.

    Session-aware continuity: if the caller passes
    session_context (with the previous turn's intent), a short
    follow-up message that looks like a budget figure, phone
    number, or bare short answer is kept on "lead_capture"
    instead of being reclassified as something else — this is
    what lets a real multi-turn lead conversation ("I want a
    site visit" -> "90 lakh" -> "9876543210") stay coherent
    without needing full conversation history sent to the LLM
    every time.
    ==========================================================
    """

    def __init__(self, llm_client: Optional[GeminiClient] = None):

        self.llm = llm_client or GeminiClient()

        self.stats = {
            "total_requests": 0,
            "rule_based_hits": 0,
            "context_overrides": 0,
            "llm_successes": 0,
            "fallback_used": 0,
            "invalid_intent_corrected": 0
        }

        logger.info("=" * 60)
        logger.info("Intent Detector initialized")
        logger.info(f"Categories: {list(INTENT_CATEGORIES.keys())}")
        logger.info("=" * 60)

    # ======================================================
    # Rule-based Fast Path (greetings only)
    # ======================================================

    def _is_pure_greeting(self, message: str) -> bool:

        cleaned = message.strip().lower().strip("!.,? ")

        if not cleaned:
            return False

        if cleaned in _GREETING_ONLY_PHRASES:
            return True

        words = cleaned.split()

        if len(words) <= 3 and set(words) & _GREETING_ONLY_PHRASES:
            return True

        return False

    # ======================================================
    # Context Continuity Check
    # ======================================================

    def _looks_like_lead_followup(self, message: str) -> bool:
        """
        True for short messages that plausibly answer a lead
        qualification question — a budget figure, a phone number,
        or just a short bare answer (like a name). Deliberately
        loose since this only APPLIES when the previous turn was
        already lead_capture — it never triggers lead_capture on
        its own.
        """

        stripped = message.strip()

        if _BUDGET_PATTERN.search(stripped):
            return True

        if _PHONE_PATTERN.search(stripped):
            return True

        word_count = len(stripped.split())

        if 0 < word_count <= _SHORT_ANSWER_WORD_LIMIT:
            return True

        return False

    # ======================================================
    # Prompt Construction (for the LLM path)
    # ======================================================

    def _build_prompt(self, message: str) -> str:

        category_lines = "\n".join(
            f'- "{key}": {desc}'
            for key, desc in INTENT_CATEGORIES.items()
        )

        return (
            "You are an intent classifier for a real estate sales "
            "assistant. Classify the customer message into EXACTLY "
            "ONE of these categories:\n\n"
            f"{category_lines}\n\n"
            f'Customer message: "{message}"\n\n'
            "Return JSON in this exact shape:\n"
            '{"intent": "<one_of_the_category_keys>", '
            '"confidence": "high|medium|low"}'
        )

    # ======================================================
    # Fallback (rule-based, used only if LLM call fails)
    # ======================================================

    def _fallback_detect(self, message: str) -> Dict[str, Any]:

        self.stats["fallback_used"] += 1

        lowered = message.lower()

        for intent, keywords in _FALLBACK_KEYWORDS.items():
            if any(kw in lowered for kw in keywords):
                return {
                    "intent": intent,
                    "confidence": "low",
                    "method": "fallback_keyword"
                }

        return {
            "intent": DEFAULT_INTENT,
            "confidence": "low",
            "method": "fallback_default"
        }

    # ======================================================
    # Public API
    # ======================================================

    def detect(
        self,
        message: str,
        session_context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        session_context (optional): {"last_intent": "lead_capture"}
        When the previous turn's intent was lead_capture and this
        message looks like a short follow-up answer, the intent
        stays lead_capture regardless of what the LLM/fast-path
        would otherwise say — this keeps a lead conversation from
        derailing on messages like "90 lakh" or a bare phone number.

        Returns:
            {
                "intent": "property_query",
                "confidence": "high",
                "method": "rule_based" | "llm" |
                           "fallback_keyword" | "fallback_default" |
                           "context_override"
            }
        """

        self.stats["total_requests"] += 1

        if not message or not message.strip():
            return {
                "intent": DEFAULT_INTENT,
                "confidence": "low",
                "method": "empty_input"
            }

        # --- Context override: continue an active lead conversation ---
        last_intent = (session_context or {}).get("last_intent")

        if last_intent == "lead_capture" and self._looks_like_lead_followup(message):

            self.stats["context_overrides"] += 1

            return {
                "intent": "lead_capture",
                "confidence": "high",
                "method": "context_override"
            }

        # --- Fast path: skip Gemini entirely for pure greetings ---
        if self._is_pure_greeting(message):

            self.stats["rule_based_hits"] += 1

            return {
                "intent": "greeting",
                "confidence": "high",
                "method": "rule_based"
            }

        # --- Everything else: full LLM classification ---
        try:

            result = self.llm.generate_json(
                prompt=self._build_prompt(message),
                temperature=0.0
            )

            intent = result.get("intent", DEFAULT_INTENT)
            confidence = result.get("confidence", "medium")

            if intent not in INTENT_CATEGORIES:

                logger.warning(
                    f"LLM returned unknown intent '{intent}' — "
                    f"defaulting to '{DEFAULT_INTENT}'."
                )

                self.stats["invalid_intent_corrected"] += 1
                intent = DEFAULT_INTENT

            self.stats["llm_successes"] += 1

            return {
                "intent": intent,
                "confidence": confidence,
                "method": "llm"
            }

        except Exception as e:

            logger.error(
                f"Intent detection LLM call failed, using fallback: {e}"
            )

            return self._fallback_detect(message)

    # ======================================================
    # Statistics
    # ======================================================

    def statistics(self) -> Dict[str, Any]:

        return {
            **self.stats,
            "categories": list(INTENT_CATEGORIES.keys())
        }