# 📱 FollowUp Front – Application Mobile de Suivi des Candidatures

**Projet développé dans le cadre du Titre Professionnel CDA (Concepteur Développeur d’Applications)**  
Frontend mobile réalisé avec **Angular** (PWA activée)  
Backend géré séparément (Symfony / API REST)

---

## 🧭 Contexte du projet

**FollowUp** est une application mobile destinée à accompagner les chercheurs d’emploi dans le **suivi de leurs candidatures**.

L’application permet à un utilisateur :
- d’enregistrer ses candidatures (entreprises, postes, dates, statut, notes),
- de visualiser ses statistiques (taux de réponses, relances, réussites),
- et de suivre ses démarches au quotidien depuis son smartphone.

Le projet s’inscrit dans une démarche **mobile-first**, avec une architecture moderne et évolutive :
- **Frontend mobile Angular (PWA)**
- **Backend API Symfony**
- **Frontend web admin Twig**

---

## 🧰 Technologies principales

| Domaine | Technologies |
|----------|---------------|
| Framework | Angular 18+ |
| Langage | TypeScript, HTML, SCSS |
| Outil de build | Angular CLI |
| PWA | Service Worker, Manifest Web |
| Gestion de dépendances | npm |
| Versionnage | Git + GitHub |
| Serveur de dev | Node.js / http-server |

---

## ⚙️ Installation & exécution locale

### 1️⃣ Cloner le dépôt

```bash
git clone https://github.com/Evy38/followup-front.git
cd followup-front
2️⃣ Installer les dépendances
npm install

3️⃣ Lancer le serveur de développement
ng serve -o


➡️ L’application s’ouvre automatiquement sur http://localhost:4200

🚀 Build de production (PWA activée)
Génération de la build
ng build --configuration production


Le dossier de sortie se trouve dans :

dist/followup-front/browser/

Test local de la PWA
npx http-server dist/followup-front/browser -p 4201 --spa


➡️ Puis ouvrir http://127.0.0.1:4201

🌐 Fonctionnalités PWA

L’application Angular intègre la configuration Progressive Web App (PWA) pour permettre :

l’installation sur mobile (icône + splash screen),

la mise en cache local pour un affichage plus rapide,

une base pour le mode hors connexion (offline-ready),

la compatibilité avec un déploiement futur HTTPS.

Fichiers clés :
Fichier	Rôle
manifest.webmanifest	Décrit l’application (nom, icônes, couleurs)
ngsw-config.json	Définit les ressources mises en cache
ngsw-worker.js	Service Worker (gère le cache et les mises à jour)
app.config.ts	Active le Service Worker en production
📁 Structure du projet
followup-front/
│
├── src/
│   ├── app/               # Composants Angular
│   ├── assets/            # Images et ressources
│   ├── environments/      # Variables d’environnement
│   ├── main.ts            # Point d’entrée principal
│   ├── manifest.webmanifest
│   └── index.html
│
├── angular.json           # Configuration du projet Angular
├── ngsw-config.json       # Configuration du service worker
├── package.json           # Dépendances et scripts npm
└── README.md

📚 Bonnes pratiques mises en œuvre

Architecture modulaire Angular (standalone components, routing clair)

Approche mobile-first (responsive design SCSS)

Respect des bonnes pratiques PWA (manifest, cache, service worker)

Versionnement Git avec conventions de commit

Préparation au déploiement CI/CD (structure stable et reproductible)

📈 Pistes d’évolution

Connexion à l’API Symfony (authentification JWT)

Ajout d’un tableau de bord statistique (graphes de suivi)

Amélioration du mode hors ligne complet

Déploiement sur un serveur HTTPS (Netlify / Firebase Hosting)

👩‍💻 Auteur

Cécile [Evy38]
Développeuse Fullstack en formation CDA – Simplon Grenoble
📍 France
💼 GitHub – Evy38

🏁 Licence

Projet ouvert à usage pédagogique dans le cadre du Titre Professionnel CDA.
Reproduction libre à des fins d’apprentissage.
