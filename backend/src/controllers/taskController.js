// ============================================
// Task Controller
// Gestion des tâches (vue Kanban en bonus)
// CDC §4 — 3 statuts : todo / en_cours / done
// ============================================

const prisma = require('../config/prisma');

// GET /api/projects/:id/tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { project_id: parseInt(req.params.id) },
      orderBy: [{ statut: 'asc' }, { position: 'asc' }],
      include: {
        assignee: { select: { id: true, nom: true, prenom: true } },
        _count: { select: { comments: true } }
      }
    });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// POST /api/projects/:id/tasks
const createTask = async (req, res) => {
  try {
    const { titre, description, priorite, deadline, assigned_to } = req.body;
    const task = await prisma.task.create({
      data: {
        project_id: parseInt(req.params.id),
        titre,
        description,
        priorite,
        deadline: deadline ? new Date(deadline) : null,
        assigned_to: assigned_to || null
      }
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// PUT /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    const { titre, description, priorite, deadline, assigned_to } = req.body;
    const task = await prisma.task.update({
      where: { id: parseInt(req.params.id) },
      data: {
        titre,
        description,
        priorite,
        deadline: deadline ? new Date(deadline) : null,
        assigned_to
      }
    });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// PUT /api/tasks/:id/move — changer de statut (supervisor / team_leader)
const moveTask = async (req, res) => {
  try {
    const { statut, position } = req.body;
    const taskId = parseInt(req.params.id);

    const oldTask = await prisma.task.findUnique({ where: { id: taskId } });
    if (!oldTask) return res.status(404).json({ message: 'Tâche introuvable' });

    const task = await prisma.task.update({
      where: { id: taskId },
      data: { statut, position }
    });

    await prisma.taskHistory.create({
      data: {
        task_id: taskId,
        changed_by: req.user.id,
        ancien_statut: oldTask.statut,
        nouveau_statut: statut
      }
    });

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    await prisma.task.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Tâche supprimée' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// GET /api/tasks/:id/history
const getTaskHistory = async (req, res) => {
  try {
    const history = await prisma.taskHistory.findMany({
      where: { task_id: parseInt(req.params.id) },
      orderBy: { changed_at: 'desc' },
      include: {
        user: { select: { id: true, nom: true, prenom: true } }
      }
    });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

module.exports = { getTasks, createTask, updateTask, moveTask, deleteTask, getTaskHistory };
