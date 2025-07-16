// Importation d'Express et création d'un routeur
const express = require('express');
const router = express.Router();


// Import du contrôleur qui contient les fonctions liées aux utilisateurs
const controller = require('../controllers/utilisateur.controller');


// Import des middlewares d'authentification et d’autorisation
const { verifyToken, restrictTo } = require('../middleware/authMiddleware');




// 🔐 Route de test accessible uniquement aux administrateurs connectés
// Utile pour tester que le token et les permissions fonctionnent
router.get('/admin-only', verifyToken, restrictTo('admin'), (req, res) => {
  res.json({ message: 'Bienvenue administrateur !' });
});




// 👤 Créer un utilisateur (employé) — seul l’administrateur peut faire ça
router.post('/', verifyToken, restrictTo('admin'), controller.createUtilisateur);




// 📋 Lire tous les utilisateurs — visible uniquement par l’admin
router.get('/', verifyToken, restrictTo('admin'), controller.getAllUtilisateurs);




// ❌ Supprimer un utilisateur via son ID — uniquement pour l’admin
router.delete('/:id', verifyToken, restrictTo('admin'), controller.deleteUtilisateur);




// 📥 Voir les messages du formulaire de contact — rôle : responsable_communication
router.get('/messages', verifyToken, restrictTo('responsable_communication'), controller.getMessages);




// 💬 Lire les avis des clients — rôle : responsable_avis
router.get('/avis', verifyToken, restrictTo('responsable_avis'), controller.getAvis);




// ✅ Répondre à un avis — même rôle : responsable_avis
router.post('/avis/:id/repondre', verifyToken, restrictTo('responsable_avis'), controller.repondreAvis);




// 📝 Modifier du contenu (page d’accueil, à propos...) — rôle : gestionnaire_contenu
router.put('/contenu/:page', verifyToken, restrictTo('gestionnaire_contenu'), controller.updatePageContent);




// 🍽️ Créer une réservation client — uniquement par un maître d’hôtel
router.post('/reservation', verifyToken, restrictTo('maitre_hotel'), controller.createReservation);




// 👀 Lire toutes les réservations — pour que le maître d’hôtel puisse gérer
router.get('/reservations', verifyToken, restrictTo('maitre_hotel'), controller.getAllReservations);




// 👤 Voir les infos de l’utilisateur connecté (admin ou employé)
router.get('/me', verifyToken, controller.getCurrentUtilisateur);




// Exportation du routeur pour l’utiliser dans server.js
module.exports = router;

