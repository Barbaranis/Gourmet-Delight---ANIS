//src/routes/auth.routes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

console.log("✅ auth.routes.js chargé !");

router.get('/test', (req, res) => {
  res.send('✅ Route de test auth OK !');
});

router.post('/login', authController.login);

module.exports = router;
