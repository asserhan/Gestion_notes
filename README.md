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

## Tests

### Backend

```bash
cd backend
pytest
```

### Frontend

```bash
cd frontend
npm test
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

## Bonnes Pratiques Implémentées

- Validation des données avec Pydantic
- Gestion des erreurs centralisée
- Tests unitaires et d'intégration
- Documentation API avec Swagger
- Sécurité avec JWT
- Architecture modulaire
- Code propre et maintenable

## Contribution

1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.