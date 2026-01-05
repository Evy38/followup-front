# FollowUp – Frontend (Angular PWA)

Application frontend **Angular (SPA + PWA)** destinée au suivi et à la gestion des candidatures d’emploi.  
Cette application consomme une **API REST Symfony sécurisée par JWT**.

---

## 📋 Présentation

FollowUp est une application **mobile-first** permettant à un utilisateur de :

- s’authentifier (email/mot de passe ou Google OAuth),
- gérer ses candidatures d’emploi,
- centraliser le suivi de sa recherche de manière structurée.

Le frontend est conçu comme une **Single Page Application** avec gestion d’état côté client et protection des routes.

---

## 🏗️ Architecture technique

### Stack

- **Framework** : Angular 20.x
- **Architecture** : Standalone Components
- **Routing** : Angular Router (outlet principal + outlet secondaire)
- **Authentification** : JWT (via API backend)
- **HTTP** : HttpClient + Interceptor JWT
- **PWA** : Service Worker + Manifest
- **SSR** : Désactivé (SPA volontaire)

---

## 📁 Structure du projet

src/
├── app/
│ ├── pages/
│ │ ├── home/ # Pages publiques (home, about, pricing…)
│ │ ├── auth/ # Login, signup, forgot-password, OAuth
│ │ └── dashboard/ # Zone privée
│ │
│ ├── layout/
│ │ ├── public-layout/ # Layout public avec navbar
│ │ └── private-layout/ # Layout protégé (dashboard)
│ │
│ ├── services/
│ │ └── auth.service.ts # Gestion authentification & JWT
│ │
│ ├── guards/
│ │ └── auth.guard.ts # Protection des routes privées
│ │
│ ├── interceptors/
│ │ └── jwt.interceptor.ts # Injection automatique du token
│ │
│ ├── shared/
│ │ └── navbar/ # Composants UI réutilisables
│ │
│ └── app.routes.ts # Définition des routes
│
├── assets/ # Images, icônes, illustrations
├── public/ # manifest.webmanifest, icônes PWA
└── index.html


---

## 🔐 Authentification & Sécurité

### Méthodes d’authentification

- **Email / mot de passe**
- **Google OAuth 2.0**

### Fonctionnement

1. L’utilisateur s’authentifie via l’API backend
2. Le backend renvoie un **JWT**
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
  - `/login` (outlet secondaire)
  - `/forgot-password` (outlet secondaire)

👉 Les écrans d’authentification sont affichés via un **router-outlet secondaire** afin de préserver la navigation et l’UX.

---

## 📱 Progressive Web App (PWA)

- Service Worker activé en production
- Manifest configuré
- Application installable sur mobile
- Mise à jour automatique avec confirmation utilisateur

---

## 🎨 Design & UX

### Principes

- Mobile-first
- Composants standalone
- Animations légères
- UX centrée sur la simplicité

### Palette principale

```css
--primary: #0077b6;
--secondary: #0096c7;
--accent: #1a3a57;
--text: #334;
--text-light: #5b6c75;

🚀 Installation & lancement

# Installation
npm install

# Lancement en dev
npm start
# http://localhost:4200

# Build production
npm run build

🧪 Tests

Les tests frontend ne sont pas encore implémentés.

Prévu :

Tests unitaires (Jasmine / Karma ou Vitest)

Tests E2E (Cypress ou Playwright)

📦 Déploiement

Build Angular classique (/dist)

Compatible hébergement statique

API backend séparée

📌 Choix techniques assumés

❌ Pas de SSR : application orientée usage authentifié

✅ JWT stateless

✅ Séparation claire public / privé

✅ OAuth traité hors API REST

👩‍💻 Auteur

Cécile
Projet réalisé dans le cadre du Titre Professionnel Concepteur Développeur d’Applications (CDA)

Dernière mise à jour : 2025
Version : 1.0.0