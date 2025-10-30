# Architecture Technique - HORECA Prospection

## Vue d'ensemble

HORECA Prospection est une application web full-stack moderne conçue pour gérer les prospections commerciales dans le secteur HORECA (Hôtels, Restaurants, Traiteurs, Écoles, Hôpitaux).

### Stack technique

- **Frontend** : React 18 + TypeScript + TailwindCSS
- **Backend** : Node.js + Express + TypeScript
- **Base de données** : PostgreSQL 15 + PostGIS
- **Cache/Queue** : Redis + BullMQ
- **Stockage** : AWS S3 (ou compatible)
- **APIs externes** : Google Maps, OpenAI
- **Conteneurisation** : Docker + Docker Compose

---

## Architecture globale

```
┌─────────────────┐
│   Frontend      │
│   React + TS    │
│   Port 3000     │
└────────┬────────┘
         │
         │ HTTPS/REST
         │
┌────────▼────────┐      ┌──────────────┐
│   Backend API   │◄─────┤  Redis       │
│   Express + TS  │      │  (Queue)     │
│   Port 3001     │      └──────────────┘
└────────┬────────┘
         │
         │
┌────────▼────────┐      ┌──────────────┐
│   PostgreSQL    │      │  Worker AI   │
│   + PostGIS     │      │  (BullMQ)    │
└─────────────────┘      └──────────────┘
         │
         │
┌────────▼────────┐
│   AWS S3        │
│   (Fichiers)    │
└─────────────────┘
```

---

## Backend

### Structure des dossiers

```
backend/
├── src/
│   ├── controllers/       # Logique métier par ressource
│   │   ├── auth.controller.ts
│   │   ├── prospect.controller.ts
│   │   ├── visit.controller.ts
│   │   ├── tour.controller.ts
│   │   ├── user.controller.ts
│   │   └── stats.controller.ts
│   ├── db/               # Base de données
│   │   ├── connection.ts # Pool PostgreSQL
│   │   ├── migrate.ts    # Script de migration
│   │   ├── seed.ts       # Données de test
│   │   └── schema.sql    # Schéma complet
│   ├── middlewares/      # Middlewares Express
│   │   ├── auth.ts       # Authentification JWT
│   │   ├── error-handler.ts
│   │   ├── not-found.ts
│   │   └── validate.ts   # Validation Zod
│   ├── models/           # Modèles de données
│   │   ├── user.model.ts
│   │   ├── prospect.model.ts
│   │   ├── visit.model.ts
│   │   └── tour.model.ts
│   ├── routes/           # Définition des routes
│   │   ├── index.ts
│   │   ├── auth.routes.ts
│   │   ├── prospect.routes.ts
│   │   ├── visit.routes.ts
│   │   ├── tour.routes.ts
│   │   ├── user.routes.ts
│   │   └── stats.routes.ts
│   ├── services/         # Services externes
│   │   ├── google-maps.service.ts
│   │   └── s3.service.ts
│   ├── types/            # Types TypeScript
│   │   └── index.ts
│   ├── utils/            # Utilitaires
│   │   └── logger.ts     # Logger Pino
│   ├── workers/          # Workers asynchrones
│   │   └── ai-enrichment.worker.ts
│   └── index.ts          # Point d'entrée
├── package.json
├── tsconfig.json
└── .env.example
```

### API REST

Toutes les routes sont préfixées par `/api/v1`

#### Authentification

- `POST /auth/login` - Connexion
- `POST /auth/refresh` - Renouvellement token
- `POST /auth/logout` - Déconnexion
- `GET /auth/me` - Profil utilisateur
- `PUT /auth/me` - Mise à jour profil
- `POST /auth/change-password` - Changement mot de passe

#### Prospects

- `GET /prospects` - Liste (filtres : q, type, status, city, lat, lng, radius)
- `GET /prospects/nearby` - Prospects à proximité
- `GET /prospects/:id` - Détails + historique visites
- `POST /prospects` - Créer
- `PUT /prospects/:id` - Modifier
- `DELETE /prospects/:id` - Supprimer
- `POST /prospects/:id/enrich` - Enrichir via IA

#### Visites

