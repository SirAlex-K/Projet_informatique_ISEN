// ============================================
// Project Controller
// ============================================

const prisma = require('../config/prisma');

// GET /api/projects
const getAll = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: { supervisor: { select: { id: true, nom: true, prenom: true } }, members: true }
    });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// GET /api/projects/:id
const getOne = async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        supervisor: { select: { id: true, nom: true, prenom: true } },
        members: { include: { user: { select: { id: true, nom: true, prenom: true, email: true } } } },
        tasks: true,
        deliverables: true
      }
    });
    if (!project) return res.status(404).json({ message: 'Projet introuvable' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// POST /api/projects
const create = async (req, res) => {
  try {
    const { titre, description, date_debut, date_fin } = req.body;
    const project = await prisma.project.create({
      data: { titre, description, date_debut: date_debut ? new Date(date_debut) : null, date_fin: date_fin ? new Date(date_fin) : null, supervisor_id: req.user.id }
    });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// PUT /api/projects/:id
const update = async (req, res) => {
  try {
    const { titre, description, date_debut, date_fin, statut } = req.body;
    const project = await prisma.project.update({
      where: { id: parseInt(req.params.id) },
      data: { titre, description, date_debut: date_debut ? new Date(date_debut) : null, date_fin: date_fin ? new Date(date_fin) : null, statut }
    });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// DELETE /api/projects/:id
const remove = async (req, res) => {
  try {
    await prisma.project.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Projet supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

module.exports = { getAll, getOne, create, update, remove };
