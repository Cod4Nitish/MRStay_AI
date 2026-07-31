import logging
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
    Orchestrates the answering pipeline.
    """
    def __init__(self):
        self.embeddings = Embeddings()
        self.vector_store = VectorStore(db_path=CHROMA_DB_PATH)
        self.retriever = Retriever(embeddings=self.embeddings, vector_store=self.vector_store)
        self.prompt_builder = PromptBuilder()
        self.llm = LLM()

    def query(self, user_question: str) -> Dict[str, Any]:
        """
        Executes the full RAG pipeline for a given question.
        Returns a dictionary with 'answer' and 'sources'.
        """
        logger.info(f"Received query: {user_question}")
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
                    "document": res.get('metadata', {}).get('filename', 'Unknown'),
                    "section": res.get('metadata', {}).get('source', 'Unknown'),
                    "score": round(score, 2)
                })

            # Format the retrieved chunks into a single context string
            context = self.retriever.format_context(raw_results)
            
            # 3: Build Prompt
            prompt = self.prompt_builder.build(query=user_question, context=context)
            
            # 4: Generate LLM Response
            answer = self.llm.generate(prompt)
            logger.info("Successfully generated response")
            
            return {
                "answer": answer,
                "sources": sources
            }
        except Exception as e:
            logger.error(f"Error executing query: {str(e)}")
            raise e

if __name__ == "__main__":
    import sys
    logging.basicConfig(level=logging.INFO)
    engine = RAGQueryEngine()
    question = sys.argv[1] if len(sys.argv) > 1 else "What is MRStay?"
    print(f"\nQuestion: {question}")
    print("-" * 40)
    result = engine.query(question)
    print("Answer:", result['answer'])
    print("Sources:", result['sources'])
