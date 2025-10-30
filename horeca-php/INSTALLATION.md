# 📦 GUIDE D'INSTALLATION - HORECA Prospection (Version PHP)

## ✅ APPLICATION 100% COMPATIBLE HÉBERGEMENT OVH CLASSIQUE

---

## 📋 PRÉ-REQUIS

**Sur votre hébergement OVH, vous devez avoir :**
- ✅ PHP 7.4 ou supérieur
- ✅ MySQL 5.7 ou supérieur
- ✅ Accès FTP (FileZilla)
- ✅ Accès phpMyAdmin (création base de données)

---

## 🚀 INSTALLATION (15 MINUTES)

### **ÉTAPE 1 : CRÉER LA BASE DE DONNÉES (3 MIN)**

1. **Connectez-vous à votre Manager OVH**
2. **Hébergement web** → Votre hébergement → **Bases de données**
3. **Créer une base de données**
   - Type : MySQL
   - Version : 5.7 ou supérieur
   - Nom : `horeca_db` (ou autre)
   - Créer

4. **Notez les informations** :
   ```
   Serveur : xxxxx.mysql.db (ex: mysql5-21.pro)
   Base : horeca_db
   Utilisateur : xxxxx
   Mot de passe : xxxxx
   ```

---

### **ÉTAPE 2 : IMPORTER LE SCHÉMA SQL (2 MIN)**

1. **Accédez à phpMyAdmin** (depuis Manager OVH)
2. Sélectionnez votre base `horeca_db`
3. **Onglet "Importer"**
4. **Choisir un fichier** → Sélectionnez `install/schema.sql`
5. **Exécuter**
6. ✅ Vous devez voir 7 tables créées + 18 prospects de test

---

### **ÉTAPE 3 : CONFIGURER LA BASE DE DONNÉES (2 MIN)**

1. **Ouvrez le fichier `config/database.php`** avec un éditeur de texte
2. **Remplacez les valeurs** :

```php
define('DB_HOST', 'xxxxx.mysql.db');    // Votre serveur MySQL OVH
define('DB_NAME', 'horeca_db');          // Nom de votre base
define('DB_USER', 'xxxxx');              // Votre utilisateur MySQL
define('DB_PASS', 'xxxxx');              // Votre mot de passe MySQL
```

3. **Enregistrez** le fichier

---

### **ÉTAPE 4 : UPLOADER LES FICHIERS (5 MIN)**

**Avec FileZilla :**

1. **Ouvrez FileZilla**
2. **Connexion :**
   - Hôte : `ftp.votre-domaine.com` (ou IP FTP OVH)
   - Utilisateur : Votre login FTP OVH
   - Mot de passe : Votre mot de passe FTP
   - Port : 21

3. **Naviguer vers `/www/` ou `/public_html/`**

4. **Uploader TOUS les fichiers** :
   ```
   ├── config/
   ├── includes/
   ├── css/
   ├── js/
   ├── install/
   ├── index.php
   ├── dashboard.php
   ├── prospects.php
   ├── (tous les autres fichiers .php)
   ```

5. **Attendre la fin du transfert**

---

### **ÉTAPE 5 : TESTER L'APPLICATION (2 MIN)**

1. **Ouvrez votre navigateur**
2. **Allez sur** : `http://votre-domaine.com`
3. **Page de login s'affiche** ✅

**Connexion avec les comptes de test :**

```
Administrateur :
Email    : admin@horeca-prospection.com
Mot de passe : Admin123!

Manager :
Email    : manager@horeca-prospection.com
Mot de passe : Admin123!

Commercial :
Email    : commercial@horeca-prospection.com
Mot de passe : Admin123!
```

4. **Testez les fonctionnalités** :
   - ✅ Dashboard
   - ✅ Liste prospects (15 prospects de test)
   - ✅ Créer un prospect
   - ✅ Créer une visite
   - ✅ Carte interactive
   - ✅ Statistiques

---

## 🔒 SÉCURITÉ (IMPORTANT !)

### **1. Supprimer le dossier d'installation**

```bash
# Via FTP, supprimez le dossier :
/install/
```

### **2. Changer les mots de passe par défaut**

**Via phpMyAdmin :**

```sql
-- Générer un nouveau hash de mot de passe (utiliser un outil bcrypt en ligne)
-- Puis exécuter :
UPDATE users SET password = 'NOUVEAU_HASH_BCRYPT' WHERE email = 'admin@horeca-prospection.com';
```

**Ou via l'interface web :**
- Connectez-vous en admin
- Utilisateurs → Modifier → Changez le mot de passe

### **3. Permissions des fichiers**

**Recommandé :**
- Fichiers PHP : `644`
- Dossiers : `755`
- `config/database.php` : `600` (si possible)

---

## 🎨 PERSONNALISATION

### **Modifier le nom de l'application**

**Fichier : `config/config.php`**

```php
define('SITE_NAME', 'HORECA Prospection'); // Changez ici
define('SITE_URL', 'http://votre-domaine.com'); // Votre URL
```

### **Changer le logo**

**Fichier : `includes/sidebar.php`**

Remplacez "HORECA" par votre logo ou nom

### **Modifier les couleurs**

**Fichier : `css/style.css`**

Couleur principale actuelle : `#2563EB` (bleu)
Cherchez et remplacez par votre couleur

---

## 🐛 DÉPANNAGE

### **Erreur "Connexion à la base refusée"**

✅ Vérifiez `config/database.php` :
- Host correct ?
- Nom base correct ?
- User/Password corrects ?

### **Page blanche**

✅ Activez l'affichage des erreurs PHP :

**Créez un fichier `.htaccess` à la racine :**

```apache
php_flag display_errors on
php_value error_reporting E_ALL
```

### **Erreurs 500**

✅ Vérifiez les logs d'erreur PHP (Manager OVH → Logs)

### **CSS ne s'affiche pas**

✅ Videz le cache de votre navigateur (Ctrl+F5)

---

## 📊 DONNÉES DE TEST

**L'application est livrée avec :**
- ✅ 3 utilisateurs de test (admin, manager, commercial)
- ✅ 15 prospects de test (Paris)
- ✅ Tous avec mot de passe : `Admin123!`

**Pour ajouter vos propres données :**
1. Connectez-vous
2. Prospects → Nouveau prospect
3. Remplissez le formulaire

---

## 🔄 SAUVEGARDE

### **Base de données**

**Via phpMyAdmin :**
1. Sélectionnez votre base
2. Onglet **"Exporter"**
3. Format : SQL
4. **Exécuter**
5. Téléchargez le fichier `.sql`

**Faites des sauvegardes régulières !**

### **Fichiers**

**Via FTP :**
- Téléchargez tout le dossier `/www/` régulièrement

---

## ✅ CHECKLIST POST-INSTALLATION

- [ ] Base de données créée et importée
- [ ] `config/database.php` configuré
- [ ] Fichiers uploadés sur FTP
- [ ] Login fonctionne
- [ ] Prospects affichés
- [ ] Dossier `/install/` supprimé
- [ ] Mots de passe par défaut changés
- [ ] Première sauvegarde effectuée

---

## 🎉 FÉLICITATIONS !

**Votre application HORECA Prospection est en ligne !**

**URL : `http://votre-domaine.com`**

**Support : Consultez ce fichier en cas de problème**

---

## 📞 CONTACT

Pour toute question sur l'installation, vérifiez :
1. Ce guide d'installation
2. Les permissions des fichiers
3. Les logs PHP (Manager OVH)

**Version :** 1.0 PHP  
**Date :** Octobre 2025  
**Compatible :** Hébergement web OVH classique (Perso/Pro/Performance)

