# ✅ Checklist de Déploiement - FollowUp Front

## Avant le déploiement

### Vérifications techniques
- [ ] Tous les tests unitaires passent (`npm test`)
- [ ] Le build de production fonctionne (`npm run build -- --configuration=production`)
- [ ] Aucune erreur ESLint/Linting
- [ ] Les variables d'environnement sont configurées
- [ ] Les secrets GitHub sont à jour

### Vérifications fonctionnelles
- [ ] Les nouvelles fonctionnalités sont validées en UAT
- [ ] Les tests d'acceptation utilisateur sont OK
- [ ] Aucun bug bloquant identifié
- [ ] La documentation utilisateur est à jour

### Vérifications de sécurité
- [ ] Scan de vulnérabilités réalisé (`npm audit`)
- [ ] Les dépendances sont à jour
- [ ] Les certificats SSL sont valides
- [ ] Les CORS sont correctement configurés
- [ ] Le RGPD est respecté (mentions légales, cookies)

### Préparation
- [ ] Backup de l'environnement cible créé
- [ ] Plan de rollback préparé
- [ ] Équipe de support informée
- [ ] Fenêtre de maintenance planifiée (si nécessaire)

---

## Pendant le déploiement

### Exécution
- [ ] Build de production lancé
- [ ] Artefacts créés avec succès
- [ ] Déploiement vers l'environnement cible
- [ ] Logs de déploiement consultés

### Monitoring
- [ ] Surveillance des métriques serveur
- [ ] Vérification des logs d'erreur
- [ ] Monitoring de la disponibilité

---

## Après le déploiement

### Tests de fumée (Smoke Tests)
- [ ] Le site est accessible
- [ ] La page d'accueil se charge
- [ ] La connexion utilisateur fonctionne
- [ ] Les appels API backend répondent
- [ ] Les assets (images, CSS, JS) se chargent

### Vérifications de performance
- [ ] Temps de chargement < 3 secondes
- [ ] Score Lighthouse > 90
- [ ] Aucune erreur 404 ou 500

### Communication
- [ ] Équipe de support notifiée
- [ ] Client informé du déploiement
- [ ] Notes de version publiées

### Documentation
- [ ] Historique de déploiement mis à jour
- [ ] Problèmes rencontrés documentés
- [ ] Leçons apprises notées

---

## En cas de problème

### Procédure de rollback
- [ ] Identifier la cause du problème
- [ ] Décision de rollback prise
- [ ] Restauration du backup
- [ ] Tests post-rollback
- [ ] Communication aux utilisateurs

---

## Signatures

| Rôle                  | Nom | Date | Signature |
|-----------------------|-----|------|-----------|
| Chef de projet        |     |      |           |
| Développeur           |     |      |           |
| Responsable technique |     |      |           |
| Client (UAT/PROD)     |     |      |           |