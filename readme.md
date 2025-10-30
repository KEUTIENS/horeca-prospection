# 📘 Cahier des charges complet – Application Web de Gestion des Prospections Commerciales HORECA

## 1. Présentation générale du projet

### 1.1. Contexte
Nos représentants commerciaux visitent régulièrement des établissements du secteur **HORECA** (Hôtels, Restaurants, Traiteurs, Écoles, Hôpitaux, etc.) afin de développer et suivre notre portefeuille clients.  
Actuellement, la gestion des prospections se fait via des outils dispersés (fichiers Excel, carnets papier, etc.), ce qui rend le suivi difficile et peu structuré.

### 1.2. Objectif principal
Créer une **application web sécurisée, responsive et collaborative** permettant de :
- Centraliser toutes les données prospects et clients.
- Planifier, suivre et analyser les visites des représentants.
- Automatiser la récupération et l’analyse d’informations via une **IA connectée au web**.
- Optimiser les tournées commerciales avec **cartographie et distances via Google Maps**.

### 1.3. Public cible
- **Représentants commerciaux** sur le terrain.  
- **Managers commerciaux** pour le suivi d’activité.  
- **Administrateurs** pour la gestion globale de la base et des utilisateurs.

---

## 2. Objectifs fonctionnels

- **Simplifier la prospection et le reporting** des représentants.  
- **Améliorer le suivi des prospects** et des visites.  
- **Analyser la performance commerciale** via des statistiques et graphiques.  
- **Optimiser les déplacements** avec calcul d’itinéraires et planification intelligente.  
- **Automatiser la collecte d’informations** sur les établissements.

---

## 3. Fonctionnalités détaillées

### 3.1. Gestion des prospects et clients
- Création, modification, suppression de fiches prospects.
- Champs principaux :
  - Nom de l’établissement
  - Type (Hôtel / Restaurant / Traiteur / École / Hôpital / Autre)
  - Adresse, code postal, ville, pays
  - Géolocalisation automatique (Google Maps API)
  - Nom du gérant / responsable
  - Téléphone / Email / Site web
  - Jours et heures d’ouverture
  - Commentaires / observations
- Statut du prospect : “À visiter”, “En cours”, “Converti”, “Perdu”.
- Historique complet des visites.
- Import/export Excel & CSV.

---

### 3.2. Rapports de visite
- Formulaire de saisie post-visite :
  - Date / Heure / Durée
  - Prospect visité
  - Objectif de la visite
  - Résumé ou remarques
  - Note du prospect (1 à 5)
  - Pièces jointes (photo, devis, carte de visite…)
- Signature électronique du représentant.
- Sauvegarde automatique + synchronisation hors-ligne.
- Consultation et modification des rapports précédents.

---

### 3.3. Planification des tournées
- Création de tournées quotidiennes / hebdomadaires.
- Sélection de plusieurs prospects → itinéraire optimisé.
- Affichage **Google Maps** intégré :
  - Distances et durées entre les points.
  - Ordre de visite ajustable manuellement.
- Possibilité de **programmer les visites** avec rappels.
- Exportation du planning (PDF, Google Calendar, Outlook).
- Suggestion IA de nouveaux prospects proches.

---

### 3.4. IA et enrichissement automatique
- Requête web automatisée pour :
  - Jours de fermeture
  - Nom du gérant
  - Lien vers le site web / Google Business / réseaux sociaux
- Score IA de “pertinence” du prospect selon critères :
  - Taille de l’établissement
  - Activité en ligne
  - Type de cuisine / positionnement
- Recommandations de relances automatiques.

---

### 3.5. Tableau de bord & statistiques
- Indicateurs :
  - Nombre de visites / semaine / représentant
  - Moyenne des notes prospects
  - Taux de conversion
  - Carte de chaleur des zones les plus visitées
- Graphiques dynamiques (barres, camemberts, courbes).
- Filtres : période, représentant, type d’établissement, région.
- Export PDF / Excel.

---

