# ⚡ DÉMARRAGE RAPIDE - 5 ÉTAPES (15 MIN)

## 🎯 APPLICATION HORECA PRÊTE EN 15 MINUTES !

---

## ✅ ÉTAPE 1 : BASE DE DONNÉES (3 MIN)

**Manager OVH → Bases de données → Créer**

```
Notez :
- Serveur : xxxxx.mysql.db
- Base : horeca_db
- User : xxxxx
- Password : xxxxx
```

**phpMyAdmin → Importer → `install/schema.sql` → Exécuter**

---

## ✅ ÉTAPE 2 : CONFIGURATION (2 MIN)

**Éditez `config/database.php` :**

```php
define('DB_HOST', 'xxxxx.mysql.db');  // ← Votre serveur
define('DB_NAME', 'horeca_db');        // ← Votre base
define('DB_USER', 'xxxxx');            // ← Votre user
define('DB_PASS', 'xxxxx');            // ← Votre password
```

**Sauvegardez !**

---

## ✅ ÉTAPE 3 : UPLOAD FTP (5 MIN)

**FileZilla :**

```
Hôte : ftp.votre-domaine.com
User : votre-login-ftp
Pass : votre-password-ftp
```

**Uploadez TOUT vers `/www/` ou `/public_html/`**

---

## ✅ ÉTAPE 4 : TEST (2 MIN)

**Ouvrez** : `http://votre-domaine.com`

**Connectez-vous :**
```
Email : admin@horeca-prospection.com
Password : Admin123!
```

**✅ Ça marche !**

---

## ✅ ÉTAPE 5 : SÉCURITÉ (3 MIN)

**1. Supprimez** `/install/` (via FTP)

**2. Changez le mot de passe admin**
- phpMyAdmin → Table `users`
- Ou : Utilisateurs → Modifier

---

## 🎉 FINI !

**Votre application est EN LIGNE !**

**Fonctionnalités disponibles :**
- ✅ 15 prospects de test
- ✅ Gestion complète
- ✅ Rapports de visite
- ✅ Planning tournées
- ✅ Statistiques
- ✅ Carte interactive
- ✅ 3 utilisateurs test

---

## 🆘 PROBLÈME ?

**Page blanche ?** → Vérifiez `config/database.php`

**Erreur connexion ?** → Logs PHP (Manager OVH)

**CSS bizarre ?** → Videz cache (Ctrl+F5)

---

## 📚 BESOIN DE PLUS DE DÉTAILS ?

👉 Lisez `INSTALLATION.md` (guide complet)

---

**🚀 BON DÉMARRAGE !**

