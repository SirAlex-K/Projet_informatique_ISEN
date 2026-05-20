# Plateforme de Gestion et Suivi des Projets Étudiants

> Sujet 1 — JUNIA ISEN3 · 2026  
> Projet informatique · Équipe de 5 · 18 mai → 24 juin 2026

---

## Objectif

Proposer une application web permettant :
- aux **encadrants** de superviser, suivre et piloter l'ensemble des projets étudiants grâce à une vision globale et des indicateurs d'avancement
- aux **étudiants** de collaborer, s'organiser et suivre la progression de leurs projets de manière structurée

---

## Stack technique

| Couche | Technologie |
|---|---|
| Frontend | React + Vite + TypeScript |
| Backend | Node.js + Express |
| Base de données | MySQL |
| Authentification | JWT + bcrypt |
| Upload fichiers | Multer |
| État global | Zustand |
| Routage | React Router v6 |

---

## Fonctionnalités clés

- **Gestion des projets & équipes** — création, membres, encadrants
- **Suivi des tâches** — statuts (todo / en cours / done), priorités, deadlines, assignation
- **Tableau de bord encadrant** — vue globale, indicateurs d'avancement, graphiques
- **Upload de livrables** — dépôt de fichiers PDF/ZIP par projet
- **Commentaires** — fil de discussion par projet ou par tâche
- **Authentification par rôle** — étudiant / encadrant avec JWT

---

## Structure du projet

```
projet/
├── backend/
│   ├── src/
│   │   ├── controllers/      # authController, projectController, taskController...
│   │   ├── models/           # User, Project, Task, TeamMember, Deliverable, Comment
│   │   ├── routes/           # auth, projects, tasks, teams, deliverables, dashboard
│   │   ├── middlewares/      # auth.middleware (JWT), role.middleware, upload.middleware
│   │   └── config/           # database.js (MySQL), jwt.js
│   ├── db/
│   │   ├── schema.sql        # CREATE TABLE
│   │   └── seed.sql          # données de test
│   ├── .env                  # DB_HOST, JWT_SECRET (non versionné)
│   ├── package.json
│   └── server.js             # point d'entrée
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ui/           # Button, Card, Badge, Modal, Table
    │   │   ├── Navbar.tsx
    │   │   ├── Sidebar.tsx
    │   │   ├── TaskCard.tsx
    │   │   └── ProjectCard.tsx
    │   ├── pages/            # Login, Dashboard, Projects, Tasks, Team, Deliverables, SupervisorDash
    │   ├── services/         # api.ts (axios), auth.service, projects.service, tasks.service
    │   ├── store/            # authStore.ts, projectStore.ts (Zustand)
    │   ├── App.tsx
    │   └── main.tsx
    ├── package.json
    └── vite.config.ts
```

---

## Schéma BDD (6 tables)

```
users           — id, nom, prenom, email, password_hash, role (student|supervisor), avatar_url, created_at
projects        — id, titre, description, supervisor_id (FK→users), date_debut, date_fin, statut, created_at
team_members    — project_id (FK), user_id (FK), role_in_project (member|lead), joined_at   [PK composite]
tasks           — id, project_id (FK), assigned_to (FK→users), titre, description, statut, priorite, deadline
deliverables    — id, project_id (FK), uploaded_by (FK→users), nom_fichier, chemin_fichier, uploaded_at
comments        — id, project_id (FK), user_id (FK), task_id (FK NULL), contenu, created_at
```

**Relations :** `users` ←1:N→ `projects` (supervisor) · `users` ←N:N→ `projects` (via team_members) · `projects` ←1:N→ `tasks` · `projects` ←1:N→ `deliverables` · `projects` ←1:N→ `comments`

---

## API REST — Endpoints

| Méthode | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Créer un compte |
| POST | `/api/auth/login` | Connexion → JWT |
| GET | `/api/auth/me` | Profil connecté |
| GET | `/api/projects` | Liste tous les projets |
| POST | `/api/projects` | Créer un projet |
| GET | `/api/projects/:id` | Détail d'un projet |
| PUT | `/api/projects/:id` | Modifier un projet |
| DELETE | `/api/projects/:id` | Supprimer un projet |
| GET | `/api/projects/:id/tasks` | Tâches d'un projet |
| POST | `/api/projects/:id/tasks` | Créer une tâche |
| PUT | `/api/tasks/:id` | Modifier / changer statut |
| DELETE | `/api/tasks/:id` | Supprimer une tâche |
| GET | `/api/projects/:id/members` | Membres d'un projet |
| POST | `/api/projects/:id/members` | Ajouter un membre |
| DELETE | `/api/projects/:id/members/:uid` | Retirer un membre |
| GET | `/api/projects/:id/deliverables` | Liste livrables |
| POST | `/api/projects/:id/deliverables` | Upload fichier (multipart) |
| DELETE | `/api/deliverables/:id` | Supprimer un livrable |
| GET | `/api/dashboard/supervisor` | Vue globale encadrant |
| GET | `/api/dashboard/project/:id` | Stats d'un projet |

---

## Installation

### Prérequis

- Node.js ≥ 18
- MySQL ≥ 8
- npm ou pnpm

### Backend

```bash
cd backend
npm install
cp .env.example .env      # remplir DB_HOST, DB_USER, DB_PASS, DB_NAME, JWT_SECRET
mysql -u root -p < db/schema.sql
mysql -u root -p < db/seed.sql
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

L'application est accessible sur `http://localhost:5173`, l'API sur `http://localhost:3000`.

---

## Planning

| Phase | Période | Objectif |
|---|---|---|
| Phase 1 — Cadrage & Conception | 18 – 25 mai | Stack, BDD, arborescence, routes, planning |
| Phase 2 — Développement Core | 26 mai – 8 juin | CRUD, Auth JWT, équipes, upload livrables |
| Phase 3 — Dashboards & Tests | 9 – 15 juin | Dashboard encadrant, tests, corrections |
| Phase 4 — Rapport & Soutenance | 16 – 24 juin | Rapport, slides, demo finale |

---

## Équipe

| Rôle | Responsabilités |
|---|---|
| Chef de projet | Coordination, suivi, rapport, slides soutenance |
| Backend / BDD | API REST, schéma MySQL, auth JWT |
| Frontend / UI | React, design system, intégration API |
| Data / Dashboard | Graphiques, indicateurs, dashboard encadrant |
| QA / Tests | Tests unitaires & intégration, revue de code |

---

## Avancement

- [x] Organisation de l'équipe & rôles
- [x] Stack technique choisie
- [x] Schéma BDD conçu (6 tables)
- [x] Arborescence des fichiers définie
- [x] Routes API définies (20+ endpoints)
- [x] Planning 5 semaines établi
- [ ] Init backend (Node.js + Express + MySQL)
- [ ] Init frontend (React + Vite)
- [ ] Authentification JWT
- [ ] CRUD Projets & Tâches
- [ ] Gestion des équipes
- [ ] Upload de livrables (Multer)
- [ ] Dashboard encadrant
- [ ] Tests & corrections
- [ ] Rapport & soutenance

---

*JUNIA ISEN3 · 2026*
