# 🚀 Guide de Démarrage Rapide (5 minutes)

## Étape 1: Cloner et installer (2 min)

```bash
# Cloner le repo
git clone https://github.com/votre-username/rag-chatbot.git
cd rag-chatbot

# Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Frontend (dans un autre terminal)
cd frontend
npm install
```

## Étape 2: Configuration API (1 min)

**Option facile: OpenAI**

1. Aller sur: https://platform.openai.com/api-keys
2. Créer une clé API (gratuit pour commencer)
3. Créer fichier `.env` dans `/backend`:

```env
OPENAI_API_KEY=sk-votre-cle-ici
```

**Alternative: Claude (Anthropic)**

1. Aller sur: https://console.anthropic.com/settings/keys
2. Même processus, utiliser:

```env
ANTHROPIC_API_KEY=sk-ant-votre-cle-ici
```

## Étape 3: Lancement (30 sec)

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate
uvicorn main_openai:app --reload
# ou: uvicorn main_claude:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

## Étape 4: Utilisation (1 min)

1. Ouvrir http://localhost:3000
2. Aller dans "Documents" → Uploader un PDF
3. Aller dans "Chat" → Poser une question!

## 🎉 Vous êtes prêt!

### Exemple de test rapide

1. Uploadez n'importe quel PDF (contrat, manuel, doc technique)
2. Testez avec:
   - "Résume ce document en 3 points"
   - "Quels sont les points principaux?"
   - "Explique-moi la section sur [topic]"

## ⚠️ Problèmes courants

**Erreur: Module not found**
```bash
pip install -r requirements.txt
# ou
npm install
```

**Erreur: API Key invalid**
- Vérifiez que votre clé est bien dans `.env`
- Vérifiez qu'il n'y a pas d'espace avant/après la clé

**Port déjà utilisé**
```bash
# Backend: changer le port
uvicorn main_openai:app --reload --port 8001

# Frontend: dans package.json, ajouter:
"start": "PORT=3001 react-scripts start"
```

## 📚 Prochaines étapes

- Lire le README.md complet
- Personnaliser l'UI dans `ChatBot.css`
- Ajuster les paramètres dans `main.py`
- Déployer sur Vercel + Render

## 🆘 Besoin d'aide?

- Ouvrir une issue sur GitHub
- Vérifier la documentation dans `/docs`
- Consulter les logs dans le terminal

Bon développement! 🚀