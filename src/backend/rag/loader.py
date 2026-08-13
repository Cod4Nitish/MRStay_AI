import os
from pathlib import Path
from typing import List, Dict, Any
from pypdf import PdfReader


class DocumentLoader:
    """
    Loads documents from the filesystem.
    Supports .txt, .md and .pdf files.

    Tags each document with a "property" metadata field derived
    from its immediate parent folder under properties/ — this is
    what lets the retriever later restrict search to a single
    property instead of mixing content across properties.
    """

    def __init__(self, directory_path: str):
        self.directory_path = Path(directory_path)

    def _extract_property_name(self, file_path: Path) -> str:
        """
        For a file at .../properties/7th_avenue_gaur_city/faq.txt
        returns "7th_avenue_gaur_city". For files outside a
        properties/ subfolder, returns "general".
        """

        parts = file_path.relative_to(self.directory_path).parts

        if len(parts) >= 2 and parts[0] == "properties":
            return parts[1]

        return "general"

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
                                "filename": file,
                                "property": self._extract_property_name(
                                    file_path
                                )
                            }
                        })

                    except Exception as e:
                        print(f"Error reading {file_path}: {e}")

        return documents