// ============================================
// Auth Controller — register & login
// ============================================

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const { secret, expiresIn } = require('../config/jwt');

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { nom, prenom, email, password, role } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ message: 'Email déjà utilisé' });

    const password_hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { nom, prenom, email, password_hash, role: role || 'student' }
    });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, secret, { expiresIn });

    res.status(201).json({ token, user: { id: user.id, nom: user.nom, prenom: user.prenom, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Email ou mot de passe incorrect' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ message: 'Email ou mot de passe incorrect' });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, secret, { expiresIn });

    res.json({ token, user: { id: user.id, nom: user.nom, prenom: user.prenom, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// GET /api/auth/me
const me = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, nom: true, prenom: true, email: true, role: true, avatar_url: true, created_at: true }
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// GET /api/auth/me/project — statut projet de l'étudiant connecté
const myProject = async (req, res) => {
  try {
    const membership = await prisma.teamMember.findFirst({
      where: { user_id: req.user.id },
      include: {
        project: {
          include: {
            supervisor: { select: { id: true, nom: true, prenom: true } },
            subjects: true,
            milestones: { orderBy: { date_cible: 'asc' } }
          }
        },
        group: {
          include: {
            sujet: true,
            members: {
              include: {
                user: { select: { id: true, nom: true, prenom: true } }
              }
            }
          }
        }
      }
    });

    if (!membership) return res.json({ project: null, membership: null, group: null });

    res.json({
      project:    membership.project,
      membership: {
        group_id:        membership.group_id,
        role_in_project: membership.role_in_project,
        joined_at:       membership.joined_at
      },
      group: membership.group
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

module.exports = { register, login, me, myProject };
