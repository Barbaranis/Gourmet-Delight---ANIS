
//src/server.js





require('dotenv').config();



// ------------------------------
// Imports
// ------------------------------

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const csurf = require('csurf');
const path = require('path');


const app = express();

const sequelize = require('./config/db');


console.log(`🌍 ENV : connecté à la base ${process.env.DB_NAME} en tant que ${process.env.DB_USER}`);


// ------------------------------
// Middlewares globaux
// ------------------------------
app.use(helmet());
app.use(morgan('dev'));


// 🚫 Anti-brute force
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: '⚠️ Trop de requêtes, réessayez plus tard.'
});
app.use(limiter);


// 🔐 Cookies & body
app.use(cookieParser());
app.use(express.json());


// ✅ CORS (frontend Netlify / localhost)
app.use(cors({
  origin: ['http://localhost:3001', 'https://gourmet-delight.netlify.app'],
  credentials: true
}));


// 🛡️ Protection CSRF (après cookies & JSON)
app.use(csurf({
  cookie: {
    httpOnly: false,        // Front peut lire le token
    secure: false,          // 🔒 true en prod HTTPS
    sameSite: 'Lax'
  }
}));


// 🎫 Route pour récupérer le token CSRF
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});


// ------------------------------
// Fichiers statiques (ex : images plats)
// ------------------------------
app.use('/uploads', express.static(path.join(__dirname, '/src/uploads')));



// ------------------------------
// ROUTES API
// ------------------------------
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/plats', require('./routes/plat.routes'));
app.use('/api/utilisateurs', require('./routes/utilisateur.routes'));
app.use('/api/contact', require('./routes/contact'));


// ------------------------------
// Test
// ------------------------------

app.get('/', (req, res) => {
  res.send('✅ Serveur backend actif 🍽️');
});



// ------------------------------
// Start serveur
// ------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`🚀 Serveur backend lancé sur http://localhost:${PORT}`);


  try {
    await sequelize.sync();
    console.log('✅ Modèles Sequelize synchronisés avec la base PostgreSQL.');
  } catch (err) {
    console.error('❌ Erreur de sync Sequelize :', err);
  }
});

