# 📜 Guide : Consulter l'historique Git

## 🎯 Introduction

Ce document explique comment consulter et naviguer dans l'historique Git du projet FollowUp Front. L'historique Git permet de suivre toutes les modifications apportées au code, comprendre l'évolution du projet, et identifier quand et par qui des changements ont été effectués.

---

## 🔍 Commandes de base pour consulter l'historique

### 1. Afficher l'historique complet

```bash
# Afficher tous les commits (format détaillé)
git log

# Afficher tous les commits (format compact sur une ligne)
git log --oneline

# Afficher les 10 derniers commits
git log -10

# Afficher les 20 derniers commits en format compact
git log --oneline -20
```

### 2. Afficher l'historique avec un graphe

```bash
# Graphe de toutes les branches
git log --all --oneline --graph

# Graphe de la branche actuelle avec les 30 derniers commits
git log --oneline --graph -30

# Graphe détaillé avec les informations de fusion
git log --all --graph --decorate
```

### 3. Afficher l'historique d'un fichier spécifique

```bash
# Historique complet d'un fichier
git log -- src/app/app.routes.ts

# Historique compact d'un fichier
git log --oneline -- src/app/app.routes.ts

# Voir les modifications d'un fichier avec les différences
git log -p -- src/app/app.routes.ts
```

### 4. Afficher les détails d'un commit

```bash
# Voir les détails d'un commit spécifique
git show <commit-hash>

# Exemple avec un hash de commit
git show cd2480c

# Voir uniquement les fichiers modifiés (sans les différences)
git show --name-only <commit-hash>

# Voir les statistiques des modifications
git show --stat <commit-hash>
```

---

## 📊 Affichage personnalisé de l'historique

### Format personnalisé avec plus d'informations

```bash
# Format personnalisé : hash, date, auteur, message
git log --pretty=format:"%h - %ad - %an: %s" --date=short

# Avec les branches et tags
git log --pretty=format:"%h %ad | %s%d [%an]" --graph --date=short

# Afficher l'historique avec les statistiques
git log --stat --oneline
```

### Filtrer par date

```bash
# Commits depuis une date spécifique
git log --since="2026-01-01"

# Commits entre deux dates
git log --since="2026-01-01" --until="2026-02-01"

# Commits des 7 derniers jours
git log --since="1 week ago"

# Commits du dernier mois
git log --since="1 month ago"
```

### Filtrer par auteur

```bash
# Commits d'un auteur spécifique
git log --author="Cécile"

# Avec format compact
git log --oneline --author="Cécile"
```

### Rechercher dans les messages de commit

```bash
# Rechercher un mot-clé dans les messages
git log --grep="fix"

# Rechercher plusieurs mots-clés
git log --grep="auth" --grep="login"

# Recherche insensible à la casse
git log --grep="API" -i
```

---

## 🌿 Historique des branches

### Visualiser les branches

```bash
# Liste de toutes les branches
git branch -a

# Historique de toutes les branches avec graphe
git log --all --graph --oneline

# Comparer deux branches
git log main..develop --oneline

# Voir les commits d'une branche qui ne sont pas dans une autre
git log develop..main --oneline
```

### Historique d'une branche spécifique

```bash
# Historique d'une branche distante
git log origin/main --oneline

# Historique d'une branche locale
git log develop --oneline
```

---

## 🔎 Rechercher dans l'historique du code

### Rechercher quand un code a été ajouté ou supprimé

```bash
# Rechercher dans les différences de code
git log -S "AuthService" --oneline

# Rechercher avec regex
git log -G "function.*login" --oneline

# Afficher les différences pour la recherche
git log -S "AuthService" -p
```

### Trouver qui a modifié une ligne de code

```bash
# Afficher l'historique ligne par ligne d'un fichier (blame)
git blame src/app/core/auth/auth.service.ts

# Avec les numéros de lignes
git blame -L 10,20 src/app/core/auth/auth.service.ts

# Format plus lisible
git blame -w src/app/core/auth/auth.service.ts
```

---

## 📈 Statistiques et contributions

### Statistiques globales

```bash
# Nombre de commits par auteur
git shortlog -s -n

# Avec les emails
git shortlog -s -n -e

# Statistiques détaillées
git log --shortstat --oneline
```

### Contributions par fichier

