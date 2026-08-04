import logging
import time
from datetime import datetime
from typing import Dict, Any

from .embeddings import Embeddings
from .vector_store import VectorStore
from .retriever import Retriever
from .prompt_builder import PromptBuilder
from .llm import LLM
from src.backend.config.settings import CHROMA_DB_PATH

logger = logging.getLogger(__name__)


class RAGQueryEngine:
    """
    ==========================================================
    MRStay AI
    Enterprise RAG Query Engine
    Orchestrates the answering pipeline.
    ==========================================================
    """

    def __init__(self):

        self.embeddings = Embeddings()
        self.vector_store = VectorStore(db_path=CHROMA_DB_PATH)
        self.retriever = Retriever(embeddings=self.embeddings, vector_store=self.vector_store)
        self.prompt_builder = PromptBuilder()
        self.llm = LLM()

        self.stats = {
            "queries": 0,
            "success": 0,
            "failed": 0,
            "avg_response_time": 0
        }

        logger.info(
            "Enterprise Query Engine Initialized"
        )

    def query(self, user_question: str) -> Dict[str, Any]:
        """
        Executes the full RAG pipeline for a given question.
        Returns a dictionary with 'answer' and 'sources'.
        """

        if not user_question or not user_question.strip():
            raise ValueError(
                "Question cannot be empty."
            )

        start = time.time()

        self.stats["queries"] += 1

        logger.info("=" * 60)
        logger.info(f"Question : {user_question}")
        logger.info("=" * 60)

        try:
            # 1 & 2: Retrieve relevant documents
            raw_results = self.retriever.retrieve(user_question, top_k=3)

            sources = []
            for res in raw_results:
                # distance is typically smaller for more similar items in cosine/L2
                # We can mock a 'score' as 1.0 - distance or similar depending on metric.
                # Assuming cosine distance where 0 is identical and 1 is orthogonal.
                dist = res.get('distance', 1.0)
                score = max(0.0, 1.0 - dist)

                sources.append({
                    "id": res.get("id"),
                    "document": res.get('metadata', {}).get('filename', 'Unknown'),
                    "section": res.get('metadata', {}).get('source', 'Unknown'),
                    "score": round(score, 2),
                    "distance": round(dist, 4)
                })

            # Format the retrieved chunks into a single context string
            context = self.retriever.format_context(raw_results)

            if not context.strip():

                logger.warning(
                    "No context found."
                )

                self.stats["success"] += 1

                elapsed = time.time() - start
                self._update_avg_response_time(elapsed)

                return {

                    "answer":
                        "No relevant documents found.",

                    "sources": []
                }

            # 3: Build Prompt
            prompt = self.prompt_builder.build(query=user_question, context=context)

            # 4: Generate LLM Response
            answer = self.llm.generate(prompt)

            self.stats["success"] += 1

            elapsed = time.time() - start
            self._update_avg_response_time(elapsed)

            logger.info(f"Completed in {elapsed:.3f}s")
            logger.info("Successfully generated response")

            return {
                "answer": answer,
                "sources": sources
            }

        except Exception as e:

            self.stats["failed"] += 1

            elapsed = time.time() - start
            self._update_avg_response_time(elapsed)

            logger.error(f"Error executing query: {str(e)}")
            raise e

    # ======================================================
    # Internal Helper
    # ======================================================

    def _update_avg_response_time(self, elapsed: float):

        total_done = self.stats["success"] + self.stats["failed"]

        if total_done <= 1:
            self.stats["avg_response_time"] = round(elapsed, 3)
        else:
            prev_avg = self.stats["avg_response_time"]
            new_avg = prev_avg + (elapsed - prev_avg) / total_done
            self.stats["avg_response_time"] = round(new_avg, 3)

    # ======================================================
    # Health Check
    # ======================================================

    def health(self) -> Dict[str, Any]:

        llm_health = "unknown"

        try:
            if hasattr(self.llm, "health"):
                llm_health = self.llm.health()
            else:
                llm_health = {"success": True, "note": "No health() method on LLM."}

        except Exception as e:
            logger.exception(e)
            llm_health = {"success": False, "error": str(e)}

        return {
            "embeddings": self.embeddings.health(),
            "vector_store": self.vector_store.health(),
            "retriever": self.retriever.health(),
            "llm": llm_health
        }

    # ======================================================
    # Enterprise Statistics
    # ======================================================

    def statistics(self) -> Dict[str, Any]:

        return {

            **self.stats,

            "documents":
                self.vector_store.count(),

            "embedding":
                self.embeddings.model_info(),

            "retriever":
                self.retriever.statistics()

        }

    # ======================================================
    # Reset Statistics
    # ======================================================

    def reset_statistics(self):

        self.stats = {
            "queries": 0,
            "success": 0,
            "failed": 0,
            "avg_response_time": 0
        }

        logger.info("Query engine statistics reset.")


if __name__ == "__main__":
    import sys
    logging.basicConfig(level=logging.INFO)
    engine = RAGQueryEngine()
    question = sys.argv[1] if len(sys.argv) > 1 else "What is MRStay?"

    print(f"\nQuestion: {question}")
    print("-" * 40)

    start_time = time.time()
    result = engine.query(question)
    total_time = time.time() - start_time

    print("Answer:", result['answer'])
    print("Sources:", result['sources'])
    print(f"\nExecution Time: {total_time:.3f}s")

    print("\nHealth:")
    print(engine.health())

    print("\nStatistics:")
    print(engine.statistics())