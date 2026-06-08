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
        members: { include: { user: { select: { id: true, nom: true, prenom: true, email: true } } } },
        tasks: true,
        deliverables: true
      }
    });

    const stats = projects.map(p => ({
      id: p.id,
      titre: p.titre,
      statut: p.statut,
      nb_membres: p.members.length,
      nb_taches: p.tasks.length,
      nb_done: p.tasks.filter(t => t.statut === 'done').length,
      nb_en_cours: p.tasks.filter(t => t.statut === 'en_cours').length,
      nb_livrables: p.deliverables.length,
      avancement: p.tasks.length > 0
        ? Math.round((p.tasks.filter(t => t.statut === 'done').length / p.tasks.length) * 100)
        : 0,
      membres: p.members.map(m => ({ role_in_project: m.role_in_project, ...m.user }))
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
        tasks: { include: { assignee: { select: { id: true, nom: true, prenom: true } } } },
        deliverables: true,
        milestones: { orderBy: { date_cible: 'asc' } }
      }
    });
    if (!project) return res.status(404).json({ message: 'Projet introuvable' });

    const taches_par_statut = {
      todo: project.tasks.filter(t => t.statut === 'todo').length,
      en_cours: project.tasks.filter(t => t.statut === 'en_cours').length,
      done: project.tasks.filter(t => t.statut === 'done').length
    };

    const avancement = project.tasks.length > 0
      ? Math.round((taches_par_statut.done / project.tasks.length) * 100)
      : 0;

    res.json({ project, taches_par_statut, avancement });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// GET /api/dashboard/student
const studentDashboard = async (req, res) => {
  try {
    const membership = await prisma.teamMember.findFirst({
      where: { user_id: req.user.id },
      include: {
        project: {
          include: {
            tasks: { include: { assignee: { select: { id: true, nom: true, prenom: true } } } },
            deliverables: true,
            milestones: { orderBy: { date_cible: 'asc' } },
            supervisor: { select: { id: true, nom: true, prenom: true, email: true } }
          }
        }
      }
    });

    if (!membership) return res.status(404).json({ message: 'Aucun projet assigné' });

    const project = membership.project;
    const myTasks = project.tasks.filter(t => t.assigned_to === req.user.id);
    const avancement = project.tasks.length > 0
      ? Math.round((project.tasks.filter(t => t.statut === 'done').length / project.tasks.length) * 100)
      : 0;

    res.json({
      project: {
        id: project.id,
        titre: project.titre,
        description: project.description,
        statut: project.statut,
        date_debut: project.date_debut,
        date_fin: project.date_fin,
        supervisor: project.supervisor
      },
      role_in_project: membership.role_in_project,
      avancement,
      mes_taches: myTasks,
      livrables: project.deliverables,
      jalons: project.milestones
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

module.exports = { supervisorDashboard, studentDashboard, projectStats };
