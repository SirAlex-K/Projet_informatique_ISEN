// ============================================
// Middleware ProjectRole
// Vérifie si l'user est supervisor/admin
// OU team leader du projet concerné
// ============================================

const prisma = require('../config/prisma');

const isLeaderOrSupervisor = async (req, res, next) => {
  try {
    const { role, id: userId } = req.user;

    // Admin et supervisor passent toujours
    if (role === 'admin' || role === 'supervisor') return next();

    // Pour les étudiants — vérifier si team leader du projet
    const projectId = parseInt(req.params.id);
    if (!projectId) return res.status(403).json({ message: 'Accès refusé' });

    const membership = await prisma.teamMember.findFirst({
      where: { project_id: projectId, user_id: userId, role_in_project: 'lead' }
    });

    if (membership) return next();

    return res.status(403).json({ message: 'Accès refusé — rôle insuffisant' });
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

module.exports = { isLeaderOrSupervisor };
