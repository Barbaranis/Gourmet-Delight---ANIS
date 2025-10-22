// src/server.js
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
const csrf = require('csurf');
const path = require('path');

const sequelize = require('./config/db');

const app = express();
console.log(`🌍 ENV : connecté à la base ${process.env.DB_NAME} en tant que ${process.env.DB_USER}`);

// ------------------------------
// Middlewares globaux (ordre important)
// ------------------------------
app.use(helmet());
app.use(morgan('dev'));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: '⚠️ Trop de requêtes, réessayez plus tard.'
}));

// Parseurs
app.use(cookieParser());
app.use(express.json());

// ✅ CORS (frontend Netlify + localhost)
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'https://gourmet-delight.netlify.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'csrf-token', 'x-csrf-token', 'x-xsrf-token'],
}));

// ------------------------------
// CSRF
// ------------------------------
// Secret stocké en cookie ; le token est lu dans l'entête X-CSRF-Token
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,   // non lisible côté front (sécurité)
    secure: false,    // true en prod HTTPS
    sameSite: 'Lax',  // 'None' + secure:true si front sur autre domaine en HTTPS
  },
  value: (req) => req.get('X-CSRF-Token') || req.get('x-csrf-token') || req.get('x-xsrf-token'),
});

// Endpoint pour obtenir un token ET poser le cookie _csrf sur localhost:5000
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  const token = req.csrfToken();
  // Cookie lisible pour debug (facultatif)
  res.cookie('XSRF-TOKEN', token, { httpOnly: false, sameSite: 'Lax', secure: false });
  res.json({ csrfToken: token });
});

// N'appliquer CSRF qu'aux méthodes qui modifient l'état
const requireCsrfForUnsafeMethods = (req, res, next) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  return csrfProtection(req, res, next);
};

// ------------------------------
// Fichiers statiques (ex : images plats)
// ------------------------------
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ------------------------------
// ROUTES API
// ------------------------------
app.use('/api/auth', requireCsrfForUnsafeMethods, require('./routes/auth.routes'));
app.use('/api/plats', requireCsrfForUnsafeMethods, require('./routes/plat.routes'));
app.use('/api/utilisateurs', requireCsrfForUnsafeMethods, require('./routes/utilisateur.routes'));
app.use('/api/contact', requireCsrfForUnsafeMethods, require('./routes/contact'));

// ------------------------------
// Handler d'erreurs CSRF (après les routes)
// ------------------------------
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({ error: 'Invalid or missing CSRF token' });
  }
  next(err);
});

// ------------------------------
// Test
// ------------------------------
app.get('/', (req, res) => {
  res.send('✅ Serveur backend actif 🍽️');
});

// ------------------------------
// Start serveur
// ------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`🚀 Serveur backend lancé sur http://localhost:${PORT}`);
  try {
    await sequelize.sync();
    console.log('✅ Modèles Sequelize synchronisés avec la base PostgreSQL.');
  } catch (err) {
    console.error('❌ Erreur de sync Sequelize :', err);
  }
});

