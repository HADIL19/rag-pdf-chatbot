from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import shutil
import os

from pdf_processor import extract_text_from_pdf, chunk_text
from embeddings import EmbeddingModel
from vector_store import VectorStore

app = FastAPI()

# Permettre les requêtes depuis le frontend React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialiser les composants
embedding_model = EmbeddingModel()
vector_store = VectorStore()

class Query(BaseModel):
    question: str

@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    """Uploader et traiter un PDF"""
    
    # Sauvegarder le PDF
    file_path = f"uploads/{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Extraire et découper le texte
    text = extract_text_from_pdf(file_path)
    chunks = chunk_text(text)
    
    # Créer les embeddings et stocker
    embeddings = embedding_model.encode(chunks)
    vector_store.add_documents(embeddings, chunks)
    
    return {"message": f"PDF {file.filename} traité avec succès!", "chunks": len(chunks)}

@app.post("/ask")
async def ask_question(query: Query):
    """Répondre à une question"""
    
    # Encoder la question
    question_embedding = embedding_model.encode([query.question])
    
    # Chercher les passages pertinents
    results = vector_store.search(question_embedding, k=3)
    
    # Construire le contexte
    context = "\n\n".join([chunk for chunk, _ in results])
    
    # Ici tu peux ajouter un appel à OpenAI/Claude pour générer une réponse
    # Pour l'instant, on renvoie juste les passages trouvés
    
    return {
        "answer": context,
        "sources": [{"text": chunk[:100] + "...", "score": float(score)} 
                   for chunk, score in results]
    }

@app.get("/")
async def root():
    return {"message": "RAG Chatbot API"}