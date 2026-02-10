# 🤖 RAG Chatbot - Assistant Documentaire Intelligent

Un chatbot basé sur **RAG (Retrieval-Augmented Generation)** qui répond aux questions en se basant sur vos documents PDF. Construit avec FastAPI, React, et intégration OpenAI/Claude.

![Python](https://img.shields.io/badge/Python-3.10+-blue)
![React](https://img.shields.io/badge/React-18+-61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688)
![License](https://img.shields.io/badge/License-MIT-green)

## 🎯 Fonctionnalités

- ✅ **Upload de PDFs** avec drag & drop
- ✅ **Extraction intelligente** du contenu des documents
- ✅ **Recherche vectorielle** ultra-rapide avec FAISS
- ✅ **Réponses générées par IA** (OpenAI GPT-4 ou Claude Sonnet)
- ✅ **Interface moderne** et responsive
- ✅ **Citations des sources** pour chaque réponse
- ✅ **Support multi-documents**

## 🏗️ Architecture

```
┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│   Frontend  │ ────> │   Backend    │ ────> │  Vector DB  │
│   (React)   │ <──── │  (FastAPI)   │ <──── │   (FAISS)   │
└─────────────┘       └──────────────┘       └─────────────┘
                              │
                              ▼
                      ┌──────────────┐
                      │  OpenAI/     │
                      │  Claude API  │
                      └──────────────┘
```

### Stack Technique

**Backend:**
- FastAPI (API REST)
- PyPDF2 (extraction de texte)
- Sentence-Transformers (embeddings)
- FAISS (recherche vectorielle)
- OpenAI API ou Anthropic Claude

**Frontend:**
- React 18
- Axios (requêtes HTTP)
- CSS moderne avec animations

## 🚀 Installation

### Prérequis

- Python 3.10+
- Node.js 18+
- npm ou yarn
- Clé API OpenAI **OU** Anthropic (voir ci-dessous)

### 1️⃣ Backend

```bash
# Cloner le repo
git clone https://github.com/votre-username/rag-chatbot.git
cd rag-chatbot

# Créer environnement virtuel
cd backend
python -m venv venv

# Activer l'environnement
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# Configurer les variables d'environnement
cp .env.example .env
# Éditez .env et ajoutez votre clé API
```

**Obtenir une clé API:**

**Option A - OpenAI:**
1. Aller sur https://platform.openai.com/api-keys
2. Créer une clé API
3. Ajouter dans `.env`: `OPENAI_API_KEY=sk-...`

**Option B - Anthropic Claude:**
1. Aller sur https://console.anthropic.com/settings/keys
2. Créer une clé API
3. Ajouter dans `.env`: `ANTHROPIC_API_KEY=sk-ant-...`

```bash
# Lancer le serveur (choisir une option)
# Avec OpenAI:
uvicorn main_openai:app --reload

# Avec Claude:
uvicorn main_claude:app --reload

# Le backend est disponible sur http://localhost:8000
```

### 2️⃣ Frontend

```bash
# Dans un nouveau terminal
cd frontend

# Installer les dépendances
npm install

# Lancer l'application
npm start

# L'app est disponible sur http://localhost:3000
```

## 📖 Utilisation

1. **Uploader un PDF**: Allez dans l'onglet "Documents" et uploadez votre PDF
2. **Attendre le traitement**: Le backend découpe et indexe le document (~quelques secondes)
3. **Poser des questions**: Retournez à l'onglet "Chat" et posez vos questions!

### Exemple de questions

```
💬 "Quelles sont les étapes pour déposer une réclamation?"
💬 "Quel est le délai de traitement mentionné?"
💬 "Résume-moi la section sur les garanties"
```

## 🎨 Captures d'écran

### Chat Interface
Interface moderne avec support des sources et citations.

### Upload Interface
Drag & drop facile avec barre de progression.

## 🔧 Configuration Avancée

### Ajuster la taille des chunks

Dans `pdf_processor.py`:

```python
chunks = chunk_text(text, 
    chunk_size=500,  # Augmenter pour plus de contexte
    overlap=50       # Augmenter pour éviter de couper les phrases
)
```

### Changer le modèle d'embeddings

Dans `embeddings.py`:

```python
# Modèles disponibles:
# - 'all-MiniLM-L6-v2' (rapide, 384 dimensions)
# - 'all-mpnet-base-v2' (plus précis, 768 dimensions)
# - 'multi-qa-mpnet-base-dot-v1' (optimisé pour Q&A)

self.model = SentenceTransformer('all-mpnet-base-v2')
```

### Ajuster le nombre de sources

Dans `main.py` (ligne ~100):

```python
results = vector_store.search(question_embedding, k=5)  # k=5 au lieu de 3
```

## 📊 API Endpoints

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/` | GET | Informations de l'API |
| `/upload-pdf` | POST | Upload un PDF |
| `/ask` | POST | Poser une question |
| `/stats` | GET | Statistiques du système |
| `/docs` | GET | Documentation Swagger |

### Exemple de requête

```bash
# Upload PDF
curl -X POST "http://localhost:8000/upload-pdf" \
  -F "file=@document.pdf"

# Poser une question
curl -X POST "http://localhost:8000/ask" \
  -H "Content-Type: application/json" \
  -d '{"question": "Quelle est la procédure?", "use_ai": true}'
```

## 🧪 Tests

```bash
# Backend
cd backend
pytest tests/

# Frontend
cd frontend
npm test
```


## 🤝 Contribution

Les contributions sont les bienvenues! 

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Améliorations Futures

- [ ] Support de multiples formats (Word, Excel, TXT)
- [ ] Historique des conversations
- [ ] Authentification utilisateur
- [ ] Base de données PostgreSQL
- [ ] Support multilingue
- [ ] Export des conversations en PDF
- [ ] Mode vocal (speech-to-text)

## 📄 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👨‍💻 Auteur

Créé avec ❤️ pour le challenge de développement

## 🙏 Remerciements

- [FastAPI](https://fastapi.tiangolo.com/)
- [Sentence Transformers](https://www.sbert.net/)
- [FAISS](https://github.com/facebookresearch/faiss)
- [OpenAI](https://openai.com/)
- [Anthropic](https://anthropic.com/)

---

⭐ Si ce projet vous plaît, n'hésitez pas à lui donner une étoile!