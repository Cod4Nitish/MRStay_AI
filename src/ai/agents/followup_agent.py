import logging
from typing import Any, Dict, Optional

from src.ai.agents.base_agent import BaseAgent

logger = logging.getLogger(__name__)


class FollowUpAgent(BaseAgent):
    """
    ==========================================================
    MRStay AI
    Follow-up Agent (STUB)

    Full implementation (scheduled follow-up messages, reminder
    sequences, re-engagement logic) is planned for Phase 2 —
    once CRM and persistent memory are in place. For now this
    agent acknowledges the request and confirms it's noted, so
    the orchestrator's routing table stays complete.
    ==========================================================
    """

    agent_name = "followup_agent"

    def handle(
        self,
        message: str,
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:

        return {
            "response": (
                "Noted! Our team will follow up with you shortly. "
                "Is there anything else I can help with in the "
                "meantime?"
            ),
            "sources": [],
            "metadata": {"stub": True, "reason": "follow_up_pending_phase_2"}
        }