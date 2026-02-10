import PyPDF2
from typing import List

def extract_text_from_pdf(pdf_path: str) -> str:
    """Extraire le texte d'un PDF"""
    text = ""
    with open(pdf_path, 'rb') as file:
        pdf_reader = PyPDF2.PdfReader(file)
        for page in pdf_reader.pages:
            text += page.extract_text()
    return text

def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> List[str]:
    """Découper le texte en morceaux avec chevauchement"""
    chunks = []
    start = 0
    
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        chunks.append(chunk)
        start += chunk_size - overlap
    
    return chunks

#Les PDFs sont longs. On les découpe en petits morceaux (chunks) pour :-Trouver précisément les infos pertinentes-Éviter de surcharger le modèle IA. L'overlap : On laisse 50 caractères qui se chevauchent entre chunks pour ne pas couper une phrase importante.