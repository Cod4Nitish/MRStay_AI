import logging
import time
import uuid
from abc import ABC, abstractmethod
from typing import Any, Dict, Optional

logger = logging.getLogger(__name__)


class BaseAgent(ABC):
    """
    ==========================================================
    MRStay AI
    Base Agent Interface

    Every specialized agent (Reception, Property, Lead, etc.)
    inherits from this. Keeps a consistent contract so the
    Orchestrator never needs to know agent-specific internals.
    ==========================================================
    """

    agent_name: str = "base_agent"

    def __init__(self):
        self.stats = {
            "total_calls": 0,
            "total_failures": 0
        }

    @abstractmethod
    def handle(
        self,
        message: str,
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Every agent must implement this.
        Must return:
            {
                "response": str,
                "sources": list (optional),
                "metadata": dict (optional)
            }
        """
        raise NotImplementedError

    def safe_handle(
        self,
        message: str,
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Wraps handle() with timing, error handling and stats —
        this is what the Orchestrator actually calls.
        """

        self.stats["total_calls"] += 1
        start = time.time()

        try:
            result = self.handle(message, context)

            return {
                "success": True,
                "response": result.get("response", ""),
                "sources": result.get("sources", []),
                "metadata": result.get("metadata", {}),
                "agent_used": self.agent_name,
                "latency_ms": round((time.time() - start) * 1000)
            }

        except Exception as e:

            self.stats["total_failures"] += 1
            logger.exception(f"[{self.agent_name}] handle() failed: {e}")

            return {
                "success": False,
                "response": (
                    "Sorry, something went wrong while processing "
                    "your request. Please try again."
                ),
                "sources": [],
                "metadata": {"error": str(e)},
                "agent_used": self.agent_name,
                "latency_ms": round((time.time() - start) * 1000)
            }


def new_session_id() -> str:
    return str(uuid.uuid4())[:8]