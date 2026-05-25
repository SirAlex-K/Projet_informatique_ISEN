# Plateforme de Gestion et Suivi des Projets Étudiants

> Sujet 1 — JUNIA ISEN3 · 2026  
> Projet informatique · Équipe de 5 · 18 mai → 24 juin 2026

---

## Objectif

Application web permettant :
- aux **encadrants** de superviser, suivre et piloter l'ensemble des projets étudiants
- aux **étudiants** de collaborer, s'organiser et suivre la progression de leurs projets
- au **jury** de noter les soutenances
- aux **chefs de projet** de coordonner leur équipe

---

## Stack technique

| Couche | Technologie |
|---|---|
| Frontend | React + Vite + TypeScript |
| Backend | Node.js + Express |
| Base de données | PostgreSQL |
| ORM | Prisma |
| Authentification | JWT + bcryptjs |
| Upload fichiers | Multer (max 10MB) |
| État global | Zustand |
| Routage | React Router v6 |

---

## Fonctionnalités (conformes au CDC)

- **4 rôles** — étudiant, chef de projet, encadrant, jury (CDC §2)
- **Gestion des projets** — 7 statuts : proposé → validé → en cours → en retard → livré → soutenu → clôturé (CDC §3)
- **Suivi des tâches** — 3 statuts : à faire / en cours / terminé, priorités, deadlines, historique (CDC §4)
- **Jalons** — dates cibles, marquage atteint/non atteint (CDC §4)
- **Commentaires** — par projet ou par tâche (CDC §5)
- **Messagerie** — chat par projet (CDC §5)
- **Notifications** — alertes automatiques : tâche assignée, livrable déposé, jalon atteint... (CDC §5)
- **Livrables** — dépôt fichiers PDF/ZIP/DOCX, validation encadrant (accepté/rejeté/révision) (CDC §6)
- **Évaluations** — notes de soutenance par le jury (0–20) (CDC §7)
- **Dashboard** — vue globale encadrant avec indicateurs d'avancement

---

## Structure du projet

```
projet/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma     # 12 modèles PostgreSQL
│   │   └── seed.js           # données de test (5 users, 4 rôles)
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── projectController.js
│   │   │   ├── teamController.js
│   │   │   ├── taskController.js
│   │   │   ├── deliverableController.js
│   │   │   ├── deliverableReviewController.js
│   │   │   ├── messageController.js
│   │   │   ├── commentController.js
│   │   │   ├── milestoneController.js
│   │   │   ├── notificationController.js
│   │   │   ├── evaluationController.js
│   │   │   └── dashboardController.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── projects.routes.js
│   │   │   ├── teams.routes.js
│   │   │   ├── tasks.routes.js
│   │   │   ├── deliverables.routes.js
│   │   │   ├── deliverable_reviews.routes.js
│   │   │   ├── messages.routes.js
│   │   │   ├── comments.routes.js
│   │   │   ├── milestones.routes.js
│   │   │   ├── notifications.routes.js
│   │   │   ├── evaluations.routes.js
│   │   │   └── dashboard.routes.js
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js    # JWT
│   │   │   ├── role.middleware.js    # contrôle des rôles
│   │   │   └── upload.middleware.js  # Multer
│   │   └── config/
│   │       ├── prisma.js
│   │       └── jwt.js
│   ├── .env                  # DATABASE_URL, JWT_SECRET (non versionné)
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ui/           # Button, Card, Badge, Modal, Table
    │   │   ├── Navbar.tsx
    │   │   ├── Sidebar.tsx
    │   │   ├── TaskCard.tsx
    │   │   └── ProjectCard.tsx
    │   ├── pages/
    │   ├── services/         # api.ts (axios)
    │   ├── store/            # Zustand
    │   ├── App.tsx
    │   └── main.tsx
    ├── package.json
    └── vite.config.ts
```

---

## Schéma BDD — 12 tables

