import logging
import time
from typing import Any, Dict, Optional

from src.ai.agents.intent_detection import IntentDetector
from src.ai.agents.reception_agent import ReceptionAgent
from src.ai.agents.property_agent import PropertyAgent
from src.ai.agents.base_agent import new_session_id, BaseAgent

logger = logging.getLogger(__name__)


class AgentOrchestrator:
    """
    ==========================================================
    MRStay AI
    Agent Orchestrator (the "brain")

    Flow:
        message -> intent detection -> route to registered
        agent -> structured response

    Design principles:
        - Adding a new agent later = one new class + one
          registry entry. This file's core logic never changes.
        - If any single agent fails to initialize (e.g. an
          external API is down), the whole system does NOT
          crash — that agent is simply unavailable and routes
          fall back to reception_agent.
        - Every response has a consistent, frontend-friendly
          shape regardless of which agent handled it.
    ==========================================================
    """

    # intent -> registry key. Agents not yet built (lead_agent,
    # sales_manager_agent, etc.) intentionally point to
    # reception_agent for now — swap the value here later,
    # nothing else needs to change.
    INTENT_TO_AGENT = {
        "property_query": "property_agent",
        "greeting": "reception_agent",
        "general_faq": "reception_agent",
        "lead_capture": "reception_agent",     # TODO: lead_qualification_agent
        "human_handoff": "reception_agent",    # TODO: sales_manager_agent
    }

    FALLBACK_AGENT_KEY = "reception_agent"

    def __init__(self):

        self.intent_detector = IntentDetector()
        self.agents: Dict[str, BaseAgent] = {}

        self.stats = {
            "total_requests": 0,
            "total_failures": 0,
            "agent_init_failures": []
        }

        self._register_agents()

        logger.info("=" * 60)
        logger.info("Agent Orchestrator initialized")
        logger.info(f"Registered agents: {list(self.agents.keys())}")
        if self.stats["agent_init_failures"]:
            logger.warning(
                f"Agents that failed to initialize: "
                f"{self.stats['agent_init_failures']}"
            )
        logger.info("=" * 60)

    # ======================================================
    # Agent Registration
    # ======================================================

    def _register_agents(self):
        """
        Each agent is initialized independently. If one fails
        (e.g. RAG engine can't reach ChromaDB, or an API key is
        missing), we log it and continue — the rest of the
        system stays usable.
        """

        agent_classes = {
            "reception_agent": ReceptionAgent,
            "property_agent": PropertyAgent,
        }

        for key, agent_class in agent_classes.items():

            try:
                self.agents[key] = agent_class()
                logger.info(f"Agent '{key}' initialized successfully.")

            except Exception as e:
                logger.exception(
                    f"Failed to initialize agent '{key}': {e}"
                )
                self.stats["agent_init_failures"].append(key)

        if self.FALLBACK_AGENT_KEY not in self.agents:
            raise RuntimeError(
                f"Critical: fallback agent "
                f"'{self.FALLBACK_AGENT_KEY}' failed to initialize. "
                "Orchestrator cannot start safely."
            )

    # ======================================================
    # Routing
    # ======================================================

    def route(
        self,
        message: str,
        session_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Main entrypoint. Detects intent, picks the right agent,
        executes it safely, and returns a structured response.
        """

        self.stats["total_requests"] += 1
        start = time.time()

        session_id = session_id or new_session_id()

        if not message or not message.strip():
            return self._build_response(
                success=False,
                response_text="Please type a message.",
                intent=None,
                confidence=None,
                agent_used=None,
                session_id=session_id,
                start_time=start,
                sources=[]
            )

        # 1. Detect intent (already has its own internal fallback)
        intent_result = self.intent_detector.detect(message)
        intent = intent_result["intent"]
        confidence = intent_result["confidence"]

        # 2. Resolve agent — fall back if mapped agent isn't registered
        agent_key = self.INTENT_TO_AGENT.get(intent, self.FALLBACK_AGENT_KEY)

        if agent_key not in self.agents:
            logger.warning(
                f"Agent '{agent_key}' not available "
                f"(init failed or not registered) — "
                f"falling back to '{self.FALLBACK_AGENT_KEY}'."
            )
            agent_key = self.FALLBACK_AGENT_KEY

        agent = self.agents[agent_key]

        # 3. Execute safely (agent.safe_handle never raises)
        result = agent.safe_handle(
            message,
            context={"session_id": session_id}
        )

        if not result["success"]:
            self.stats["total_failures"] += 1

        return self._build_response(
            success=result["success"],
            response_text=result["response"],
            intent=intent,
            confidence=confidence,
            agent_used=agent_key,
            session_id=session_id,
            start_time=start,
            sources=result.get("sources", [])
        )

    # ======================================================
    # Response Builder
    # ======================================================

    def _build_response(
        self,
        success: bool,
        response_text: str,
        intent: Optional[str],
        confidence: Optional[str],
        agent_used: Optional[str],
        session_id: str,
        start_time: float,
        sources: list
    ) -> Dict[str, Any]:

        return {
            "success": success,
            "response": response_text,
            "intent": intent,
            "confidence": confidence,
            "agent_used": agent_used,
            "session_id": session_id,
            "latency_ms": round((time.time() - start_time) * 1000),
            "sources": sources
        }

    # ======================================================
    # Health Check
    # ======================================================

    def health(self) -> Dict[str, Any]:

        return {
            "success": self.FALLBACK_AGENT_KEY in self.agents,
            "registered_agents": list(self.agents.keys()),
            "failed_agents": self.stats["agent_init_failures"],
            "intent_map": self.INTENT_TO_AGENT
        }

    # ======================================================
    # Statistics
    # ======================================================

    def statistics(self) -> Dict[str, Any]:

        return {
            **self.stats,
            "agents": list(self.agents.keys())
        }