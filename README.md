# FollowUp – Frontend (Angular PWA)

Application frontend **Angular (SPA + PWA)** destinée au suivi et à la gestion des candidatures d’emploi.  
Cette application consomme une **API REST Symfony sécurisée par JWT**.

---

## 📋 Présentation

FollowUp est une application **mobile-first** permettant à un utilisateur de :

- s’authentifier (email / mot de passe ou Google OAuth),
- gérer et suivre ses candidatures d’emploi,
- centraliser sa recherche de manière claire et structurée.

Le frontend est conçu comme une **Single Page Application (SPA)** avec séparation stricte des responsabilités et protection des routes.

---

## 🏗️ Architecture technique

### Stack

- **Framework** : Angular 20.x
- **Architecture** : Standalone Components
- **Routing** : Angular Router (outlet principal + outlet secondaire)
- **Authentification** : JWT (fourni par l’API backend)
- **HTTP** : HttpClient + Interceptor JWT
- **PWA** : Service Worker + Manifest
- **SSR** : volontairement désactivé (SPA)

---

## 📁 Structure du projet

src/
├── app/
│ ├── core/
│ │ ├── auth/
│ │ │ ├── auth.service.ts
│ │ │ ├── auth.guard.ts
│ │ │ └── jwt.interceptor.ts
│ │ └── pwa/
│ │ └── update.service.ts
│ │
│ ├── features/
│ │ ├── public/ # Pages publiques (home, about, pricing…)
│ │ ├── auth/ # Login, signup, reset password, OAuth
│ │ └── dashboard/ # Zone privée
│ │
│ ├── layouts/
│ │ ├── public-layout/ # Layout public avec navbar
│ │ └── private-layout/ # Layout protégé (dashboard)
│ │
│ ├── shared/
│ │ └── components/
│ │ └── navbar/ # Composants UI réutilisables
│ │
│ ├── app.routes.ts # Définition des routes
│ ├── app.config.ts # Configuration globale
│ └── app.ts # Composant racine
│
├── assets/ # Images, icônes, illustrations
├── public/ # Manifest PWA et icônes
└── index.html


👉 Cette organisation respecte les bonnes pratiques Angular :
- **core** : logique transverse (auth, sécurité, PWA),
- **features** : fonctionnalités métier,
- **shared** : composants réutilisables,
- **layouts** : structuration visuelle des zones.

---

## 🔐 Authentification & Sécurité

### Méthodes d’authentification

- **Email / mot de passe**
- **Google OAuth 2.0**

### Fonctionnement

1. L’utilisateur s’authentifie via l’API backend
2. Le backend retourne un **JWT**
3. Le token est stocké côté client (`localStorage`)
4. Un **HTTP Interceptor** ajoute automatiquement le token aux requêtes protégées
5. Les routes privées sont sécurisées via un **AuthGuard**

---

### Endpoints consommés (backend)

| Méthode | Endpoint | Description |
|-------|---------|------------|
| POST | `/api/login_check` | Connexion JWT |
| POST | `/api/register` | Inscription |
| POST | `/api/password/request` | Demande de reset |
| POST | `/api/password/reset` | Réinitialisation |
| GET | `/auth/google` | OAuth Google |

---

## 🧭 Routing & Navigation

### Séparation claire des zones

- **Zone publique**
  - `/`
  - `/about`
  - `/features`
  - `/pricing`

- **Zone privée (protégée)**
  - `/dashboard`

- **Authentification en overlay**
  - `/login`
  - `/forgot-password`

👉 Les écrans d’authentification sont affichés via un **router-outlet secondaire**, ce qui permet :
- de conserver le contexte de navigation,
- d’améliorer l’expérience utilisateur,
- d’éviter les ruptures de navigation.

---

## 📱 Progressive Web App (PWA)

- Service Worker activé en production
- Manifest configuré
- Application installable sur mobile
- Gestion des mises à jour avec confirmation utilisateur

---

## 🎨 Design & UX

### Principes

- Mobile-first
- Composants standalone
- Navigation simple et lisible
- UX orientée utilisateur authentifié

### Palette principale

```css
--primary: #0077b6;
--secondary: #0096c7;
--accent: #1a3a57;
--text: #334;
--text-light: #5b6c75;
 
 ---

## 🚀 Installation & lancement

# Installation des dépendances
npm install

# Lancement en développement
npm start
# http://localhost:4200

# Build production
npm run build

🧪 Tests

Les tests frontend ne sont pas encore implémentés.

Prévu :

Tests unitaires (Jasmine / Karma ou Vitest)

Tests end-to-end (Cypress ou Playwright)

📦 Déploiement

Build Angular classique (/dist)

Compatible hébergement statique

API backend déployée séparément

📌 Choix techniques assumés

❌ Pas de SSR : application orientée usage authentifié

✅ JWT stateless

✅ Séparation claire public / privé

✅ OAuth traité hors API REST

✅ Architecture scalable et maintenable

---

## 📖 Documentation complémentaire

- **[Guide de déploiement technique](./docs/technical-deployment-doc.md)** : Procédure complète de déploiement
- **[Guide de l'historique Git](./docs/git-history-guide.md)** : Comment consulter et naviguer dans l'historique Git du projet
- **[Documentation de déploiement](./deployment/README.md)** : Instructions de déploiement par environnement

---

👩‍💻 Auteur

Cécile
Projet réalisé dans le cadre du Titre Professionnel Concepteur Développeur d’Applications (CDA)

Année : 2025

Version : 1.0.0