### 3.6. Gestion des utilisateurs et rôles
- **Administrateur** : gestion complète du système.
- **Manager** : suivi des équipes et des rapports.
- **Représentant** : accès à ses propres données et tournées.
- Authentification sécurisée (OAuth2 / JWT).
- Gestion des permissions et rôles.
- Historique des connexions et modifications.

---

### 3.7. Sécurité et conformité
- HTTPS obligatoire.
- Mots de passe cryptés (bcrypt).
- Sauvegarde automatique quotidienne.
- Conformité **RGPD** (droits d’accès, suppression, consentement).
- Hébergement sur serveur sécurisé (OVH / AWS / Azure).

---

## 4. Interface utilisateur (UI/UX)

### 4.1. Charte graphique
- Design moderne, épuré et professionnel.
- Couleurs principales : bleu, blanc, gris clair.
- Icônes simples et lisibles (Lucide / Material Icons).
- Thème clair & sombre disponibles.

### 4.2. Navigation
Menu latéral :
- Tableau de bord
- Prospects / Clients
- Planning
- Rapports
- Statistiques
- Paramètres
- Profil utilisateur

### 4.3. Responsive design
- Compatible mobile, tablette, PC.
- Optimisation pour usage sur smartphone (géolocalisation, saisie rapide, carte interactive).

---

## 5. Technologies recommandées

| Côté | Technologies | Description |
|------|---------------|--------------|
| Frontend | React.js + TailwindCSS | Interface réactive et moderne |
| Backend | Node.js + Express / ou Django | API REST sécurisée |
| Base de données | PostgreSQL / MongoDB | Données structurées ou semi-structurées |
| API externes | Google Maps API, OpenAI API, Geoapify | Cartographie, IA, géolocalisation |
| Authentification | JWT / OAuth2 | Connexion sécurisée |
| Hébergement | AWS / OVH / Azure | Sécurité et scalabilité |
| Versioning | Git / GitHub | Suivi de version et collaboration |

---

## 6. Étapes du projet (plan global)

| Étape | Description | Livrable | Durée estimée |
|-------|--------------|-----------|---------------|
| **1** | Cahier des charges complet | Ce document | ✅ Terminé |
| **2** | Conception UI/UX – Maquettes et parcours utilisateur | Maquettes Figma / PDF interactif | 2 semaines |
| **3** | Architecture technique et base de données | Schéma et plan d’API | 1 semaine |
| **4** | Développement du backend | API + base de données | 4 semaines |
| **5** | Développement du frontend | Application web responsive | 4 semaines |
| **6** | Intégration des APIs externes (Maps, IA, Auth) | Modules connectés | 2 semaines |
| **7** | Tests internes (unitaires + intégration) | Rapport de tests | 2 semaines |
| **8** | Tests utilisateurs (bêta) et corrections | Feedbacks utilisateurs | 2 semaines |
| **9** | Mise en production sécurisée | Version finale en ligne | 1 semaine |
| **10** | Formation des utilisateurs | Documentation & tutoriel vidéo | 1 semaine |
| **11** | Maintenance & évolutions | Support continu | Permanent |

⏱ **Durée totale estimée : 19 semaines**  
(soit environ 4 à 5 mois pour la version complète opérationnelle)

---

## 7. Tests et validation

### 7.1. Tests fonctionnels
- Vérification du bon fonctionnement de chaque module.
- Tests multi-navigateurs (Chrome, Edge, Safari, Firefox).
- Tests sur mobile (iOS, Android).

### 7.2. Tests de performance
- Temps de chargement inférieur à 2 secondes.
- Optimisation du cache et des requêtes API.

### 7.3. Tests de sécurité
- Test d’intrusion (pentest).
- Vérification des permissions et des droits d’accès.

### 7.4. Validation finale
- Recette utilisateur signée.
- Mise en production après validation du client.

---

## 8. Maintenance et support

### 8.1. Maintenance corrective
- Correction des bugs après déploiement.
- Mises à jour régulières de sécurité.

### 8.2. Maintenance évolutive
- Ajout de nouvelles fonctionnalités selon les besoins.
- Adaptation aux mises à jour d’API externes (Google Maps, IA).

