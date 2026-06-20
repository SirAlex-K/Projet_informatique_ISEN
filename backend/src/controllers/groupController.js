// ============================================
// Group Controller — CDC : API CRUD équipes & membres
// Gère les groupes au sein d'un projet :
//   - consultation des groupes et de leurs membres
//   - intégration d'un étudiant dans un groupe (avec élection automatique du leader)
//   - choix du sujet par le Team Leader
// Routes : GET  /api/projects/:id/groups
//          GET  /api/projects/:id/groups/:gid
//          POST /api/projects/:id/groups/:gid/join
//          PUT  /api/projects/:id/groups/:gid/sujet
// ============================================

const prisma = require('../config/prisma');

// ── GET /api/projects/:id/groups ─────────────────────────────────────────────
// Liste tous les groupes d'un projet avec leurs membres et leur sujet choisi.
// Utilisé à la fois par le dashboard superviseur et la page de sélection de groupe.
const getGroups = async (req, res) => {
  try {
    const groups = await prisma.projectGroup.findMany({
      where: { project_id: parseInt(req.params.id) },
      include: {
        sujet:   true,
        members: {
          include: { user: { select: { id: true, nom: true, prenom: true } } }
        }
      },
      orderBy: { numero: 'asc' }
    });
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// ── POST /api/projects/:id/groups/:gid/join ───────────────────────────────────
// Permet à un étudiant de rejoindre un groupe.
// Règle métier : le PREMIER étudiant à rejoindre un groupe vide devient
// automatiquement Team Leader (role_in_project = 'lead').
// Les suivants reçoivent le rôle 'member'.
// Vérifications : groupe non complet, étudiant bien inscrit au projet,
// étudiant sans groupe existant.
const joinGroup = async (req, res) => {
  try {
    const project_id = parseInt(req.params.id);
    const group_id   = parseInt(req.params.gid);
    const user_id    = req.user.id;

    const group = await prisma.projectGroup.findFirst({
      where:   { id: group_id, project_id },
      include: { members: true }
    });
    if (!group) return res.status(404).json({ message: 'Groupe introuvable' });
    if (group.members.length >= group.capacite_max)
      return res.status(400).json({ message: 'Groupe complet' });

    const membership = await prisma.teamMember.findUnique({
      where: { project_id_user_id: { project_id, user_id } }
    });
    if (!membership)
      return res.status(403).json({ message: 'Non assigné à ce projet' });
    if (membership.group_id)
      return res.status(400).json({ message: 'Vous êtes déjà dans un groupe' });

    // Premier membre du groupe → devient Team Leader
    const isFirst = group.members.length === 0;

    const updated = await prisma.teamMember.update({
      where: { project_id_user_id: { project_id, user_id } },
      data: {
        group_id,
        role_in_project: isFirst ? 'lead' : 'member'
      }
    });

    // isLeader est renvoyé au frontend pour déclencher le choix de sujet si nécessaire
    res.json({ ...updated, isLeader: isFirst });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// ── PUT /api/projects/:id/groups/:gid/sujet ───────────────────────────────────
// Permet au Team Leader de choisir le sujet de son groupe.
// Accès restreint : seul le membre avec role_in_project='lead' peut effectuer cette action.
// Vérification que le sujet appartient bien à ce projet.
const chooseSubject = async (req, res) => {
  try {
    const project_id = parseInt(req.params.id);
    const group_id   = parseInt(req.params.gid);
    const user_id    = req.user.id;
    const { sujet_id } = req.body;

    // Vérification : l'utilisateur est bien le leader de ce groupe
    const membership = await prisma.teamMember.findUnique({
      where: { project_id_user_id: { project_id, user_id } }
    });
    if (
      !membership ||
      membership.group_id !== group_id ||
      membership.role_in_project !== 'lead'
    ) {
      return res.status(403).json({ message: 'Seul le team leader peut choisir le sujet' });
    }

    // Vérification : le sujet existe et appartient bien à ce projet
    const subject = await prisma.projectSubject.findFirst({
      where: { id: parseInt(sujet_id), project_id }
    });
    if (!subject) return res.status(404).json({ message: 'Sujet introuvable' });

    // Vérification : sujet non déjà pris par un autre groupe du même projet
    const alreadyTaken = await prisma.projectGroup.findFirst({
      where: { sujet_id: parseInt(sujet_id), project_id, NOT: { id: group_id } }
    });
    if (alreadyTaken)
      return res.status(400).json({ message: 'Sujet déjà choisi par un autre groupe' });

    const group = await prisma.projectGroup.update({
      where:   { id: group_id },
      data:    { sujet_id: parseInt(sujet_id) },
      include: { sujet: true }
    });

    res.json(group);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// ── GET /api/projects/:id/groups/:gid ────────────────────────────────────────
// Détail d'un groupe spécifique avec ses membres et leur email (pour le superviseur).
const getGroup = async (req, res) => {
  try {
    const group = await prisma.projectGroup.findFirst({
      where:   { id: parseInt(req.params.gid), project_id: parseInt(req.params.id) },
      include: {
        sujet:   true,
        members: {
          include: { user: { select: { id: true, nom: true, prenom: true, email: true } } }
        }
      }
    });
    if (!group) return res.status(404).json({ message: 'Groupe introuvable' });
    res.json(group);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

module.exports = { getGroups, getGroup, joinGroup, chooseSubject };
