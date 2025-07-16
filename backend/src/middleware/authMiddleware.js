// src/middleware/authMiddleware.js


const jwt = require('jsonwebtoken');


// ✅ Vérifie le token JWT dans l'en-tête Authorization
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;


  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Accès refusé. Token manquant.' });
  }


  const token = authHeader.split(' ')[1];


  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    req.user = decoded; // stocke les infos du token (id, email, rôle...)
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalide.' });
  }
};


// ✅ Autorise certains rôles, mais l'admin a tous les droits
exports.restrictTo = (...rolesAutorises) => {
  return (req, res, next) => {
    const userRole = req.user.role;


    // ✅ Si l'utilisateur est admin OU a un rôle autorisé, il passe
    if (userRole === 'admin' || rolesAutorises.includes(userRole)) {
      return next();
    }


    return res.status(403).json({ message: 'Accès interdit. Rôle non autorisé.' });
  };
};

