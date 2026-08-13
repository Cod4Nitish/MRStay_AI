import logging
from typing import Any, Dict, Optional

from src.ai.llm.gemini_client import GeminiClient

logger = logging.getLogger(__name__)


# ==============================================================
# Supported Intents
# ==============================================================
# Every value the classifier is allowed to return. Keeping this
# as a single source of truth so the orchestrator can validate
# against it too.
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

# Lightweight keyword map used ONLY as a fallback when the LLM
# call fails — keeps the system degraded-but-functional instead
# of hard down.
_FALLBACK_KEYWORDS = {
    "greeting": ["hi", "hello", "hey", "namaste", "thanks", "thank you", "bye"],
    "lead_capture": ["call me", "site visit", "my number", "contact me", "callback"],
    "human_handoff": ["talk to human", "agent please", "complaint", "not happy", "legal"],
}

# Pure greeting phrases — used for the instant rule-based fast
# path below, BEFORE any LLM call is made. Kept deliberately
# narrow (short messages only) so a real question never gets
# misclassified as a greeting.
_GREETING_ONLY_PHRASES = {
    "hi", "hii", "hiii", "hello", "hey", "hola", "yo",
    "good morning", "good afternoon", "good evening",
    "namaste", "namaskar"
}


class IntentDetector:
    """
    ==========================================================
    MRStay AI
    Intent Detection Agent

    Classifies an incoming customer message into one of the
    fixed INTENT_CATEGORIES so the Agent Orchestrator can route
    it to the correct downstream agent.

    Performance: pure greetings are classified instantly via a
    rule-based check, with NO Gemini call — this removes an
    unnecessary LLM round-trip from the fastest, most common
    conversation path. Every other message still goes through
    the full LLM classifier for accuracy.
    ==========================================================
    """

    def __init__(self, llm_client: Optional[GeminiClient] = None):

        self.llm = llm_client or GeminiClient()

        self.stats = {
            "total_requests": 0,
            "rule_based_hits": 0,
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
        """
        True only when the message is JUST a greeting — short,
        with no other content. "hi" -> True. "hi, price kya hai?"
        -> False (still goes to the LLM below).
        """

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

    def detect(self, message: str) -> Dict[str, Any]:
        """
        Returns:
            {
                "intent": "property_query",
                "confidence": "high",
                "method": "rule_based" | "llm" |
                           "fallback_keyword" | "fallback_default"
            }
        """

        self.stats["total_requests"] += 1

        if not message or not message.strip():
            return {
                "intent": DEFAULT_INTENT,
                "confidence": "low",
                "method": "empty_input"
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