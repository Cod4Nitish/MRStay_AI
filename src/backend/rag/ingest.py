import os
import logging
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
    logger.info(f"Starting ingestion pipeline from {DOCUMENTS_PATH}...")
    
    # 1. Load
    loader = DocumentLoader(directory_path=DOCUMENTS_PATH)
    docs = loader.load_documents()
    logger.info(f"Loaded {len(docs)} documents.")
    if not docs:
        logger.warning("No documents found. Skipping ingestion.")
        return {"documents": 0, "chunks": 0, "vectors": 0, "message": "No documents found"}

    # 2. Chunk
    chunker = TextChunker(chunk_size=1000, chunk_overlap=200)
    chunks = chunker.chunk_documents(docs)
    logger.info(f"Created {len(chunks)} chunks.")

    # 3. Embed
    embeddings_model = Embeddings()
    texts_to_embed = [chunk['content'] for chunk in chunks]
    logger.info("Generating embeddings...")
    vectors = embeddings_model.embed_texts(texts_to_embed)

    # 4. Store
    logger.info(f"Storing into VectorDB at {CHROMA_DB_PATH}...")
    vector_store = VectorStore(db_path=CHROMA_DB_PATH)
    vector_store.add_documents(chunks=chunks, embeddings=vectors)
    
    logger.info("Ingestion pipeline completed successfully.")
    
    return {
        "documents": len(docs),
        "chunks": len(chunks),
        "vectors": len(vectors),
        "message": "Ingestion successful"
    }

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    ingest_documents()
