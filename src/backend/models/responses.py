from pydantic import BaseModel
from typing import Any, Optional, List, Dict

class BaseResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Any] = None

class RAGQuerySource(BaseModel):
    document: str
    section: Optional[str] = None
    score: float

class RAGQueryResponse(BaseModel):
    answer: str
    sources: List[RAGQuerySource]

class RAGStatsResponse(BaseModel):
    documents: int
    chunks: int
    vectors: int
    last_sync: str