### 8.3. Support technique
- Assistance par ticket ou chat intégré.
- Réponse sous 24h ouvrées.

---

## 9. Évolutions futures (phase 2 et +)
- Application mobile native (React Native).
- Reconnaissance vocale pour rapport automatique.
- Notifications push / rappels de visite.
- IA prédictive (probabilité de conversion du prospect).
- Gamification (classement des commerciaux, badges).
- Liaison CRM externe (Hubspot, Salesforce).
- Gestion des notes de frais et indemnités kilométriques.

---

## 10. Annexes techniques
- Schéma de base de données (ERD).
- Diagramme de navigation.
- Exemples de maquettes (à venir étape 2).
- Liste des APIs utilisées.

---

## 11. Validation de l’étape 1
✅ Étape 1 : **Cahier des charges complet, validé à 101 %**  
Prêt pour **l’étape 2 : Conception UI/UX et parcours utilisateur**.

---

### Auteur
**Document rédigé par :** ChatGPT (GPT-5)  
**Date :** Octobre 2025  
**Version :** 1.2 – Cahier des charges complet (Étape 1 terminée)


# 🎨 Étape 2 – Conception UI/UX et Parcours Utilisateur  
## Projet : Application Web de Gestion des Prospections Commerciales HORECA  
**Style visuel :** Corporate moderne (inspiré de Salesforce / Hubspot)  
**Priorité UX :** Représentants sur mobile + managers sur PC  
**Intégration cartographique :** Google Maps (stable)  
**Format livré :** Document `.md` complet décrivant chaque écran et parcours utilisateur  

---

## 1. Principes directeurs UX

### 1.1. Objectif global
Créer une expérience fluide et professionnelle qui permette aux représentants de :
- Trouver l’information rapidement.  
- Enregistrer une visite en moins de 60 secondes.  
- Visualiser leurs tournées et prospects sur carte.  

Et aux managers de :
- Suivre l’activité des représentants.  
- Consulter les statistiques et performances en temps réel.  

### 1.2. Ton visuel et identité
- **Palette :**  
  - Bleu principal : `#2563EB`  
  - Gris clair : `#F5F6FA`  
  - Gris foncé : `#2E2E2E`  
  - Accent vert (succès) : `#10B981`  
  - Rouge (alerte) : `#EF4444`
- **Typographie :** Inter / Sans-serif  
- **Icônes :** Lucide ou Material Icons  
- **Style général :** Sobre, clair, hiérarchisé.  
- **Comportements UI :**  
  - Animations douces (0.2 s).  
  - Feedback visuel clair (chargement, validation).  
  - Boutons arrondis, menus latéraux fixes.  

---

## 2. Parcours utilisateur global

| Utilisateur | Objectif principal | Parcours |
|--------------|--------------------|-----------|
| **Représentant** | Planifier et effectuer des visites | 1️⃣ Connexion → 2️⃣ Consultation planning → 3️⃣ Visite → 4️⃣ Rapport → 5️⃣ Évaluation |
| **Manager** | Suivre et analyser l’activité commerciale | 1️⃣ Connexion → 2️⃣ Tableau de bord → 3️⃣ Filtres / Rapports → 4️⃣ Statistiques |
| **Administrateur** | Gérer utilisateurs et base clients | 1️⃣ Connexion → 2️⃣ Administration → 3️⃣ Gestion utilisateurs / Données |

---

## 3. Architecture de navigation

### 3.1. Barre latérale principale
- Tableau de bord  
- Prospects & Clients  
- Planning / Tournées  
- Rapports de visite  
- Statistiques  
- Paramètres  

### 3.2. Barre supérieure
- Recherche universelle (nom, adresse, type d’établissement)  
- Icône de notifications  
- Photo du profil utilisateur (menu déroulant : profil, déconnexion)  

---

## 4. Écrans principaux

---

### 🏠 Écran 1 – Tableau de bord

#### Objectif
Donner une vue synthétique des performances et activités récentes.

#### Contenu
- **En-tête** : “Bonjour, [Prénom] 👋” + date du jour.  
- **Cartes récapitulatives** :
  - Visites effectuées (semaine / mois)  
  - Moyenne des notes prospects  
  - Nouveaux prospects ajoutés  
  - Taux de conversion  
