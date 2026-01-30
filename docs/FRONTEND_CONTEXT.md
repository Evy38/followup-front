
# Frontend – Contexte canonique du projet

## 1. Stack & configuration globale

- **Version Angular détectée** : 20.3.x
- **Standalone components** : oui (usage de `loadComponent`)
- **TypeScript version** : ~5.9.2
- **Mode SPA** : oui  
	**PWA** : oui (service worker configuré)  
	**SSR** : oui (présence de `@angular/ssr`, scripts SSR)
- **Gestion de l’état global** : NON DÉTECTÉ (aucun store global type NgRx, usage de BehaviorSubject local)

## 2. Arborescence réelle

**src/app/**

- **core/** : services transverses (auth, interceptors, pwa, ui)
- **features/** : fonctionnalités métier (auth, dashboard, public)
- **shared/** : composants UI réutilisables (navbar, toast)
- **layouts/** : layouts public/privé (gestion des zones publiques/privées)
- **autres dossiers** : NON DÉTECTÉ

**Rôle observé :**
- core/ : logique technique et services globaux
- features/ : logique métier découpée par domaine
- shared/ : UI transverse
- layouts/ : structure de page

## 3. Configuration core

- **AuthService** : gestion du login, logout, inscription, stockage du token (localStorage), publication de l’état utilisateur (BehaviorSubject), accès API `/api`, gestion OAuth Google.
- **Guards** :
	- `authGuard` : vérifie l’authentification via AuthService, redirige vers overlay login si non authentifié ou email non vérifié.
- **Interceptors HTTP** :
	- `jwtInterceptor` : ajoute le token sauf sur routes publiques.
	- `httpErrorInterceptor` : redirige vers login overlay sur 401/403 hors `/api/candidatures`.
- **Services globaux** :
	- ToastService (affichage notifications)
	- UpdateService (gestion PWA, reload sur nouvelle version)
- **Stockage du token** : localStorage

## 4. Routing & navigation

- **Fichier(s) de routes** : `app.routes.ts`
- **Routes publiques** : racine, about, features, pricing, verify-email (layout public)
- **Routes privées** : sous `/app` (layout privé, guardé par `authGuard`)
- **Lazy loading** : oui (usage de `loadComponent`)
- **Layouts utilisés** : `PublicLayoutComponent`, `PrivateLayoutComponent`
- **Routes dynamiques** : NON DÉTECTÉ (pas de paramètre dynamique dans les extraits)
- **Paramètres de routes critiques** : NON DÉTECTÉ

## 5. Modèles de données (models / interfaces)

- **Candidature**
	- Champs : `@id`, `id`, `jobTitle`, `dateCandidature`, `dateDerniereRelance`, `lienAnnonce`, `externalOfferId`, `entreprise`, `statut`, `relances`, `statutReponse`, `dateEntretien`, `heureEntretien`
	- Relations : entreprise (objet), statut (objet), relances (array d’objets Relance)
	- Champs sensibles : `statutReponse`, `relances`
- **Job**
	- Champs : `externalId`, `title`, `company`, `location`, `contractType`, `salaryMin`, `salaryMax`, `redirectUrl`, `_candidated`
- **Relance**
	- Champs : `id`, `rang`, `dateRelance`, `faite`, `dateRealisation`

## 6. Services métier

- **CandidatureService**
	- Endpoints : `/api/candidatures/from-offer`, `/api/my-candidatures`, `/api/candidatures/{id}/statut-reponse`, `/api/candidatures/{id}/entretien`, suppression par IRI
	- Méthodes : `createFromOffer`, `getMyCandidatures`, `deleteCandidatureByIri`, `updateStatutReponse`, `updateEntretien`, `notifyRefresh`
	- Types de retour : Observable<any>, Observable<Candidature[]>
	- Hypothèses : API Hydra (usage de IRI, hydra:member)
- **JobService**
	- Endpoint : `/api/jobs`
	- Méthode : `getJobs`
	- Retour : Observable<Job[]>
- **RelanceService**
	- Endpoint : `/api/relances`
	- Méthodes : `markAsDone`, `markAsUndone`
	- Retour : Observable<Relance>
- **UpdateService**
	- Méthode : subscribe aux updates PWA, reload sur nouvelle version

## 7. Composants métier critiques

- **HomeComponent** (`features/public/home`) : page d’accueil publique, données NON DÉTECTÉ
- **DashboardComponent** (`features/dashboard/pages/home`) : page d’accueil privée, données NON DÉTECTÉ
- **CandidaturesComponent** (`features/dashboard/pages/candidatures`) : gestion des candidatures, consomme CandidatureService
- **RelancesComponent** (`features/dashboard/pages/relances`) : gestion des relances, consomme RelanceService
- **LoginComponent** (`features/auth/login`) : authentification, consomme AuthService
- **SignupComponent** (`features/auth/signup`) : inscription, consomme AuthService

## 8. Sécurité frontend

- **Mécanisme d’authentification** : JWT, token stocké localStorage
- **Vérification du token** : via AuthService et jwtInterceptor
- **Comportement au refresh navigateur** : récupération du token localStorage, publication dans BehaviorSubject
- **Gestion de l’expiration du token** : NON DÉTECTÉ (pas de refresh token observé)
- **Protection des routes** : `authGuard` sur layout privé
- **Redirections observées** : overlay login sur 401/403 ou non-authentifié

## 9. Gestion des erreurs UI

- **Traitement global des erreurs API** : httpErrorInterceptor (redirige vers login overlay)
- **Composants/services utilisés** : ToastService (affichage notifications)
- **Comportement en cas d’erreur bloquante** : redirection login overlay
- **Cas particuliers** : overlay login en cas d’erreur d’authentification

## 10. Styles & UI

- **Méthode de styling** : CSS natif (fichiers .css par composant)
- **Fichiers globaux de style** : `styles.css`
- **Conventions visuelles explicites** : NON DÉTECTÉ
- **Composants UI transverses** : Toast (`shared/toast`), PublicNavbar (`shared/public-navbar`)

## 11. Synchronisation & rafraîchissement des données

- **Mécanismes observés** : Subject, BehaviorSubject (notamment dans CandidatureService, AuthService, ToastService)
- **Services concernés** : CandidatureService (`refresh$`), AuthService (`tokenSubject`, `userSubject`), ToastService (`toastSubject`)
- **Objectif réel** : rafraîchir listes, notifier changements, afficher notifications

## 12. Flux fonctionnels critiques

- **Login → token → accès privé**
	- Login via AuthService → token stocké localStorage → publication dans BehaviorSubject → accès routes privées via authGuard
- **Annonce → candidature → relance**
	- Création candidature via CandidatureService (`createFromOffer`) → gestion via CandidaturesComponent → relances via RelanceService et RelancesComponent

## 13. Points sensibles / pièges connus

- **Décalages back/front** : usage d’IRI et Hydra (API REST typée Hydra)
- **Hypothèses implicites** : token toujours en localStorage, absence de refresh token
- **Couplages forts** : navigation overlay login liée à la gestion d’erreur globale, dépendance forte à la structure API (IRI, hydra:member)