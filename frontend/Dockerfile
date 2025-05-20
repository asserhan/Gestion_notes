FROM node:20-alpine

WORKDIR /app

# Installation des dépendances système nécessaires
RUN apk add --no-cache python3 make g++

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie du reste des fichiers
COPY . .


ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

EXPOSE 3000

# Démarrage de l'application
CMD ["npm", "start"] 