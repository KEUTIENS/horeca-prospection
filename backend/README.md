# HORECA Prospection Backend API

API REST backend pour l'application de gestion des prospections commerciales HORECA.

## Technologies

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Language:** TypeScript
- **Base de données:** PostgreSQL avec PostGIS
- **Authentification:** JWT
- **APIs externes:** Google Maps, OpenAI

## Installation

```bash
# Installer les dépendances
npm install

# Copier et configurer l'environnement
cp .env.example .env
# Éditer .env avec vos valeurs

# Créer la base de données PostgreSQL
createdb horeca_prospection

# Exécuter les migrations
npm run migrate

# Peupler avec des données de test
npm run seed
```

## Configuration

Éditez le fichier `.env` avec vos paramètres :

- `DATABASE_URL` : URL de connexion PostgreSQL
- `JWT_SECRET` : Clé secrète pour JWT
- `GOOGLE_MAPS_API_KEY` : Clé API Google Maps
- `OPENAI_API_KEY` : Clé API OpenAI
- `AWS_*` : Configuration S3 pour les fichiers

## Démarrage

```bash
# Mode développement (avec hot-reload)
npm run dev

# Mode production
npm run build
npm start
```

Le serveur démarre sur `http://localhost:3001`

## Endpoints API

### Authentification

- `POST /api/v1/auth/login` - Connexion
- `POST /api/v1/auth/refresh` - Renouvellement du token
- `POST /api/v1/auth/logout` - Déconnexion
- `GET /api/v1/auth/me` - Profil utilisateur
- `PUT /api/v1/auth/me` - Mise à jour du profil
- `POST /api/v1/auth/change-password` - Changement de mot de passe

### Utilisateurs (Admin uniquement)

- `GET /api/v1/users` - Liste des utilisateurs
- `GET /api/v1/users/:id` - Détails utilisateur
- `POST /api/v1/users` - Créer un utilisateur
- `PUT /api/v1/users/:id` - Modifier un utilisateur
- `DELETE /api/v1/users/:id` - Supprimer un utilisateur

### Prospects

- `GET /api/v1/prospects` - Liste des prospects
- `GET /api/v1/prospects/nearby` - Prospects à proximité
- `GET /api/v1/prospects/:id` - Détails prospect
- `POST /api/v1/prospects` - Créer un prospect
- `PUT /api/v1/prospects/:id` - Modifier un prospect
- `DELETE /api/v1/prospects/:id` - Supprimer un prospect
- `POST /api/v1/prospects/:id/enrich` - Enrichir via IA

### Visites

- `GET /api/v1/visits` - Liste des visites
- `GET /api/v1/visits/stats` - Statistiques des visites
- `GET /api/v1/visits/:id` - Détails visite
- `POST /api/v1/visits` - Créer une visite
- `PUT /api/v1/visits/:id` - Modifier une visite
- `DELETE /api/v1/visits/:id` - Supprimer une visite

### Tournées

- `GET /api/v1/tours` - Liste des tournées
- `GET /api/v1/tours/:id` - Détails tournée
- `POST /api/v1/tours` - Créer une tournée
- `PUT /api/v1/tours/:id` - Modifier une tournée
- `DELETE /api/v1/tours/:id` - Supprimer une tournée
- `POST /api/v1/tours/:id/start` - Démarrer une tournée
- `POST /api/v1/tours/:id/complete` - Terminer une tournée

### Statistiques

- `GET /api/v1/stats/overview` - Vue d'ensemble
- `GET /api/v1/stats/conversions` - Taux de conversion
- `GET /api/v1/stats/heatmap` - Carte de chaleur
- `GET /api/v1/stats/by-user` - Stats par utilisateur

## Comptes de test

Après avoir exécuté `npm run seed` :

- **Admin:** admin@horeca-prospection.com / Admin123!
- **Manager:** manager@horeca-prospection.com / Manager123!
- **Rep:** rep@horeca-prospection.com / Rep123!

## Scripts

- `npm run dev` - Démarrage en mode développement
- `npm run build` - Compilation TypeScript
- `npm start` - Démarrage en production
- `npm run migrate` - Exécuter les migrations de base de données
- `npm run seed` - Peupler la base de données avec des données de test
- `npm test` - Lancer les tests

## Structure du projet

```
backend/
├── src/
│   ├── controllers/      # Contrôleurs API
│   ├── db/              # Connexion et migrations DB
│   ├── middlewares/     # Middlewares Express
│   ├── models/          # Modèles de données
│   ├── routes/          # Définition des routes
│   ├── services/        # Services (Google Maps, S3, etc.)
│   ├── types/           # Types TypeScript
│   ├── utils/           # Utilitaires
│   └── index.ts         # Point d'entrée
├── package.json
├── tsconfig.json
└── .env.example
```

## Licence

Propriétaire - HORECA Prospection © 2025



