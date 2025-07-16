//src/controllers/auth.controller.js

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../models'); // ✅ Import dans index.js
const Utilisateur = db.Utilisateur;

const TOKEN_DURATION = '24h';
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis.' });
    }

    const user = await Utilisateur.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.mot_de_passe); // ✅ CORRIGÉ ICI
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Mot de passe incorrect.' });
    }

    const token = jwt.sign(
      { id: user.id_utilisateur, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: TOKEN_DURATION }
    );

    res.status(200).json({
      message: 'Connexion réussie.',
      token,
      user: {
        id: user.id_utilisateur,
        email: user.email,
        role: user.role,
        prenom: user.prenom
      }
    });
  } catch (error) {
    console.error('Erreur login :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
