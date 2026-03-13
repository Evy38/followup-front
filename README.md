# FollowUp – Frontend (Angular PWA)

Application frontend **Angular (SPA + PWA)** destinée au suivi et à la gestion des candidatures d'emploi.
Cette application consomme une **API REST Symfony sécurisée par JWT**.

Projet de fin de formation – **Titre Professionnel Concepteur Développeur d'Applications (CDA)**

---

## 📋 Présentation

FollowUp est une application **mobile-first** permettant à un utilisateur de :

- s'authentifier (email / mot de passe ou Google OAuth),
- gérer et suivre ses candidatures d'emploi,
- planifier et suivre ses relances et entretiens,
- rechercher des offres d'emploi via l'API Adzuna,
- administrer les comptes utilisateurs (rôle admin).

Le frontend est conçu comme une **Single Page Application (SPA)** avec séparation stricte des responsabilités et protection des routes.

---

## 🏗️ Architecture technique

### Stack

| Composant | Technologie | Version |
|-----------|-------------|---------|
| **Framework** | Angular | 20.x |
| **Langage** | TypeScript | 5.9 |
| **Architecture** | Standalone Components | - |
| **Routing** | Angular Router (outlet principal + overlay) | - |
| **HTTP** | HttpClient + Interceptors | - |
| **PWA** | Service Worker + Manifest | - |
| **Tests** | Karma + Jasmine | - |

**SSR** : volontairement désactivé (SPA orientée usage authentifié)

---

## 📁 Structure du projet

```
src/
├── app/
│   ├── core/
│   │   ├── auth/
│   │   │   ├── auth.service.ts           # Authentification JWT + OAuth + RGPD
│   │   │   ├── auth.guard.ts             # Garde routes privées
│   │   │   ├── admin.guard.ts            # Garde routes admin (ROLE_ADMIN)
│   │   │   └── jwt.interceptor.ts        # Ajout automatique du token aux requêtes
│   │   ├── http/
│   │   │   └── http-error.interceptor.ts # Gestion globale 401/403
│   │   ├── models/
│   │   │   ├── user.model.ts             # Interface User + enums rôles
│   │   │   ├── candidature.model.ts      # Interface Candidature + EntretienApi
│   │   │   ├── relance.model.ts          # Interface Relance
│   │   │   └── job.model.ts              # Interface JobOffer (Adzuna)
│   │   ├── services/
│   │   │   ├── candidature.service.ts    # CRUD candidatures + statut réponse
│   │   │   ├── entretien.service.ts      # CRUD entretiens
│   │   │   ├── relance.service.ts        # Mise à jour relances
│   │   │   ├── profile.service.ts        # Profil utilisateur + suppression compte
│   │   │   ├── user.service.ts           # Gestion utilisateurs (admin)
│   │   │   ├── job.service.ts            # Recherche offres (Adzuna)
│   │   │   └── annonce-filter.service.ts # Filtres de recherche d'annonces
│   │   ├── ui/
│   │   │   └── toast.service.ts          # Notifications toast globales
│   │   └── pwa/
│   │       └── update.service.ts         # Gestion mises à jour PWA
│   │
│   ├── features/
│   │   ├── public/                       # Pages accessibles sans auth
│   │   │   ├── home/
│   │   │   ├── about/
│   │   │   ├── features/
│   │   │   ├── pricing/
│   │   │   ├── privacy/                  # Politique de confidentialité
│   │   │   ├── legal/                    # Mentions légales
│   │   │   └── terms/                    # Conditions d'utilisation
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   ├── forgot-password/
│   │   │   ├── reset-password/
│   │   │   ├── verify-email/
│   │   │   ├── google-callback/          # Réception token OAuth
│   │   │   ├── finalize-signup/          # Finalisation inscription OAuth + consentement RGPD
│   │   │   └── welcome/
│   │   ├── dashboard/                    # Zone privée utilisateur
│   │   │   ├── pages/
│   │   │   │   ├── home/                 # Tableau de bord
│   │   │   │   ├── candidatures/         # Liste et gestion des candidatures
│   │   │   │   ├── annonces/             # Recherche d'offres Adzuna
│   │   │   │   └── relances/
│   │   │   │       ├── relances.component.ts
│   │   │   │       ├── relances.facade.ts  # Façade orchestrant les services
│   │   │   │       ├── helpers/
│   │   │   │       └── components/
│   │   │   └── profile/                  # Profil et suppression de compte
│   │   └── admin/                        # Zone admin (ROLE_ADMIN)
│   │       └── pages/users-list/         # Gestion des utilisateurs
│   │
│   ├── layouts/
│   │   ├── public-layout/                # Layout public (navbar + footer)
│   │   └── private-layout/               # Layout dashboard (sidebar + topbar)
│   │
│   ├── shared/
│   │   ├── toast/                        # Composant toast de notification
│   │   ├── confirm-modal/                # Modal de confirmation générique
│   │   ├── rgpd-consent-modal/           # Modal consentement RGPD (OAuth)
│   │   ├── public-navbar/
│   │   └── public-footer/
│   │
│   ├── app.routes.ts                     # Définition des routes
│   ├── app.config.ts                     # Configuration globale (providers, interceptors)
│   └── app.ts                            # Composant racine
│
├── assets/
├── public/                               # Manifest PWA et icônes
└── index.html
```

