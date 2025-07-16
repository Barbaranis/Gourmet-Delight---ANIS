// backend/src/config/db.js


const { Sequelize } = require('sequelize');


// ✅ Chargement du fichier .env depuis la racine du backend
require('dotenv').config({ path: '../../.env' });


// ✅ Vérification du mot de passe
console.log('🔐 DB_PASSWORD =', process.env.DB_PASSWORD);
console.log('📦 Type =', typeof process.env.DB_PASSWORD);


// ✅ Connexion Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT || 5432,
    logging: false,
  }
);


// ✅ Test de connexion
sequelize
  .authenticate()
  .then(() => console.log('✅ Connexion à la base PostgreSQL réussie.'))
  .catch((err) => console.error('❌ Erreur de connexion à la base :', err));


module.exports = sequelize;

