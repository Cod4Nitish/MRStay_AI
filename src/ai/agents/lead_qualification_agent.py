import logging
from typing import Any, Dict, Optional

from src.ai.agents.base_agent import BaseAgent
from src.ai.llm.gemini_client import GeminiClient
from src.ai.memory.session_store import session_store

logger = logging.getLogger(__name__)


class LeadQualificationAgent(BaseAgent):
    """
    ==========================================================
    MRStay AI
    Lead Qualification Agent

    Collects: name, phone, budget, property/requirement — one
    field at a time, across multiple turns, using session-based
    state. Never re-asks a field it already has.

    Flow per message:
        session_id -> load existing state
                   -> extract any new fields from this message
                   -> merge into state
                   -> find next missing field
                   -> ask ONLY that field (or confirm completion)
    ==========================================================
    """

    agent_name = "lead_qualification_agent"

    REQUIRED_FIELDS = ["name", "phone", "budget", "requirement"]

    FIELD_QUESTIONS = {
        "name": "May I know your name?",
        "phone": "Could I get your phone number so our team can reach you for the site visit?",
        "budget": "What budget range are you considering?",
        "requirement": "Which property or configuration (e.g. 2BHK/3BHK) are you interested in?",
    }

    def __init__(self, llm_client: Optional[GeminiClient] = None):
        super().__init__()
        self.llm = llm_client or GeminiClient()

    # ======================================================
    # Extraction
    # ======================================================

    def _extract_fields(
        self,
        message: str,
        already_have: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Asks the LLM to pull out any of the required fields present
        in this message. Fields already collected are listed so the
        model focuses on what's still missing, but it may still
        return a correction if the user updates a previous answer.
        """

        missing = [f for f in self.REQUIRED_FIELDS if f not in already_have]

        prompt = (
            "Extract any of the following lead details mentioned in "
            "the customer's message. Only include a field if it is "
            "explicitly present in the message — do not guess or "
            "invent values.\n\n"
            f"Fields to look for: {', '.join(self.REQUIRED_FIELDS)}\n"
            f"Already collected: {already_have}\n"
            f"Still missing: {missing}\n\n"
            f'Customer message: "{message}"\n\n'
            "Return JSON with only the fields you found in this "
            "message, e.g. "
            '{"name": "Shivani"} or {"budget": "90 lakh"}. '
            "If nothing new is found, return {}."
        )

        try:
            extracted = self.llm.generate_json(prompt=prompt, temperature=0.0)
            return extracted if isinstance(extracted, dict) else {}

        except Exception as e:
            logger.warning(f"Lead field extraction failed: {e}")
            return {}

    # ======================================================
    # Handle
    # ======================================================

    def handle(
        self,
        message: str,
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:

        session_id = (context or {}).get("session_id", "anonymous")

        existing = session_store.get(session_id)

        new_fields = self._extract_fields(message, existing)

        updated_state = session_store.update(session_id, new_fields)

        missing_fields = [
            f for f in self.REQUIRED_FIELDS
            if not updated_state.get(f)
        ]

        if missing_fields:
            next_field = missing_fields[0]
            question = self.FIELD_QUESTIONS[next_field]

            # Small warm acknowledgement if we just captured something.
            if new_fields:
                response_text = f"Thanks! {question}"
            else:
                response_text = question

            return {
                "response": response_text,
                "sources": [],
                "metadata": {
                    "lead_status": "in_progress",
                    "collected": updated_state,
                    "missing": missing_fields
                }
            }

        # All fields collected.
        response_text = (
            f"Thank you {updated_state.get('name', '')}! We have your "
            f"details — budget {updated_state.get('budget')}, interested "
            f"in {updated_state.get('requirement')}. Our sales team will "
            f"contact you shortly on {updated_state.get('phone')} to "
            f"schedule your site visit."
        )

        return {
            "response": response_text,
            "sources": [],
            "metadata": {
                "lead_status": "complete",
                "collected": updated_state
            }
        }