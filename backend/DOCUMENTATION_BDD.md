# Documentation BDD — Plateforme Projets ISEN

**Stack** : PostgreSQL + Prisma ORM  
**Projet** : Sujet 1 — Plateforme de Gestion et Suivi des Projets Étudiants  
**Groupe** : ISEN3 — Équipe 5  

---

## 12 Modèles (conformes au CDC)

| Table | Description | CDC |
|---|---|---|
| `users` | 3 rôles : admin, student, supervisor | §2 |
| `projects` | 7 statuts : proposé → clôturé | §3 |
| `team_members` | Pivot — un étudiant dans un seul projet (lead ou member) | §2 |
| `tasks` | Tâches, 3 statuts CDC | §4 |
| `task_history` | Historique des changements de statut | §4 |
| `deliverables` | Dépôt fichiers via Multer (max 10MB) | §6 |
| `deliverable_reviews` | Validation encadrant : accepté/rejeté/révision | §6 |
| `messages` | Chat par projet | §5 |
| `comments` | Commentaires sur projets et tâches | §5 |
| `milestones` | Jalons avec date cible et statut atteint | §4 |
| `notifications` | Alertes système automatiques | §5 |
| `evaluations` | Notes de soutenance par l'encadrant (0–20) | §7 |

---

## Enums

### UserRole
```
admin | student | supervisor
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
│   └── seed.js              ← données de test (3 rôles)
├── src/
│   ├── config/
│   │   ├── prisma.js
│   │   └── jwt.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── adminController.js
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
│   │   ├── auth.middleware.js        ← vérifie le JWT
│   │   ├── role.middleware.js        ← vérifie le rôle (3 rôles)
│   │   ├── projectRole.middleware.js ← supervisor ou TL du projet
│   │   └── upload.middleware.js      ← Multer 10MB
│   └── routes/
│       ├── auth.routes.js          → /api/auth
│       ├── admin.routes.js         → /api/admin
│       ├── projects.routes.js      → /api/projects (+ toutes ressources imbriquées)
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
| POST | `/api/auth/login` | tous | Connexion JWT |
| GET | `/api/auth/me` | auth | Profil connecté |
| GET | `/api/admin/users` | admin | Liste tous les users |
| POST | `/api/admin/users` | admin | Créer un compte |
| GET | `/api/admin/users/:id` | admin | Détail user |
| PUT | `/api/admin/users/:id` | admin | Modifier user |
| DELETE | `/api/admin/users/:id` | admin | Supprimer user |
| GET | `/api/admin/users/by-role/:role` | admin | Filtrer par rôle |
| GET | `/api/projects` | auth | Liste des projets |
| POST | `/api/projects` | admin, supervisor | Créer un projet |
| GET | `/api/projects/:id` | auth | Détail projet |
| PUT | `/api/projects/:id` | admin, supervisor | Modifier projet |
| DELETE | `/api/projects/:id` | admin, supervisor | Supprimer projet |
| GET | `/api/projects/:id/members` | auth | Membres de l'équipe |
| POST | `/api/projects/:id/members` | admin, supervisor | Ajouter membre |
| DELETE | `/api/projects/:id/members/:uid` | admin, supervisor | Retirer membre |
| GET | `/api/projects/:id/tasks` | auth | Tâches du projet |
| POST | `/api/projects/:id/tasks` | supervisor ou TL | Créer tâche |
| PUT | `/api/tasks/:id` | supervisor ou TL | Modifier tâche |
| PUT | `/api/tasks/:id/move` | supervisor ou TL | Changer statut |
| DELETE | `/api/tasks/:id` | supervisor ou TL | Supprimer tâche |
| GET | `/api/tasks/:id/history` | auth | Historique tâche |
| GET | `/api/tasks/:id/comments` | auth | Commentaires tâche |
| GET | `/api/projects/:id/milestones` | auth | Jalons |
| POST | `/api/projects/:id/milestones` | supervisor ou TL | Créer jalon |
| PUT | `/api/milestones/:id` | admin, supervisor | Modifier jalon |
| PUT | `/api/milestones/:id/reach` | supervisor ou TL | Marquer atteint |
| DELETE | `/api/milestones/:id` | admin, supervisor | Supprimer jalon |
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
| POST | `/api/projects/:id/evaluations` | admin, supervisor | Noter le projet |
| DELETE | `/api/evaluations/:id` | admin, supervisor | Supprimer évaluation |
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
| admin@isen.fr | admin | admin2026 |
| meryem.benyoussef@junia.com | supervisor | password123 |
| alex.komenan@junia.com | student (TL) | password123 |
| etudiant1@junia.com | student | password123 |
| etudiant2@junia.com | student | password123 |
| etudiant3@junia.com | student | password123 |
| etudiant4@junia.com | student | password123 |
