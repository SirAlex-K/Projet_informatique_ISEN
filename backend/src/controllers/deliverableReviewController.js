// ============================================
// Deliverable Review Controller — CDC : Validation des livrables par l'encadrant
// L'encadrant peut statuer sur chaque livrable avec 3 décisions possibles :
//   - accepte  : livrable validé
//   - rejete   : livrable refusé, à soumettre à nouveau
//   - revision : livrable à corriger avant validation
// Routes : GET  /api/deliverables/:id/reviews
//          POST /api/deliverables/:id/reviews  (supervisor uniquement)
// ============================================

const prisma = require('../config/prisma');

// ── GET /api/deliverables/:id/reviews ────────────────────────────────────────
// Récupère toutes les évaluations d'un livrable, triées de la plus récente
// à la plus ancienne. Inclut les infos du relecteur (encadrant).
const getReviews = async (req, res) => {
  try {
    const reviews = await prisma.deliverableReview.findMany({
      where:   { deliverable_id: parseInt(req.params.id) },
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

// ── POST /api/deliverables/:id/reviews ───────────────────────────────────────
// Crée une évaluation sur un livrable. Accès réservé au superviseur
// (contrôlé par le middleware role('supervisor') sur la route).
// Le commentaire est optionnel mais recommandé en cas de rejet ou révision.
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
        reviewer_id:    req.user.id, // encadrant connecté
        decision,                    // 'accepte' | 'rejete' | 'revision'
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
