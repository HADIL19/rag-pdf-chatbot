from typing import List
from sentence_transformers import SentenceTransformer
import numpy as np

class EmbeddingModel:
    def __init__(self):
        # Modèle gratuit et performant
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
    
    def encode(self, texts: List[str]) -> np.ndarray:
        """Convertir texte en vecteurs numériques"""
        return self.model.encode(texts)
    
#embedding ? C'est transformer du texte en nombres (vecteurs). Deux textes similaires auront des vecteurs proches. Exemple : "Comment déposer une réclamation ?" → [0.2, 0.8, 0.1, ...],"Procédure de réclamation" → [0.3, 0.7, 0.2, ...] (proche!)