---

## 🔐 Authentification & Sécurité

### Méthodes d'authentification

- **Email / mot de passe** (uniquement adresses Gmail)
- **Google OAuth 2.0**

### Fonctionnement JWT

1. L'utilisateur s'authentifie via l'API backend
2. Le backend retourne un **JWT**
3. Le token est stocké dans **localStorage**
4. `jwtInterceptor` ajoute automatiquement `Authorization: Bearer {token}` sur chaque requête
5. `httpErrorInterceptor` gère les erreurs 401 (token expiré → déconnexion) et 403 (accès refusé)
6. Les routes privées sont sécurisées via `authGuard` et `adminGuard`

### Guards

| Guard | Protection |
|-------|-----------|
| `authGuard` | Routes `/app/**` — nécessite un token JWT valide |
| `adminGuard` | Routes `/app/admin/**` — nécessite `ROLE_ADMIN` |

### Interceptors

| Interceptor | Rôle |
|-------------|------|
| `jwtInterceptor` | Injecte le token JWT dans chaque requête sortante |
| `httpErrorInterceptor` | Redirige vers login sur 401/403 |

### RGPD

- Consentement RGPD requis à l'inscription (champ `consentRgpd`)
- Pour les utilisateurs OAuth : modal `RgpdConsentModalComponent` affichée après connexion
- Appel `POST /api/me/consent` via `AuthService.acceptRgpd()`
- Demande de suppression de compte depuis la page profil (`ProfileService.deleteProfile()`)

---

## 🌐 Endpoints consommés (backend)

| Méthode | Endpoint | Service |
|---------|---------|---------|
| POST | `/api/login_check` | `AuthService` |
| POST | `/api/register` | `AuthService` |
| GET | `/api/me` | `AuthService` |
| POST | `/api/me/consent` | `AuthService` |
| POST | `/api/password/request` | `AuthService` |
| POST | `/api/password/reset` | `AuthService` |
| POST | `/api/verify-email/resend` | `AuthService` |
| GET | `/auth/google` | `AuthService` |
| GET | `/api/user/profile` | `ProfileService` |
| PUT | `/api/user/profile` | `ProfileService` |
| DELETE | `/api/user/profile` | `ProfileService` |
| GET | `/api/my-candidatures` | `CandidatureService` |
| POST | `/api/candidatures/from-offer` | `CandidatureService` |
| DELETE | `/api/candidatures/{id}` | `CandidatureService` |
| PATCH | `/api/candidatures/{id}/statut-reponse` | `CandidatureService` |
| POST | `/api/entretiens` | `EntretienService` |
| PATCH | `/api/entretiens/{id}` | `EntretienService` |
| DELETE | `/api/entretiens/{id}` | `EntretienService` |
| PATCH | `/api/relances/{id}` | `RelanceService` |
| GET | `/api/jobs` | `JobService` |
| GET | `/api/admin/users` | `UserService` |
| PUT | `/api/admin/users/{id}` | `UserService` |
| DELETE | `/api/admin/users/{id}` | `UserService` |

---

## 🧭 Routing & Navigation

### Vue d'ensemble

```
/                          Zone publique (PublicLayoutComponent)
├── /                      Page d'accueil
├── /about
├── /features
├── /pricing
├── /verify-email          Vérification email (token en query param)
├── /privacy
├── /legal
└── /terms

/app                       Zone privée (PrivateLayoutComponent, authGuard)
├── /app/dashboard         Tableau de bord
├── /app/candidatures      Gestion des candidatures
├── /app/annonces          Recherche d'offres Adzuna
├── /app/relances          Relances et entretiens
├── /app/profile           Profil utilisateur
└── /app/admin             Zone admin (adminGuard)
    └── /app/admin/users   Gestion des utilisateurs

/google/callback           Réception du token OAuth Google
/finalize-signup           Finalisation inscription OAuth (consentement RGPD)
/reset-password            Réinitialisation du mot de passe

(outlet: overlay)          Superposés sur le contenu existant
├── login                  Formulaire de connexion
└── forgot-password        Demande de réinitialisation
```

