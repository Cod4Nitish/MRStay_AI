import logging
import os
from typing import Any, Dict, Optional

from src.ai.agents.base_agent import BaseAgent
from src.backend.rag.query import RAGQueryEngine
from src.backend.config.settings import DOCUMENTS_PATH

logger = logging.getLogger(__name__)


class PropertyAgent(BaseAgent):
    """
    Wraps the existing RAG pipeline so it conforms to the
    standard agent interface.

    Also detects which specific property (if any) the customer's
    message refers to, and restricts retrieval to that property's
    documents only — this prevents content from unrelated
    properties (e.g. Gaur Aero Heights) from leaking into an
    answer about a different property (e.g. 7th Avenue).
    """

    agent_name = "property_agent"

    def __init__(self):
        super().__init__()
        self.engine = RAGQueryEngine()
        self.known_properties = self._discover_properties()

        logger.info(
            f"PropertyAgent knows {len(self.known_properties)} "
            f"properties: {self.known_properties}"
        )

    def _discover_properties(self) -> list:
        """
        Scans documents/properties/ once at startup and returns
        the list of property folder names (e.g.
        ["7th_avenue_gaur_city", "gaur_aero_heights"]).
        """

        properties_dir = os.path.join(DOCUMENTS_PATH, "properties")

        if not os.path.isdir(properties_dir):
            return []

        return [
            name for name in os.listdir(properties_dir)
            if os.path.isdir(os.path.join(properties_dir, name))
        ]

    def _detect_property(self, message: str) -> Optional[str]:
        """
        Simple, dependency-free match: normalizes the folder name
        (underscores -> spaces) and checks if enough of its words
        appear in the message. Good enough for exact-name mentions
        like "7th Avenue" or "Gaur Aero Heights".
        """

        lowered = message.lower()

        for property_name in self.known_properties:

            readable = property_name.replace("_", " ").lower()
            words = [w for w in readable.split() if len(w) > 2]

            if not words:
                continue

            matched = sum(1 for w in words if w in lowered)

            # Require most of the significant words to match, so a
            # single generic word ("city", "heights") alone doesn't
            # falsely trigger a match.
            if matched >= max(1, len(words) - 1):
                return property_name

        return None

    def handle(
        self,
        message: str,
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:

        property_filter = self._detect_property(message)

        if property_filter:
            logger.info(
                f"Restricting retrieval to property: {property_filter}"
            )

        result = self.engine.query(
            message,
            property_filter=property_filter
        )

        return {
            "response": result.get("answer", ""),
            "sources": result.get("sources", []),
            "metadata": {"property_filter": property_filter}
        }