const prisma = require('../config/prisma');

// GET /api/projects/:id/evaluations
const getEvaluations = async (req, res) => {
  try {
    const evaluations = await prisma.evaluation.findMany({
      where: { project_id: parseInt(req.params.id) },
      orderBy: { evaluated_at: 'desc' },
      include: {
        evaluator: { select: { id: true, nom: true, prenom: true, role: true } },
        group:     { select: { id: true, numero: true, sujet: { select: { libelle: true } } } }
      }
    });

    const moyenne = evaluations.length
      ? evaluations.reduce((sum, e) => sum + e.note, 0) / evaluations.length
      : null;

    res.json({ evaluations, moyenne });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// POST /api/projects/:id/evaluations — supervisor only
const createEvaluation = async (req, res) => {
  try {
    const { note, commentaire, group_id } = req.body;

    if (note < 0 || note > 20)
      return res.status(400).json({ message: 'La note doit être entre 0 et 20' });

    const project = await prisma.project.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!project) return res.status(404).json({ message: 'Projet introuvable' });

    if (group_id) {
      const already = await prisma.evaluation.findFirst({
        where: { project_id: parseInt(req.params.id), group_id: parseInt(group_id) }
      });
      if (already)
        return res.status(400).json({ message: 'Ce groupe a déjà été noté' });
    }

    const evaluation = await prisma.evaluation.create({
      data: {
        project_id:   parseInt(req.params.id),
        group_id:     group_id ? parseInt(group_id) : null,
        evaluator_id: req.user.id,
        note:         parseFloat(note),
        commentaire
      },
      include: {
        evaluator: { select: { id: true, nom: true, prenom: true } },
        group:     { select: { id: true, numero: true, sujet: { select: { libelle: true } } } }
      }
    });

    res.status(201).json(evaluation);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// DELETE /api/evaluations/:id — supervisor only
const deleteEvaluation = async (req, res) => {
  try {
    const evaluation = await prisma.evaluation.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!evaluation) return res.status(404).json({ message: 'Évaluation introuvable' });
    if (evaluation.evaluator_id !== req.user.id)
      return res.status(403).json({ message: 'Vous ne pouvez supprimer que vos propres évaluations' });
    await prisma.evaluation.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Évaluation supprimée' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

module.exports = { getEvaluations, createEvaluation, deleteEvaluation };
