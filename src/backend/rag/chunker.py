from typing import List, Dict, Any
from langchain_text_splitters import RecursiveCharacterTextSplitter

class TextChunker:
    """
    Splits document text into manageable chunks for vector embeddings.
    Uses LangChain's RecursiveCharacterTextSplitter.
    """
    def __init__(self, chunk_size: int = 1000, chunk_overlap: int = 200):
        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            length_function=len,
            is_separator_regex=False,
        )

    def chunk_documents(self, documents: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Takes a list of document dicts (content, metadata) and returns 
        a list of chunked dicts, preserving metadata.
        """
        chunks = []
        for doc in documents:
            text = doc.get("content", "")
            metadata = doc.get("metadata", {})
            
            if not text:
                continue
                
            split_texts = self.splitter.split_text(text)
            
            for i, split_text in enumerate(split_texts):
                chunk_meta = metadata.copy()
                chunk_meta["chunk_index"] = i
                
                chunks.append({
                    "content": split_text,
                    "metadata": chunk_meta
                })
                
        return chunks
