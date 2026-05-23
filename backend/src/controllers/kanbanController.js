// ============================================
// Kanban Controller
// Seul l'encadrant peut créer / déplacer les cartes
// Les étudiants peuvent seulement lire
// ============================================

const prisma = require('../config/prisma');

// GET /api/projects/:id/cards
const getCards = async (req, res) => {
  try {
    const cards = await prisma.kanbanCard.findMany({
      where: { project_id: parseInt(req.params.id) },
      orderBy: [{ statut: 'asc' }, { position: 'asc' }],
      include: { assignee: { select: { id: true, nom: true, prenom: true } } }
    });
    res.json(cards);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// POST /api/projects/:id/cards
const createCard = async (req, res) => {
  try {
    const { titre, description, priorite, deadline, assigned_to } = req.body;
    const card = await prisma.kanbanCard.create({
      data: {
        project_id: parseInt(req.params.id),
        titre, description, priorite,
        deadline: deadline ? new Date(deadline) : null,
        assigned_to: assigned_to || null
      }
    });
    res.status(201).json(card);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// PUT /api/cards/:id
const updateCard = async (req, res) => {
  try {
    const { titre, description, priorite, deadline, assigned_to } = req.body;
    const card = await prisma.kanbanCard.update({
      where: { id: parseInt(req.params.id) },
      data: { titre, description, priorite, deadline: deadline ? new Date(deadline) : null, assigned_to }
    });
    res.json(card);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// PUT /api/cards/:id/move — déplacer colonne (supervisor only)
const moveCard = async (req, res) => {
  try {
    const { statut, position } = req.body;
    const cardId = parseInt(req.params.id);

    const oldCard = await prisma.kanbanCard.findUnique({ where: { id: cardId } });
    if (!oldCard) return res.status(404).json({ message: 'Carte introuvable' });

    const card = await prisma.kanbanCard.update({
      where: { id: cardId },
      data: { statut, position }
    });

    // Enregistrer dans l'historique
    await prisma.cardHistory.create({
      data: {
        card_id: cardId,
        changed_by: req.user.id,
        ancien_statut: oldCard.statut,
        nouveau_statut: statut
      }
    });

    res.json(card);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// DELETE /api/cards/:id
const deleteCard = async (req, res) => {
  try {
    await prisma.kanbanCard.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Carte supprimée' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

module.exports = { getCards, createCard, updateCard, moveCard, deleteCard };
