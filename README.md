# FollowUp - Application de Suivi de Candidatures

## 📋 Description
Application Angular PWA pour le suivi et la gestion des candidatures d'emploi.

## 🏗️ Architecture Technique

### Stack
- **Frontend** : Angular 20.3 (Standalone Components)
- **Backend** : [API REST - détails à compléter]
- **Base de données** : [À préciser]
- **Authentification** : JWT
- **PWA** : Service Worker + Manifest

### Structure du projet
```
src/
├── app/
│   ├── pages/
│   │   └── login/           # Page de connexion
│   ├── services/
│   │   └── auth.ts          # Service d'authentification
│   ├── guards/              # Protection des routes (à créer)
│   ├── components/          # Composants réutilisables (à créer)
│   └── models/              # Interfaces TypeScript (à créer)
├── assets/                  # Images et ressources statiques
└── public/                  # Fichiers publics (manifest, icons)
```

## 🚀 Installation & Démarrage

```bash
# Installation des dépendances
npm install

# Développement
npm start
# → http://localhost:4200

# Build production
npm run build

# Tests
npm test
```

## ⚙️ Configuration

### Variables d'environnement
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  // Autres configs...
};
```

### API Backend
- **URL de base** : `http://localhost:8080/api`
- **Endpoints** :
  - `POST /auth/login` - Connexion
  - `POST /auth/register` - Inscription
  - [À compléter avec les autres endpoints]

## 📱 Fonctionnalités

### ✅ Implémentées
- [x] Page de connexion responsive
- [x] Authentification JWT
- [x] PWA (Service Worker)
- [x] Configuration SSR
- [x] Design mobile-first

### 🚧 En cours / À faire
- [ ] Dashboard principal
- [ ] CRUD candidatures
- [ ] Filtres et recherche
- [ ] Statistiques et graphiques
- [ ] Gestion profil utilisateur
- [ ] Notifications push (PWA)

## 🎨 Design System

### Couleurs principales
```css
--primary: #0077b6;     /* Bleu principal */
--secondary: #0096c7;   /* Bleu secondaire */
--accent: #1a3a57;      /* Bleu foncé titres */
--text: #334;           /* Texte principal */
--text-light: #5b6c75;  /* Texte secondaire */
```

### Breakpoints
```css
/* Mobile-first */
@media (min-width: 768px) { /* Tablette */ }
@media (min-width: 1024px) { /* Desktop */ }
```

## 🧪 Tests

### Structure des tests
- **Unit tests** : Jasmine + Karma
- **E2E tests** : [À préciser - Cypress/Playwright ?]

### Commandes
```bash
npm test              # Tests unitaires
npm run test:watch    # Tests en mode watch
npm run e2e           # Tests E2E
```

## 📦 Déploiement

### Build production
```bash
npm run build
# Fichiers générés dans /dist/followup-front
```

### PWA
- **Service Worker** : Mise en cache automatique
- **Manifest** : Installation en app native
- **Offline** : Fonctionnalités de base disponibles hors ligne

## 🔐 Sécurité

### Authentification
- **JWT Token** : Stocké en localStorage
- **Guards** : Protection des routes (à implémenter)
- **Intercepteurs** : Ajout automatique du token (à implémenter)

### Validation
- **Frontend** : Validation Angular Reactive Forms
- **Backend** : Validation côté serveur

## 🐛 Debug & Logs

### Outils de développement
- **Angular DevTools** : Extension Chrome/Firefox
- **Logs** : Console.log en développement
- **Erreurs** : Gestion centralisée (à implémenter)

## 🤝 Contribution

### Git Workflow
```bash
# Branche principale
main

# Branches de feature
feature/nom-de-la-fonctionnalite

# Commits
feat: nouvelle fonctionnalité
fix: correction de bug
docs: documentation
style: formatage
refactor: refactoring
test: ajout de tests
```

## 📈 Performance

### PWA Scores (à mesurer)
- **Performance** : [À tester avec Lighthouse]
- **Accessibilité** : [À tester]
- **SEO** : [À tester]
- **PWA** : [À tester]

## 📞 Support & Contact

### Issues connues
- [À documenter]

### Roadmap
1. **Phase 1** : Authentification + CRUD de base
2. **Phase 2** : Dashboard et statistiques
3. **Phase 3** : Fonctionnalités avancées PWA

---

**Dernière mise à jour** : 9 novembre 2025
**Version** : 1.0.0-beta
**Auteur** : Cécile