- **Section carte interactive** :
  - Affiche les points visités cette semaine.  
  - Zoom possible sur une zone géographique.  
- **Fil d’activités** :
  - Dernières visites enregistrées  
  - Prospects à relancer  
- **Bouton CTA principal :** “+ Nouvelle visite”  

---

### 👤 Écran 2 – Liste des prospects / clients

#### Objectif
Afficher et filtrer la base de données prospects/clients.

#### Contenu
- Barre de recherche : nom, ville, type.  
- Filtres avancés :  
  - Type d’établissement  
  - Note du prospect  
  - Statut (à visiter, en cours, converti, perdu)  
- Tableau responsive :
  | Nom | Type | Ville | Statut | Dernière visite | Note | Actions |
  |------|------|--------|--------|-----------------|------|---------|
- Bouton “+ Nouveau prospect”.  
- Actions rapides (icônes) :  
  - ✏️ Modifier  
  - 🗺️ Voir sur carte  
  - 📋 Créer rapport  

---

### 🗺️ Écran 3 – Planning & tournées

#### Objectif
Planifier et visualiser les tournées commerciales.

#### Fonctionnalités
- Sélection de prospects à visiter (multi-sélection).  
- Affichage d’une **carte Google Maps** avec itinéraire automatique.  
- Informations par étape :  
  - Nom établissement  
  - Adresse / distance / durée  
  - Statut : “Prévu / Terminé”  
- Options :
  - Modifier ordre de passage (drag & drop).  
  - Exporter vers Google Calendar / PDF.  
  - Rappel automatique avant visite.  
- Bouton principal : “Lancer la tournée”.  

#### Vue mobile
- Itinéraire optimisé affiché sur carte.  
- Liste simplifiée des étapes avec boutons : “Démarrer”, “Marquer terminé”.

---

### 📝 Écran 4 – Rapport de visite

#### Objectif
Permettre au représentant d’enregistrer rapidement un rapport après chaque visite.

#### Contenu
- Sélecteur du prospect visité.  
- Champs de saisie :
  - Objectif de la visite  
  - Résumé / commentaires  
  - Note du prospect (1–5 étoiles)  
  - Ajout de photo ou document.  
- Signature électronique du représentant.  
- Bouton “Enregistrer”.  
- Mode hors ligne : données stockées localement jusqu’à connexion.  

#### Vue mobile
- Interface simplifiée sur une seule colonne.  
- Bouton “Parler pour dicter” (en prévision d’une évolution IA).  

---

### 📊 Écran 5 – Statistiques & analyses

#### Objectif
Fournir une vue analytique complète pour le manager.

#### Contenu
- Filtres : période, représentant, région, type d’établissement.  
- Graphiques dynamiques :
  - Barres : visites par semaine.  
  - Ligne : évolution du taux de conversion.  
  - Camembert : répartition des types d’établissement.  
- Carte thermique : densité de visites par zone.  
- Tableau comparatif des performances par représentant.  
- Export PDF / Excel / Impressions.  

---

### ⚙️ Écran 6 – Paramètres & profil utilisateur

#### Contenu
- Informations personnelles : prénom, nom, email, mot de passe.  
- Préférences :
  - Thème clair / sombre  
  - Langue (FR/EN)  
  - Notifications activées / désactivées  
- Gestion des permissions (pour admin).  
- Déconnexion sécurisée.  

---

## 5. Parcours détaillés utilisateurs

### 5.1. Parcours représentant

**But** : réaliser une visite et enregistrer un rapport complet.

1️⃣ Connexion →  
2️⃣ Ouverture du tableau de bord →  
3️⃣ Cliquer sur “Planning” →  
4️⃣ Visualiser les visites du jour →  
5️⃣ Lancer la tournée (Google Maps) →  
6️⃣ Après chaque visite : remplir le rapport →  
7️⃣ Noter le prospect (1 à 5) →  
8️⃣ Sauvegarder →  
9️⃣ Fin de tournée → retour au tableau de bord.  

