// ============================================
// Task Controller — CDC : Gestion des tâches (statuts, assignation Kanban)
// 3 statuts : todo → en_cours → done
// 3 priorités : basse / normale / haute
// Routes : GET/POST  /api/projects/:id/tasks
//          PUT/DELETE /api/tasks/:id
//          PUT        /api/tasks/:id/move
//          GET        /api/tasks/:id/history
// ============================================

const prisma = require('../config/prisma');

// ── GET /api/projects/:id/tasks ──────────────────────────────────────────────
// Récupère toutes les tâches d'un projet, triées par statut puis position
// (pour respecter l'ordre d'affichage dans le Kanban).
// Inclut l'assignataire et le nombre de commentaires par tâche.
const getTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where:   { project_id: parseInt(req.params.id) },
      orderBy: [{ statut: 'asc' }, { position: 'asc' }],
      include: {
        assignee: { select: { id: true, nom: true, prenom: true } },
        _count:   { select: { comments: true } }
      }
    });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// ── POST /api/projects/:id/tasks ─────────────────────────────────────────────
// Crée une nouvelle tâche dans un projet.
// L'assigned_to est optionnel : une tâche peut être créée sans assignataire.
const createTask = async (req, res) => {
  try {
    const { titre, description, priorite, deadline, assigned_to } = req.body;
    const task = await prisma.task.create({
      data: {
        project_id:  parseInt(req.params.id),
        titre,
        description,
        priorite,
        deadline:    deadline ? new Date(deadline) : null,
        assigned_to: assigned_to || null
      }
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// ── PUT /api/tasks/:id ───────────────────────────────────────────────────────
// Met à jour les informations d'une tâche (titre, description, priorité,
// deadline, assignataire). Utilisé notamment pour l'assignation depuis
// le Kanban étudiant (assigned_to peut être null pour désassigner).
const updateTask = async (req, res) => {
  try {
    const { titre, description, priorite, deadline, assigned_to } = req.body;
    const task = await prisma.task.update({
      where: { id: parseInt(req.params.id) },
      data: {
        titre, description, priorite,
        deadline:    deadline ? new Date(deadline) : null,
        assigned_to
      }
    });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// ── PUT /api/tasks/:id/move ──────────────────────────────────────────────────
// Déplace une tâche dans le Kanban (changement de colonne = changement de statut).
// Enregistre automatiquement chaque changement dans task_history
// pour un suivi complet de l'avancement (traçabilité CDC §4).
const moveTask = async (req, res) => {
  try {
    const { statut, position } = req.body;
    const taskId = parseInt(req.params.id);

    // Récupère l'ancien statut avant mise à jour pour l'historique
    const oldTask = await prisma.task.findUnique({ where: { id: taskId } });
    if (!oldTask) return res.status(404).json({ message: 'Tâche introuvable' });

    const task = await prisma.task.update({
      where: { id: taskId },
      data:  { statut, position }
    });

    // Historique : qui a changé quoi et quand (changed_by = utilisateur connecté)
    await prisma.taskHistory.create({
      data: {
        task_id:       taskId,
        changed_by:    req.user.id,
        ancien_statut: oldTask.statut,
        nouveau_statut: statut
      }
    });

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// ── DELETE /api/tasks/:id ────────────────────────────────────────────────────
// Supprime une tâche (et son historique via cascade Prisma).
const deleteTask = async (req, res) => {
  try {
    await prisma.task.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Tâche supprimée' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// ── GET /api/tasks/:id/history ───────────────────────────────────────────────
// Retourne l'historique complet des changements de statut d'une tâche,
// trié du plus récent au plus ancien.
const getTaskHistory = async (req, res) => {
  try {
    const history = await prisma.taskHistory.findMany({
      where:   { task_id: parseInt(req.params.id) },
      orderBy: { changed_at: 'desc' },
      include: { user: { select: { id: true, nom: true, prenom: true } } }
    });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

module.exports = { getTasks, createTask, updateTask, moveTask, deleteTask, getTaskHistory };
