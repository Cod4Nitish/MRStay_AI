import logging
import time

from typing import List, Dict, Any

from .embeddings import Embeddings
from .vector_store import VectorStore

logger = logging.getLogger(__name__)


class Retriever:
    """
    ==========================================================
    MRStay AI
    Enterprise Retriever
    Coordinates between embeddings and vector store to fetch
    relevant context.
    ==========================================================
    """

    def __init__(
        self,
        embeddings: Embeddings,
        vector_store: VectorStore
    ):

        self.embeddings = embeddings
        self.vector_store = vector_store

        self.stats = {
            "queries": 0,
            "documents_retrieved": 0,
            "failed_queries": 0
        }

        logger.info(
            "Retriever Initialized Successfully"
        )

    # ======================================================
    # Retrieve
    # ======================================================

    def retrieve(
        self,
        query: str,
        top_k: int = 5,
        min_score: float = None
    ) -> List[Dict[str, Any]]:
        """
        Takes a raw text query and returns relevant document chunks.
        """

        if not query or not query.strip():
            logger.warning("Empty query received. Skipping retrieval.")
            return []

        start_time = time.time()

        self.stats["queries"] += 1

        try:

            query_vector = self.embeddings.embed_query(query)

            results = self.vector_store.similarity_search(
                query_vector,
                n_results=top_k
            )

            if min_score is not None:

                results = [
                    res for res in results
                    if res.get("distance", 1.0) <= min_score
                ]

            self.stats["documents_retrieved"] += len(results)

            elapsed = time.time() - start_time

            logger.info(
                f"Retrieved {len(results)} documents for query "
                f"'{query[:50]}' in {elapsed:.3f}s"
            )

            return results

        except Exception as e:

            self.stats["failed_queries"] += 1

            logger.exception(e)

            raise

    # ======================================================
    # Format Context
    # ======================================================

    def format_context(self, results: List[Dict[str, Any]]) -> str:
        """
        Formats retrieved results into a single context string for LLM prompting.
        """

        context_parts = []

        for i, res in enumerate(results):

            content = res.get('content', '')

            if not content or not content.strip():
                logger.warning(
                    f"Skipping document {i+1}: missing/empty content."
                )
                continue

            metadata = res.get('metadata', {})

            if not isinstance(metadata, dict):
                logger.warning(
                    f"Invalid metadata for document {i+1}. Using empty metadata."
                )
                metadata = {}

            source = metadata.get('filename', 'Unknown')

            context_parts.append(
                f"--- Document {i+1} (Source: {source}) ---\n{content}\n"
            )

        logger.info(
            f"Formatted context from {len(context_parts)}/{len(results)} documents."
        )

        return "\n".join(context_parts)

    # ======================================================
    # Health Check
    # ======================================================

    def health(self) -> Dict[str, Any]:

        try:

            results = self.retrieve("health check", top_k=1)

            return {
                "success": True,
                "vector_store_health": self.vector_store.health(),
                "sample_retrieval_count": len(results)
            }

        except Exception as e:

            logger.exception(e)

            return {
                "success": False,
                "error": str(e)
            }

    # ======================================================
    # Enterprise Statistics
    # ======================================================

    def statistics(self) -> Dict[str, Any]:

        return {
            **self.stats
        }

    # ======================================================
    # Reset Statistics
    # ======================================================

    def reset_statistics(self):

        self.stats = {
            "queries": 0,
            "documents_retrieved": 0,
            "failed_queries": 0
        }

        logger.info("Retriever statistics reset.")