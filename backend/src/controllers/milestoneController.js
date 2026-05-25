// ============================================
// Milestone Controller
// Jalons du projet (CDC §4)
// ============================================

const prisma = require('../config/prisma');

// GET /api/projects/:id/milestones
const getMilestones = async (req, res) => {
  try {
    const milestones = await prisma.milestone.findMany({
      where: { project_id: parseInt(req.params.id) },
      orderBy: { date_cible: 'asc' }
    });
    res.json(milestones);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// POST /api/projects/:id/milestones
const createMilestone = async (req, res) => {
  try {
    const { titre, description, date_cible } = req.body;
    const milestone = await prisma.milestone.create({
      data: {
        project_id: parseInt(req.params.id),
        titre,
        description,
        date_cible: new Date(date_cible)
      }
    });
    res.status(201).json(milestone);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// PUT /api/milestones/:id
const updateMilestone = async (req, res) => {
  try {
    const { titre, description, date_cible } = req.body;
    const milestone = await prisma.milestone.update({
      where: { id: parseInt(req.params.id) },
      data: {
        titre,
        description,
        date_cible: date_cible ? new Date(date_cible) : undefined
      }
    });
    res.json(milestone);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// PUT /api/milestones/:id/reach — marquer comme atteint
const reachMilestone = async (req, res) => {
  try {
    const milestone = await prisma.milestone.update({
      where: { id: parseInt(req.params.id) },
      data: {
        atteint: true,
        atteint_le: new Date()
      }
    });
    res.json(milestone);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// DELETE /api/milestones/:id
const deleteMilestone = async (req, res) => {
  try {
    await prisma.milestone.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Jalon supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

module.exports = { getMilestones, createMilestone, updateMilestone, reachMilestone, deleteMilestone };
