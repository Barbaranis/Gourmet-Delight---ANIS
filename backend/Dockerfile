# ---------- Étape 1 : build de l'image Node ----------
    FROM node:20-alpine


    # Définir le répertoire de travail
    WORKDIR /app
    
    
    # Copier les fichiers nécessaires
    COPY package*.json ./
    
    
    # Installer les dépendances
    RUN npm install
    
    
    # Copier tout le code source
    COPY . .
    
    
    # Exposer le port utilisé par ton backend
    EXPOSE 5000
    
    
    # Lancer le serveur
    CMD ["npm", "run", "start"]
    
    