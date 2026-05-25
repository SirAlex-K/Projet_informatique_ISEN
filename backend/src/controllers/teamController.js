// ============================================
// Team Controller
// ============================================

const prisma = require('../config/prisma');

// GET /api/projects/:id/members
const getMembers = async (req, res) => {
  try {
    const members = await prisma.teamMember.findMany({
      where: { project_id: parseInt(req.params.id) },
      include: { user: { select: { id: true, nom: true, prenom: true, email: true, avatar_url: true } } }
    });
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// POST /api/projects/:id/members
const addMember = async (req, res) => {
  try {
    const { user_id, role_in_project } = req.body;

    // Un étudiant ne peut appartenir qu'à un seul projet
    const existing = await prisma.teamMember.findFirst({
      where: { user_id: parseInt(user_id) }
    });
    if (existing) {
      return res.status(400).json({ message: 'Cet étudiant est déjà membre d\'un projet' });
    }

    const member = await prisma.teamMember.create({
      data: { project_id: parseInt(req.params.id), user_id: parseInt(user_id), role_in_project: role_in_project || 'member' }
    });
    res.status(201).json(member);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// DELETE /api/projects/:id/members/:uid
const removeMember = async (req, res) => {
  try {
    await prisma.teamMember.delete({
      where: { project_id_user_id: { project_id: parseInt(req.params.id), user_id: parseInt(req.params.uid) } }
    });
    res.json({ message: 'Membre retiré' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

module.exports = { getMembers, addMember, removeMember };
