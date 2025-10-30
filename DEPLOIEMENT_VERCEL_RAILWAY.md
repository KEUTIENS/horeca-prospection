# 🚀 GUIDE DE DÉPLOIEMENT VERCEL + RAILWAY (GRATUIT)

## ✅ CODE POUSSÉ SUR GITHUB !

**Repository** : https://github.com/KEUTIENS/horeca-prospection

---

## 📋 ÉTAPES COMPLÈTES (15 MINUTES)

### **ÉTAPE 1 : DÉPLOYER LE BACKEND SUR RAILWAY (7 MIN)**

#### A. Créer un compte Railway

1. Va sur **https://railway.app**
2. Clique **"Login with GitHub"**
3. Connecte-toi avec ton compte GitHub : **KEUTIENS**
4. Autorise Railway à accéder à tes repos

#### B. Créer le projet

1. Clique **"New Project"**
2. Sélectionne **"Deploy from GitHub repo"**
3. Cherche et sélectionne **"horeca-prospection"**
4. Railway détecte automatiquement `docker-compose.yml` ✅

#### C. Configurer les services

Railway crée automatiquement ces services :
- ✅ `backend` (Node.js + Express)
- ✅ `postgres` (PostgreSQL + PostGIS)
- ✅ `redis` (Redis)
- ✅ `worker` (Worker AI)

**NE PAS déployer le service `frontend` sur Railway !**
→ Supprime-le ou désactive-le (on utilisera Vercel pour le frontend)

#### D. Variables d'environnement BACKEND

Clique sur le service **backend** → **Variables** → **Raw Editor**

Copie-colle ça :

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
JWT_SECRET=horeca_jwt_secret_super_long_minimum_32_caracteres_aleatoires_2025
JWT_REFRESH_SECRET=horeca_refresh_secret_aussi_super_long_minimum_32_caracteres_2025
CORS_ORIGIN=*
FRONTEND_URL=https://horeca-prospection.vercel.app
```

**Clique "Add"**

#### E. Générer le domaine public du backend

Dans le service **backend** → **Settings** → **Networking**
- Clique **"Generate Domain"**
- Railway génère : `https://xxx-production.up.railway.app`

**✅ COPIE CETTE URL** → Tu en auras besoin pour Vercel !

Exemple : `https://horeca-backend-production-abc123.up.railway.app`

#### F. Attendre le déploiement

Dans **Deployments**, attends que le statut soit **"Success"** (2-3 min)

---

### **ÉTAPE 2 : DÉPLOYER LE FRONTEND SUR VERCEL (5 MIN)**

#### A. Connecte-toi sur Vercel

1. Va sur **https://vercel.com**
2. Tu es déjà connecté ✅

#### B. Nouveau projet

1. Clique **"Add New..."** → **"Project"**
2. **Import Git Repository**
3. Actualise (F5) si tu ne vois pas le repo
4. Cherche **"horeca-prospection"**
5. Clique **"Import"**

#### C. Configuration du projet

**Framework Preset** : Sélectionne **"Create React App"**

**Root Directory** :
- Clique **"Edit"**
- Entre : `frontend`
- Clique **"Continue"**

**Build and Output Settings** (laisse par défaut) :
- Build Command : `npm run build`
- Output Directory : `build`
- Install Command : `npm install`

#### D. Variables d'environnement

Clique sur **"Environment Variables"** pour dérouler

**Ajoute cette variable :**

- **NAME** : `REACT_APP_API_URL`
- **VALUE** : `https://TON_URL_RAILWAY.up.railway.app/api/v1`

**⚠️ REMPLACE `TON_URL_RAILWAY.up.railway.app` par l'URL copiée à l'étape 1E !**

Exemple : `https://horeca-backend-production-abc123.up.railway.app/api/v1`

**Clique "Add"**

#### E. Déployer

**Clique sur le gros bouton bleu "Deploy"**

**Attends 2-4 minutes** ⏳

Vercel va :
- ✅ Cloner ton repo
- ✅ Installer les dépendances (`npm install`)
- ✅ Compiler React (`npm run build`)
- ✅ Déployer l'application

#### F. Récupérer l'URL

Une fois déployé, Vercel affiche :
```
🎉 Your project has been deployed!

https://horeca-prospection.vercel.app
```

**✅ TON APPLICATION EST EN LIGNE !**

---

### **ÉTAPE 3 : METTRE À JOUR LE CORS SUR RAILWAY (2 MIN)**

**Retourne sur Railway** → Service **backend** → **Variables**

