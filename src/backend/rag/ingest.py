import os
import logging
import time
from typing import Dict, Any

from .loader import DocumentLoader
from .chunker import TextChunker
from .embeddings import Embeddings
from .vector_store import VectorStore
from src.backend.config.settings import CHROMA_DB_PATH, DOCUMENTS_PATH

logger = logging.getLogger(__name__)


def ingest_documents() -> Dict[str, Any]:
    """
    Orchestrates the ingestion pipeline.
    Returns statistics about the ingestion.
    """

    stats = {
        "documents": 0,
        "chunks": 0,
        "vectors": 0,
        "duration": 0,
        "status": "success"
    }

    start = time.time()

    try:

        logger.info("=" * 60)
        logger.info("STEP 1 : Loading Documents")
        logger.info("=" * 60)

        loader = DocumentLoader(directory_path=DOCUMENTS_PATH)
        docs = loader.load_documents()
        
        logger.info(f"Loaded {len(docs)} documents.")

        if not docs:
            logger.warning("No documents found. Skipping ingestion.")

            stats["status"] = "failed"
            stats["duration"] = round(time.time() - start, 3)

            return {
                **stats,
                "message": "No documents found"
            }

        logger.info("=" * 60)
        logger.info("STEP 2 : Chunking")
        logger.info("=" * 60)

        chunker = TextChunker(chunk_size=1000, chunk_overlap=200)
        chunks = chunker.chunk_documents(docs)
        logger.info(f"Created {len(chunks)} chunks.")

        if not chunks:
            logger.warning("No chunks generated. Skipping ingestion.")

            stats["status"] = "failed"
            stats["documents"] = len(docs)
            stats["duration"] = round(time.time() - start, 3)

            return {
                **stats,
                "message": "No chunks generated."
            }

        logger.info("=" * 60)
        logger.info("STEP 3 : Embeddings")
        logger.info("=" * 60)

        embeddings_model = Embeddings()
        texts_to_embed = [chunk['content'] for chunk in chunks]
        logger.info("Generating embeddings...")
        vectors = embeddings_model.embed_texts(texts_to_embed)

        if len(vectors) != len(chunks):
            raise ValueError(
                "Embedding count mismatch."
            )

        logger.info("=" * 60)
        logger.info("STEP 4 : Vector Store")
        logger.info("=" * 60)

        logger.info(f"Storing into VectorDB at {CHROMA_DB_PATH}...")
        vector_store = VectorStore(db_path=CHROMA_DB_PATH)
        vector_store.add_documents(chunks=chunks, embeddings=vectors)

        logger.info("Ingestion pipeline completed successfully.")

        elapsed = round(time.time() - start, 3)

        return {
            "documents": len(docs),
            "chunks": len(chunks),
            "vectors": len(vectors),
            "duration": elapsed,
            "status": "success",
            "message": "Ingestion successful"
        }

    except Exception as e:

        logger.exception(e)

        elapsed = round(time.time() - start, 3)

        return {
            "status": "failed",
            "duration": elapsed,
            "error": str(e)
        }


# ==============================================================
# Health Check
# ==============================================================

def health() -> Dict[str, Any]:

    return {
        "documents_path": DOCUMENTS_PATH,
        "vector_db": CHROMA_DB_PATH,
        "status": "healthy"
    }


# ==============================================================
# Statistics
# ==============================================================

def statistics() -> Dict[str, Any]:

    return {
        "documents_path": DOCUMENTS_PATH,
        "vector_db": CHROMA_DB_PATH
    }


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    result = ingest_documents()
    print(result)