# Guide de déploiement en Production

## ⚠️ CRITIQUES - À FAIRE AVANT LA MISE EN LIGNE

### 1. SAUVEGARDES AUTOMATIQUES DE LA BASE DE DONNÉES

#### Script de sauvegarde quotidienne
Créer un script `backup.sh` :

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/horeca"
mkdir -p $BACKUP_DIR

# Backup PostgreSQL
docker exec horeca-postgres pg_dump -U postgres horeca_prospection > $BACKUP_DIR/db_backup_$DATE.sql

# Garder seulement les 30 derniers jours
find $BACKUP_DIR -name "db_backup_*.sql" -mtime +30 -delete

echo "Backup créé: db_backup_$DATE.sql"
```

#### Ajouter au crontab (Linux/Mac)
```bash
# Backup tous les jours à 3h du matin
0 3 * * * /path/to/backup.sh
```

### 2. SÉCURITÉ - CHANGER LES MOTS DE PASSE

Créer un fichier `.env` à la racine du projet :

```env
# Base de données
POSTGRES_USER=horeca_prod
POSTGRES_PASSWORD=CHANGE_MOI_MAINTENANT_123!@#$%
POSTGRES_DB=horeca_prospection

# JWT Secrets (générer avec: openssl rand -base64 64)
JWT_SECRET=CHANGE_MOI_AVEC_OPENSSL_RAND_BASE64_64
JWT_REFRESH_SECRET=CHANGE_MOI_AUSSI_AVEC_OPENSSL_RAND_BASE64_64

# API Keys
GOOGLE_MAPS_API_KEY=ta_vraie_cle_google_maps
OPENAI_API_KEY=ta_vraie_cle_openai

# CORS (ton domaine de production)
CORS_ORIGIN=https://ton-domaine.com
```

### 3. DOCKER COMPOSE POUR LA PRODUCTION

Créer `docker-compose.prod.yml` :

```yaml
version: '3.8'

services:
  postgres:
    image: postgis/postgis:15-3.3-alpine
    container_name: horeca-postgres
    restart: always
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups  # Dossier pour les backups
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - horeca-network

  redis:
    image: redis:7-alpine
    container_name: horeca-redis
    restart: always
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "--raw", "incr", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - horeca-network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    container_name: horeca-backend
    restart: always
    environment:
      NODE_ENV: production
      PORT: 3001
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
      REDIS_HOST: redis
      REDIS_PORT: 6379
      REDIS_PASSWORD: ${REDIS_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
      JWT_REFRESH_SECRET: ${JWT_REFRESH_SECRET}
      CORS_ORIGIN: ${CORS_ORIGIN}
      GOOGLE_MAPS_API_KEY: ${GOOGLE_MAPS_API_KEY}
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - horeca-network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
      args:
        REACT_APP_API_URL: ${CORS_ORIGIN}/api/v1
        REACT_APP_GOOGLE_MAPS_API_KEY: ${GOOGLE_MAPS_API_KEY}
    container_name: horeca-frontend
    restart: always
    networks:
      - horeca-network

  worker:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    container_name: horeca-worker
    restart: always
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
      REDIS_HOST: redis
      REDIS_PORT: 6379
      REDIS_PASSWORD: ${REDIS_PASSWORD}
      OPENAI_API_KEY: ${OPENAI_API_KEY}
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    command: node dist/workers/ai-enrichment.worker.js
    networks:
      - horeca-network

  # Nginx reverse proxy
  nginx:
    image: nginx:alpine
    container_name: horeca-nginx
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - backend
      - frontend
    networks:
      - horeca-network

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local

networks:
  horeca-network:
    driver: bridge
```

### 4. DOCKERFILE PRODUCTION

#### Backend: `backend/Dockerfile.prod`
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
EXPOSE 3001
CMD ["node", "dist/index.js"]
```

#### Frontend: `frontend/Dockerfile.prod`
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG REACT_APP_API_URL
ARG REACT_APP_GOOGLE_MAPS_API_KEY
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_GOOGLE_MAPS_API_KEY=$REACT_APP_GOOGLE_MAPS_API_KEY
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx-frontend.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 5. RESTAURATION D'UN BACKUP

En cas de problème, restaurer les données :

```bash
# Restaurer depuis un backup
docker exec -i horeca-postgres psql -U postgres horeca_prospection < /path/to/backup.sql

# Ou depuis un conteneur arrêté
docker run -i --rm --network horeca-network \
  -v /path/to/backup.sql:/backup.sql \
  postgres:15-alpine \
  psql -h postgres -U postgres horeca_prospection < /backup.sql
```

## 📋 CHECKLIST AVANT MISE EN LIGNE

- [ ] Modifier tous les mots de passe dans `.env`
- [ ] Configurer HTTPS avec Let's Encrypt (Certbot)
- [ ] Configurer les sauvegardes automatiques
- [ ] Tester la restauration d'un backup
- [ ] Configurer les logs de production
- [ ] Activer le monitoring (CPU, RAM, Disque)
- [ ] Configurer les alertes email en cas de problème
- [ ] Documenter la procédure de déploiement
- [ ] Créer un utilisateur admin de production
- [ ] Supprimer les données de test

## 🔒 SÉCURITÉ RGPD

- Sauvegardes chiffrées
- Accès restreint à la base de données
- Logs anonymisés
- Politique de rétention des données (supprimer les anciennes visites après X années)

## 📞 SUPPORT

En cas de problème :
1. Vérifier les logs : `docker compose logs -f backend`
2. Vérifier l'état des conteneurs : `docker compose ps`
3. Restaurer un backup si nécessaire