**Modifie** :
```env
CORS_ORIGIN=https://horeca-prospection.vercel.app
FRONTEND_URL=https://horeca-prospection.vercel.app
```

**⚠️ Remplace par TON URL Vercel !**

**Clique "Update"**

Le backend redémarre automatiquement (30 sec)

---

### **ÉTAPE 4 : SEED LA BASE DE DONNÉES (2 MIN)**

**Dans Railway** → Service **backend** → **Deployments** → Dernier déploiement

Clique sur les **3 points** → **"View Logs"**

Vérifie que tu vois :
```
✅ Database migrations completed
✅ Database seeded successfully
```

**Si pas de seed automatique :**

Railway → Service **backend** → Clique les **3 points** → **"Run Command"**

```bash
npm run seed
```

---

### **ÉTAPE 5 : TESTER L'APPLICATION**

**Ouvre ton navigateur :**

```
https://horeca-prospection.vercel.app
```

**Login :**
```
Email    : admin@horeca-prospection.com
Password : Admin123!
```

**✅ Teste :**
- ✅ Login fonctionne
- ✅ Dashboard affiche les stats
- ✅ Liste des prospects (20 prospects de test)
- ✅ Carte interactive (Leaflet)
- ✅ Créer une nouvelle visite
- ✅ Planning des tournées

---

### **ÉTAPE 6 : CONNECTER TON DOMAINE OVH (OPTIONNEL - 5 MIN)**

#### A. Dans Vercel

1. Va dans **Settings** → **Domains**
2. **Add** : `app.tondomaine.com`
3. Vercel te donne :
   ```
   Type: CNAME
   Name: app
   Value: cname.vercel-dns.com
   ```

#### B. Dans Manager OVH

1. **Domaines** → Ton domaine → **Zone DNS**
2. **Ajouter une entrée**
3. **Type** : CNAME
4. **Sous-domaine** : `app`
5. **Cible** : `cname.vercel-dns.com`
6. **Enregistrer**

**Attends 1-24h (propagation DNS)**

**Accès final** : `https://app.tondomaine.com`

---

## 🎯 RÉSULTAT FINAL

### **URLs de ton application :**

```
Frontend : https://horeca-prospection.vercel.app (ou app.tondomaine.com)
Backend  : https://xxx-production.up.railway.app
Database : PostgreSQL sur Railway
Redis    : Redis sur Railway
```

### **Login :**

```
Email    : admin@horeca-prospection.com
Password : Admin123!
```

### **Utilisateurs de test :**

```
Manager :
Email    : manager@horeca-prospection.com
Password : Manager123!

Commercial :
Email    : commercial@horeca-prospection.com
Password : Commercial123!
```

---

## 💰 COÛTS

| Service | Prix | Limites |
|---------|------|---------|
| **Vercel** | ✅ GRATUIT | 100 GB bandwidth/mois |
| **Railway** | ✅ GRATUIT | 500h exécution/mois (~16h/jour) |
| **GitHub** | ✅ GRATUIT | Illimité repos publics |
| **TOTAL** | **0€** | ✅ |

**Si tu dépasses les limites gratuites :**
- Railway : 5$/mois pour illimité
- Vercel : 20$/mois pour Pro (mais Free suffit largement)

---

## 🔄 MISES À JOUR FUTURES

**Pour mettre à jour l'application :**

```powershell
cd C:\Users\FABIEN0.CUISIMAT-FABIEN\cursor\PROSPECT

# Modifier ton code...

git add .
git commit -m "Description des changements"
git push
```

**Vercel et Railway redéploient AUTOMATIQUEMENT !** 🎉

---

## 🐛 DÉPANNAGE

### **Erreur "Failed to connect to backend"**

→ Vérifie que `REACT_APP_API_URL` dans Vercel pointe vers la bonne URL Railway

### **Erreur CORS**

→ Vérifie que `CORS_ORIGIN` dans Railway contient l'URL Vercel

### **Base de données vide**

→ Relance le seed dans Railway : `npm run seed`

### **Backend crashe**

→ Railway → Backend → Logs : Vérifie les erreurs

---

## 🎉 FÉLICITATIONS !

**TON APPLICATION HORECA EST EN LIGNE À 110% !**

**Toutes les fonctionnalités :**
- ✅ Gestion prospects
- ✅ Rapports de visite
- ✅ Upload photos
- ✅ Planning tournées
- ✅ Carte interactive (Leaflet)
- ✅ Carte de chaleur
- ✅ Export PDF
- ✅ Statistiques
- ✅ Gestion utilisateurs
- ✅ Design Apple moderne

**PROFITE DE TON APPLICATION ! 🚀**

