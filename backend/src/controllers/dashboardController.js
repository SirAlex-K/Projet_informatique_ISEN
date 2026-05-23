// ============================================
// Dashboard Controller
// ============================================

const prisma = require('../config/prisma');

// GET /api/dashboard/supervisor
const supervisorDashboard = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: { supervisor_id: req.user.id },
      include: {
        members: true,
        kanban_cards: true,
        deliverables: true
      }
    });

    const stats = projects.map(p => ({
      id: p.id,
      titre: p.titre,
      statut: p.statut,
      nb_membres: p.members.length,
      nb_cartes: p.kanban_cards.length,
      nb_done: p.kanban_cards.filter(c => c.statut === 'done').length,
      nb_bloque: p.kanban_cards.filter(c => c.statut === 'bloque').length,
      nb_livrables: p.deliverables.length,
      avancement: p.kanban_cards.length > 0
        ? Math.round((p.kanban_cards.filter(c => c.statut === 'done').length / p.kanban_cards.length) * 100)
        : 0
    }));

    res.json({ total_projets: projects.length, projets: stats });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// GET /api/dashboard/project/:id
const projectStats = async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        members: { include: { user: { select: { id: true, nom: true, prenom: true } } } },
        kanban_cards: { include: { assignee: { select: { id: true, nom: true, prenom: true } } } },
        deliverables: true
      }
    });
    if (!project) return res.status(404).json({ message: 'Projet introuvable' });

    const cartes_par_colonne = {
      todo: project.kanban_cards.filter(c => c.statut === 'todo').length,
      en_cours: project.kanban_cards.filter(c => c.statut === 'en_cours').length,
      done: project.kanban_cards.filter(c => c.statut === 'done').length,
      bloque: project.kanban_cards.filter(c => c.statut === 'bloque').length
    };

    res.json({ project, cartes_par_colonne });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

module.exports = { supervisorDashboard, projectStats };
