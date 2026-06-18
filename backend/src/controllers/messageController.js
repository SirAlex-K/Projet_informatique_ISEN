const prisma = require('../config/prisma');

// GET /api/projects/:id/messages?group_id=X
const getMessages = async (req, res) => {
  try {
    const project_id = parseInt(req.params.id);
    const rawGroupId = req.query.group_id;
    // group_id=none → messages broadcast (group_id IS NULL)
    // group_id=X    → messages du groupe X
    // (absent)      → tous les messages
    const groupFilter = rawGroupId === 'none'
      ? null
      : rawGroupId ? parseInt(rawGroupId) : undefined;

    const messages = await prisma.message.findMany({
      where: { project_id, ...(groupFilter !== undefined ? { group_id: groupFilter } : {}) },
      include: { sender: { select: { id: true, nom: true, prenom: true, avatar_url: true } } },
      orderBy: { created_at: 'asc' }
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// POST /api/projects/:id/messages
const sendMessage = async (req, res) => {
  try {
    const { contenu, group_id } = req.body;
    const message = await prisma.message.create({
      data: {
        project_id: parseInt(req.params.id),
        group_id:   group_id ? parseInt(group_id) : null,
        sender_id:  req.user.id,
        contenu,
      },
      include: { sender: { select: { id: true, nom: true, prenom: true, avatar_url: true } } }
    });
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

const markRead = async (req, res) => {
  try {
    const message = await prisma.message.update({
      where: { id: parseInt(req.params.id) },
      data: { is_read: true }
    });
    res.json(message);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

module.exports = { getMessages, sendMessage, markRead };
