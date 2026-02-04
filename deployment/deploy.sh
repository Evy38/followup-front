#!/bin/bash

#############################################
# Script de déploiement - FollowUp Front
# Usage: ./deploy.sh [sit|uat|prod]
#############################################

set -e  # Arrêter le script en cas d'erreur

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction d'affichage
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier les arguments
if [ $# -eq 0 ]; then
    log_error "Usage: ./deploy.sh [sit|uat|prod]"
    exit 1
fi

ENVIRONMENT=$1
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BUILD_DIR="dist/followup-front/browser"
BACKUP_DIR="backups/${ENVIRONMENT}_${TIMESTAMP}"

log_info "🚀 Début du déploiement vers ${ENVIRONMENT}"

# Validation de l'environnement
case $ENVIRONMENT in
    sit|uat|prod)
        log_info "✅ Environnement valide: ${ENVIRONMENT}"
        ;;
    *)
        log_error "❌ Environnement invalide. Utilisez: sit, uat, ou prod"
        exit 1
        ;;
esac

# Étape 1: Vérifications pré-déploiement
log_info "📋 Étape 1: Vérifications pré-déploiement"

# Vérifier que Node.js est installé
if ! command -v node &> /dev/null; then
    log_error "Node.js n'est pas installé"
    exit 1
fi
log_info "✅ Node.js version: $(node -v)"

# Vérifier que npm est installé
if ! command -v npm &> /dev/null; then
    log_error "npm n'est pas installé"
    exit 1
fi
log_info "✅ npm version: $(npm -v)"

# Étape 2: Installation des dépendances
log_info "📦 Étape 2: Installation des dépendances"
npm ci
log_info "✅ Dépendances installées"

# Étape 3: Build de production
log_info "🔨 Étape 3: Build de l'application pour ${ENVIRONMENT}"
npm run build -- --configuration=${ENVIRONMENT}

if [ ! -d "$BUILD_DIR" ]; then
    log_error "Le dossier de build n'existe pas: ${BUILD_DIR}"
    exit 1
fi
log_info "✅ Build réussi"

# Étape 4: Vérification de la taille des fichiers
log_info "📏 Étape 4: Vérification de la taille du build"
BUILD_SIZE=$(du -sh $BUILD_DIR | cut -f1)
log_info "Taille du build: ${BUILD_SIZE}"

# Étape 5: Création d'un backup (simulation)
log_info "💾 Étape 5: Création d'un backup"
mkdir -p "$BACKUP_DIR"
log_warn "⚠️  Backup simulé - dans un déploiement réel, on sauvegarderait l'ancien build"
log_info "✅ Backup créé dans ${BACKUP_DIR}"

# Étape 6: Déploiement (simulation)
log_info "🚀 Étape 6: Déploiement vers ${ENVIRONMENT}"

case $ENVIRONMENT in
    sit)
        log_info "Déploiement vers SIT (automatique)"
        log_warn "⚠️  Simulation: dans un vrai déploiement, on ferait:"
        echo "     scp -r ${BUILD_DIR}/* user@sit-server:/var/www/followup-front/"
        ;;
    uat)
        log_info "Déploiement vers UAT (après validation)"
        log_warn "⚠️  Simulation: dans un vrai déploiement, on ferait:"
        echo "     scp -r ${BUILD_DIR}/* user@uat-server:/var/www/followup-front/"
        ;;
    prod)
        log_warn "⚠️  ATTENTION: Déploiement vers PRODUCTION"
        read -p "Êtes-vous sûr de vouloir déployer en production? (yes/no): " confirmation
        if [ "$confirmation" != "yes" ]; then
            log_error "Déploiement annulé"
            exit 1
        fi
        log_warn "⚠️  Simulation: dans un vrai déploiement, on ferait:"
        echo "     scp -r ${BUILD_DIR}/* user@prod-server:/var/www/followup-front/"
        echo "     ssh user@prod-server 'sudo systemctl reload nginx'"
        ;;
esac

log_info "✅ Déploiement (simulé) terminé"

# Étape 7: Tests post-déploiement (simulation)
log_info "🧪 Étape 7: Tests post-déploiement"
log_warn "⚠️  Simulation: dans un vrai déploiement, on vérifierait:"
echo "     - Accessibilité du site"
echo "     - Page d'accueil charge correctement"
echo "     - API backend répond"
log_info "✅ Tests post-déploiement (simulés) OK"

# Étape 8: Notification
log_info "📧 Étape 8: Notification"
log_warn "⚠️  Simulation: envoi d'une notification Slack/Email"
echo "     Déploiement de FollowUp Front vers ${ENVIRONMENT} réussi"
echo "     Build: ${BUILD_SIZE}"
echo "     Date: $(date)"

log_info "🎉 Déploiement vers ${ENVIRONMENT} terminé avec succès!"

# Résumé
echo ""
echo "=========================================="
echo "  📊 RÉSUMÉ DU DÉPLOIEMENT"
echo "=========================================="
echo "  Environnement: ${ENVIRONMENT}"
echo "  Date: $(date)"
echo "  Taille du build: ${BUILD_SIZE}"
echo "  Backup: ${BACKUP_DIR}"
echo "=========================================="

Rendre le script exécutable :
chmod +x deployment/deploy.sh