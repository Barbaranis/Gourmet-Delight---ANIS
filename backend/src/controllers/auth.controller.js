// 📁 src/controllers/auth.controller.js

const jwt = require('jsonwebtoken');       // 🔐 Gestion des tokens JWT
const bcrypt = require('bcrypt');          // 🔒 Pour hasher/comparer les mots de passe
const db = require('../models');           // 📦 Accès aux modèles Sequelize
const Utilisateur = db.Utilisateur;

const TOKEN_DURATION = '24h';              // ⏱️ Durée du token JWT
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';  // 🔑 Clé secrète pour signer les tokens


// -----------------------------------------------------
// 🔐 Contrôleur : Connexion utilisateur (POST /api/auth/login)
// -----------------------------------------------------
exports.login = async (req, res) => {
  try {
    // ✅ Extraction des données envoyées depuis le frontend
    const { email, mot_de_passe } = req.body;

    // 🔐 Sécurité #1 : Validation des champs requis
    if (!email || !mot_de_passe) {
      return res.status(400).json({ message: 'Email et mot de passe requis.' });
    }

    // 🔍 Recherche de l’utilisateur dans la base
    const user = await Utilisateur.findOne({ where: { email } });

    // 🔐 Sécurité #2 : Vérifie si l’utilisateur existe
    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé.' });
    }

    // 🔐 Sécurité #3 : Compare le mot de passe fourni avec le hash stocké
    const passwordMatch = await bcrypt.compare(mot_de_passe, user.mot_de_passe);

    // 🔐 Sécurité #4 : Refuse si mot de passe invalide
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Mot de passe incorrect.' });
    }

    // 🔐 Sécurité #5 : Génère un token avec les infos minimales (sans données sensibles)
    const token = jwt.sign(
      {
        id: user.id_utilisateur,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: TOKEN_DURATION }
    );

    // 🔐 Sécurité #6 : Envoie le token dans un cookie sécurisé (pour prévenir XSS)
    res
      .cookie('token', token, {
        httpOnly: true,                              // ✅ Inaccessible via JS
        secure: process.env.NODE_ENV === 'production', // ✅ En HTTPS uniquement en prod
        sameSite: 'Strict',                          // ✅ Protection contre les requêtes inter-domaines
        maxAge: 24 * 60 * 60 * 1000                  // ⏱️ 1 jour
      })
      .status(200)
      .json({
        message: 'Connexion réussie.',
        user: {
          id: user.id_utilisateur,
          email: user.email,
          role: user.role,
          prenom: user.prenom
        }
      });

  } catch (error) {
    // 🔐 Sécurité #7 : Gestion propre des erreurs (sans fuite sensible)
    console.error('❌ Erreur login :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
