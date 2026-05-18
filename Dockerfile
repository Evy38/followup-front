# ===============================================
# Dockerfile Production - FollowUp Frontend
# ===============================================
# Lance le serveur Angular SSR (rendu côté serveur via Express).
# Sans ce fichier, seuls les fichiers statiques seraient servis —
# le SSR ne fonctionnerait pas.
#
# Multi-stage build :
#   - Stage "builder" : compile Angular en production
#   - Stage "runtime" : image allégée qui lance uniquement le serveur Node

# -----------------------------------------------
# Stage 1: Builder (compilation Angular)
# -----------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances en premier (optimise le cache Docker)
COPY package*.json ./
RUN npm ci

# Copier le reste du code et compiler
COPY . .
RUN npm run build -- --configuration=production

# -----------------------------------------------
# Stage 2: Runtime (serveur Node SSR)
# -----------------------------------------------
FROM node:20-alpine AS runtime

WORKDIR /app

# Copier uniquement le résultat du build et les dépendances runtime
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Railway injecte automatiquement PORT, mais on définit une valeur par défaut
ENV PORT=4000
EXPOSE 4000

# Démarrer le serveur Express SSR généré par Angular
CMD ["node", "dist/followup-front/server/server.mjs"]
