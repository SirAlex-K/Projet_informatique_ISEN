// ============================================
// Message Controller — CDC : Espace de collaboration (chat + polling)
// Deux canaux par projet :
//   - Chat de groupe  : group_id = ID du groupe (visible par le groupe + encadrant)
//   - Broadcast       : group_id = null (annonces de l'encadrant à tous)
// Polling côté client : rafraîchissement toutes les 5 secondes
// Routes : GET/POST   /api/projects/:id/messages
//          PUT/DELETE /api/messages/:id
// ============================================

const prisma = require('../config/prisma');
const { createNotification } = require('./notificationController');

// ── GET /api/projects/:id/messages?group_id=X ────────────────────────────────
// Filtre les messages selon le paramètre group_id :
//   group_id=none → messages broadcast (sans groupe, group_id IS NULL)
//   group_id=X    → messages du groupe X uniquement
//   (absent)      → tous les messages du projet
const getMessages = async (req, res) => {
  try {
    const project_id  = parseInt(req.params.id);
    const rawGroupId  = req.query.group_id;

    const groupFilter = rawGroupId === 'none'
      ? null                          // IS NULL en SQL
      : rawGroupId
        ? parseInt(rawGroupId)        // groupe spécifique
        : undefined;                  // pas de filtre group_id

    const messages = await prisma.message.findMany({
      where: {
        project_id,
        ...(groupFilter !== undefined ? { group_id: groupFilter } : {})
      },
      include: { sender: { select: { id: true, nom: true, prenom: true, avatar_url: true } } },
      orderBy: { created_at: 'asc' } // ordre chronologique pour l'affichage chat
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// ── POST /api/projects/:id/messages ──────────────────────────────────────────
// Envoie un message texte et/ou une pièce jointe (image ou PDF).
// Le fichier est géré par Multer avant cette fonction (req.file).
// Après l'envoi (réponse 201 déjà envoyée), des notifications sont créées
// de manière asynchrone pour ne pas bloquer l'expéditeur.
const sendMessage = async (req, res) => {
  try {
    const { contenu, group_id } = req.body;

    // Métadonnées du fichier joint (null si message texte seul)
    let fichier_url  = null;
    let fichier_nom  = null;
    let fichier_type = null;

    if (req.file) {
      fichier_url  = `uploads/${req.file.filename}`;
      fichier_nom  = req.file.originalname;
      // Simplification du type : 'image' ou 'pdf' pour le rendu frontend
      fichier_type = req.file.mimetype.startsWith('image/') ? 'image' : 'pdf';
    }

    if (!contenu?.trim() && !fichier_url) {
      return res.status(400).json({ message: 'Contenu ou fichier requis' });
    }

    const message = await prisma.message.create({
      data: {
        project_id:  parseInt(req.params.id),
        group_id:    group_id ? parseInt(group_id) : null,
        sender_id:   req.user.id,
        contenu:     contenu?.trim() || null,
        fichier_url,
        fichier_nom,
        fichier_type,
      },
      include: { sender: { select: { id: true, nom: true, prenom: true, avatar_url: true } } }
    });

    // Réponse immédiate — les notifications sont traitées après
    res.status(201).json(message);

    // ── Notifications asynchrones ─────────────────────────────────────────────
    // Exécutées dans un bloc async séparé pour ne pas retarder la réponse.
    // Chaque destinataire reçoit une notification avec un aperçu du message.
    const projectId  = parseInt(req.params.id);
    const senderId   = req.user.id;
    const senderName = `${message.sender.prenom} ${message.sender.nom}`;
    const preview    = contenu?.trim()
      ? (contenu.trim().length > 40 ? contenu.trim().slice(0, 40) + '…' : contenu.trim())
      : '📎 Fichier joint';

    (async () => {
      try {
        let recipientIds = [];

        if (group_id) {
          // Message de groupe → membres du groupe (sauf l'expéditeur) + encadrant
          const members = await prisma.projectGroup.findUnique({
            where:   { id: parseInt(group_id) },
            include: { members: { select: { user_id: true } } }
          });
          recipientIds = (members?.members || [])
            .map(m => m.user_id)
            .filter(id => id !== senderId);

          // L'encadrant reçoit aussi les messages de groupe pour le suivi
          const proj = await prisma.project.findUnique({
            where:  { id: projectId },
            select: { supervisor_id: true }
          });
          if (proj?.supervisor_id && proj.supervisor_id !== senderId && !recipientIds.includes(proj.supervisor_id)) {
            recipientIds.push(proj.supervisor_id);
          }
        } else {
          // Broadcast → tous les membres du projet sauf l'expéditeur
          const members = await prisma.teamMember.findMany({
            where:  { project_id: projectId },
            select: { user_id: true }
          });
          recipientIds = members.map(m => m.user_id).filter(id => id !== senderId);
        }

        for (const uid of recipientIds) {
          await createNotification(uid, 'new_message', `${senderName} : ${preview}`, projectId);
        }
      } catch (_) {
        // Erreur de notification silencieuse : ne doit pas affecter l'expérience utilisateur
      }
    })();

  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// ── PATCH /api/messages/:id/read ─────────────────────────────────────────────
// Marque un message comme lu (is_read = true).
const markRead = async (req, res) => {
  try {
    const message = await prisma.message.update({
      where: { id: parseInt(req.params.id) },
      data:  { is_read: true }
    });
    res.json(message);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// ── PUT /api/messages/:id ────────────────────────────────────────────────────
// Modifie le contenu d'un message. Seul l'expéditeur peut modifier son message
// (vérification sender_id === req.user.id).
const updateMessage = async (req, res) => {
  try {
    const msg = await prisma.message.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!msg) return res.status(404).json({ message: 'Message introuvable' });
    if (msg.sender_id !== req.user.id)
      return res.status(403).json({ message: 'Non autorisé' });

    const updated = await prisma.message.update({
      where:   { id: parseInt(req.params.id) },
      data:    { contenu: req.body.contenu },
      include: { sender: { select: { id: true, nom: true, prenom: true } } }
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// ── DELETE /api/messages/:id ─────────────────────────────────────────────────
// Supprime un message. Seul l'expéditeur peut supprimer son propre message.
const deleteMessage = async (req, res) => {
  try {
    const msg = await prisma.message.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!msg) return res.status(404).json({ message: 'Message introuvable' });
    if (msg.sender_id !== req.user.id)
      return res.status(403).json({ message: 'Non autorisé' });

    await prisma.message.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Message supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

module.exports = { getMessages, sendMessage, markRead, updateMessage, deleteMessage };
