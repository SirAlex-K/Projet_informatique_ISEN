// ============================================
// Middleware Role — vérifie le rôle de l'user
// Usage : role('supervisor') ou role('student')
// ============================================

module.exports = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Accès refusé — rôle insuffisant' });
  }
  next();
};
