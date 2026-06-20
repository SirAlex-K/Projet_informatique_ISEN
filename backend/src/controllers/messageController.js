const prisma = require('../config/prisma');
const { createNotification } = require('./notificationController');

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

    let fichier_url  = null;
    let fichier_nom  = null;
    let fichier_type = null;

    if (req.file) {
      fichier_url  = `uploads/${req.file.filename}`;
      fichier_nom  = req.file.originalname;
      fichier_type = req.file.mimetype.startsWith('image/') ? 'image' : 'pdf';
    }

    if (!contenu?.trim() && !fichier_url) {
      return res.status(400).json({ message: 'Contenu ou fichier requis' });
    }

    const message = await prisma.message.create({
      data: {
        project_id:  parseInt(req.params.id),
        group_id:    group_id ? parseInt(group_id) : null,
        sender_id:   req.user.id,
        contenu:     contenu?.trim() || null,
        fichier_url,
        fichier_nom,
        fichier_type,
      },
      include: { sender: { select: { id: true, nom: true, prenom: true, avatar_url: true } } }
    });
    res.status(201).json(message);

    // Notifications asynchrones (sans bloquer la réponse)
    const projectId = parseInt(req.params.id);
    const senderId  = req.user.id;
    const senderName = `${message.sender.prenom} ${message.sender.nom}`;
    const preview = contenu?.trim()
      ? (contenu.trim().length > 40 ? contenu.trim().slice(0, 40) + '…' : contenu.trim())
      : '📎 Fichier joint';

    (async () => {
      try {
        let recipientIds = [];
        if (group_id) {
          // Message de groupe → membres du groupe sauf l'expéditeur
          const members = await prisma.projectGroup.findUnique({
            where: { id: parseInt(group_id) },
            include: { members: { select: { user_id: true } } }
          });
          recipientIds = (members?.members || []).map(m => m.user_id).filter(id => id !== senderId);
          // + le superviseur du projet
          const proj = await prisma.project.findUnique({ where: { id: projectId }, select: { supervisor_id: true } });
          if (proj?.supervisor_id && proj.supervisor_id !== senderId && !recipientIds.includes(proj.supervisor_id)) {
            recipientIds.push(proj.supervisor_id);
          }
        } else {
          // Broadcast → tous les membres du projet sauf l'expéditeur
          const members = await prisma.teamMember.findMany({ where: { project_id: projectId }, select: { user_id: true } });
          recipientIds = members.map(m => m.user_id).filter(id => id !== senderId);
        }
        for (const uid of recipientIds) {
          await createNotification(uid, 'new_message', `${senderName} : ${preview}`, projectId);
        }
      } catch (_) {}
    })();
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

// PUT /api/messages/:id
const updateMessage = async (req, res) => {
  try {
    const msg = await prisma.message.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!msg) return res.status(404).json({ message: 'Message introuvable' });
    if (msg.sender_id !== req.user.id)
      return res.status(403).json({ message: 'Non autorisé' });
    const updated = await prisma.message.update({
      where: { id: parseInt(req.params.id) },
      data: { contenu: req.body.contenu },
      include: { sender: { select: { id: true, nom: true, prenom: true } } }
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// DELETE /api/messages/:id
const deleteMessage = async (req, res) => {
  try {
    const msg = await prisma.message.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!msg) return res.status(404).json({ message: 'Message introuvable' });
    if (msg.sender_id !== req.user.id)
      return res.status(403).json({ message: 'Non autorisé' });
    await prisma.message.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Message supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

module.exports = { getMessages, sendMessage, markRead, updateMessage, deleteMessage };
