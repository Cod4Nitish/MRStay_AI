import os
from typing import List

from google import genai
from sentence_transformers import SentenceTransformer


class Embeddings:
    """
    Generates vector embeddings using Gemini or local SentenceTransformer.
    """

    def __init__(self, api_key: str = None):

        self.api_key = api_key or os.getenv("GEMINI_API_KEY")

        self.use_gemini = (
            self.api_key is not None
            and self.api_key != ""
            and self.api_key != "your_gemini_api_key_here"
        )

        if self.use_gemini:

            print("=" * 60)
            print("Using Gemini Embeddings")
            print("=" * 60)

            self.client = genai.Client(
                api_key=self.api_key
            )

            # Latest supported embedding model
            self.model_name = "gemini-embedding-001"

        else:

            print("=" * 60)
            print("Using Local SentenceTransformer")
            print("=" * 60)

            self.local_model = SentenceTransformer(
                "all-MiniLM-L6-v2"
            )

    def embed_texts(
        self,
        texts: List[str]
    ) -> List[List[float]]:

        if not texts:
            return []

        if self.use_gemini:

            vectors = []

            for text in texts:

                response = self.client.models.embed_content(
                    model=self.model_name,
                    contents=text,
                )

                vectors.append(
                    response.embeddings[0].values
                )

            return vectors

        embeddings = self.local_model.encode(texts)

        return embeddings.tolist()

    def embed_query(
        self,
        query: str
    ) -> List[float]:

        if self.use_gemini:

            response = self.client.models.embed_content(
                model=self.model_name,
                contents=query,
            )

            return response.embeddings[0].values

        return self.local_model.encode(
            [query]
        )[0].tolist()