import chromadb
from chromadb.config import Settings as ChromaSettings
from core.config import settings
from pathlib import Path


class VectorStore:
    def __init__(self, collection_name: str = "ali_knowledge"):
        self.client = chromadb.PersistentClient(
            path=settings.chroma_db_path,
            settings=ChromaSettings(anonymized_telemetry=False),
        )
        self.collection_name = collection_name
        self.collection = self.client.get_or_create_collection(
            name=collection_name,
            metadata={"hnsw:space": "cosine"},
        )

    def add_documents(self, texts: list[str], metadatas: list[dict] | None = None, ids: list[str] | None = None):
        if ids is None:
            ids = [f"doc_{i}" for i in range(len(texts))]
        self.collection.add(documents=texts, metadatas=metadatas, ids=ids)

    def search(self, query: str, n_results: int = 5) -> list[dict]:
        results = self.collection.query(query_texts=[query], n_results=n_results)
        output = []
        for i in range(len(results["ids"][0])):
            output.append({
                "id": results["ids"][0][i],
                "text": results["documents"][0][i],
                "metadata": results["metadatas"][0][i] if results["metadatas"] else {},
                "distance": results["distances"][0][i] if results["distances"] else 0,
            })
        return output

    def count(self) -> int:
        return self.collection.count()

    def delete_collection(self):
        self.client.delete_collection(self.collection_name)

    def list_collections(self) -> list[str]:
        return [c.name for c in self.client.list_collections()]
