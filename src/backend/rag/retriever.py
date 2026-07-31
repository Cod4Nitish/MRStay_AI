from typing import List, Dict, Any
from .embeddings import Embeddings
from .vector_store import VectorStore

class Retriever:
    """
    Coordinates between embeddings and vector store to fetch relevant context.
    """
    def __init__(self, embeddings: Embeddings, vector_store: VectorStore):
        self.embeddings = embeddings
        self.vector_store = vector_store

    def retrieve(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """
        Takes a raw text query and returns relevant document chunks.
        """
        query_vector = self.embeddings.embed_query(query)
        results = self.vector_store.similarity_search(query_vector, n_results=top_k)
        return results

    def format_context(self, results: List[Dict[str, Any]]) -> str:
        """
        Formats retrieved results into a single context string for LLM prompting.
        """
        context_parts = []
        for i, res in enumerate(results):
            source = res.get('metadata', {}).get('filename', 'Unknown')
            content = res.get('content', '')
            context_parts.append(f"--- Document {i+1} (Source: {source}) ---\n{content}\n")
        
        return "\n".join(context_parts)
