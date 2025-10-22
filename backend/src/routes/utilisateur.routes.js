// src/routes/utilisateur.routes.js
const express = require('express');
const router = express.Router();

// --- Controllers (import unique & clair)
const {
  checkUtilisateurExistant,
  createUtilisateur,
  getAllUtilisateurs,
  deleteUtilisateur,
  getMessages,
  getAvis,
  repondreAvis,
  updatePageContent,
  createReservation,
  getAllReservations,
  getCurrentUtilisateur,
} = require('../controllers/utilisateur.controller');

// --- Middlewares d'authZ/authN
const { verifyToken, restrictTo } = require('../middleware/authMiddleware');

// 🔐 Route de test admin
router.get('/admin-only', verifyToken, restrictTo('admin'), (req, res) => {
  res.json({ message: 'Bienvenue administrateur !' });
});

// 🔁 Vérifie existence utilisateur (Firebase ↔ Postgres)
router.post('/check', checkUtilisateurExistant);

// 👤 CRUD utilisateurs (admin)
router.post('/', verifyToken, restrictTo('admin'), createUtilisateur);
router.get('/', verifyToken, restrictTo('admin'), getAllUtilisateurs);
router.delete('/:id', verifyToken, restrictTo('admin'), deleteUtilisateur);

// 💬 Messages (responsable_communication)
router.get('/messages', verifyToken, restrictTo('responsable_communication'), getMessages);

// ⭐ Avis (responsable_avis)
router.get('/avis', verifyToken, restrictTo('responsable_avis'), getAvis);
router.post('/avis/:id/repondre', verifyToken, restrictTo('responsable_avis'), repondreAvis);

// 📝 Contenu (gestionnaire_contenu)
router.put('/contenu/:page', verifyToken, restrictTo('gestionnaire_contenu'), updatePageContent);

// 🍽️ Réservations (maître d’hôtel)
router.post('/reservation', verifyToken, restrictTo('maitre_hotel'), createReservation);
router.get('/reservations', verifyToken, restrictTo('maitre_hotel'), getAllReservations);

// 👤 Moi
router.get('/me', verifyToken, getCurrentUtilisateur);

module.exports = router;