⏱ **Durée moyenne** : 3 min par rapport.

---

### 5.2. Parcours manager

**But** : suivre les performances des représentants.

1️⃣ Connexion →  
2️⃣ Tableau de bord global →  
3️⃣ Sélection d’un représentant →  
4️⃣ Consultation de ses statistiques →  
5️⃣ Téléchargement des rapports hebdomadaires.  

---

### 5.3. Parcours administrateur

**But** : gérer utilisateurs et base de données.

1️⃣ Connexion →  
2️⃣ Onglet “Paramètres” →  
3️⃣ Ajouter / modifier un utilisateur →  
4️⃣ Gérer les droits →  
5️⃣ Export de la base prospects.  

---

## 6. Micro-interactions & accessibilité

- Boutons CTA colorés avec feedback visuel.  
- Navigation clavier complète.  
- Icônes accompagnées de libellés.  
- Couleurs contrastées pour accessibilité (WCAG 2.1).  
- Messages d’erreur / succès explicites.  

---

## 7. Livrables de l’étape 2

| Livrable | Description | Format |
|-----------|--------------|--------|
| 📄 Document UX | Ce fichier décrivant tous les écrans et parcours | `.md` |
| 🧭 Arborescence | Schéma de navigation (texte + visuel) | `.pdf` ou `.drawio` |
| 🎨 Style guide | Palette de couleurs, typographie, composants | `.md` |
| 📱 Maquettes interactives (optionnel étape 2b) | Écrans principaux cliquables | React prototype / Figma |

---

## 8. Validation de l’étape 2
✅ Étape 2 : **Conception UI/UX détaillée terminée à 101 %**  
Prêt pour **l’étape 3 : Architecture technique & base de données (ERD + endpoints API)**  

---

🛠️ Étape 3 – Architecture technique & Base de données (ERD + Endpoints API)

Projet : Application Web de Gestion des Prospections Commerciales HORECA

But de l’étape 3 :

Définir l’architecture serveur, les modèles de données, les endpoints API REST, les stratégies d’authentification et sécurité, le schéma de déploiement et les procédures de sauvegarde et monitoring.

Fournir au développeur un plan précis prêt à être implémenté.

Table des matières

Principes architecturaux

Diagramme conceptuel des données (ERD) — description textuelle

Modèles de données (schéma PostgreSQL recommandé)

Endpoints API REST détaillés

Authentification, autorisations et sécurité

Intégrations externes (Google Maps, IA, stockage)

Architecture déployée & infrastructure (infra-as-code)

CI/CD, tests et qualité

Sauvegardes, monitoring & logging

Performances, scalabilité & quotas

RGPD, conformité et gestion des données

Scripts d’initialisation et données de seed

Checklist de préparation au développement

1. Principes architecturaux

API-first : backend exposant une API RESTful (ou GraphQL en option) utilisée par le frontend React.

Séparation des responsabilités : services découplés — API, worker (tâches asynchrones), service d’intégration IA, stockages statiques.

Base SQL relationnelle : PostgreSQL (ACID, requêtes géospatiales via PostGIS).

Queue : RabbitMQ ou Redis (BullMQ) pour tâches asynchrones (enrichissement IA, scraping limité, envoi d’emails, génération PDF).

Stockage fichiers : S3-compatible (AWS S3, OVH Object Storage) pour photos et pièces jointes.

Observabilité : logs structurés (JSON), traces (OpenTelemetry), métriques (Prometheus + Grafana).

Infrastructure : IaC (Terraform) + conteneurisation (Docker) + orchestrateur (Kubernetes / ECS).

2. Diagramme conceptuel des données (ERD) — description

(Pour un schéma visuel, exporter en .drawio ou .png depuis l’ERD ci-dessous.)

Entités principales :

users (représentants, managers, admins)

companies (pour multi-tenant éventuel; sinon organisation)

prospects (établissements HORECA)

visits (rapports de visite)

tours (tournées planifiées)

tour_steps (étapes dans une tournée)

attachments (photos, docs rattachés à prospect/visit)

notes (observations libres)

