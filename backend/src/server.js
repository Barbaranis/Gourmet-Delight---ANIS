// src/server.js
require('dotenv').config();

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
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginEmbedderPolicy: false,
  })
);
app.use(morgan('dev'));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: '⚠️ Trop de requêtes, réessayez plus tard.',
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------------------------------
// ✅ CORS (localhost + Netlify)
// ------------------------------
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://gourmet-delight.netlify.app',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-CSRF-Token',
      'csrf-token',
      'x-csrf-token',
      'x-xsrf-token',
      'Cache-Control',
      'Pragma',
      'If-None-Match',
      'If-Modified-Since',
      'Accept',
      'Origin',
    ],
  })
);
// ❌ NE PAS utiliser app.options('*', cors()) (peut casser path-to-regexp)

// (optionnel) anti-cache API pour éviter les 304 sans body
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    res.set({
      'Cache-Control': 'no-store',
      Pragma: 'no-cache',
      Expires: '0',
    });
  }
  next();
});

// ------------------------------
// 🔐 CSRF Protection
// ------------------------------
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: false, // ✅ mettre true en prod (HTTPS)
    sameSite: 'Lax',
  },
  value: (req) =>
    req.get('X-CSRF-Token') ||
    req.get('x-csrf-token') ||
    req.get('x-xsrf-token'),
});

// Token CSRF (pose aussi le cookie lisible XSRF-TOKEN)
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  const token = req.csrfToken();
  res.cookie('XSRF-TOKEN', token, {
    httpOnly: false,
    sameSite: 'Lax',
    secure: false,
  });
  res.json({ csrfToken: token });
});

// Appliquer CSRF seulement aux méthodes “dangereuses”
const requireCsrfForUnsafeMethods = (req, res, next) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  return csrfProtection(req, res, next);
};

// ------------------------------
// 📁 Fichiers statiques (images uploadées)
// ------------------------------
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ------------------------------
// 🚦 Routes API
// ------------------------------
app.use('/api/auth', requireCsrfForUnsafeMethods, require('./routes/auth.routes'));
app.use('/api/plats', requireCsrfForUnsafeMethods, require('./routes/plat.routes'));
app.use('/api/utilisateurs', requireCsrfForUnsafeMethods, require('./routes/utilisateur.routes'));
app.use('/api/contact', requireCsrfForUnsafeMethods, require('./routes/contact'));

// ------------------------------
// ⚠️ Gestion des erreurs CSRF
// ------------------------------
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({ error: 'Invalid or missing CSRF token' });
  }
  next(err);
});

// ------------------------------
// Health & ping
// ------------------------------
app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.get('/', (_req, res) => res.send('✅ Serveur backend actif 🍽️'));

// ------------------------------
// 🚀 Lancement du serveur
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

