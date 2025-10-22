// src/middleware/verifyRecaptcha.js
// Vérifie le token reCAPTCHA envoyé par le front.
// En DEV, si token === 'dev', on bypass (pas d’appel Google).


const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));


module.exports = async function verifyRecaptcha(req, res, next) {
  try {
    const token = req.body?.recaptchaToken;


    if (!token) {
      return res.status(400).json({ message: 'reCAPTCHA manquant.' });
    }


    // Bypass en non-prod pour développer sereinement
    if (process.env.NODE_ENV !== 'production' && token === 'dev') {
      return next();
    }


    const secret = process.env.RECAPTCHA_SECRET; // mets ta clé secrète reCAPTCHA v2/v3 dans .env
    if (!secret) {
      console.warn('⚠️ RECAPTCHA_SECRET manquant (bypass rejeté en prod)');
      return res.status(500).json({ message: 'Config reCAPTCHA manquante.' });
    }


    const resp = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token })
    });
    const data = await resp.json();


    // score (v3) optionnel : on exige >= 0.5 si présent
    if (!data.success || (typeof data.score === 'number' && data.score < 0.5)) {
      return res.status(401).json({ message: 'reCAPTCHA invalide.' });
    }


    next();
  } catch (e) {
    console.error('verifyRecaptcha error:', e);
    res.status(500).json({ message: 'Erreur vérification reCAPTCHA.' });
  }
};



