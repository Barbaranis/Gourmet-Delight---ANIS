//src/routes/auth.routes.js




const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { body, validationResult } = require('express-validator');


console.log("✅ auth.routes.js chargé !");


// ✅ Route de test
router.get('/test', (req, res) => {
  res.send('✅ Route de test auth OK !');
});


// --------------------------------------------
// 🔐 Route POST /login : Connexion utilisateur
// --------------------------------------------
router.post(
  '/login',
  [
    body('email')
      .notEmpty().withMessage("L'email est requis.")
      .isEmail().withMessage("L'email n'est pas valide.")
      .normalizeEmail(),


    body('mot_de_passe')
      .notEmpty().withMessage("Le mot de passe est requis.")
      .isLength({ min: 6 }).withMessage("Le mot de passe doit faire au moins 6 caractères.")
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ erreurs: errors.array() });
    }


    return authController.login(req, res);
  }
);


// --------------------------------------------
// 🔐 Route POST /register : Inscription sécurisée
// --------------------------------------------
router.post(
  '/register',
  [
    body('email')
      .notEmpty().withMessage("L'email est requis.")
      .isEmail().withMessage("L'email n'est pas valide.")
      .normalizeEmail(),


    body('mot_de_passe')
      .notEmpty().withMessage("Le mot de passe est requis.")
      .isLength({ min: 6 }).withMessage("Le mot de passe doit faire au moins 6 caractères."),


    body('prenom')
      .trim()
      .notEmpty().withMessage("Le prénom est requis.")
      .isLength({ min: 2 }).withMessage("Le prénom est trop court.")
      .escape(),


    body('role')
      .optional()
      .isIn(['admin', 'chef_cuisine', 'maitre_hotel', 'responsable_salle', 'gestionnaire_contenu', 'employe'])
      .withMessage("Rôle invalide.")
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ erreurs: errors.array() });
    }


    return authController.register(req, res);
  }
);


module.exports = router;



