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
        deliverables: true,
        subjects: true
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
    const { titre, description, date_debut, date_fin, nb_groupes, capacite_max, sujets, student_ids } = req.body;

    const project = await prisma.project.create({
      data: {
        titre,
        description,
        date_debut:    date_debut ? new Date(date_debut) : null,
        date_fin:      date_fin   ? new Date(date_fin)   : null,
        supervisor_id: req.user.id
      }
    });

    // Créer les groupes
    const nbGroupes   = parseInt(nb_groupes)  || 0;
    const capMax      = parseInt(capacite_max) || 5;
    if (nbGroupes > 0) {
      await prisma.projectGroup.createMany({
        data: Array.from({ length: nbGroupes }, (_, i) => ({
          project_id:   project.id,
          numero:       i + 1,
          capacite_max: capMax
        }))
      });
    }

    // Créer la banque de sujets
    if (Array.isArray(sujets) && sujets.length > 0) {
      await prisma.projectSubject.createMany({
        data: sujets.map(libelle => ({ project_id: project.id, libelle }))
      });
    }

    // Assigner les étudiants sélectionnés
    if (Array.isArray(student_ids) && student_ids.length > 0) {
      await prisma.teamMember.createMany({
        data: student_ids.map(uid => ({
          project_id: project.id,
          user_id:    parseInt(uid),
          role_in_project: 'member'
        })),
        skipDuplicates: true
      });
    }

    const full = await prisma.project.findUnique({
      where: { id: project.id },
      include: { groups: true, subjects: true, members: true }
    });

    res.status(201).json(full);
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
