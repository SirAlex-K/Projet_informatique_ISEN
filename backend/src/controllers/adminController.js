// ============================================
// Admin Controller
// Gestion des comptes utilisateurs
// Seul l'admin peut créer / modifier / supprimer
// ============================================

const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');

// Valeurs institutionnelles fixes
const OPTIONS = {
  formations: ['ISEN', 'HEI', 'ISA'],
  promos: ['2025-2026', '2026-2027', '2027-2028', '2028-2029', '2029-2030'],
  classesByFormation: {
    ISEN: ['CIR 1', 'CIR 2', 'CIR 3', 'CSI 1', 'CSI 2', 'CSI 3'],
    HEI:  ['HEI 1', 'HEI 2', 'HEI 3'],
    ISA:  ['ISA 1', 'ISA 2', 'ISA 3'],
  },
};

// GET /api/admin/options — listes déroulantes formation & promo
const getOptions = (req, res) => {
  res.json(OPTIONS);
};

// GET /api/admin/users — liste tous les users
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true, nom: true, prenom: true,
        email: true, role: true, classe: true, formation: true, promo: true,
        avatar_url: true, created_at: true,
        team_memberships: {
          include: { project: { select: { id: true, titre: true } } }
        }
      },
      orderBy: { created_at: 'desc' }
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// GET /api/admin/users/:id
const getUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.id) },
      select: {
        id: true, nom: true, prenom: true,
        email: true, role: true, classe: true, formation: true, promo: true,
        avatar_url: true, created_at: true,
        team_memberships: {
          include: { project: { select: { id: true, titre: true, statut: true } } }
        }
      }
    });
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// POST /api/admin/users — créer un compte
const createUser = async (req, res) => {
  try {
    const { nom, prenom, email, password, role, classe, formation, promo } = req.body;

    if (!nom || !prenom || !email || !password || !role) {
      return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ message: 'Email déjà utilisé' });

    const password_hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { nom, prenom, email, password_hash, role, classe, formation, promo },
      select: { id: true, nom: true, prenom: true, email: true, role: true, classe: true, formation: true, promo: true, created_at: true }
    });

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// PUT /api/admin/users/:id — modifier un compte
const updateUser = async (req, res) => {
  try {
    const { nom, prenom, email, role, password, classe, formation, promo } = req.body;

    const data = { nom, prenom, email, role, classe, formation, promo };
    if (password) {
      data.password_hash = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data,
      select: { id: true, nom: true, prenom: true, email: true, role: true, classe: true, formation: true, promo: true }
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// DELETE /api/admin/users/:id — supprimer un compte
const deleteUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    if (userId === req.user.id) {
      return res.status(400).json({ message: 'Impossible de supprimer votre propre compte' });
    }

    await prisma.user.delete({ where: { id: userId } });
    res.json({ message: 'Utilisateur supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// GET /api/admin/users/by-role/:role — filtrer par rôle
const getUsersByRole = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: req.params.role },
      select: { id: true, nom: true, prenom: true, email: true, role: true, classe: true, formation: true, promo: true, created_at: true },
      orderBy: { nom: 'asc' }
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

module.exports = { getOptions, getAllUsers, getUser, createUser, updateUser, deleteUser, getUsersByRole };
