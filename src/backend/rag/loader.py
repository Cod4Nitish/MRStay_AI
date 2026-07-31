import os
from pathlib import Path
from typing import List, Dict, Any

class DocumentLoader:
    """
    Loads documents from the filesystem.
    Supports .txt and .md files.
    """
    def __init__(self, directory_path: str):
        self.directory_path = Path(directory_path)

    def load_documents(self) -> List[Dict[str, Any]]:
        """
        Reads all supported documents in the directory.
        Returns a list of dictionaries containing content and metadata.
        """
        documents = []
        if not self.directory_path.exists():
            return documents

        for root, _, files in os.walk(self.directory_path):
            for file in files:
                if file.endswith(('.txt', '.md')):
                    file_path = Path(root) / file
                    try:
                        with open(file_path, 'r', encoding='utf-8') as f:
                            content = f.read()
                        
                        documents.append({
                            "content": content,
                            "metadata": {
                                "source": str(file_path.relative_to(self.directory_path)),
                                "filename": file
                            }
                        })
                    except Exception as e:
                        print(f"Error reading {file_path}: {e}")
        
        return documents
