// ============================================
// Deliverable Controller — CDC : Dépôt et validation des livrables
// Gère l'upload, la liste et la suppression de fichiers.
// Stockage physique : dossier /uploads/ (servi statiquement)
// Formats acceptés : PDF, ZIP, DOCX, PNG, JPG — max 10 MB (voir upload.middleware)
// Routes : GET/POST  /api/projects/:id/deliverables
//          DELETE    /api/deliverables/:id
// ============================================

const prisma = require('../config/prisma');
const path   = require('path');
const fs     = require('fs');

// ── GET /api/projects/:id/deliverables ──────────────────────────────────────
// Liste tous les livrables d'un projet, triés du plus récent au plus ancien.
// Inclut les infos de l'uploader pour l'affichage dans le dashboard.
const getDeliverables = async (req, res) => {
  try {
    const deliverables = await prisma.deliverable.findMany({
      where:   { project_id: parseInt(req.params.id) },
      include: { uploader: { select: { id: true, nom: true, prenom: true } } },
      orderBy: { uploaded_at: 'desc' }
    });
    res.json(deliverables);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// ── POST /api/projects/:id/deliverables ──────────────────────────────────────
// Dépose un livrable. Le fichier est traité par Multer (upload.middleware)
// avant d'arriver ici : req.file contient les métadonnées du fichier sauvegardé.
// Enregistre en BDD : nom original, chemin de stockage, type MIME et taille.
const uploadDeliverable = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Aucun fichier reçu' });

    const deliverable = await prisma.deliverable.create({
      data: {
        project_id:     parseInt(req.params.id),
        uploaded_by:    req.user.id, // étudiant connecté
        nom_fichier:    req.file.originalname,
        chemin_fichier: req.file.path,   // chemin relatif dans /uploads/
        type_fichier:   req.file.mimetype,
        taille:         req.file.size    // en octets
      }
    });
    res.status(201).json(deliverable);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// ── DELETE /api/deliverables/:id ─────────────────────────────────────────────
// Supprime un livrable : d'abord le fichier physique sur le disque,
// puis l'entrée en base de données. L'ordre est important pour éviter
// des entrées orphelines en BDD si la suppression fichier échoue.
const deleteDeliverable = async (req, res) => {
  try {
    const deliverable = await prisma.deliverable.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!deliverable) return res.status(404).json({ message: 'Livrable introuvable' });

    // Suppression du fichier physique (fs.existsSync évite une erreur si déjà absent)
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
