import os
import chromadb
from typing import List, Dict, Any

class VectorStore:
    """
    Interface for ChromaDB vector storage.
    """
    def __init__(self, db_path: str, collection_name: str = "mrstay_docs"):
        # Ensure the directory exists
        os.makedirs(db_path, exist_ok=True)
        self.client = chromadb.PersistentClient(path=db_path)
        self.collection = self.client.get_or_create_collection(
            name=collection_name,
            metadata={"hnsw:space": "cosine"}
        )

    def add_documents(self, chunks: List[Dict[str, Any]], embeddings: List[List[float]]):
        """
        Adds text chunks and their corresponding embeddings to ChromaDB.
        """
        if not chunks or not embeddings or len(chunks) != len(embeddings):
            raise ValueError("Chunks and embeddings must be non-empty and of equal length.")

        ids = []
        documents = []
        metadatas = []
        
        for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
            # Create a unique ID for each chunk based on filename and index
            source = chunk['metadata'].get('source', 'unknown')
            chunk_index = chunk['metadata'].get('chunk_index', i)
            doc_id = f"{source}_{chunk_index}"
            
            ids.append(doc_id)
            documents.append(chunk['content'])
            
            # Ensure metadata values are basic types (str, int, float, bool)
            safe_meta = {}
            for k, v in chunk['metadata'].items():
                if isinstance(v, (str, int, float, bool)):
                    safe_meta[k] = v
                else:
                    safe_meta[k] = str(v)
            metadatas.append(safe_meta)
            
        self.collection.upsert(
            ids=ids,
            embeddings=embeddings,
            documents=documents,
            metadatas=metadatas
        )

    def similarity_search(self, query_embedding: List[float], n_results: int = 5) -> List[Dict[str, Any]]:
        """
        Searches for the most similar documents given a query embedding.
        """
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results
        )
        
        # Format results
        formatted_results = []
        if results and results['documents'] and results['documents'][0]:
            for i in range(len(results['documents'][0])):
                formatted_results.append({
                    "content": results['documents'][0][i],
                    "metadata": results['metadatas'][0][i] if results['metadatas'] else {},
                    "distance": results['distances'][0][i] if results['distances'] else 0.0,
                    "id": results['ids'][0][i]
                })
                
        return formatted_results