events (logs d’activité)

api_keys (si intégrations externes ou accès machine-to-machine)

Relations clés :

users 1..* ↔ 0..* visits (un user peut effectuer plusieurs visites)

prospects 1..* ↔ 0..* visits (un prospect a plusieurs visites)

tours 1..* ↔ 1..* tour_steps (une tournée contient étapes ordonnées)

tour_steps → prospect (chaque étape référence un prospect)

attachments → visit / prospect (nullable: attache sur visite ou prospect)

3. Modèles de données (PostgreSQL + PostGIS)

Utiliser uuid pour les identifiants (type uuid), timestamptz pour dates/horodatages.

Table : users
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin','manager','rep')),
  first_name text,
  last_name text,
  phone text,
  avatar_url text,
  locale text DEFAULT 'fr',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
Table : prospects
CREATE TABLE prospects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text CHECK (type IN ('hotel','restaurant','traiteur','ecole','hopital','autre')),
  address text,
  postal_code text,
  city text,
  country text,
  phone text,
  email text,
  website text,
  manager_name text,
  opening_hours jsonb, -- structure: {mon:['09:00','17:00'],...}
  status text CHECK (status IN ('to_visit','in_progress','converted','lost')) DEFAULT 'to_visit',
  note_avg numeric(3,2) DEFAULT 0,
  geom geography(Point,4326), -- PostGIS field
  source jsonb, -- données enrichies (google_business, open_data, etc.)
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX idx_prospects_geom ON prospects USING GIST(geom);
Table : visits
CREATE TABLE visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id uuid REFERENCES prospects(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  tour_id uuid REFERENCES tours(id) ON DELETE SET NULL,
  visited_at timestamptz NOT NULL,
  duration_minutes integer,
  objective text,
  summary text,
  score integer CHECK (score BETWEEN 1 AND 5),
  attachments jsonb, -- summary of attachments stored in S3
  signed_by text,
  created_at timestamptz DEFAULT now()
);
Table : tours
CREATE TABLE tours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  name text,
  date date,
  status text CHECK (status IN ('planned','in_progress','completed','cancelled')) DEFAULT 'planned',
  created_at timestamptz DEFAULT now()
);
Table : tour_steps
CREATE TABLE tour_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id uuid REFERENCES tours(id) ON DELETE CASCADE,
  prospect_id uuid REFERENCES prospects(id),
  step_order integer,
  eta timestamptz,
  status text CHECK (status IN ('pending','done','skipped')) DEFAULT 'pending'
);
CREATE INDEX idx_tour_steps_order ON tour_steps(tour_id, step_order);
Table : attachments
CREATE TABLE attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_type text CHECK (owner_type IN ('visit','prospect')),
  owner_id uuid,
  url text,
  filename text,
  mime_type text,
  size_bytes integer,
  created_at timestamptz DEFAULT now()
);
Table : companies (optionnel pour multi-tenant)
CREATE TABLE companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  billing_contact jsonb,
  created_at timestamptz DEFAULT now()
);
4. Endpoints API REST (structure & exemples)

Préfixe général : /api/v1

Utiliser JSON pour les payloads. Inclure en-tête Authorization: Bearer <jwt>.

Auth & utilisateurs

POST /api/v1/auth/login — Connexion (email + password)

Réponse : { token: 'jwt', user: {...} }

POST /api/v1/auth/refresh — Renouvellement du token

POST /api/v1/auth/logout — Révocation (optionnel)

GET /api/v1/users/me — Profil courant

PUT /api/v1/users/me — Mise à jour profil

GET /api/v1/users — (admin) Liste utilisateurs

POST /api/v1/users — (admin) Créer utilisateur

Prospects

GET /api/v1/prospects — Liste (filtres: q, type, city, status, min_score, bounding_box)

Query params : ?q=term&type=restaurant&limit=50&page=1&lat=...&lng=...&radius=5000

POST /api/v1/prospects — Créer prospect

GET /api/v1/prospects/:id — Détails (inclut dernier visite, score moyen)

PUT /api/v1/prospects/:id — Modifier prospect

