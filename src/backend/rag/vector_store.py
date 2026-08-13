import logging
import os
from datetime import datetime
from typing import Any, Dict, List

import chromadb

logger = logging.getLogger(__name__)


class VectorStore:
    """
    ==========================================================
    MRStay AI
    Enterprise ChromaDB Vector Store
    ==========================================================
    """

    def __init__(
        self,
        db_path: str,
        collection_name: str = "mrstay_docs"
    ):

        self.db_path = db_path
        self.collection_name = collection_name

        logger.info("=" * 60)
        logger.info("Initializing Enterprise Vector Store")

        os.makedirs(
            self.db_path,
            exist_ok=True
        )

        self.client = chromadb.PersistentClient(
            path=self.db_path
        )

        self.collection = self.client.get_or_create_collection(
            name=self.collection_name,
            metadata={
                "hnsw:space": "cosine",
                "application": "MRStay AI",
                "created_at": str(datetime.now())
            }
        )

        logger.info(
            f"Collection : {self.collection_name}"
        )

        logger.info(
            f"Database : {self.db_path}"
        )

        logger.info("=" * 60)

    # ======================================================
    # Add Documents
    # ======================================================

    def add_documents(
        self,
        chunks: List[Dict[str, Any]],
        embeddings: List[List[float]]
    ):

        if (
            not chunks or
            not embeddings or
            len(chunks) != len(embeddings)
        ):
            raise ValueError(
                "Chunks and embeddings must have the same length."
            )

        ids = []
        documents = []
        metadatas = []

        for index, (chunk, embedding) in enumerate(
            zip(chunks, embeddings)
        ):

            metadata = chunk.get("metadata", {})

            source = metadata.get(
                 "source",
            metadata.get("filename", "unknown")
        )

            chunk_index = metadata.get(
                "chunk_index",
                index
            )

            doc_id = f"{source}_{chunk_index}"

            ids.append(doc_id)

            documents.append(
                chunk["content"]
            )

            safe_metadata = {}

            for key, value in metadata.items():

                if isinstance(
                    value,
                    (str, int, float, bool)
                ):
                    safe_metadata[key] = value

                else:
                    safe_metadata[key] = str(value)

            metadatas.append(safe_metadata)

        try:

            existing = self.collection.get(ids=ids)

            if existing.get("ids"):
                logger.info(
                    f"Skipping {len(existing['ids'])} existing documents."
                )

            self.collection.upsert(
                ids=ids,
                embeddings=embeddings,
                documents=documents,
                metadatas=metadatas
            )

            logger.info(
                f"{len(ids)} document chunks indexed successfully."
            )

        except Exception as e:

            logger.exception(e)

            raise

    # ======================================================
    # Similarity Search
    # ======================================================

    def similarity_search(
        self,
        query_embedding: List[float],
        n_results: int = 5,
        where: Dict[str, Any] = None
    ) -> List[Dict[str, Any]]:

        logger.info(
            f"Searching Top {n_results} Documents"
            + (f" (filter: {where})" if where else "")
        )

        try:

            query_kwargs = {
                "query_embeddings": [query_embedding],
                "n_results": n_results
            }

            if where:
                query_kwargs["where"] = where

            results = self.collection.query(**query_kwargs)

            formatted_results = []

            if (
                results and
                results.get("documents") and
                results["documents"][0]
            ):

                for i in range(
                    len(results["documents"][0])
                ):

                    formatted_results.append({

                        "id":
                            results["ids"][0][i],

                        "content":
                            results["documents"][0][i],

                        "metadata":
                            results["metadatas"][0][i]
                            if results.get("metadatas")
                            else {},

                        "distance":
                            results["distances"][0][i]
                            if results.get("distances")
                            else 0.0

                    })

            logger.info(
                f"Retrieved {len(formatted_results)} matching documents."
            )

            return formatted_results

        except Exception as e:

            logger.exception(e)

            raise

    # ======================================================
    # Collection Statistics
    # ======================================================

    def count(self) -> int:

        try:

            return self.collection.count()

        except Exception as e:

            logger.exception(e)

            raise

    # ======================================================
    # Delete by ID
    # ======================================================

    def delete(self, ids: List[str]):

        try:

            self.collection.delete(ids=ids)

            logger.info(
                f"Deleted {len(ids)} documents."
            )

        except Exception as e:

            logger.exception(e)

            raise

    # ======================================================
    # Collection Info
    # ======================================================

    def info(self) -> Dict[str, Any]:

        try:

            return {

                "collection": self.collection_name,

                "documents": self.count(),

                "database": self.db_path

            }

        except Exception as e:

            logger.exception(e)

            raise

    # ======================================================
    # Health Check
    # ======================================================

    def health(self) -> Dict[str, Any]:

        try:

            return {

                "success": True,

                "collection": self.collection_name,

                "documents": self.count(),

                "database_path": self.db_path

            }

        except Exception as error:

            logger.exception(error)

            return {

                "success": False,

                "error": str(error)

            }

    # ======================================================
    # Reset Collection
    # ======================================================

    def reset(self):

        try:

            logger.warning(
                "Resetting ChromaDB Collection..."
            )

            self.client.delete_collection(
                self.collection_name
            )

            self.collection = self.client.get_or_create_collection(

                name=self.collection_name,

                metadata={
                    "hnsw:space": "cosine"
                }

            )

            logger.info(
                "Collection Reset Completed."
            )

        except Exception as e:

            logger.exception(e)

            raise

    # ======================================================
    # Enterprise Statistics
    # ======================================================

    def statistics(self) -> Dict[str, Any]:

        try:

            return {

                "collection": self.collection_name,

                "total_documents": self.count(),

                "database_path": self.db_path,

                "status": "healthy"

            }

        except Exception as e:

            logger.exception(e)

            raise