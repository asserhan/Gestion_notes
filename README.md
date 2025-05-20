# Application de Gestion de Notes

Une application web moderne pour gérer vos notes avec authentification, partage et recherche.

## Fonctionnalités

- 🔐 Authentification sécurisée
- 📝 Création et édition de notes
- 🔍 Recherche de notes
- 👥 Partage de notes
- 🔒 Gestion de la visibilité (privé/public)
- 🎨 Interface utilisateur moderne et responsive

## Prérequis

- Docker et Docker Compose
- Node.js (pour le développement frontend)
- Python 3.8+ (pour le développement backend)

## Installation avec Docker

1. Clonez le repository :
```bash
git clone <votre-repo>
cd Gestion_notes
```

2. Créez un fichier `.env` à la racine du projet :
```env
# Backend
DATABASE_URL=postgresql://postgres:postgres@db:5432/notes_db
JWT_SECRET=votre_secret_jwt
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000
```

3. Lancez l'application avec Docker Compose :
```bash
docker-compose up --build
```

L'application sera accessible sur :
- Frontend : http://localhost:3000
- Backend : http://localhost:8000
- API Documentation : http://localhost:8000/docs

## Installation pour le développement

### Backend

1. Créez un environnement virtuel Python :
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
.\venv\Scripts\activate  # Windows
```

2. Installez les dépendances :
```bash
pip install -r requirements.txt
```

3. Lancez le serveur :
```bash
uvicorn app.main:app --reload
```

### Frontend

1. Installez les dépendances :
```bash
cd frontend
npm install
```

2. Lancez le serveur de développement :
```bash
npm run dev
```

## Structure du Projet

```
Gestion_notes/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── database/
│   │   └── schemas/
│   ├── tests/
│   └── requirements.txt
├── frontend/
│   ├── app/
│   │   ├── api/
│   │   ├── components/
│   │   └── styles/
│   └── package.json
└── docker-compose.yml
```