| Table | Description |
|---|---|
| `users` | 4 rôles : student, team_leader, supervisor, jury |
| `projects` | 7 statuts CDC |
| `team_members` | Pivot N:N user ↔ project |
| `tasks` | Tâches avec 3 statuts, priorité, deadline |
| `task_history` | Historique des changements de statut |
| `deliverables` | Fichiers déposés (métadonnées) |
| `deliverable_reviews` | Validation encadrant : accepté/rejeté/révision |
| `messages` | Chat par projet |
| `comments` | Commentaires sur projets et tâches |
| `milestones` | Jalons avec date cible |
| `notifications` | Alertes système automatiques |
| `evaluations` | Notes de soutenance par le jury |

---

## API REST — Principaux endpoints

| Méthode | Route | Rôles |
|---|---|---|
| POST | `/api/auth/register` | tous |
| POST | `/api/auth/login` | tous |
| GET/POST | `/api/projects` | auth / supervisor |
| GET/PUT | `/api/projects/:id` | auth / supervisor |
| GET/POST | `/api/projects/:id/members` | auth / supervisor |
| GET/POST | `/api/projects/:id/tasks` | auth / supervisor, team_leader |
| PUT | `/api/tasks/:id/move` | supervisor, team_leader |
| GET/POST | `/api/projects/:id/milestones` | auth / supervisor |
| PUT | `/api/milestones/:id/reach` | supervisor, team_leader |
| GET/POST | `/api/projects/:id/deliverables` | auth |
| POST | `/api/deliverables/:id/reviews` | supervisor |
| GET/POST | `/api/projects/:id/comments` | auth |
| GET/POST | `/api/messages/:projectId` | auth |
| GET | `/api/notifications` | auth |
| PUT | `/api/notifications/read-all` | auth |
| GET/POST | `/api/projects/:id/evaluations` | auth / jury |
| GET | `/api/dashboard` | auth |

---

## Installation

### Prérequis

- Node.js ≥ 18
- PostgreSQL ≥ 14
- npm

### Backend

```bash
cd backend
npm install

# Créer le fichier .env
cp .env.example .env
# Remplir : DATABASE_URL="postgresql://user:password@localhost:5432/plateforme_projets"
#           JWT_SECRET="votre_secret"

# Appliquer le schéma BDD
.\node_modules\.bin\prisma db push

# Insérer les données de test
node prisma/seed.js

# Lancer le serveur
node server.js
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

L'API est accessible sur `http://localhost:3000`, le frontend sur `http://localhost:5173`.

---

## Comptes de test

| Email | Rôle | Mot de passe |
|---|---|---|
| dupont.marc@isen.fr | supervisor | password123 |
| alex.komenan@isen.fr | team_leader | password123 |
| etudiant1@isen.fr | student | password123 |
| etudiant2@isen.fr | student | password123 |
| jury1@isen.fr | jury | password123 |

---

## Planning

| Phase | Période | Objectif |
|---|---|---|
| Phase 1 — Cadrage & Conception | 18 – 25 mai | Stack, BDD, arborescence, routes, planning |
| Phase 2 — Développement Core | 26 mai – 8 juin | CRUD, Auth JWT, équipes, upload livrables |
| Phase 3 — Dashboards & Tests | 9 – 15 juin | Dashboard encadrant, tests, corrections |
| Phase 4 — Rapport & Soutenance | 16 – 24 juin | Rapport, slides, démo finale |

---

## Avancement

- [x] Organisation de l'équipe & rôles
- [x] Stack technique choisie
- [x] Schéma BDD conçu — 12 tables, conformes au CDC
- [x] Arborescence des fichiers définie
- [x] Routes API définies (30+ endpoints)
- [x] Planning établi
- [x] Init backend (Node.js + Express + PostgreSQL + Prisma)
- [x] Authentification JWT (register / login)
- [x] CRUD Projets & Tâches
- [x] Gestion des équipes
- [x] Upload de livrables (Multer)
- [x] Jalons, commentaires, notifications, évaluations
- [x] Données de test (seed)
- [ ] Init frontend (React + Vite)
- [ ] Dashboard encadrant
- [ ] Tests & corrections
- [ ] Rapport & soutenance

---

*JUNIA ISEN3 · 2026*
