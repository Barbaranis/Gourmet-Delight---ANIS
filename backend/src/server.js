//server.js


// 🌿 Chargement du fichier .env pour les variables sensibles (port, BDD, JWT, etc.)
require('dotenv').config();


// ✅ Imports des dépendances principales
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();


// ✅ Connexion à la base de données PostgreSQL via Sequelize
const sequelize = require('./config/db');


// ✅ Affichage de la base à laquelle on est connecté
console.log(`🌍 ENV : connecté à la base ${process.env.DB_NAME} en tant que ${process.env.DB_USER}`);


// ✅ Middlewares globaux
app.use(cors()); // autorise les requêtes cross-origin
app.use(express.json()); // pour parser les JSON reçus


// ✅ Permet d’accéder aux images uploadées depuis le frontend
app.use('/uploads', express.static(path.join(__dirname, '/src/uploads')));


// ✅ Import des routes
const authRoutes = require('./routes/auth.routes');
const platRoutes = require('./routes/plat.routes');
const utilisateurRoutes = require('./routes/utilisateur.routes');
const contactRoutes = require('./routes/contact'); // ✅ Route Firebase ajoutée


// ✅ Déclaration des routes API
app.use('/api/auth', authRoutes);                // Authentification
app.use('/api/plats', platRoutes);               // Plats (CRUD avec image)
app.use('/api/utilisateurs', utilisateurRoutes); // Admin & rôles employés
app.use('/api/contact', contactRoutes);          // ✅ Messages de contact via Firebase


// ✅ Route test racine
app.get('/', (req, res) => {
  res.send('✅ Serveur lancé avec succès 🍽️');
});


// ✅ Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`🚀 Serveur backend en cours sur http://localhost:${PORT}`);


  try {
    // Synchronisation des modèles Sequelize avec la base PostgreSQL
    await sequelize.sync();
    console.log('✅ Modèles Sequelize synchronisés avec la base PostgreSQL.');
  } catch (err) {
    console.error('❌ Erreur de synchronisation Sequelize :', err);
  }
});

