import logging
from typing import Any, Dict, Optional

from src.ai.agents.base_agent import BaseAgent

logger = logging.getLogger(__name__)


class SalesManagerAgent(BaseAgent):
    """
    ==========================================================
    MRStay AI
    Sales Manager Agent (STUB)

    Handles human_handoff intent — negotiation, legal questions,
    complaints, or explicit requests to talk to a human. Full
    escalation logic (CRM ticket creation, live agent routing)
    is planned for a later phase. For now, this agent
    acknowledges the request and sets expectations clearly.
    ==========================================================
    """

    agent_name = "sales_manager_agent"

    def handle(
        self,
        message: str,
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:

        return {
            "response": (
                "I understand — let me connect you with our sales "
                "team for this. Someone from MRStay AI will reach "
                "out to you shortly to assist further."
            ),
            "sources": [],
            "metadata": {"stub": True, "reason": "human_handoff_pending_phase_2"}
        }