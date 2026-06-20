// ============================================
// Middleware Role — CDC : Gestion des rôles (RBAC)
// Restreint l'accès à une route selon le rôle de l'utilisateur connecté.
// 3 rôles définis : 'admin' | 'supervisor' | 'student'
// Doit être utilisé APRÈS le middleware auth (req.user doit exister).
//
// Exemples d'usage :
//   router.post('/projects', auth, role('supervisor', 'admin'), create)
//   router.get('/admin/users', auth, role('admin'), getUsers)
// ============================================

module.exports = (...roles) => (req, res, next) => {
  // Vérifie que le rôle de l'utilisateur est dans la liste des rôles autorisés
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Accès refusé — rôle insuffisant' });
  }
  next();
};
