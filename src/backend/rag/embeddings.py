import hashlib
import logging
import os
import time
from typing import Any, Dict, List

from google import genai
from sentence_transformers import SentenceTransformer

logger = logging.getLogger(__name__)


class Embeddings:
    """
    ==========================================================
    MRStay AI
    Enterprise Embeddings Generator (Gemini + Local Fallback)
    ==========================================================
    """

    def __init__(
        self,
        api_key: str = None,
        max_retries: int = 3,
        retry_delay: float = 1.5,
        use_cache: bool = True
    ):

        self.api_key = api_key or os.getenv("GEMINI_API_KEY")

        self.max_retries = max_retries
        self.retry_delay = retry_delay

        self.use_cache = use_cache
        self._cache: Dict[str, List[float]] = {}

        self.stats = {
            "total_requests": 0,
            "total_texts_embedded": 0,
            "cache_hits": 0,
            "retries": 0,
            "failures": 0
        }

        self.use_gemini = (
            self.api_key is not None
            and self.api_key != ""
            and self.api_key != "your_gemini_api_key_here"
        )

        if self.use_gemini:

            logger.info("=" * 60)
            logger.info("Using Gemini Embeddings")
            logger.info("=" * 60)

            self.client = genai.Client(
                api_key=self.api_key
            )

            # Latest supported embedding model
            self.model_name = "gemini-embedding-001"

        else:

            logger.info("=" * 60)
            logger.info("Using Local SentenceTransformer")
            logger.info("=" * 60)

            self.local_model = SentenceTransformer(
                "all-MiniLM-L6-v2"
            )

            self.model_name = "all-MiniLM-L6-v2"

    # ======================================================
    # Internal Helpers
    # ======================================================

    def _cache_key(self, text: str) -> str:

        return hashlib.sha256(text.encode("utf-8")).hexdigest()

    def _gemini_embed_batch(
        self,
        texts: List[str]
    ) -> List[List[float]]:

        for attempt in range(1, self.max_retries + 1):

            try:

                response = self.client.models.embed_content(
                    model=self.model_name,
                    contents=texts,
                )

                return [
                    embedding.values
                    for embedding in response.embeddings
                ]

            except Exception as e:

                self.stats["retries"] += 1

                logger.warning(
                    f"Gemini embedding attempt {attempt}/{self.max_retries} "
                    f"failed: {e}"
                )

                if attempt == self.max_retries:
                    self.stats["failures"] += 1
                    logger.exception(e)
                    raise

                time.sleep(self.retry_delay * attempt)

    # ======================================================
    # Embed Multiple Texts
    # ======================================================

    def embed_texts(
        self,
        texts: List[str]
    ) -> List[List[float]]:

        if not texts:
            return []

        start_time = time.time()

        self.stats["total_requests"] += 1

        results: List[List[float]] = [None] * len(texts)
        pending_indices = []
        pending_texts = []

        if self.use_cache:

            for i, text in enumerate(texts):

                key = self._cache_key(text)

                if key in self._cache:
                    results[i] = self._cache[key]
                    self.stats["cache_hits"] += 1
                else:
                    pending_indices.append(i)
                    pending_texts.append(text)

        else:
            pending_indices = list(range(len(texts)))
            pending_texts = texts

        if pending_texts:

            try:

                if self.use_gemini:
                    vectors = self._gemini_embed_batch(pending_texts)

                else:
                    vectors = self.local_model.encode(
                        pending_texts
                    ).tolist()

            except Exception as e:

                self.stats["failures"] += 1
                logger.exception(e)
                raise

            for idx, text, vector in zip(
                pending_indices, pending_texts, vectors
            ):

                results[idx] = vector

                if self.use_cache:
                    self._cache[self._cache_key(text)] = vector

        self.stats["total_texts_embedded"] += len(texts)

        elapsed = time.time() - start_time

        logger.info(
            f"Embedded {len(texts)} texts "
            f"({len(pending_texts)} new, "
            f"{len(texts) - len(pending_texts)} cached) "
            f"in {elapsed:.3f}s"
        )

        return results

    # ======================================================
    # Embed Single Query
    # ======================================================

    def embed_query(
        self,
        query: str
    ) -> List[float]:

        return self.embed_texts([query])[0]

    # ======================================================
    # Health Check
    # ======================================================

    def health(self) -> Dict[str, Any]:

        try:

            test_vector = self.embed_query("health check")

            return {
                "success": True,
                "model": self.model_name,
                "provider": "gemini" if self.use_gemini else "local",
                "dimension": len(test_vector)
            }

        except Exception as e:

            logger.exception(e)

            return {
                "success": False,
                "error": str(e)
            }

    # ======================================================
    # Model Info
    # ======================================================

    def model_info(self) -> Dict[str, Any]:

        return {
            "provider": "gemini" if self.use_gemini else "local",
            "model_name": self.model_name,
            "cache_enabled": self.use_cache,
            "max_retries": self.max_retries
        }

    # ======================================================
    # Enterprise Statistics
    # ======================================================

    def statistics(self) -> Dict[str, Any]:

        return {
            **self.stats,
            "cache_size": len(self._cache),
            "model": self.model_name,
            "provider": "gemini" if self.use_gemini else "local"
        }

    # ======================================================
    # Clear Cache
    # ======================================================

    def clear_cache(self):

        count = len(self._cache)

        self._cache.clear()

        logger.info(f"Cleared {count} cached embeddings.")