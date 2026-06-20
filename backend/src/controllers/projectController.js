// ============================================
// Project Controller — CDC : API CRUD projets, équipes, membres
// Gère la création de projets avec groupes, sujets et membres
// Routes : GET/POST/PUT/DELETE /api/projects
// ============================================

const prisma = require('../config/prisma');

// ── GET /api/projects ────────────────────────────────────────────────────────
// Liste tous les projets avec leur encadrant et leurs membres.
// Utilisé par le dashboard superviseur et l'admin.
const getAll = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        supervisor: { select: { id: true, nom: true, prenom: true } },
        members:    true
      }
    });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// ── GET /api/projects/:id ────────────────────────────────────────────────────
// Détail complet d'un projet : encadrant, membres, tâches, livrables, sujets.
const getOne = async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        supervisor:  { select: { id: true, nom: true, prenom: true } },
        members:     { include: { user: { select: { id: true, nom: true, prenom: true, email: true } } } },
        tasks:       true,
        deliverables:true,
        subjects:    true
      }
    });
    if (!project) return res.status(404).json({ message: 'Projet introuvable' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// ── POST /api/projects ───────────────────────────────────────────────────────
// Crée un projet complet en une seule requête :
//   1. Crée le projet (lié à l'encadrant connecté via req.user.id)
//   2. Génère automatiquement les groupes numérotés (1 à nb_groupes)
//   3. Crée la banque de sujets proposés par l'encadrant
//   4. Affecte les étudiants sélectionnés au projet (sans groupe encore)
const create = async (req, res) => {
  try {
    const { titre, description, date_debut, date_fin, nb_groupes, capacite_max, sujets, student_ids } = req.body;

    // Étape 1 — Création du projet
    const project = await prisma.project.create({
      data: {
        titre,
        description,
        date_debut:    date_debut ? new Date(date_debut) : null,
        date_fin:      date_fin   ? new Date(date_fin)   : null,
        supervisor_id: req.user.id // l'encadrant est l'utilisateur connecté
      }
    });

    // Étape 2 — Création des groupes vides numérotés
    const nbGroupes = parseInt(nb_groupes)  || 0;
    const capMax    = parseInt(capacite_max) || 5;
    if (nbGroupes > 0) {
      await prisma.projectGroup.createMany({
        data: Array.from({ length: nbGroupes }, (_, i) => ({
          project_id:   project.id,
          numero:       i + 1,
          capacite_max: capMax
        }))
      });
    }

    // Étape 3 — Banque de sujets (chaque groupe en choisira un)
    if (Array.isArray(sujets) && sujets.length > 0) {
      await prisma.projectSubject.createMany({
        data: sujets.map(libelle => ({ project_id: project.id, libelle }))
      });
    }

    // Étape 4 — Inscription des étudiants (role 'member' par défaut ;
    // le premier à rejoindre un groupe devient automatiquement 'lead')
    if (Array.isArray(student_ids) && student_ids.length > 0) {
      await prisma.teamMember.createMany({
        data: student_ids.map(uid => ({
          project_id:      project.id,
          user_id:         parseInt(uid),
          role_in_project: 'member'
        })),
        skipDuplicates: true // évite les doublons si un étudiant est sélectionné deux fois
      });
    }

    // Retourne le projet complet avec groupes, sujets et membres
    const full = await prisma.project.findUnique({
      where: { id: project.id },
      include: { groups: true, subjects: true, members: true }
    });

    res.status(201).json(full);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// ── PUT /api/projects/:id ────────────────────────────────────────────────────
// Met à jour les métadonnées d'un projet (titre, dates, statut).
// Le statut suit le cycle : propose → valide → en_cours → livré → soutenu → clôturé
const update = async (req, res) => {
  try {
    const { titre, description, date_debut, date_fin, statut } = req.body;
    const project = await prisma.project.update({
      where: { id: parseInt(req.params.id) },
      data: {
        titre, description,
        date_debut: date_debut ? new Date(date_debut) : null,
        date_fin:   date_fin   ? new Date(date_fin)   : null,
        statut
      }
    });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// ── DELETE /api/projects/:id ─────────────────────────────────────────────────
// Supprime un projet et toutes ses données liées (cascade définie dans le schéma Prisma).
const remove = async (req, res) => {
  try {
    await prisma.project.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Projet supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

module.exports = { getAll, getOne, create, update, remove };
