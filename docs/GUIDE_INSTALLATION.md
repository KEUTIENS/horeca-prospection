# Guide d'Installation et de Déploiement - HORECA Prospection

## Table des matières

1. [Prérequis](#prérequis)
2. [Installation locale](#installation-locale)
3. [Déploiement avec Docker](#déploiement-avec-docker)
4. [Configuration](#configuration)
5. [Tests et vérification](#tests-et-vérification)
6. [Déploiement en production](#déploiement-en-production)
7. [Dépannage](#dépannage)

---

## Prérequis

### Logiciels requis

- **Node.js** : Version 18.0 ou supérieure
- **npm** : Version 9.0 ou supérieure
- **PostgreSQL** : Version 15 ou supérieure avec extension PostGIS
- **Redis** : Version 7 ou supérieure (pour le worker AI)
- **Docker & Docker Compose** : Version 20.10+ et 2.0+ (optionnel mais recommandé)

### Clés API nécessaires

- **Google Maps API Key** : Pour la géolocalisation et les itinéraires
  - APIs à activer : Geocoding API, Directions API, Places API
- **OpenAI API Key** : Pour l'enrichissement automatique des prospects
- **AWS S3** : Pour le stockage des fichiers (ou compatible S3)
- **SendGrid/Mailgun** : Pour l'envoi d'emails (optionnel)

---

## Installation locale

### 1. Cloner le projet

```bash
git clone https://github.com/votre-org/horeca-prospection.git
cd horeca-prospection
```

### 2. Installation des dépendances

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd frontend
npm install
```

### 3. Configuration des variables d'environnement

#### Backend

Créez un fichier `.env` dans le dossier `backend/` :

```env
# Serveur
NODE_ENV=development
PORT=3001
API_PREFIX=/api/v1

# Base de données
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/horeca_prospection
DB_HOST=localhost
DB_PORT=5432
DB_NAME=horeca_prospection
DB_USER=postgres
DB_PASSWORD=postgres

# JWT
JWT_SECRET=votre-secret-jwt-tres-securise
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=votre-secret-refresh-tres-securise
JWT_REFRESH_EXPIRES_IN=7d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Google Maps
GOOGLE_MAPS_API_KEY=votre-cle-google-maps

# OpenAI
OPENAI_API_KEY=votre-cle-openai
OPENAI_MODEL=gpt-4

# AWS S3
AWS_ACCESS_KEY_ID=votre-access-key
AWS_SECRET_ACCESS_KEY=votre-secret-key
AWS_REGION=eu-west-3
AWS_S3_BUCKET=horeca-prospection-attachments

# Email
SENDGRID_API_KEY=votre-cle-sendgrid
EMAIL_FROM=noreply@horeca-prospection.com

# CORS
CORS_ORIGIN=http://localhost:3000

# Logs
LOG_LEVEL=debug
```

#### Frontend

Créez un fichier `.env` dans le dossier `frontend/` :

```env
REACT_APP_API_URL=http://localhost:3001/api/v1
REACT_APP_GOOGLE_MAPS_API_KEY=votre-cle-google-maps
```

### 4. Configuration de la base de données

#### Créer la base de données PostgreSQL

```bash
# Connexion à PostgreSQL
psql -U postgres

# Création de la base
CREATE DATABASE horeca_prospection;

# Activation de PostGIS
\c horeca_prospection
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

\q
```

#### Exécuter les migrations

```bash
cd backend
npm run migrate
```

#### Peupler la base avec des données de test

```bash
npm run seed
```

Cela créera 3 utilisateurs par défaut :
- **Admin** : admin@horeca-prospection.com / Admin123!
- **Manager** : manager@horeca-prospection.com / Manager123!
- **Rep** : rep@horeca-prospection.com / Rep123!

### 5. Démarrer l'application

#### Démarrer le backend

```bash
cd backend
npm run dev
```

L'API sera disponible sur `http://localhost:3001`

#### Démarrer le frontend

```bash
cd frontend
npm start
```

L'application web sera disponible sur `http://localhost:3000`

#### Démarrer le worker AI (optionnel)

```bash
cd backend
node -r ts-node/register src/workers/ai-enrichment.worker.ts
```

---

## Déploiement avec Docker

### 1. Préparation

Créez un fichier `.env` à la racine du projet :

```env
GOOGLE_MAPS_API_KEY=votre-cle-google-maps
OPENAI_API_KEY=votre-cle-openai
AWS_ACCESS_KEY_ID=votre-access-key
AWS_SECRET_ACCESS_KEY=votre-secret-key
AWS_REGION=eu-west-3
AWS_S3_BUCKET=horeca-prospection-attachments
SENDGRID_API_KEY=votre-cle-sendgrid
```

### 2. Lancer tous les services

```bash
docker-compose up -d
```

Cela va démarrer :
- PostgreSQL + PostGIS (port 5432)
- Redis (port 6379)
- Backend API (port 3001)
- Frontend React (port 3000)
- Worker AI

### 3. Initialiser la base de données

```bash
# Attendre que PostgreSQL soit prêt
docker-compose exec postgres pg_isready

# Exécuter les migrations
docker-compose exec backend npm run migrate

# Peupler avec des données de test
docker-compose exec backend npm run seed
```

### 4. Accéder à l'application

- **Frontend** : http://localhost:3000
- **API** : http://localhost:3001
- **Health check** : http://localhost:3001/health

---

## Configuration

### Configuration de Google Maps API

1. Accédez à [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez les APIs suivantes :
   - Geocoding API
   - Directions API
   - Places API
   - Maps JavaScript API
4. Créez une clé API dans "Credentials"
5. Ajoutez des restrictions d'API si nécessaire

### Configuration d'OpenAI

1. Accédez à [OpenAI Platform](https://platform.openai.com/)
2. Créez une clé API
3. Ajoutez-la dans `.env` : `OPENAI_API_KEY=sk-...`

### Configuration S3

1. Créez un bucket S3 sur AWS (ou OVH Object Storage)
2. Configurez les permissions CORS :

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
        "AllowedOrigins": ["http://localhost:3000", "https://votre-domaine.com"],
        "ExposeHeaders": ["ETag"]
    }
]
```

3. Créez un utilisateur IAM avec accès S3
4. Ajoutez les credentials dans `.env`

---

## Tests et vérification

### Tests Backend

```bash
cd backend
npm test
```

### Tests Frontend

```bash
cd frontend
npm test
```

### Vérification de l'API

```bash
# Health check
curl http://localhost:3001/health

# Test de login
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@horeca-prospection.com","password":"Admin123!"}'
```

### Vérification de la base de données

```bash
# Via Docker
docker-compose exec postgres psql -U postgres -d horeca_prospection -c "SELECT COUNT(*) FROM users;"

# En local
psql -U postgres -d horeca_prospection -c "SELECT COUNT(*) FROM users;"
```

---

## Déploiement en production

### 1. Variables d'environnement de production

**IMPORTANT** : Changez tous les secrets et clés !

```env
NODE_ENV=production
JWT_SECRET=un-secret-tres-long-et-tres-securise
JWT_REFRESH_SECRET=un-autre-secret-tres-long-et-securise
DATABASE_URL=postgresql://user:password@prod-host:5432/horeca_prospection
CORS_ORIGIN=https://votre-domaine.com
LOG_LEVEL=info
```

### 2. Build de production

#### Backend

```bash
cd backend
npm run build
npm start
```

#### Frontend

```bash
cd frontend
npm run build
```

Les fichiers statiques seront dans `frontend/build/`

### 3. Servir le frontend

Utilisez Nginx ou servez directement depuis le backend :

**Nginx** :

```nginx
server {
    listen 80;
    server_name votre-domaine.com;

    location / {
        root /var/www/horeca-prospection/frontend/build;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 4. HTTPS avec Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d votre-domaine.com
```

### 5. Process Manager (PM2)

```bash
npm install -g pm2

# Backend
cd backend
pm2 start npm --name "horeca-backend" -- start

# Worker
pm2 start src/workers/ai-enrichment.worker.ts --name "horeca-worker"

# Sauvegarde de la configuration
pm2 save
pm2 startup
```

---

## Dépannage

### Le backend ne démarre pas

```bash
# Vérifier les logs
docker-compose logs backend

# Vérifier que PostgreSQL est accessible
docker-compose exec backend npm run migrate

# Vérifier les variables d'environnement
docker-compose exec backend env | grep DB_
```

### Erreurs de connexion à la base de données

```bash
# Vérifier que PostgreSQL est démarré
docker-compose ps postgres

# Test de connexion
psql -h localhost -U postgres -d horeca_prospection
```

### Le frontend ne se connecte pas à l'API

1. Vérifiez `REACT_APP_API_URL` dans `.env`
2. Vérifiez CORS dans le backend
3. Ouvrez la console du navigateur pour les erreurs

### Le worker AI ne fonctionne pas

1. Vérifiez que Redis est démarré : `docker-compose ps redis`
2. Vérifiez la clé OpenAI : `echo $OPENAI_API_KEY`
3. Vérifiez les logs : `docker-compose logs worker`

---

## Support

Pour toute question ou problème :
- Documentation complète : `docs/`
- Issues GitHub : https://github.com/votre-org/horeca-prospection/issues
- Email : support@horeca-prospection.com

---

**HORECA Prospection © 2025**



