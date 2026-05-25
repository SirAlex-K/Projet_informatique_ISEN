// ============================================
// Notification Controller
// Alertes système automatiques (CDC §5)
// ============================================

const prisma = require('../config/prisma');

// GET /api/notifications — notifications de l'utilisateur connecté
const getMyNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { user_id: req.user.id },
      orderBy: { created_at: 'desc' },
      take: 50,
      include: {
        project: { select: { id: true, titre: true } }
      }
    });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// GET /api/notifications/unread-count
const getUnreadCount = async (req, res) => {
  try {
    const count = await prisma.notification.count({
      where: { user_id: req.user.id, is_read: false }
    });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// PUT /api/notifications/:id/read — marquer comme lue
const markAsRead = async (req, res) => {
  try {
    const notif = await prisma.notification.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!notif || notif.user_id !== req.user.id) {
      return res.status(404).json({ message: 'Notification introuvable' });
    }
    const updated = await prisma.notification.update({
      where: { id: parseInt(req.params.id) },
      data: { is_read: true }
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// PUT /api/notifications/read-all — tout marquer comme lu
const markAllAsRead = async (req, res) => {
  try {
    await prisma.notification.updateMany({
      where: { user_id: req.user.id, is_read: false },
      data: { is_read: true }
    });
    res.json({ message: 'Toutes les notifications marquées comme lues' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// Fonction utilitaire — créer une notification (appelée depuis d'autres controllers)
const createNotification = async (userId, type, contenu, projectId = null) => {
  await prisma.notification.create({
    data: {
      user_id: userId,
      project_id: projectId,
      type,
      contenu
    }
  });
};

module.exports = { getMyNotifications, getUnreadCount, markAsRead, markAllAsRead, createNotification };