- `GET /visits` - Liste (filtres : prospectId, userId, dateFrom, dateTo)
- `GET /visits/stats` - Statistiques
- `GET /visits/:id` - Détails
- `POST /visits` - Créer
- `PUT /visits/:id` - Modifier
- `DELETE /visits/:id` - Supprimer

#### Tournées

- `GET /tours` - Liste (filtres : userId, date, status)
- `GET /tours/:id` - Détails + étapes
- `POST /tours` - Créer
- `PUT /tours/:id` - Modifier
- `DELETE /tours/:id` - Supprimer
- `POST /tours/:id/start` - Démarrer
- `POST /tours/:id/complete` - Terminer
- `PUT /tours/:id/steps/:stepId` - Modifier étape

#### Statistiques

- `GET /stats/overview` - Vue d'ensemble
- `GET /stats/conversions` - Taux de conversion
- `GET /stats/heatmap` - Carte de chaleur
- `GET /stats/by-user` - Par représentant

#### Utilisateurs (Admin uniquement)

- `GET /users` - Liste
- `GET /users/:id` - Détails
- `POST /users` - Créer
- `PUT /users/:id` - Modifier
- `DELETE /users/:id` - Supprimer

### Authentification

**JWT avec refresh tokens**

- Access Token : 15 minutes (courte durée)
- Refresh Token : 7 jours (stocké en base)
- Les tokens sont révoqués lors de la déconnexion

**Rôles** :
- `admin` : Accès complet
- `manager` : Lecture tous utilisateurs, modification équipe
- `rep` : Lecture/écriture ses propres données uniquement

### Base de données

**Tables principales** :
- `companies` : Organisations multi-tenant
- `users` : Utilisateurs (admin, manager, rep)
- `prospects` : Établissements HORECA
- `visits` : Rapports de visite
- `tours` : Tournées planifiées
- `tour_steps` : Étapes des tournées
- `attachments` : Fichiers joints
- `notes` : Notes libres
- `events` : Logs d'audit
- `refresh_tokens` : Tokens de session

**Extensions PostgreSQL** :
- `uuid-ossp` : Génération d'UUIDs
- `pgcrypto` : Chiffrement
- `postgis` : Données géospatiales

**Indices** :
- Index GIST sur `prospects.geom` pour recherche spatiale
- Index B-tree sur clés étrangères
- Index sur champs filtrables (status, type, date, etc.)

### Worker IA

