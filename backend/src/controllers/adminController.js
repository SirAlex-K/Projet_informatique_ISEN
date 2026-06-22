// ============================================
// Admin Controller
// Gestion des comptes utilisateurs
// Seul l'admin peut créer / modifier / supprimer
// ============================================

const prisma  = require('../config/prisma');
const bcrypt  = require('bcryptjs');
const mailer  = require('../config/mailer');

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

    // Envoi asynchrone des credentials par mail (non bloquant)
    mailer.sendMail({
      from: `"ProjectHub — JUNIA" <${process.env.MAIL_USER}>`,
      to: email,
      subject: 'Vos identifiants de connexion — Plateforme ProjectHub',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#111">
          <p>Bonjour ${prenom} ${nom},</p>

          <p>
            Nous vous informons que votre compte a été créé sur la
            <strong>plateforme ProjectHub</strong>. Vous pouvez dès à présent vous connecter
            avec les identifiants suivants :
          </p>

          <p>
            <u>Login</u> : <strong>${email}</strong><br/>
            <u>Mot de passe</u> : <strong>${password}</strong>
          </p>

          <p>Nous vous conseillons de modifier votre mot de passe lors de votre première connexion.</p>

          <p>Bonne journée.</p>

          <hr style="border:none;border-top:1px solid #ccc;margin:24px 0"/>

          <p style="color:#555;font-size:13px">
            Pôle Informatique — ISEN JUNIA<br/>
            Mail : <a href="mailto:${process.env.MAIL_USER}">${process.env.MAIL_USER}</a>
          </p>

          <hr style="border:none;border-top:1px solid #ccc;margin:24px 0"/>

          <p>Hello ${prenom} ${nom},</p>

          <p>
            We would like to inform you that your account has been created on the
            <strong>ProjectHub platform</strong>. You can now log in with the following credentials:
          </p>

          <p>
            <u>Login</u>: <strong>${email}</strong><br/>
            <u>Password</u>: <strong>${password}</strong>
          </p>

          <p>We recommend changing your password upon your first login.</p>

          <p>Have a nice day.</p>

          <p style="color:#555;font-size:13px">
            IT Department — ISEN JUNIA<br/>
            Mail : <a href="mailto:${process.env.MAIL_USER}">${process.env.MAIL_USER}</a>
          </p>
        </div>
      `
    }).then(() => console.log(`Mail envoyé à ${email}`))
      .catch(err => console.error('Erreur envoi mail:', err.message, err.code));

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
