// ============================================
// Middleware Auth — CDC : Authentification JWT
// Vérifie la présence et la validité du token JWT
// dans le header Authorization de chaque requête protégée.
// Usage : router.use(auth) ou router.get('/route', auth, handler)
// ============================================

const jwt    = require('jsonwebtoken');
const { secret } = require('../config/jwt');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Le token doit être au format "Bearer <token>"
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token manquant ou invalide' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // jwt.verify() valide la signature ET l'expiration du token
    const decoded = jwt.verify(token, secret);
    req.user = decoded; // { id, email, role } — disponible dans tous les handlers suivants
    next();
  } catch (err) {
    // Token expiré ou falsifié
    return res.status(401).json({ message: 'Token expiré ou invalide' });
  }
};
