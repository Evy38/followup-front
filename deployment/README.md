# 📦 Documentation de Déploiement - FollowUp Front

## 🎯 Vue d'ensemble

Cette documentation décrit la procédure complète de déploiement de l'application Angular FollowUp Front.

---

## 🏗️ Architecture de déploiement

┌─────────────────┐
│   Développeur   │
└────────┬────────┘
│ git push
↓
┌─────────────────┐
│  GitHub Actions │ ← CI/CD Pipeline
└────────┬────────┘
│
├─→ [Test] Environnement SIT (System Integration Testing)
│
├─→ [UAT] Environnement UAT (User Acceptance Testing)
│
└─→ [PROD] Environnement Production (après validation manuelle)

# 📦 Documentation de Déploiement - FollowUp Front

## 🎯 Vue d'ensemble

Cette documentation décrit la procédure complète de déploiement de l'application Angular FollowUp Front.

---

## 🏗️ Architecture de déploiement
```
┌─────────────────┐
│   Développeur   │
└────────┬────────┘
         │ git push
         ↓
┌─────────────────┐
│  GitHub Actions │ ← CI/CD Pipeline
└────────┬────────┘
         │
         ├─→ [Test] Environnement SIT (System Integration Testing)
         │
         ├─→ [UAT] Environnement UAT (User Acceptance Testing)
         │
         └─→ [PROD] Environnement Production (après validation manuelle)
```

---

## 📋 Prérequis pour le déploiement

### Prérequis techniques
- Node.js 20.x ou supérieur
- npm 9.x ou supérieur
- Accès au serveur de production (SSH ou plateforme cloud)
- Variables d'environnement configurées

### Prérequis de sécurité
- Certificat SSL/TLS valide
- Secrets GitHub configurés
- Authentification API backend en place

---

## 🔧 Variables d'environnement requises

| Variable          | Description                    | Environnement |
|-------------------|--------------------------------|---------------|
| `API_URL`         | URL de l'API backend          | Tous          |
| `BASE_URL`        | URL de base de l'application  | Tous          |
| `OAUTH_BASE`      | URL du service OAuth          | Tous          |
| `NODE_ENV`        | Environnement (dev/prod)      | Tous          |

---

## 🚀 Procédure de déploiement

### Étape 1 : Build de production
```bash
# Installer les dépendances
npm ci

# Build optimisé pour la production
npm run build -- --configuration production

# Vérifier le build
ls -lh dist/followup-front/browser
```

### Étape 2 : Tests pré-déploiement
```bash
# Tests unitaires
npm run test:ci

# Vérification de la qualité du code (si configuré)
npm run lint
```

### Étape 3 : Préparation des artefacts

Les fichiers de production se trouvent dans :
```
dist/followup-front/browser/
├── index.html
├── main-*.js
├── polyfills-*.js
├── styles-*.css
└── assets/
```

### Étape 4 : Déploiement sur l'environnement cible

#### Option A : Serveur Web classique (nginx, Apache)
```bash
# Copier les fichiers vers le serveur
scp -r dist/followup-front/browser/* user@server:/var/www/followup-front/

# Redémarrer le serveur web (si nécessaire)
ssh user@server "sudo systemctl reload nginx"
```

#### Option B : Plateforme cloud (Netlify, Vercel, Firebase)
```bash
# Exemple pour Netlify
netlify deploy --prod --dir=dist/followup-front/browser

# Exemple pour Firebase
firebase deploy --only hosting
```

#### Option C : Conteneur Docker
```bash
# Build de l'image Docker
docker build -t followup-front:latest .

# Push vers un registry
docker push registry.example.com/followup-front:latest

# Déployer sur le serveur
docker-compose up -d
```

---

## ✅ Tests post-déploiement

1. **Vérification de santé** :
   - Accéder à `https://votre-domaine.com`
   - Vérifier que la page d'accueil se charge

2. **Tests fonctionnels** :
   - Connexion utilisateur
   - Navigation entre les pages
   - Appels API backend

3. **Tests de performance** :
   - Lighthouse score > 90
   - Temps de chargement < 3 secondes

---

## 🔄 Rollback en cas de problème

### Procédure de retour arrière
```bash
# Si déploiement sur serveur web
ssh user@server "cp -r /var/www/followup-front-backup/* /var/www/followup-front/"

# Si conteneur Docker
docker-compose down
docker-compose up -d followup-front:previous-version

# Si plateforme cloud
netlify rollback  # ou commande équivalente de la plateforme
```

---

## 📞 Contacts

| Rôle                  | Contact          |
|-----------------------|------------------|
| Chef de projet        | [Nom]            |
| Administrateur système| [Nom]            |
| DevOps               | [Nom]            |

---

## 📅 Historique des déploiements

| Date       | Version | Environnement | Statut | Déployé par |
|------------|---------|---------------|--------|-------------|
| 2026-02-04 | v1.0.0  | Production    | ✅     | [Votre nom] |

---

## 🔗 Liens utiles

- [Documentation Angular](https://angular.io/guide/deployment)
- [Guide de déploiement Angular](https://angular.io/guide/deployment)
- [Repository GitHub](https://github.com/votre-username/followup-front)