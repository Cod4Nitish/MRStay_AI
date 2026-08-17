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

        properties_dir = os.path.join(DOCUMENTS_PATH, "properties")

        if not os.path.isdir(properties_dir):
            return []

        return [
            name for name in os.listdir(properties_dir)
            if os.path.isdir(os.path.join(properties_dir, name))
        ]

    def _detect_property(self, message: str) -> Optional[str]:
        """
        Picks the property whose name has the highest word-overlap
        ratio with the message, as long as at least half its
        significant words are present. This avoids false positives
        from a single generic shared word (e.g. "city") while still
        matching partial mentions like "7th Avenue" for
        "7th_avenue_gaur_city".
        """

        lowered = message.lower()
        best_match = None
        best_ratio = 0.0

        for property_name in self.known_properties:

            readable = property_name.replace("_", " ").lower()
            words = [w for w in readable.split() if len(w) > 2]

            if not words:
                continue

            matched = sum(1 for w in words if w in lowered)
            ratio = matched / len(words)

            if ratio >= 0.5 and ratio > best_ratio:
                best_ratio = ratio
                best_match = property_name

        logger.info(
            f"Property detection for '{message[:50]}' -> "
            f"{best_match} (ratio: {best_ratio})"
        )

        return best_match

    def handle(
        self,
        message: str,
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:

        context = context or {}
        property_filter = self._detect_property(message)

        # agar current message mein property-name nahi mila,
        # last mentioned property (session context se) use karo
        if not property_filter:
            property_filter = context.get("last_property")
            if property_filter:
                logger.info(
                    f"No property in message — falling back to "
                    f"last mentioned: {property_filter}"
                )

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