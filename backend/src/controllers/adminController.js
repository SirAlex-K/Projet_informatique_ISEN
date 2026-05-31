// ============================================
// Admin Controller
// Gestion des comptes utilisateurs
// Seul l'admin peut créer / modifier / supprimer
// ============================================

const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');

// GET /api/admin/users — liste tous les users
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true, nom: true, prenom: true,
        email: true, role: true, avatar_url: true, created_at: true,
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
        email: true, role: true, avatar_url: true, created_at: true,
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
    const { nom, prenom, email, password, role } = req.body;

    if (!nom || !prenom || !email || !password || !role) {
      return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ message: 'Email déjà utilisé' });

    const password_hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { nom, prenom, email, password_hash, role },
      select: { id: true, nom: true, prenom: true, email: true, role: true, created_at: true }
    });

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// PUT /api/admin/users/:id — modifier un compte
const updateUser = async (req, res) => {
  try {
    const { nom, prenom, email, role, password } = req.body;

    const data = { nom, prenom, email, role };
    if (password) {
      data.password_hash = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data,
      select: { id: true, nom: true, prenom: true, email: true, role: true }
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

    // Empêcher l'admin de se supprimer lui-même
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
      select: { id: true, nom: true, prenom: true, email: true, role: true, created_at: true },
      orderBy: { nom: 'asc' }
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

module.exports = { getAllUsers, getUser, createUser, updateUser, deleteUser, getUsersByRole };