**Technologie** : BullMQ (file d'attente Redis)

**Fonctionnement** :
1. Un job d'enrichissement est ajouté à la queue
2. Le worker récupère le job
3. Appel à OpenAI avec les données du prospect
4. Extraction des informations (gérant, horaires, spécialités)
5. Mise à jour du prospect en base
6. Calcul d'un score de pertinence (0-10)

**Rate limiting** : 10 requêtes/minute vers OpenAI

---

## Frontend

### Structure des dossiers

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   └── Layout/
│   │       ├── Layout.tsx
│   │       ├── Sidebar.tsx
│   │       └── Header.tsx
│   ├── config/
│   │   └── api.ts         # Configuration Axios
│   ├── context/
│   │   └── AuthContext.tsx # Gestion auth
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Prospects.tsx
│   │   ├── Planning.tsx
│   │   ├── Reports.tsx
│   │   ├── Stats.tsx
│   │   └── Settings.tsx
│   ├── types/
│   │   └── index.ts       # Types TypeScript
│   ├── App.tsx            # Routing
│   ├── index.tsx
│   └── index.css          # Styles Tailwind
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

### Routing

**React Router v6**

Routes protégées par le composant `PrivateRoute` qui vérifie l'authentification.

### État global

**Context API** pour l'authentification :
- `AuthContext` : user, login, logout, updateUser
- Stockage des tokens dans `localStorage`
- Refresh automatique des tokens expirés

### API Client

**Axios** avec interceptors :
- Ajout automatique du token Bearer
- Gestion du refresh token sur 401
- Redirection vers login si refresh échoue

### Composants

**Principaux composants** :
- `Layout` : Structure globale (sidebar + header + main)
- `Sidebar` : Navigation principale
- `Header` : Barre de recherche et notifications

**Pages** :
- `Dashboard` : Vue d'ensemble avec KPIs
- `Prospects` : Liste et gestion des prospects
- `Planning` : Tournées et calendrier
- `Reports` : Historique des visites
- `Stats` : Graphiques et analytics
- `Settings` : Paramètres utilisateur

### Styles

**TailwindCSS** avec classes personnalisées :
- `.btn`, `.btn-primary`, `.btn-secondary`
- `.input`, `.card`, `.badge`
- Palette de couleurs cohérente

---

## Sécurité

### Backend

1. **Authentification** : JWT avec secrets robustes
2. **Autorisation** : Vérification des rôles sur chaque endpoint
3. **Validation** : Zod pour tous les inputs
4. **Rate limiting** : 100 requêtes/minute par IP
5. **CORS** : Origines autorisées uniquement
6. **Helmet.js** : Headers de sécurité HTTP
7. **Bcrypt** : Hashing des mots de passe (10 rounds)
8. **SQL** : Requêtes paramétrées (protection injection)

### Frontend

1. **XSS** : React échappe automatiquement
2. **HTTPS** : Obligatoire en production
3. **Tokens** : Stockés dans localStorage (alternative : cookies httpOnly)
4. **Validation** : Formulaires validés côté client et serveur

### Base de données

1. **Encryption at rest** : Activer sur PostgreSQL
2. **Sauvegardes** : Quotidiennes automatiques
3. **Accès** : Limité par firewall
4. **Rotation** : Mots de passe changés régulièrement

---

## Performance

### Backend

- **Connection pooling** : PostgreSQL (max 20 connexions)
- **Indices** : Sur tous les champs filtrés
- **Cache** : Redis pour sessions et queue
- **Logging** : Pino (JSON structuré, haute performance)

### Frontend

- **Code splitting** : React lazy loading
- **Minification** : Production build optimisé
- **Caching** : Service Worker (à implémenter)
- **CDN** : Recommandé pour les assets statiques

### Base de données

- **PostGIS** : Indices GIST pour requêtes spatiales O(log n)
- **Triggers** : Mise à jour automatique des statistiques
- **Vacuum** : Maintenance régulière PostgreSQL

---

## Monitoring & Logs

### Logs

**Pino** (backend) :
- Format JSON structuré
- Niveaux : debug, info, warn, error
- Rotation quotidienne recommandée
- Agrégation : ELK Stack ou Datadog

### Métriques

**À implémenter** :
- Prometheus pour métriques serveur
- Grafana pour dashboards
- Alertes sur erreurs critiques

### Health checks

- `GET /health` : Status API
- Vérification connexions DB et Redis
- Uptime monitoring recommandé (UptimeRobot, Pingdom)

---

## Scalabilité

### Horizontal scaling

- Backend : Stateless, peut être répliqué
- Load balancer : Nginx ou AWS ALB
- Sessions : Stockées dans Redis (partagé)

### Vertical scaling

- PostgreSQL : Augmenter RAM et CPU
- Index optimization : EXPLAIN ANALYZE
- Connection pooling : PgBouncer

### CDN

- Fichiers statiques frontend
- Images et documents S3
- CloudFlare ou AWS CloudFront

---

## CI/CD

**Recommandations** :

1. **GitHub Actions** :
   - Tests automatiques sur PR
   - Build Docker images
   - Deploy sur merge to main

2. **Tests** :
   - Backend : Jest + Supertest
   - Frontend : React Testing Library
   - E2E : Cypress ou Playwright

3. **Environnements** :
   - Dev : docker-compose local
   - Staging : Clone de production
   - Production : Kubernetes ou ECS

---

## Backups

### Base de données

```bash
# Backup
pg_dump -h localhost -U postgres horeca_prospection > backup.sql

# Restore
psql -h localhost -U postgres horeca_prospection < backup.sql
```

**Automatisation** : Cron job quotidien + retention 30 jours

### Fichiers S3

- Versioning activé sur le bucket
- Lifecycle policy pour archivage

---

## Conformité RGPD

1. **Consentement** : Acceptation CGU/RGPD
2. **Accès** : Export des données utilisateur
3. **Suppression** : Hard delete ou anonymisation
4. **Sécurité** : Encryption, accès limité
5. **Audit** : Table `events` pour traçabilité

---

**HORECA Prospection © 2025**



