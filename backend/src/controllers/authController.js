// ============================================
// Auth Controller — CDC : Authentification & gestion des rôles
// Technos : JWT (jsonwebtoken) + bcryptjs
// Routes  : POST /api/auth/register
//           POST /api/auth/login
//           GET  /api/auth/me
//           GET  /api/auth/me/project
// ============================================

const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const prisma = require('../config/prisma');
const { secret, expiresIn } = require('../config/jwt');

// ── POST /api/auth/register ──────────────────────────────────────────────────
// Crée un compte utilisateur. Le mot de passe est haché avec bcrypt (salt=10)
// avant d'être stocké — jamais de mot de passe en clair en base.
// Retourne un token JWT + les infos publiques de l'utilisateur créé.
const register = async (req, res) => {
  try {
    const { nom, prenom, email, password, role } = req.body;

    // Vérification unicité de l'email (contrainte @unique en BDD)
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ message: 'Email déjà utilisé' });

    // Hachage bcrypt — le facteur de coût 10 offre un bon équilibre sécurité/performance
    const password_hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { nom, prenom, email, password_hash, role: role || 'student' }
    });

    // Génération du JWT signé avec la clé secrète — payload minimal (id, email, role)
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn }
    );

    res.status(201).json({
      token,
      user: { id: user.id, nom: user.nom, prenom: user.prenom, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// ── POST /api/auth/login ─────────────────────────────────────────────────────
// Authentifie un utilisateur existant.
// bcrypt.compare() compare le mot de passe saisi avec le hash stocké,
// sans jamais décrypter ce dernier (hachage à sens unique).
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    // Message d'erreur identique pour email et mot de passe invalides
    // (évite de révéler si un email est enregistré ou non)
    if (!user) return res.status(401).json({ message: 'Email ou mot de passe incorrect' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ message: 'Email ou mot de passe incorrect' });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn }
    );

    res.json({
      token,
      user: { id: user.id, nom: user.nom, prenom: user.prenom, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// ── GET /api/auth/me ─────────────────────────────────────────────────────────
// Retourne le profil de l'utilisateur connecté (identifié via le token JWT
// décodé par le middleware auth, disponible dans req.user).
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

// ── GET /api/auth/me/project ─────────────────────────────────────────────────
// Retourne le projet, le groupe et le rôle de l'étudiant connecté.
// Utilisé au chargement du dashboard étudiant pour déterminer si
// l'étudiant est déjà affecté à un groupe ou doit encore en choisir un.
const myProject = async (req, res) => {
  try {
    const membership = await prisma.teamMember.findFirst({
      where: { user_id: req.user.id },
      include: {
        project: {
          include: {
            supervisor: { select: { id: true, nom: true, prenom: true } },
            subjects:   true,
            milestones: { orderBy: { date_cible: 'asc' } }
          }
        },
        group: {
          include: {
            sujet:   true,
            members: {
              include: { user: { select: { id: true, nom: true, prenom: true } } }
            }
          }
        }
      }
    });

    // Étudiant sans projet affecté → réponse vide sans erreur
    if (!membership) return res.json({ project: null, membership: null, group: null });

    res.json({
      project:    membership.project,
      membership: {
        group_id:        membership.group_id,
        role_in_project: membership.role_in_project, // 'lead' ou 'member'
        joined_at:       membership.joined_at
      },
      group: membership.group
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

module.exports = { register, login, me, myProject };
