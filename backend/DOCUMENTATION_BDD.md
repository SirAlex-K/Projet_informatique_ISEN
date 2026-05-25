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
| `team_members` | Pivot N:N — un étudiant appartient à un seul projet | §2 |
| `tasks` | Tâches, 3 statuts CDC | §4 |
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
│   └── seed.js              ← données de test (5 users, 4 rôles)
├── src/
│   ├── config/
│   │   ├── prisma.js
│   │   └── jwt.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   ├── teamController.js
│   │   ├── taskController.js
│   │   ├── deliverableController.js
│   │   ├── deliverableReviewController.js
│   │   ├── messageController.js
│   │   ├── commentController.js
│   │   ├── milestoneController.js
│   │   ├── notificationController.js
│   │   ├── evaluationController.js
│   │   └── dashboardController.js
│   ├── middlewares/
│   │   ├── auth.middleware.js      ← vérifie le JWT
│   │   ├── role.middleware.js      ← vérifie le rôle (4 rôles)
│   │   └── upload.middleware.js    ← Multer 10MB
│   └── routes/
│       ├── auth.routes.js          → /api/auth
│       ├── projects.routes.js      → /api/projects (+ membres, tâches, jalons, livrables, messages, commentaires, évaluations)
│       ├── tasks.routes.js         → /api/tasks
│       ├── milestones.routes.js    → /api/milestones
│       ├── comments.routes.js      → /api/comments
│       ├── deliverable_reviews.routes.js → /api/deliverables
│       ├── evaluations.routes.js   → /api/evaluations
│       ├── notifications.routes.js → /api/notifications
│       └── dashboard.routes.js     → /api/dashboard
└── server.js
```

---

## Routes API

| Méthode | Route | Rôles | Description |
|---|---|---|---|
| POST | `/api/auth/register` | tous | Inscription |
| POST | `/api/auth/login` | tous | Connexion JWT |
| GET | `/api/auth/me` | auth | Profil connecté |
| GET | `/api/projects` | auth | Liste des projets |
| POST | `/api/projects` | supervisor | Créer un projet |
| GET | `/api/projects/:id` | auth | Détail projet |
| PUT | `/api/projects/:id` | supervisor | Modifier projet |
| DELETE | `/api/projects/:id` | supervisor | Supprimer projet |
| GET | `/api/projects/:id/members` | auth | Membres de l'équipe |
| POST | `/api/projects/:id/members` | supervisor | Ajouter membre |
| DELETE | `/api/projects/:id/members/:uid` | supervisor | Retirer membre |
| GET | `/api/projects/:id/tasks` | auth | Tâches du projet |
| POST | `/api/projects/:id/tasks` | supervisor, team_leader | Créer tâche |
| PUT | `/api/tasks/:id` | supervisor, team_leader | Modifier tâche |
| PUT | `/api/tasks/:id/move` | supervisor, team_leader | Changer statut |
| DELETE | `/api/tasks/:id` | supervisor, team_leader | Supprimer tâche |
| GET | `/api/tasks/:id/history` | auth | Historique tâche |
| GET | `/api/tasks/:id/comments` | auth | Commentaires tâche |
| GET | `/api/projects/:id/milestones` | auth | Jalons |
| POST | `/api/projects/:id/milestones` | supervisor | Créer jalon |
| PUT | `/api/milestones/:id` | supervisor | Modifier jalon |
| PUT | `/api/milestones/:id/reach` | supervisor, team_leader | Marquer atteint |
| DELETE | `/api/milestones/:id` | supervisor | Supprimer jalon |
| GET | `/api/projects/:id/deliverables` | auth | Livrables |
| POST | `/api/projects/:id/deliverables` | auth | Déposer fichier |
| GET | `/api/deliverables/:id/reviews` | auth | Avis sur livrable |
| POST | `/api/deliverables/:id/reviews` | supervisor | Valider livrable |
| GET | `/api/projects/:id/messages` | auth | Messages du projet |
| POST | `/api/projects/:id/messages` | auth | Envoyer message |
| GET | `/api/projects/:id/comments` | auth | Commentaires projet |
| POST | `/api/projects/:id/comments` | auth | Poster commentaire |
| PUT | `/api/comments/:id` | auteur | Modifier commentaire |
| DELETE | `/api/comments/:id` | auteur / supervisor | Supprimer commentaire |
| GET | `/api/notifications` | auth | Mes notifications |
| GET | `/api/notifications/unread-count` | auth | Nb non lues |
| PUT | `/api/notifications/read-all` | auth | Tout marquer lu |
| PUT | `/api/notifications/:id/read` | auth | Marquer une lue |
| GET | `/api/projects/:id/evaluations` | auth | Notes soutenance |
| POST | `/api/projects/:id/evaluations` | jury | Noter le projet |
| DELETE | `/api/evaluations/:id` | jury | Supprimer évaluation |
| GET | `/api/dashboard/supervisor` | supervisor | Stats globales |
| GET | `/api/dashboard/project/:id` | auth | Stats d'un projet |

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
