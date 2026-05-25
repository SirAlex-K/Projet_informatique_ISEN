# Documentation BDD — Plateforme Projets ISEN

**Stack** : PostgreSQL + Prisma ORM  
**Projet** : Sujet 1 — Plateforme de Gestion et Suivi des Projets Étudiants  
**Groupe** : ISEN3 — Équipe 5  

---

## 12 Modèles (conformes au CDC)

| Table | Description | CDC |
|---|---|---|
| `users` | 4 rôles : student, team_leader, supervisor, jury | §2 |
| `projects` | 7 statuts : proposé → clôturé | §3 |
| `team_members` | Pivot N:N user ↔ project | §2 |
| `tasks` | Tâches (vue Kanban en bonus), 3 statuts | §4 |
| `task_history` | Historique des changements de statut | §4 |
| `deliverables` | Dépôt fichiers via Multer (max 10MB) | §6 |
| `deliverable_reviews` | Validation encadrant : accepté/rejeté/révision | §6 |
| `messages` | Chat par projet | §5 |
| `comments` | Commentaires sur projets et tâches | §5 |
| `milestones` | Jalons avec date cible et statut atteint | §4 |
| `notifications` | Alertes système automatiques | §5 |
| `evaluations` | Notes de soutenance par le jury (0–20) | §7 |

---

## Enums

### UserRole
```
student | team_leader | supervisor | jury
```

### ProjectStatut (7 états CDC §3)
```
propose → valide → en_cours → en_retard → livre → soutenu → cloture
```

### TaskStatut (3 états CDC §4)
```
todo | en_cours | done
```

### NotificationType
```
task_assigned | task_updated | deliverable_uploaded | deliverable_reviewed
comment_added | milestone_reached | project_updated
```

### DeliverableDecision
```
accepte | rejete | revision
```

---

## Structure des fichiers

```
backend/
├── prisma/
│   ├── schema.prisma        ← 12 modèles
│   └── seed.js              ← données de test (5 users, 1 projet, tâches...)
├── src/
│   ├── config/
│   │   ├── prisma.js
│   │   └── jwt.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   ├── teamController.js
│   │   ├── taskController.js           ← (ex kanbanController)
│   │   ├── deliverableController.js
│   │   ├── deliverableReviewController.js  ← NOUVEAU
│   │   ├── messageController.js
│   │   ├── commentController.js        ← NOUVEAU
│   │   ├── milestoneController.js      ← NOUVEAU
│   │   ├── notificationController.js   ← NOUVEAU
│   │   ├── evaluationController.js     ← NOUVEAU
│   │   └── dashboardController.js
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   └── upload.middleware.js
│   └── routes/
│       ├── auth.routes.js
│       ├── projects.routes.js
│       ├── teams.routes.js
│       ├── tasks.routes.js             ← (ex kanban.routes)
│       ├── deliverables.routes.js
│       ├── deliverable_reviews.routes.js  ← NOUVEAU
│       ├── messages.routes.js
│       ├── comments.routes.js          ← NOUVEAU
│       ├── milestones.routes.js        ← NOUVEAU
│       ├── notifications.routes.js     ← NOUVEAU
│       ├── evaluations.routes.js       ← NOUVEAU
│       └── dashboard.routes.js
└── server.js
```

---

## Routes API

| Méthode | Route | Rôles | Description |
|---|---|---|---|
| POST | `/api/auth/register` | tous | Inscription |
| POST | `/api/auth/login` | tous | Connexion JWT |
| GET | `/api/projects` | auth | Liste des projets |
| POST | `/api/projects` | supervisor | Créer un projet |
| GET | `/api/projects/:id` | auth | Détail projet |
| PUT | `/api/projects/:id` | supervisor | Modifier projet |
| GET | `/api/projects/:id/members` | auth | Membres de l'équipe |
| POST | `/api/projects/:id/members` | supervisor | Ajouter membre |
| DELETE | `/api/projects/:id/members/:uid` | supervisor | Retirer membre |
| GET | `/api/projects/:id/tasks` | auth | Tâches du projet |
| POST | `/api/projects/:id/tasks` | supervisor, team_leader | Créer tâche |
| PUT | `/api/tasks/:id/move` | supervisor, team_leader | Changer statut |
| DELETE | `/api/tasks/:id` | supervisor, team_leader | Supprimer tâche |
| GET | `/api/tasks/:id/history` | auth | Historique tâche |
| GET | `/api/projects/:id/deliverables` | auth | Livrables |
| POST | `/api/projects/:id/deliverables` | auth | Déposer fichier |
| GET | `/api/deliverables/:id/reviews` | auth | Avis sur livrable |
| POST | `/api/deliverables/:id/reviews` | supervisor | Valider livrable |
| GET | `/api/projects/:id/milestones` | auth | Jalons |
| POST | `/api/projects/:id/milestones` | supervisor | Créer jalon |
| PUT | `/api/milestones/:id/reach` | supervisor, team_leader | Marquer atteint |
| GET | `/api/projects/:id/comments` | auth | Commentaires projet |
| POST | `/api/projects/:id/comments` | auth | Poster commentaire |
| GET | `/api/tasks/:id/comments` | auth | Commentaires tâche |
| GET | `/api/messages/:projectId` | auth | Messages du projet |
| POST | `/api/messages` | auth | Envoyer message |
| GET | `/api/notifications` | auth | Mes notifications |
| PUT | `/api/notifications/read-all` | auth | Tout marquer lu |
| GET | `/api/projects/:id/evaluations` | auth | Notes soutenance |
| POST | `/api/projects/:id/evaluations` | jury | Noter le projet |
| GET | `/api/dashboard` | auth | Stats globales |

---

## Commandes utiles

```bash
# Valider le schéma
.\node_modules\.bin\prisma validate

# Pousser le schéma (dev)
.\node_modules\.bin\prisma db push

# Générer le client Prisma
.\node_modules\.bin\prisma generate

# Insérer les données de test
node prisma/seed.js

# Lancer le serveur
node server.js
# ou avec nodemon
npx nodemon server.js
```

---

## Données de test (seed)

| Email | Rôle | Mot de passe |
|---|---|---|
| dupont.marc@isen.fr | supervisor | password123 |
| alex.komenan@isen.fr | team_leader | password123 |
| etudiant1@isen.fr | student | password123 |
| etudiant2@isen.fr | student | password123 |
| jury1@isen.fr | jury | password123 |