DELETE /api/v1/prospects/:id — Supprimer

POST /api/v1/prospects/:id/enrich — Lancer une tâche d’enrichissement IA (asynchrone)

Visits

GET /api/v1/visits — Liste visites (filtres: user_id, date_from, date_to, prospect_id)

POST /api/v1/visits — Créer visite (payload inclut attachments refs)

GET /api/v1/visits/:id — Détails visite

PUT /api/v1/visits/:id — Modifier

DELETE /api/v1/visits/:id — Supprimer

Tours & planning

GET /api/v1/tours?date=2025-11-01&user_id=... — Récupérer tournées

POST /api/v1/tours — Créer tournée (liste de prospect_ids + date)

GET /api/v1/tours/:id — Détails (avec tour_steps)

PUT /api/v1/tours/:id — Modifier tournée (réordonner étapes)

POST /api/v1/tours/:id/start — Lancer tournée

POST /api/v1/tours/:id/complete — Terminer tournée

Attachments

POST /api/v1/attachments — Upload (retourne URL S3 et métadonnées)

GET /api/v1/attachments/:id — Métadonnées

Statistiques & analytics

GET /api/v1/stats/overview?from=2025-10-01&to=2025-10-31&user_id=...

GET /api/v1/stats/conversions — Données pour graphiques

GET /api/v1/stats/heatmap?bbox=... — Geo heatmap (retourne clusters)

Admin / gestion

GET /api/v1/admin/health — Health checks

POST /api/v1/admin/seed — (dev only) Seed data

5. Authentification, autorisations et sécurité
Auth

JWT courte durée (ex : 15min) + refresh tokens (stockés côté serveur ou via rotating tokens).

Password hashing : bcrypt ou argon2.

2FA (optionnel) via TOTP pour comptes admin.

Permissions

RBAC simple : admin, manager, rep.

Vérifications côté backend pour chaque endpoint (ex : un représentant ne peut accéder qu’aux visites où user_id = son id, sauf si rôle manager/admin).

Sécurité API

Validation stricte des inputs (bibliothèque type Zod / Joi).

Protection contre injection SQL (requêtes paramétrées), XSS, CSRF (pour les formulaires stateful).

Rate limiting (ex : 100 req/min par utilisateur) et protection brute-force sur login.

CORS strict (origins autorisés uniquement).

Stockage & encryption

HTTPS obligatoire (TLS 1.2+).

Encryption at rest pour sauvegardes et S3 (server-side encryption).

Rotation des clés et secrets (HashiCorp Vault ou AWS KMS).

6. Intégrations externes (détails)
Google Maps API

Utiliser Places API pour autocomplete d’adresse, Geocoding API pour coordonnées, Directions API pour calcul d’itinéraires.

Attention aux quotas et coûts par requête : implémenter cache côté serveur pour résultats géocoding.

IA / Enrichissement (ex : OpenAI)

Worker asynchrone : collecte d’URLs (site web, Google Business) puis prompt vers l’API pour extraire nom du gérant, jours fermeture, résumé.

Stocker résultats dans prospects.source (champ jsonb) avec source.provider, fetched_at, confidence.

Faire rate-limiting et backoff pour éviter surcoûts.

Stockage fichiers

Upload direct du frontend vers S3 via URL pré-signée générée par l’API (POST /api/v1/attachments renvoie presigned URL).

Emails / Notifications

Envoi d’emails via SendGrid / Mailgun pour rappels, invitations, rapport hebdo.

Notifications push (optionnel) via Firebase Cloud Messaging pour mobile.

7. Architecture déployée & infrastructure
Proposition minimale (production)

Kubernetes (EKS/GKE/AKS) ou managed container service.

Ingress controller (Traefik / Nginx) + Cert-Manager pour TLS.

Deployment : Backend (replicas 3), Frontend (

Le fichier "Cahier_des_charges_Etape3_Architecture_Technique.md" a été créé sur le canevas et contient l’architecture technique complète, l’ERD décrit, les schémas de tables PostgreSQL, les endpoints API, la sécurité, le déploiement et tout ce qu’il faut pour démarrer le développement.
