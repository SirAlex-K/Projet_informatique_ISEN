// ============================================
// Deliverable Review Controller
// Validation des livrables par l'encadrant (CDC §6)
// Décisions : accepte / rejete / revision
// ============================================

const prisma = require('../config/prisma');

// GET /api/deliverables/:id/reviews
const getReviews = async (req, res) => {
  try {
    const reviews = await prisma.deliverableReview.findMany({
      where: { deliverable_id: parseInt(req.params.id) },
      orderBy: { reviewed_at: 'desc' },
      include: {
        reviewer: { select: { id: true, nom: true, prenom: true, role: true } }
      }
    });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// POST /api/deliverables/:id/reviews — supervisor only
const createReview = async (req, res) => {
  try {
    const { decision, commentaire } = req.body;

    const deliverable = await prisma.deliverable.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!deliverable) return res.status(404).json({ message: 'Livrable introuvable' });

    const review = await prisma.deliverableReview.create({
      data: {
        deliverable_id: parseInt(req.params.id),
        reviewer_id: req.user.id,
        decision,
        commentaire
      },
      include: {
        reviewer: { select: { id: true, nom: true, prenom: true } }
      }
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

module.exports = { getReviews, createReview };
