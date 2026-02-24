import chromadb
from chromadb.utils import embedding_functions
import os

class MemoryManager:
    def __init__(self):
        self.client = chromadb.PersistentClient(path="./chroma_db")
        self.embedding_fn = embedding_functions.DefaultEmbeddingFunction()
        self.collection = self.client.get_or_create_collection(
            name="elysia_memory",
            embedding_function=self.embedding_fn
        )

    def add_memory(self, text, metadata=None):
        self.collection.add(
            documents=[text],
            metadatas=[metadata] if metadata else [{"type": "conversation"}],
            ids=[str(self.collection.count() + 1)]
        )

    def query_memory(self, query_text, n_results=3):
        results = self.collection.query(
            query_texts=[query_text],
            n_results=n_results
        )
        return results["documents"][0] if results["documents"] else []

memory_manager = MemoryManager()
