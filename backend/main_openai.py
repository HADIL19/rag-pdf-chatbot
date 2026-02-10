"""
Backend RAG amélioré avec OpenAI
Installation: pip install openai python-dotenv
"""

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import shutil
import os
from typing import List, Optional
from dotenv import load_dotenv
import openai

from pdf_processor import extract_text_from_pdf, chunk_text
from embeddings import EmbeddingModel
from vector_store import VectorStore

# Charger les variables d'environnement
load_dotenv()

app = FastAPI(title="RAG Chatbot API", version="2.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration OpenAI
openai.api_key = os.getenv("OPENAI_API_KEY")

# Initialiser les composants
embedding_model = EmbeddingModel()
vector_store = VectorStore()

# Créer le dossier uploads
os.makedirs("uploads", exist_ok=True)


class Query(BaseModel):
    question: str
    use_ai: bool = True  # Option pour utiliser l'IA ou juste retourner les chunks


class ChatResponse(BaseModel):
    answer: str
    sources: List[dict]
    model_used: Optional[str] = None


def generate_ai_answer(question: str, context: str) -> str:
    """
    Génère une réponse intelligente avec OpenAI
    """
    try:
        system_prompt = """Tu es un assistant expert qui répond aux questions en te basant UNIQUEMENT sur le contexte fourni.

Règles importantes:
1. Réponds UNIQUEMENT avec les informations du contexte
2. Si l'info n'est pas dans le contexte, dis "Je n'ai pas trouvé cette information dans les documents"
3. Sois précis et concis
4. Cite les passages pertinents du contexte
5. Utilise un ton professionnel mais accessible
"""

        user_prompt = f"""Contexte extrait des documents:
{context}

Question de l'utilisateur:
{question}

Réponds à la question en te basant sur le contexte ci-dessus."""

        response = openai.chat.completions.create(
            model="gpt-4o-mini",  # Ou "gpt-4" pour meilleure qualité
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.3,  # Moins créatif = plus fidèle aux docs
            max_tokens=500
        )

        return response.choices[0].message.content

    except Exception as e:
        print(f"Erreur OpenAI: {e}")
        return f"Erreur lors de la génération de la réponse: {str(e)}"


@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    """
    Upload et traitement d'un PDF
    """
    try:
        # Vérifier que c'est un PDF
        if not file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Le fichier doit être un PDF")

        # Sauvegarder le fichier
        file_path = f"uploads/{file.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Extraire et découper le texte
        text = extract_text_from_pdf(file_path)
        
        if not text.strip():
            raise HTTPException(status_code=400, detail="Le PDF ne contient pas de texte extractible")

        chunks = chunk_text(text, chunk_size=500, overlap=50)

        # Créer les embeddings et stocker
        embeddings = embedding_model.encode(chunks)
        vector_store.add_documents(embeddings, chunks)

        return {
            "message": f"PDF '{file.filename}' traité avec succès!",
            "chunks": len(chunks),
            "filename": file.filename
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur: {str(e)}")


@app.post("/ask", response_model=ChatResponse)
async def ask_question(query: Query):
    """
    Répondre à une question avec RAG + OpenAI
    """
    try:
        # Vérifier qu'il y a des documents
        if vector_store.index.ntotal == 0:
            raise HTTPException(
                status_code=400,
                detail="Aucun document n'a été uploadé. Veuillez d'abord uploader un PDF."
            )

        # 1. Encoder la question
        question_embedding = embedding_model.encode([query.question])

        # 2. Chercher les passages pertinents (top 3)
        results = vector_store.search(question_embedding, k=3)

        # 3. Construire le contexte
        context = "\n\n---\n\n".join([chunk for chunk, _ in results])

        # 4. Générer la réponse avec OpenAI (si demandé)
        if query.use_ai:
            answer = generate_ai_answer(query.question, context)
            model_used = "gpt-4o-mini"
        else:
            # Sinon, juste retourner le contexte
            answer = context
            model_used = None

        # 5. Préparer les sources
        sources = [
            {
                "text": chunk[:200] + ("..." if len(chunk) > 200 else ""),
                "score": float(score),
                "relevance": round((1 - float(score)) * 100, 1)  # Convertir en %
            }
            for chunk, score in results
        ]

        return ChatResponse(
            answer=answer,
            sources=sources,
            model_used=model_used
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur: {str(e)}")


@app.get("/")
async def root():
    """
    Endpoint racine
    """
    return {
        "message": "RAG Chatbot API v2.0",
        "endpoints": {
            "upload": "/upload-pdf",
            "ask": "/ask",
            "docs": "/docs"
        },
        "documents_count": vector_store.index.ntotal
    }


@app.get("/stats")
async def get_stats():
    """
    Statistiques du système
    """
    return {
        "total_chunks": vector_store.index.ntotal,
        "total_documents": len(set(vector_store.chunks)),
        "embedding_model": "all-MiniLM-L6-v2",
        "ai_model": "gpt-4o-mini"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)