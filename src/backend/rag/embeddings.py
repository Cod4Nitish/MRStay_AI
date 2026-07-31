import os
from typing import List
import google.generativeai as genai
from sentence_transformers import SentenceTransformer

class Embeddings:
    """
    Generates vector embeddings for text chunks.
    Uses Gemini Embeddings if GEMINI_API_KEY is available, 
    otherwise falls back to local SentenceTransformers.
    """
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        self.use_gemini = bool(self.api_key and self.api_key != "your_gemini_api_key_here")
        
        if self.use_gemini:
            genai.configure(api_key=self.api_key)
            self.model_name = "models/text-embedding-004"
            print("Using Gemini Embeddings")
        else:
            print("Using local SentenceTransformers (all-MiniLM-L6-v2)")
            self.local_model = SentenceTransformer('all-MiniLM-L6-v2')

    def embed_texts(self, texts: List[str]) -> List[List[float]]:
        """
        Takes a list of strings and returns a list of embedding vectors.
        """
        if not texts:
            return []

        if self.use_gemini:
            # Gemini embeddings
            embeddings = []
            for text in texts:
                result = genai.embed_content(
                    model=self.model_name,
                    content=text,
                    task_type="retrieval_document"
                )
                embeddings.append(result['embedding'])
            return embeddings
        else:
            # Local embeddings
            embeddings = self.local_model.encode(texts)
            return embeddings.tolist()
    
    def embed_query(self, query: str) -> List[float]:
        """
        Embeds a single query string.
        """
        if self.use_gemini:
            result = genai.embed_content(
                model=self.model_name,
                content=query,
                task_type="retrieval_query"
            )
            return result['embedding']
        else:
            return self.local_model.encode([query])[0].tolist()
