const prisma = require('../config/prisma');

// GET /api/projects/:id/groups
const getGroups = async (req, res) => {
  try {
    const groups = await prisma.projectGroup.findMany({
      where: { project_id: parseInt(req.params.id) },
      include: {
        sujet: true,
        members: {
          include: {
            user: { select: { id: true, nom: true, prenom: true } }
          }
        }
      },
      orderBy: { numero: 'asc' }
    });
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// POST /api/projects/:id/groups/:gid/join
const joinGroup = async (req, res) => {
  try {
    const project_id = parseInt(req.params.id);
    const group_id   = parseInt(req.params.gid);
    const user_id    = req.user.id;

    const group = await prisma.projectGroup.findFirst({
      where: { id: group_id, project_id },
      include: { members: true }
    });
    if (!group) return res.status(404).json({ message: 'Groupe introuvable' });
    if (group.members.length >= group.capacite_max)
      return res.status(400).json({ message: 'Groupe complet' });

    const membership = await prisma.teamMember.findUnique({
      where: { project_id_user_id: { project_id, user_id } }
    });
    if (!membership)
      return res.status(403).json({ message: 'Non assigné à ce projet' });
    if (membership.group_id)
      return res.status(400).json({ message: 'Vous êtes déjà dans un groupe' });

    const isFirst = group.members.length === 0;

    const updated = await prisma.teamMember.update({
      where: { project_id_user_id: { project_id, user_id } },
      data: {
        group_id,
        role_in_project: isFirst ? 'lead' : 'member'
      }
    });

    res.json({ ...updated, isLeader: isFirst });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// PUT /api/projects/:id/groups/:gid/sujet
const chooseSubject = async (req, res) => {
  try {
    const project_id = parseInt(req.params.id);
    const group_id   = parseInt(req.params.gid);
    const user_id    = req.user.id;
    const { sujet_id } = req.body;

    const membership = await prisma.teamMember.findUnique({
      where: { project_id_user_id: { project_id, user_id } }
    });
    if (
      !membership ||
      membership.group_id !== group_id ||
      membership.role_in_project !== 'lead'
    ) {
      return res.status(403).json({ message: 'Seul le team leader peut choisir le sujet' });
    }

    const subject = await prisma.projectSubject.findFirst({
      where: { id: parseInt(sujet_id), project_id }
    });
    if (!subject) return res.status(404).json({ message: 'Sujet introuvable' });

    const alreadyTaken = await prisma.projectGroup.findFirst({
      where: { sujet_id: parseInt(sujet_id), project_id, NOT: { id: group_id } }
    });
    if (alreadyTaken)
      return res.status(400).json({ message: 'Sujet déjà choisi par un autre groupe' });

    const group = await prisma.projectGroup.update({
      where: { id: group_id },
      data: { sujet_id: parseInt(sujet_id) },
      include: { sujet: true }
    });

    res.json(group);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// GET /api/projects/:id/groups/:gid
const getGroup = async (req, res) => {
  try {
    const group = await prisma.projectGroup.findFirst({
      where: { id: parseInt(req.params.gid), project_id: parseInt(req.params.id) },
      include: {
        sujet: true,
        members: {
          include: { user: { select: { id: true, nom: true, prenom: true, email: true } } }
        }
      }
    });
    if (!group) return res.status(404).json({ message: 'Groupe introuvable' });
    res.json(group);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

module.exports = { getGroups, getGroup, joinGroup, chooseSubject };