### Overlay d'authentification

Les écrans de connexion et mot de passe oublié utilisent un **router-outlet secondaire** (`outlet: overlay`), ce qui permet :
- de conserver le contexte de navigation,
- d'améliorer l'expérience utilisateur,
- d'éviter les rechargements de page.

### Lazy loading

Tous les composants sont chargés en **lazy loading** (`loadComponent`) pour optimiser le bundle initial.

---

## 🔄 Façade Pattern (Relances)

La page Relances utilise une **façade** (`RelancesFacade`) qui orchestre les services :

```
RelancesComponent
    └── RelancesFacade
            ├── CandidatureService  → chargement liste + mise à jour statut réponse
            ├── RelanceService      → marquage fait / à faire
            └── EntretienService    → création / suppression entretiens
```

Avantages :
- Les composants n'accèdent jamais directement aux services
- **Optimistic UI** : mise à jour locale immédiate avant confirmation serveur
- **Rollback automatique** en cas d'erreur backend
- Stats agrégées exposées via `stats$` (total, relances en attente, faites)

---

## 📱 Progressive Web App (PWA)

- Service Worker activé en production
- Manifest configuré (icônes, couleurs, display standalone)
- Application installable sur mobile et desktop
- `UpdateService` : détecte les nouvelles versions et propose une confirmation de mise à jour

---

## 🎨 Design & UX

### Principes

- **Mobile-first**
- Composants standalone (Angular 17+)
- Navigation simple et lisible

### Palette principale

```css
--primary: #0077b6;
--secondary: #0096c7;
--accent: #1a3a57;
--text: #334;
--text-light: #5b6c75;
```

### Composants UI partagés

- `ToastComponent` + `ToastService` : notifications contextuelles (succès, erreur)
- `ConfirmModalComponent` : modal de confirmation générique
- `RgpdConsentModalComponent` : modal de consentement RGPD pour les utilisateurs OAuth

---

## 🧪 Tests

### Tests unitaires (Karma + Jasmine)

| Fichier spec | Composant testé | Exemples de tests |
|-------------|----------------|-------------------|
| `auth.service.spec.ts` | `AuthService` | login JWT, isLogged, logout, register, me(), resendVerificationEmail |
| `candidature.service.spec.ts` | `CandidatureService` | En cours |
| `entretien.service.spec.ts` | `EntretienService` | En cours |
| `login.component.spec.ts` | `LoginComponent` | En cours |
| `dashboard-home.component.spec.ts` | `DashboardHomeComponent` | En cours |
| `app.spec.ts` | `AppComponent` | En cours |

### Commandes

```bash
# Tous les tests
npm test

# Tests en mode watch
npm run test -- --watch

# Tests avec couverture de code
npm run test -- --code-coverage
```

### Tests end-to-end

Prévus avec **Cypress** ou **Playwright**.

---

## 🚀 Installation & lancement

```bash
# Installation des dépendances
npm install

# Lancement en développement
npm start
# http://localhost:4200

# Build production
npm run build
```

### Variables d'environnement

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api',
  backendUrl: 'http://localhost:8000'
};
```

---

## 📦 Déploiement

- Build Angular classique (`/dist`)
- Compatible hébergement statique (Netlify, Vercel, Render Static Sites)
- API backend déployée séparément
- Configurer `src/environments/environment.production.ts` avec les URLs de production

---

## 📌 Choix techniques assumés

- ❌ **Pas de SSR** : application orientée usage authentifié, pas d'indexation SEO nécessaire
- ✅ **JWT stateless** stocké en localStorage (adapté au contexte SPA)
- ✅ **Séparation claire public / privé** via layouts et guards
- ✅ **OAuth traité hors API REST** (redirection navigateur vers backend)
- ✅ **Façade pattern** pour la page Relances (orchestration multi-services)
- ✅ **Optimistic UI** avec rollback pour les mutations fréquentes
- ✅ **Lazy loading** systématique pour optimiser le bundle

---

## 👤 Auteur

**Cécile MOREL**
Développeuse Full Stack
Projet réalisé dans le cadre du **Titre Professionnel Concepteur Développeur d'Applications** (REAC TP-01281 v04)

---

## 📄 Licence

Ce projet est réalisé dans un cadre pédagogique (CDA).
