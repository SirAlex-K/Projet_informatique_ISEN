// ============================================
// Comment Controller
// Commentaires sur projets et tâches (CDC §5)
// ============================================

const prisma = require('../config/prisma');

// GET /api/projects/:id/comments
const getProjectComments = async (req, res) => {
  try {
    const comments = await prisma.comment.findMany({
      where: { project_id: parseInt(req.params.id), task_id: null },
      orderBy: { created_at: 'desc' },
      include: {
        author: { select: { id: true, nom: true, prenom: true, role: true } }
      }
    });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// GET /api/tasks/:id/comments
const getTaskComments = async (req, res) => {
  try {
    const comments = await prisma.comment.findMany({
      where: { task_id: parseInt(req.params.id) },
      orderBy: { created_at: 'asc' },
      include: {
        author: { select: { id: true, nom: true, prenom: true, role: true } }
      }
    });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// POST /api/projects/:id/comments
const createComment = async (req, res) => {
  try {
    const { contenu, task_id } = req.body;
    const comment = await prisma.comment.create({
      data: {
        project_id: parseInt(req.params.id),
        task_id: task_id ? parseInt(task_id) : null,
        author_id: req.user.id,
        contenu
      },
      include: {
        author: { select: { id: true, nom: true, prenom: true, role: true } }
      }
    });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// PUT /api/comments/:id
const updateComment = async (req, res) => {
  try {
    const comment = await prisma.comment.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!comment) return res.status(404).json({ message: 'Commentaire introuvable' });
    if (comment.author_id !== req.user.id) return res.status(403).json({ message: 'Non autorisé' });

    const updated = await prisma.comment.update({
      where: { id: parseInt(req.params.id) },
      data: { contenu: req.body.contenu }
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// DELETE /api/comments/:id
const deleteComment = async (req, res) => {
  try {
    const comment = await prisma.comment.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!comment) return res.status(404).json({ message: 'Commentaire introuvable' });
    if (comment.author_id !== req.user.id && req.user.role !== 'supervisor' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé' });
    }
    await prisma.comment.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Commentaire supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

module.exports = { getProjectComments, getTaskComments, createComment, updateComment, deleteComment };
