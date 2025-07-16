// src/controllers/utilisateur.controller.js


const bcrypt = require('bcrypt');
const db = require('../models');
const Utilisateur = db.Utilisateur;


// ✅ Créer un utilisateur (admin uniquement)
exports.createUtilisateur = async (req, res) => {
  const { nom, prenom, email, mot_de_passe, role, telephone } = req.body;


  if (!email || !mot_de_passe || !role) {
    return res.status(400).json({ message: 'Champs obligatoires manquants.' });
  }


  try {
    const existe = await Utilisateur.findOne({ where: { email } });
    if (existe) {
      return res.status(409).json({ message: 'Un utilisateur avec cet email existe déjà.' });
    }


    const hash = await bcrypt.hash(mot_de_passe, 10);


    const nouvelUtilisateur = await Utilisateur.create({
      nom,
      prenom,
      email,
      mot_de_passe: hash,
      role,
      telephone: telephone || null
    });


    res.status(201).json({
      message: 'Utilisateur créé avec succès.',
      utilisateur: {
        id: nouvelUtilisateur.id_utilisateur,
        email: nouvelUtilisateur.email,
        role: nouvelUtilisateur.role
      }
    });
  } catch (error) {
    console.error('Erreur création utilisateur :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};


// ✅ Lire tous les utilisateurs (admin uniquement)
exports.getAllUtilisateurs = async (req, res) => {
  try {
    const utilisateurs = await Utilisateur.findAll({
      attributes: ['id_utilisateur', 'nom', 'prenom', 'email', 'role', 'telephone'],
      order: [['role', 'ASC']]
    });


    res.status(200).json(utilisateurs);
  } catch (error) {
    console.error('Erreur récupération utilisateurs :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};


// ✅ Supprimer un utilisateur (admin uniquement)
exports.deleteUtilisateur = async (req, res) => {
  const { id } = req.params;


  try {
    const utilisateur = await Utilisateur.findByPk(id);
    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }


    await utilisateur.destroy();
    res.status(200).json({ message: 'Utilisateur supprimé.' });
  } catch (error) {
    console.error('Erreur suppression utilisateur :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};


// ✅ Voir les messages du formulaire de contact
exports.getMessages = async (req, res) => {
  try {
    const Contact = require('../models/contact.model')(db.sequelize, db.Sequelize.DataTypes);
    const messages = await Contact.findAll();
    res.status(200).json(messages);
  } catch (error) {
    console.error('Erreur récupération messages :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};


// ✅ Lire les avis des clients
exports.getAvis = async (req, res) => {
  try {
    const Avis = require('../models/avis.model')(db.sequelize, db.Sequelize.DataTypes);
    const avis = await Avis.findAll();
    res.status(200).json(avis);
  } catch (error) {
    console.error('Erreur récupération avis :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};


// ✅ Répondre à un avis
exports.repondreAvis = async (req, res) => {
  try {
    const Avis = require('../models/avis.model')(db.sequelize, db.Sequelize.DataTypes);
    const { id } = req.params;
    const { reponse } = req.body;


    const avis = await Avis.findByPk(id);
    if (!avis) return res.status(404).json({ message: 'Avis non trouvé.' });


    avis.reponse = reponse;
    await avis.save();


    res.status(200).json({ message: 'Réponse envoyée avec succès.', avis });
  } catch (error) {
    console.error('Erreur en répondant à l’avis :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};


// ✅ Modifier une page de contenu
exports.updatePageContent = async (req, res) => {
  try {
    const { page } = req.params;
    const { contenu } = req.body;
    const fs = require('fs');
    const chemin = `./src/content/${page}.json`;


    if (!fs.existsSync(chemin)) {
      return res.status(404).json({ message: 'Page non trouvée.' });
    }


    fs.writeFileSync(chemin, JSON.stringify({ contenu }, null, 2), 'utf-8');
    res.status(200).json({ message: `Contenu de ${page} mis à jour.` });
  } catch (error) {
    console.error('Erreur update contenu :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};


// ✅ Ajouter une réservation
exports.createReservation = async (req, res) => {
  try {
    const Reservation = require('../models/reservation.model')(db.sequelize, db.Sequelize.DataTypes);
    const reservation = await Reservation.create(req.body);
    res.status(201).json({ message: 'Réservation enregistrée.', reservation });
  } catch (error) {
    console.error('Erreur création réservation :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};


// ✅ Lire toutes les réservations
exports.getAllReservations = async (req, res) => {
  try {
    const Reservation = require('../models/reservation.model')(db.sequelize, db.Sequelize.DataTypes);
    const reservations = await Reservation.findAll();
    res.status(200).json(reservations);
  } catch (error) {
    console.error('Erreur récupération réservations :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};


// ✅ Infos de l’utilisateur connecté
exports.getCurrentUtilisateur = async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findByPk(req.user.id_utilisateur, {
      attributes: ['id_utilisateur', 'nom', 'prenom', 'email', 'role', 'telephone']
    });


    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }


    res.status(200).json(utilisateur);
  } catch (error) {
    console.error('Erreur récupération utilisateur connecté :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

