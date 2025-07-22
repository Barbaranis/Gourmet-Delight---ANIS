# 🛠️ Gourmet Delight — Backend


Ce dossier contient le backend de l’application **Gourmet Delight**, un site web pour un restaurant gastronomique fictif.


Le backend permet la gestion sécurisée des données, la communication avec la base PostgreSQL, la synchronisation avec Firestore, l’authentification des utilisateurs, et la gestion des rôles.


---


## 🎯 Rôle du backend


- Authentification avec rôles (admin, chef_cuisine, etc.)
- Gestion des plats (CRUD)
- Enregistrement des images
- Synchronisation automatique avec Firebase Firestore
- Gestion des employés
- Sécurisation des accès via JWT


---


## 🔌 Technologies utilisées


- Node.js / Express
- PostgreSQL (via Sequelize)
- Firebase Admin SDK
- JSON Web Tokens (JWT)
- Multer (upload d’images)
- Docker (image du backend disponible)


---


## 📦 Données traitées


Le backend gère notamment :


- Les **plats** : création, modification, suppression, image
- Les **employés** : rôle, identité
- L’**authentification** : login, token, sécurité
- La **connexion entre PostgreSQL et Firestore** (chaque plat est synchronisé dans Firebase)


---


## 🐳 Docker


Une image Docker du backend est disponible.  
Elle permet un lancement rapide et portable de l’API :


```bash
docker build -t gourmet-backend .
docker run -p 3000:3000 gourmet-backend

