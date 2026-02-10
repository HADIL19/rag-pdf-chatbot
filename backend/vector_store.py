import faiss
import numpy as np
from typing import List, Tuple

class VectorStore:
    def __init__(self, dimension: int = 384):
        # 384 = dimension du modèle all-MiniLM-L6-v2
        self.index = faiss.IndexFlatL2(dimension)
        self.chunks = []
    
    def add_documents(self, embeddings: np.ndarray, chunks: List[str]):
        """Ajouter les documents à l'index"""
        self.index.add(embeddings)
        self.chunks.extend(chunks)
    
    def search(self, query_embedding: np.ndarray, k: int = 3) -> List[Tuple[str, float]]:
        """Chercher les k documents les plus similaires"""
        distances, indices = self.index.search(query_embedding, k)
        
        results = []
        for i, idx in enumerate(indices[0]):
            results.append((self.chunks[idx], distances[0][i]))
        
        return results
    
#FAISS : C'est une base de données ultra-rapide pour chercher des vecteurs similaires. Créée par Meta/Facebook.
