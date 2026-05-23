// ============================================
// Message Controller — chat par projet
// Polling côté frontend toutes les 5s
// ============================================

const prisma = require('../config/prisma');

// GET /api/projects/:id/messages
const getMessages = async (req, res) => {
  try {
    const messages = await prisma.message.findMany({
      where: { project_id: parseInt(req.params.id) },
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
    const { contenu } = req.body;
    const message = await prisma.message.create({
      data: { project_id: parseInt(req.params.id), sender_id: req.user.id, contenu },
      include: { sender: { select: { id: true, nom: true, prenom: true, avatar_url: true } } }
    });
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// PUT /api/messages/:id/read
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
