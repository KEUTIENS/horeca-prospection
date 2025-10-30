# 🍽️ HORECA Prospection - Version PHP

## Application de Gestion Commerciale HORECA

**Version PHP + MySQL compatible hébergement web OVH classique**

---

## ✨ FONCTIONNALITÉS

### ✅ Gestion des Prospects
- Liste complète avec recherche et filtres
- Création, modification, suppression
- Détails complets (coordonnées, historique)
- Statuts : À visiter, En cours, Converti, Perdu
- Types : Hôtel, Restaurant, Traiteur, École, Hôpital

### ✅ Rapports de Visite
- Enregistrement rapide des visites
- Notation 1-5 étoiles
- Objectif, résumé, durée
- Historique complet par prospect
- Signature du contact

### ✅ Planning & Tournées
- Planification des tournées commerciales
- Liste des étapes
- Statuts : Planifiée, En cours, Terminée

### ✅ Statistiques & Analyses
- Dashboard avec KPIs en temps réel
- Graphiques dynamiques (Chart.js)
- Visites par mois
- Prospects par type et statut
- Top prospects avec meilleures notes

### ✅ Carte Interactive
- Visualisation sur carte (Leaflet + OpenStreetMap)
- Markers colorés par statut
- Pop-ups avec informations
- **Gratuit, pas de clé API nécessaire !**

### ✅ Gestion Utilisateurs (Admin)
- CRUD complet des utilisateurs
- 3 rôles : Admin, Manager, Commercial
- Activation/Désactivation
- Historique

### ✅ Design Moderne
- Style Apple.com
- Sidebar bleu marine (#1e293b)
- Responsive (mobile, tablette, PC)
- Interface épurée et professionnelle

---

## 💻 TECHNOLOGIES

- **Backend** : PHP 7.4+
- **Base de données** : MySQL 5.7+
- **Frontend** : HTML5, CSS3, JavaScript
- **Carte** : Leaflet + OpenStreetMap (gratuit !)
- **Graphiques** : Chart.js
- **Design** : CSS custom (style Apple)

---

## 📦 INSTALLATION

**Voir le fichier `INSTALLATION.md` pour le guide complet**

**Résumé :**
1. Créer base MySQL dans Manager OVH
2. Importer `install/schema.sql`
3. Configurer `config/database.php`
4. Uploader fichiers via FTP
5. Accéder à votre site

**Temps d'installation : 15 minutes**

---

## 🔐 COMPTES PAR DÉFAUT

```
Admin :
Email    : admin@horeca-prospection.com
Mot de passe : Admin123!

Manager :
Email    : manager@horeca-prospection.com
Mot de passe : Admin123!

Commercial :
Email    : commercial@horeca-prospection.com
Mot de passe : Admin123!
```

⚠️ **Changez ces mots de passe après installation !**

---

## 📂 STRUCTURE

```
horeca-php/
├── config/
│   ├── database.php (Configuration BDD)
│   └── config.php (Configuration générale)
├── includes/
│   ├── header.php
│   ├── sidebar.php
│   └── footer.php
├── css/
│   └── style.css (Design Apple)
├── js/
│   └── app.js
├── install/
│   └── schema.sql (Base de données)
├── index.php (Login)
├── dashboard.php
├── prospects.php
├── prospect-detail.php
├── new-prospect.php
├── edit-prospect.php
├── visits.php
├── new-visit.php
├── planning.php
├── stats.php
├── map.php
├── users.php
├── logout.php
├── INSTALLATION.md
└── README.md
```

---

## 🎯 COMPATIBILITÉ

**✅ Compatible avec :**
- Hébergement web OVH (Perso/Pro/Performance)
- PHP 7.4, 8.0, 8.1, 8.2
- MySQL 5.7, 8.0
- Tous les navigateurs modernes

**✅ Hébergements testés :**
- OVH Hébergement Web
- OVH Pro
- OVH Performance

---

## 🔒 SÉCURITÉ

- ✅ Mots de passe hashés (bcrypt)
- ✅ Protection injection SQL (PDO prepared statements)
- ✅ Sessions PHP sécurisées
- ✅ Protection XSS (échappement HTML)
- ✅ Contrôle d'accès par rôle (RBAC)

---

## 📊 DONNÉES INCLUSES

**15 prospects de test (Paris) :**
- Hôtel Le Grand Paris
- Restaurant La Tour Eiffel
- Traiteur Gourmet Plus
- École Internationale Paris
- Hôpital Pitié-Salpêtrière
- ...et 10 autres

**3 utilisateurs de test**

---

## 🎨 PERSONNALISATION

**Facile à personnaliser :**
- Couleurs : `css/style.css`
- Logo : `includes/sidebar.php`
- Nom app : `config/config.php`

---

## 📝 LICENCE

**Usage interne** - Application développée pour HORECA Prospection

---

## 🎉 VERSION

**Version** : 1.0 PHP  
**Date** : Octobre 2025  
**Statut** : Production ready  

---

## ✅ AVANTAGES VERSION PHP

- ✅ **0€ supplémentaire** (utilise hébergement OVH existant)
- ✅ **Upload FTP classique** (pas besoin de Docker, VPS, etc.)
- ✅ **Installation 15 minutes**
- ✅ **Fonctionne immédiatement**
- ✅ **Support PHP/MySQL** (technologie standard)
- ✅ **Pas de dépendances complexes**

---

**🚀 APPLICATION PRÊTE À L'EMPLOI !**

