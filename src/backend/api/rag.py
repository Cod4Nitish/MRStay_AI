from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import logging
from datetime import datetime

from src.backend.models.responses import BaseResponse, RAGQueryResponse, RAGStatsResponse
from src.backend.rag.query import RAGQueryEngine
from src.backend.rag.ingest import ingest_documents
from src.backend.rag.vector_store import VectorStore
from src.backend.config.settings import CHROMA_DB_PATH, DOCUMENTS_PATH

router = APIRouter(prefix="/api/rag", tags=["RAG"])
logger = logging.getLogger(__name__)

# Request models
class QueryRequest(BaseModel):
    question: str

@router.post("/query", response_model=BaseResponse)
async def query_rag(request: QueryRequest):
    try:
        engine = RAGQueryEngine()
        result = engine.query(request.question)
        
        # Result is a dict with 'answer' and 'sources'
        return BaseResponse(
            success=True,
            message="Query completed successfully",
            data=RAGQueryResponse(
                answer=result["answer"],
                sources=result["sources"]
            )
        )
    except Exception as e:
        logger.error(f"Error in RAG query: {e}")
        return BaseResponse(
            success=False,
            message=str(e),
            data=None
        )

@router.post("/ingest", response_model=BaseResponse)
async def run_ingestion():
    try:
        stats = ingest_documents()
        return BaseResponse(
            success=True,
            message="Ingestion completed successfully",
            data=stats
        )
    except Exception as e:
        logger.error(f"Error during ingestion: {e}")
        return BaseResponse(
            success=False,
            message=str(e),
            data=None
        )

@router.get("/stats", response_model=BaseResponse)
async def get_stats():
    try:
        # Approximate metrics
        import os
        
        # Count documents
        doc_count = 0
        if os.path.exists(DOCUMENTS_PATH):
            for root, _, files in os.walk(DOCUMENTS_PATH):
                for file in files:
                    if file.endswith(('.txt', '.md')):
                        doc_count += 1
                        
        # Get ChromaDB counts
        vector_store = VectorStore(db_path=CHROMA_DB_PATH)
        collection_count = vector_store.collection.count()
        
        return BaseResponse(
            success=True,
            message="Stats retrieved successfully",
            data=RAGStatsResponse(
                documents=doc_count,
                chunks=collection_count,
                vectors=collection_count,
                last_sync=datetime.now().isoformat()
            )
        )
    except Exception as e:
        logger.error(f"Error fetching RAG stats: {e}")
        return BaseResponse(
            success=False,
            message=str(e),
            data=None
        )
