// ============================================
// Deliverable Controller
// ============================================

const prisma = require('../config/prisma');
const path = require('path');
const fs = require('fs');

// GET /api/projects/:id/deliverables
const getDeliverables = async (req, res) => {
  try {
    const deliverables = await prisma.deliverable.findMany({
      where: { project_id: parseInt(req.params.id) },
      include: { uploader: { select: { id: true, nom: true, prenom: true } } },
      orderBy: { uploaded_at: 'desc' }
    });
    res.json(deliverables);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// POST /api/projects/:id/deliverables
const uploadDeliverable = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Aucun fichier reçu' });

    const deliverable = await prisma.deliverable.create({
      data: {
        project_id: parseInt(req.params.id),
        uploaded_by: req.user.id,
        nom_fichier: req.file.originalname,
        chemin_fichier: req.file.path,
        type_fichier: req.file.mimetype,
        taille: req.file.size
      }
    });
    res.status(201).json(deliverable);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// DELETE /api/deliverables/:id
const deleteDeliverable = async (req, res) => {
  try {
    const deliverable = await prisma.deliverable.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!deliverable) return res.status(404).json({ message: 'Livrable introuvable' });

    // Supprimer le fichier physique
    if (fs.existsSync(deliverable.chemin_fichier)) {
      fs.unlinkSync(deliverable.chemin_fichier);
    }

    await prisma.deliverable.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Livrable supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

module.exports = { getDeliverables, uploadDeliverable, deleteDeliverable };
