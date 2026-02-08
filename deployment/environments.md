# 🌍 Définition des Environnements

## Vue d'ensemble

L'application FollowUp Front utilise 3 environnements distincts pour assurer la qualité avant la mise en production.

---

## 1️⃣ Environnement de Développement (DEV)

### Caractéristiques
- **Accès** : Développeurs uniquement
- **URL** : `http://localhost:4200`
- **Backend** : `http://localhost:8080/api`
- **Base de données** : SQLite locale ou PostgreSQL dev

### Configuration
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  baseUrl: 'http://localhost:8080',
  backendUrl: 'http://localhost:8080'
};
```

### Objectif
- Développement de nouvelles fonctionnalités
- Tests unitaires
- Débogage

---

## 2️⃣ Environnement SIT (System Integration Testing)

### Caractéristiques
- **Accès** : Équipe de développement + testeurs
- **URL** : `https://sit.followup.com`
- **Backend** : `https://api-sit.followup.com`
- **Base de données** : PostgreSQL staging avec jeu de données de test

### Configuration
```typescript
// src/environments/environment.sit.ts
export const environment = {
  production: false,
  apiUrl: 'https://api-sit.followup.com',
  baseUrl: 'https://api-sit.followup.com',
  backendUrl: 'https://api-sit.followup.com'
};
```

### Procédure de déploiement
1. Build avec configuration SIT : `ng build --configuration=sit`
2. Tests d'intégration automatisés
3. Déploiement automatique via CI/CD
4. Notifications sur Slack/Teams

### Objectif
- Tests d'intégration entre composants
- Validation technique
- Tests de non-régression

---

## 3️⃣ Environnement UAT (User Acceptance Testing)

### Caractéristiques
- **Accès** : Client, utilisateurs finaux, équipe produit
- **URL** : `https://uat.followup.com`
- **Backend** : `https://api-uat.followup.com`
- **Base de données** : Clone de la production (anonymisée)

### Configuration
```typescript
// src/environments/environment.uat.ts
export const environment = {
  production: true,
  apiUrl: 'https://api-uat.followup.com',
  baseUrl: 'https://api-uat.followup.com',
  backendUrl: 'https://api-uat.followup.com'
};
```

### Procédure de déploiement
1. Validation manuelle requise
2. Build avec configuration UAT : `ng build --configuration=uat`
3. Tests d'acceptation par le client
4. Validation fonctionnelle complète

### Objectif
- Tests d'acceptation utilisateur
- Validation métier
- Formation des utilisateurs

---

## 4️⃣ Environnement de Production (PROD)

### Caractéristiques
- **Accès** : Tous les utilisateurs finaux
- **URL** : `https://followup.com`
- **Backend** : `https://api.followup.com`
- **Base de données** : PostgreSQL production avec haute disponibilité

### Configuration
```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.followup.com',
  baseUrl: 'https://api.followup.com',
  backendUrl: 'https://api.followup.com'
};
```

### Procédure de déploiement
1. ✅ Tests UAT validés
2. ✅ Validation du chef de projet
3. ✅ Backup de l'environnement actuel
4. 🚀 Déploiement en production
5. ✅ Tests de fumée (smoke tests)
6. 📊 Monitoring des métriques

### Contraintes
- Déploiement uniquement en heures creuses (nuit/week-end)
- Nécessite 2 validations (technique + métier)
- Backup obligatoire avant déploiement
- Plan de rollback préparé

---

## 📊 Tableau récapitulatif

| Environnement | URL                    | Auto-deploy | Validation | Monitoring |
|---------------|------------------------|-------------|------------|------------|
| DEV           | localhost:4200         | ❌          | ❌         | ❌         |
| SIT           | sit.followup.com       | ✅          | Auto       | ✅         |
| UAT           | uat.followup.com       | ⚠️          | Manuelle   | ✅         |
| PROD          | followup.com           | ⚠️          | 2x Manuelle| ✅ 24/7    |

---

## 🔐 Sécurité des environnements

### Secrets GitHub requis par environnement

| Secret            | DEV | SIT | UAT | PROD |
|-------------------|-----|-----|-----|------|
| `API_URL`         | -   | ✅  | ✅  | ✅   |
| `SSL_CERT`        | -   | ✅  | ✅  | ✅   |
| `DEPLOY_KEY`      | -   | ✅  | ✅  | ✅   |
| `MONITORING_TOKEN`| -   | ✅  | ✅  | ✅   |

### Configuration dans GitHub
```bash
# Aller dans Settings > Secrets and variables > Actions
# Ajouter les secrets pour chaque environnement
```

---

## 🔄 Flux de promotion
```
DEV → SIT → UAT → PROD
 │     │     │      │
 │     │     │      └─→ Validation métier + technique
 │     │     └────────→ Tests d'acceptation client
 │     └──────────────→ Tests d'intégration auto
 └────────────────────→ Développement continu
```