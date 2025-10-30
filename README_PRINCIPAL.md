# 🍽️ HORECA - Gestion de Prospection Commerciale

Application web complète pour gérer la prospection commerciale dans le secteur HORECA (Hôtels, Restaurants, Cafés).

## 🚀 Démarrage Rapide

### 1. Lancer l'application

**Double-cliquez sur** : `LANCER_HORECA.ps1`

OU en ligne de commande :
```powershell
docker compose up -d
```

### 2. Accéder à l'application

- **Application** : http://localhost:3030
- **API Backend** : http://localhost:3001

### 3. Se connecter

**Compte Administrateur** :
- Email : `admin@horeca-prospection.com`
- Mot de passe : `Admin123!`

**Compte Manager** :
- Email : `manager@horeca-prospection.com`
- Mot de passe : `Manager123!`

**Compte Commercial** :
- Email : `commercial@horeca-prospection.com`
- Mot de passe : `Commercial123!`

## 📋 Fonctionnalités

✅ **Gestion des prospects/clients**
- Créer, modifier, supprimer des prospects
- Filtrer par type, statut, ville
- Recherche avancée
- Géolocalisation automatique

✅ **Planning des tournées**
- Créer des tournées optimisées
- Calcul d'itinéraire automatique
- Estimation du temps de trajet

✅ **Rapports de visite**
- Enregistrer les visites
- Noter les prospects (1-5 étoiles)
- Historique complet

✅ **Carte interactive**
- Visualiser tous les prospects sur une carte
- Filtrer par type et statut
- Cliquer pour voir les détails

✅ **Statistiques**
- Taux de conversion
- Visites par mois
- Top prospects
- Performance des commerciaux

✅ **Gestion des utilisateurs** (Admin uniquement)
- Créer des comptes utilisateurs
- Gérer les rôles (Admin, Manager, Commercial)
- Activer/Désactiver des comptes

## 🗺️ Configuration Mapbox (Optionnel mais SIMPLE)

**Pour utiliser la carte interactive, configure une clé API Mapbox.**

➡️ **Voir le guide complet** : `CONFIG_MAPBOX.md`

**Configuration ULTRA RAPIDE (2 minutes)** :
1. Crée un compte gratuit sur https://account.mapbox.com/auth/signup/
2. Copie ta clé API (commence par `pk.`)
3. Crée un fichier `.env` à la racine :
   ```env
   MAPBOX_API_KEY=pk.ta_cle_ici
   ```
4. Redémarre : `docker compose restart frontend`

**Pourquoi Mapbox ?**
- ✅ Pas de carte bancaire requise
- ✅ 1 seule clé API (vs 4 pour Google)
- ✅ 50,000 vues gratuites/mois
- ✅ Configuration en 2 minutes

**Note** : L'application fonctionne parfaitement sans Mapbox. Seule la page "Carte" nécessite la clé API.

## 📁 Structure du Projet

```
PROSPECT/
├── backend/              # API Node.js + Express + TypeScript
├── frontend/             # Application React + TypeScript
├── docker-compose.yml    # Configuration Docker
├── LANCER_HORECA.ps1     # Script de démarrage
├── CONFIG_MAPBOX.md      # Guide configuration Mapbox
├── DEPLOIEMENT_PRODUCTION.md # Guide de mise en production
└── README_PRINCIPAL.md   # Ce fichier
```

## 🛠️ Technologies

- **Frontend** : React, TypeScript, React Router, Mapbox GL JS
- **Backend** : Node.js, Express, TypeScript
- **Base de données** : PostgreSQL + PostGIS
- **Cache** : Redis + BullMQ
- **Containerisation** : Docker + Docker Compose
- **Maps** : Mapbox (plus simple que Google Maps)
- **AI** : OpenAI API (optionnel)

## 📊 Données de Test

L'application contient 20 prospects de test :
- Hôtels (Ritz, George V, etc.)
- Restaurants (Tour d'Argent, L'Astrance, etc.)
- Écoles, Hôpitaux, Traiteurs
- Statuts variés : À visiter, En cours, Converti, Perdu

## 🔒 Sécurité & Sauvegardes

### Sauvegardes automatiques

**Créer un backup de la base de données** :
```powershell
docker exec horeca-postgres pg_dump -U postgres horeca_prospection > backup_$(Get-Date -Format "yyyyMMdd_HHmmss").sql
```

### Restaurer un backup
```powershell
docker exec -i horeca-postgres psql -U postgres horeca_prospection < backup.sql
```

### Les données sont persistantes !

✅ Tes données survivent à :
- Redémarrage de Docker
- Rebuild des conteneurs
- Mise à jour de l'application

❌ **Ne fais JAMAIS** : `docker compose down -v` (le `-v` supprime les données !)

## 🚀 Mise en Production

**Avant de mettre en ligne, consulte** : `DEPLOIEMENT_PRODUCTION.md`

Points critiques :
- ✅ Changer tous les mots de passe
- ✅ Configurer HTTPS avec Let's Encrypt
- ✅ Mettre en place des sauvegardes automatiques quotidiennes
- ✅ Configurer le domaine et le CORS
- ✅ Utiliser `docker-compose.prod.yml`

## 🆘 Commandes Utiles

### Démarrer l'application
```powershell
docker compose up -d
```

### Arrêter l'application
```powershell
docker compose down
```

### Voir les logs
```powershell
# Tous les services
docker compose logs -f

# Un service spécifique
docker compose logs -f frontend
docker compose logs -f backend
```

### Redémarrer un service
```powershell
docker compose restart frontend
docker compose restart backend
```

### Vérifier l'état
```powershell
docker compose ps
```

### Rebuild complet
```powershell
docker compose down
docker compose build --no-cache
docker compose up -d
```

## 📞 Support

En cas de problème :

1. **Vérifie les logs** : `docker compose logs -f`
2. **Vérifie que Docker est lancé** : Docker Desktop doit être ouvert
3. **Redémarre l'application** : `docker compose restart`
4. **En dernier recours** : Rebuild complet (commandes ci-dessus)

## 📝 Changelog

### Version Actuelle
- ✅ Gestion complète des prospects
- ✅ Planning et tournées
- ✅ Rapports de visite avec historique
- ✅ Carte interactive Mapbox (configuration ultra simple)
- ✅ Statistiques et tableaux de bord
- ✅ Gestion des utilisateurs (admin)
- ✅ Design moderne style Apple
- ✅ Responsive (mobile, tablette, desktop)
- ✅ Authentification JWT sécurisée
- ✅ Base de données persistante
- ✅ Migration de Google Maps vers Mapbox (plus simple, plus personnalisable)

## 📄 Licence

Propriétaire - HORECA Prospection

---

**Développé avec ❤️ pour optimiser ta prospection commerciale**