```bash
# Fichiers les plus modifiés
git log --pretty=format: --name-only | sort | uniq -c | sort -rg | head -10

# Statistiques par auteur
git log --author="Cécile" --stat
```

---

## 🛠️ Outils graphiques pour visualiser l'historique

### Utiliser gitk (interface graphique Git)

```bash
# Ouvrir l'interface graphique
gitk

# Pour toutes les branches
gitk --all
```

### Utiliser Git GUI

```bash
git gui
```

### Extensions VS Code recommandées

- **GitLens** : Visualisation avancée de l'historique Git
- **Git Graph** : Graphe interactif des commits
- **Git History** : Historique et recherche de fichiers

---

## 💡 Cas d'usage courants

### 1. Trouver quand un bug a été introduit

```bash
# Utiliser git bisect pour une recherche binaire
git bisect start
git bisect bad                  # La version actuelle est buguée
git bisect good v1.0.0          # La version v1.0.0 était bonne
# Git va checkout différentes versions pour tester
```

### 2. Voir les modifications depuis le dernier déploiement

```bash
# Si vous avez taggué vos déploiements
git log v1.0.0..HEAD --oneline

# Avec les statistiques
git log v1.0.0..HEAD --stat
```

### 3. Générer un changelog

```bash
# Liste des commits entre deux tags
git log v1.0.0..v1.1.0 --oneline --no-merges

# Format changelog
git log v1.0.0..v1.1.0 --pretty=format:"- %s (%h)" --no-merges
```

### 4. Voir les fichiers modifiés récemment

```bash
# Fichiers modifiés dans les 10 derniers commits
git log -10 --name-only --pretty=format: | sort | uniq

# Avec les statistiques
git log -10 --stat --oneline
```

---

## 🌐 Historique sur GitHub

### Interface Web GitHub

1. Accédez au repository : `https://github.com/Evy38/followup-front`
2. Cliquez sur l'onglet **"Commits"**
3. Utilisez les filtres pour :
   - Rechercher par auteur
   - Filtrer par branche
   - Rechercher dans les messages

### Voir l'historique d'un fichier sur GitHub

1. Naviguez vers le fichier dans l'interface GitHub
2. Cliquez sur **"History"** en haut à droite
3. Vous verrez tous les commits qui ont modifié ce fichier

### Pull Requests

- L'onglet **"Pull requests"** montre l'historique des PR
- Chaque PR fermée contient l'historique des reviews et modifications

---

## 📚 Alias Git utiles

Ajoutez ces alias dans votre fichier `~/.gitconfig` pour accélérer vos commandes :

```bash
[alias]
    # Historique compact et coloré
    lg = log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit

    # Historique avec statistiques
    ls = log --stat --oneline

    # Recherche dans l'historique
    find = log --all --oneline --grep

    # Derniers commits
    last = log -10 --oneline

    # Contributeurs
    contributors = shortlog -s -n

    # Historique d'un fichier
    filelog = log -p --
```

Utilisation :
```bash
git lg
git last
git contributors
git filelog src/app/app.routes.ts
```

---

## 🔗 Ressources supplémentaires

### Documentation officielle

- [Git Log Documentation](https://git-scm.com/docs/git-log)
- [Git Basics - Viewing the Commit History](https://git-scm.com/book/en/v2/Git-Basics-Viewing-the-Commit-History)
- [Pro Git Book (Français)](https://git-scm.com/book/fr/v2)

### Tutoriels

- [Atlassian Git Log Tutorial](https://www.atlassian.com/git/tutorials/git-log)
- [Learn Git Branching (interactif)](https://learngitbranching.js.org/?locale=fr_FR)

---

## ❓ Questions fréquentes

### Comment voir l'historique complet du projet ?

```bash
git log --all --graph --oneline
```

### Comment trouver tous mes commits ?

```bash
git log --author="$(git config user.name)" --oneline
```

### Comment annuler le dernier commit (sans perdre les modifications) ?

```bash
git reset --soft HEAD~1
```

### Comment voir ce qui a changé entre deux commits ?

```bash
git diff <commit1> <commit2>
```

### Comment exporter l'historique dans un fichier ?

```bash
git log --all --oneline > historique.txt
git log --all --stat > historique-detaille.txt
```

---

**Auteur** : Documentation FollowUp Front  
**Date** : Février 2026  
**Version** : 1.0.0
