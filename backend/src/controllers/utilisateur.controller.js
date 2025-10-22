// src/controllers/utilisateur.controller.js
// ⚠️ Adapte cette import selon ta structure de models
// Si tu as un index.js qui exporte { Utilisateur } :
const { Utilisateur } = require('../models'); 
// Sinon : const Utilisateur = require('../models/Utilisateur');

//
// ✅ Déjà présent dans ton fichier
//
const checkUtilisateurExistant = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email requis.' });

    const utilisateur = await Utilisateur.findOne({ where: { email } });
    if (!utilisateur) {
      return res.status(404).json({
        message: 'Aucun compte associé à cet email. Veuillez contacter un administrateur.'
      });
    }

    return res.status(200).json({
      utilisateur: {
        id: utilisateur.id_utilisateur,
        email: utilisateur.email,
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        role: utilisateur.role
      }
    });
  } catch (error) {
    console.error('❌ Erreur lors de la vérification de l’utilisateur :', error);
    return res.status(500).json({ message: 'Erreur serveur interne.' });
  }
};

//
// 🧩 Stubs pour débloquer toutes tes routes (à implémenter ensuite)
//

// POST /api/utilisateurs/  (admin)
const createUtilisateur = async (req, res, next) => {
  try {
    // TODO: créer un utilisateur en DB
    return res.status(201).json({ message: 'createUtilisateur: OK (stub)' });
  } catch (e) { next(e); }
};

// GET /api/utilisateurs/  (admin)
const getAllUtilisateurs = async (req, res, next) => {
  try {
    // TODO: lister les utilisateurs
    return res.json({ message: 'getAllUtilisateurs: OK (stub)', data: [] });
  } catch (e) { next(e); }
};

// DELETE /api/utilisateurs/:id  (admin)
const deleteUtilisateur = async (req, res, next) => {
  try {
    // TODO: suppression
    return res.json({ message: `deleteUtilisateur: OK (stub) id=${req.params.id}` });
  } catch (e) { next(e); }
};

// GET /api/utilisateurs/messages  (responsable_communication)
const getMessages = async (req, res, next) => {
  try {
    // TODO: récupérer messages Firestore/PG
    return res.json({ message: 'getMessages: OK (stub)', data: [] });
  } catch (e) { next(e); }
};

// GET /api/utilisateurs/avis  (responsable_avis)
const getAvis = async (req, res, next) => {
  try {
    // TODO: récupérer avis
    return res.json({ message: 'getAvis: OK (stub)', data: [] });
  } catch (e) { next(e); }
};

// POST /api/utilisateurs/avis/:id/repondre  (responsable_avis)
const repondreAvis = async (req, res, next) => {
  try {
    // TODO: enregistrer réponse
    return res.json({ message: `repondreAvis: OK (stub) id=${req.params.id}` });
  } catch (e) { next(e); }
};

// PUT /api/utilisateurs/contenu/:page  (gestionnaire_contenu)
const updatePageContent = async (req, res, next) => {
  try {
    // TODO: MAJ contenu (Firestore/PG)
    return res.json({ message: `updatePageContent: OK (stub) page=${req.params.page}` });
  } catch (e) { next(e); }
};

// POST /api/utilisateurs/reservation  (maitre_hotel)
const createReservation = async (req, res, next) => {
  try {
    // TODO: créer réservation
    return res.status(201).json({ message: 'createReservation: OK (stub)' });
  } catch (e) { next(e); }
};

// GET /api/utilisateurs/reservations  (maitre_hotel)
const getAllReservations = async (req, res, next) => {
  try {
    // TODO: lister réservations
    return res.json({ message: 'getAllReservations: OK (stub)', data: [] });
  } catch (e) { next(e); }
};

// GET /api/utilisateurs/me  (connecté)
const getCurrentUtilisateur = async (req, res, next) => {
  try {
    // TODO: renvoyer req.user depuis verifyToken
    return res.json({ message: 'getCurrentUtilisateur: OK (stub)', user: req.user || null });
  } catch (e) { next(e); }
};

module.exports = {
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
};
