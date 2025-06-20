# Image de base Node.js
FROM node:18

# Dossier de travail dans le conteneur
WORKDIR /app

# Copie les fichiers nécessaires
COPY package*.json ./

# Installe les dépendances (ne fera rien si y’en a pas, mais doit quand même être là)
RUN npm install

# Copie le reste (ton index.js par ex.)
COPY . .

# Lance le serveur
CMD ["npm", "start"]

