```md
# 📄 RAG PDF Chatbot (Next.js + FastAPI)

A **Retrieval-Augmented Generation (RAG) chatbot** that answers user questions based **only on the content of PDF documents**.

This project demonstrates how real-world AI assistants work in companies (document bots, support bots, internal tools).

---

## 🚀 Features

- Ask questions in natural language
- Search inside PDF documents
- Retrieve the most relevant text passages
- Generate accurate answers based on documents
- Modern chat interface (Next.js)
- Fast and scalable backend (FastAPI + FAISS)

---

## 🧠 How It Works (RAG Pipeline)

1. PDF documents are loaded and converted to text
2. Text is split into chunks with overlap
3. Each chunk is transformed into embeddings
4. Embeddings are stored in a FAISS vector database
5. User question is embedded
6. FAISS retrieves the most relevant chunks
7. A language model generates the final answer using retrieved context

---

## 🏗️ Architecture

```

Frontend (Next.js)
|
|  HTTP (REST)
v
Backend (FastAPI)
|
|-- PDF Parsing (PyPDF)
|-- Text Chunking
|-- Embeddings (Sentence Transformers)
|-- FAISS Vector Search
|-- RAG Answer Generation

```

---

## 🛠 Tech Stack

### Backend
- Python
- FastAPI
- PyPDF
- LangChain
- Sentence-Transformers
- FAISS (Vector Database)

### Frontend
- Next.js (App Router)
- React
- Tailwind CSS

---

## 📂 Project Structure

```

rag-pdf-chatbot/
├── backend/
│   ├── main.py
│   ├── ingest.py
│   ├── rag.py
│   └── pdfs/
│
├── frontend/
│   ├── src/app/page.tsx
│   └── ...
│
└── README.md

````

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/rag-pdf-chatbot.git
cd rag-pdf-chatbot
````

---

### 2️⃣ Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Run the backend:

```bash
uvicorn main:app --reload
```

Backend will run on:

```
http://localhost:8000
```

---

### 3️⃣ Frontend Setup (Next.js)

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on:

```
http://localhost:3000
```

---

## 🔐 Environment Variables

Create a `.env.local` file in `frontend/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 💬 API Endpoint

### Ask a question

**POST** `/ask`

```json
{
  "question": "How do I file a claim?"
}
```

Response:

```json
{
  "answer": "You can file a claim by filling out the official form..."
}
```

---

## 📸 Screenshots

*(Add screenshots of the chat interface here)*

---

## 🚧 Future Improvements

* PDF upload from frontend
* Source citations (page number, paragraph)
* Streaming responses
* Authentication
* Docker support
* Deployment (Vercel + Render)

---

## 🎯 Why This Project Matters

* Demonstrates real-world AI architecture
* Uses Retrieval-Augmented Generation (RAG)
* Shows backend + frontend integration
* Suitable for enterprise use cases
* Strong portfolio project for GitHub & CV

---

## 🧑‍💻 Author

Built with ❤️ by **[HINATA]**

---

## 📜 License

This project is licensed under the MIT License.

```

---

