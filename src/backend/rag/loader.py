import os
from pathlib import Path
from typing import List, Dict, Any
from pypdf import PdfReader


class DocumentLoader:
    """
    Loads documents from the filesystem.
    Supports .txt, .md and .pdf files.
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

                if file.lower().endswith((".txt", ".md", ".pdf")):
                    file_path = Path(root) / file

                    try:
                        if file.lower().endswith(".pdf"):
                            reader = PdfReader(file_path)
                            content = "\n".join(
                                page.extract_text() or ""
                                for page in reader.pages
                            )
                        else:
                            with open(
                                file_path,
                                "r",
                                encoding="utf-8"
                            ) as f:
                                content = f.read()

                        documents.append({
                            "content": content,
                            "metadata": {
                                "source": str(
                                    file_path.relative_to(
                                        self.directory_path
                                    )
                                ),
                                "filename": file
                            }
                        })

                    except Exception as e:
                        print(f"Error reading {file_path}: {e}")

        return documents