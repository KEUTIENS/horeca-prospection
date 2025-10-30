# Configuration Mapbox (ULTRA SIMPLE) 🗺️

## ⚡ Pourquoi Mapbox ?

✅ **1 seule clé API** (vs 4 pour Google Maps)  
✅ **Pas de carte bancaire requise**  
✅ **50,000 vues gratuites/mois** (vs 28,000 pour Google)  
✅ **Configuration en 2 minutes**  
✅ **Personnalisation illimitée**  

---

## 🚀 Configuration en 3 étapes

### Étape 1 : Créer un compte Mapbox (GRATUIT)

1. **Va sur** : https://account.mapbox.com/auth/signup/
2. **Crée un compte** avec ton email
3. **Valide ton email** (clique sur le lien reçu)
4. **C'est tout !** Pas besoin de carte bancaire

### Étape 2 : Copier ta clé API

1. Une fois connecté, tu arrives sur le tableau de bord
2. **Ta clé API est déjà affichée** en haut de la page !
3. Elle commence par `pk.` (exemple : `pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbG...`)
4. **Copie-la** (bouton "Copy" à côté)

### Étape 3 : Configurer l'application

#### A. Créer le fichier `.env`

**À la racine du projet** (à côté de `docker-compose.yml`), crée un fichier nommé `.env` :

**Sous Windows** :
- Clic droit → Nouveau → Document texte
- Nomme-le `.env` (avec le point !)
- Windows te dira "Le fichier pourrait devenir inutilisable" → Clique "Oui"

#### B. Ajouter ta clé

Ouvre le fichier `.env` avec Notepad et colle :

```env
MAPBOX_API_KEY=pk.COLLE_TA_CLE_ICI
OPENAI_API_KEY=
```

**⚠️ REMPLACE `pk.COLLE_TA_CLE_ICI` par ta vraie clé Mapbox !**

#### C. Redémarrer l'application

```powershell
docker compose restart frontend
```

**C'EST TOUT ! 🎉**

---

## 🎨 Styles de carte disponibles

Mapbox propose plusieurs styles prêts à l'emploi :

- `streets-v12` - **Style par défaut** (actuel)
- `outdoors-v12` - Randonnée, relief
- `light-v11` - Minimaliste clair
- `dark-v11` - Mode sombre
- `satellite-v9` - Vue satellite
- `satellite-streets-v12` - Satellite + routes

Pour changer le style, modifie la ligne dans `frontend/src/components/Map/MapboxMap.tsx` :

```typescript
style: 'mapbox://styles/mapbox/streets-v12',
// Remplace par un autre style
```

---

## 💰 Quota gratuit

### Ce qui est inclus GRATUITEMENT :

- **50,000 chargements de carte** / mois
- Pas de limite de temps
- Pas de watermark obligatoire
- Tous les styles de base
- Support par email

### Exemple d'utilisation :

- **10 utilisateurs** qui regardent la carte **10 fois/jour** = **3,000 vues/mois**
- Tu es **TRÈS LOIN du quota** ! 🚀

---

## ✅ Tester la carte

1. Va sur http://localhost:3030/map
2. Tu devrais voir une **belle carte interactive** avec tous tes prospects
3. Clique sur un marker pour voir les détails
4. Utilise les filtres (ville, type, statut)

---

## 🎯 Fonctionnalités de la carte

✅ **Markers colorés** par statut :
- 🟢 Vert = Converti
- 🔵 Bleu = En cours
- 🟠 Orange = À visiter
- 🔴 Rouge = Perdu

✅ **Pop-ups** avec informations détaillées
✅ **Navigation** : Zoom, déplacement, plein écran
✅ **Ajustement automatique** pour afficher tous les prospects
✅ **Clic sur marker** pour voir la fiche complète

---

## 🆘 Dépannage

### La carte n'apparaît pas ?

1. **Vérifie que le fichier `.env` existe** à la racine du projet
2. **Vérifie que ta clé commence par `pk.`**
3. **Redémarre Docker** : `docker compose restart frontend`
4. **Vide le cache du navigateur** : `Ctrl + Shift + R`
5. **Vérifie la console** (F12) pour voir les erreurs

### Message "Configuration de la clé API requise" ?

➡️ Ta clé n'est pas configurée ou le fichier `.env` est mal placé.

---

## 📊 Mapbox vs Google Maps

| Critère | Mapbox | Google Maps |
|---------|--------|-------------|
| Configuration | ⭐⭐⭐⭐⭐ 2 min | ⭐⭐ 15 min |
| Compte bancaire | ❌ Non requis | ✅ Requis |
| APIs à activer | 1 | 4 |
| Quota gratuit | 50,000/mois | 28,000/mois |
| Personnalisation | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| Performance | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Documentation | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

---

## 🔗 Liens utiles

- **Créer un compte** : https://account.mapbox.com/auth/signup/
- **Tableau de bord** : https://account.mapbox.com/
- **Documentation** : https://docs.mapbox.com/
- **Exemples** : https://docs.mapbox.com/mapbox-gl-js/example/

---

**Tu as une question ? Demande-moi !** 😊

