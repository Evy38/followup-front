# ===============================================
# Dockerfile Production - FollowUp Frontend
# ===============================================
# Compile Angular en mode static et sert les fichiers avec nginx.
#
# Multi-stage build :
#   - Stage "builder" : compile Angular en production
#   - Stage "runtime" : nginx sert les fichiers statiques

# -----------------------------------------------
# Stage 1: Builder (compilation Angular)
# -----------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration=production

# -----------------------------------------------
# Stage 2: Runtime (nginx)
# -----------------------------------------------
FROM nginx:alpine AS runtime

# Copier le build Angular (outputMode: static → browser/)
COPY --from=builder /app/dist/followup-front/browser /usr/share/nginx/html

# Config nginx : toutes les routes → index.html (SPA routing)
RUN printf 'server {\n\
    listen 80;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
