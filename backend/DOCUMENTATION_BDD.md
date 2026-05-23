# Documentation BDD — Plateforme Gestion Projets ISEN
**Équipe de 5 · JUNIA ISEN3 · 2026**

---

## 1. Pourquoi PostgreSQL ?

Notre Cahier des Charges (CDC v2) spécifie PostgreSQL comme base de données.

- **Gratuit et open source**
- **Robuste** — gère bien les relations complexes entre tables
- **Compatible Prisma** — migrations automatiques, pas de SQL à écrire à la main
- **Standard professionnel** — utilisé dans la majorité des projets réels

---

## 2. Pourquoi Prisma ?

Prisma est un ORM (Object Relational Mapper). Il fait le lien entre notre code JavaScript et la base de données.

**Sans Prisma** — on écrirait du SQL brut :
```sql
SELECT * FROM kanban_cards WHERE project_id = 1 AND statut = 'todo';
```

**Avec Prisma** — on écrit du JavaScript simple :
```js
prisma.kanbanCard.findMany({ where: { project_id: 1, statut: 'todo' } })
```

Avantages :
- Pas d'erreurs de syntaxe SQL
- Le code est plus lisible
- Les migrations (création des tables) sont automatiques
- Les relations entre tables sont gérées automatiquement

---

## 3. Les étapes qu'on a effectuées

### Étape 1 — Installation de PostgreSQL
- Téléchargé et installé **PostgreSQL 18** sur le PC
- Mot de passe choisi : `root` (pour le développement local uniquement)
- PostgreSQL tourne en arrière-plan sur le port **5432** (port par défaut)

---

### Étape 2 — Création de la base de données
On a créé la base de données vide appelée `plateforme_projets` via la commande :
```bash
createdb -U postgres plateforme_projets
```
À ce stade, la base existe mais elle est vide — pas encore de tables.

---

### Étape 3 — Définition du schéma Prisma
On a créé le fichier `prisma/schema.prisma` qui décrit :
- La connexion à PostgreSQL
- Les 7 tables (appelées "models" dans Prisma)
- Les relations entre les tables
- Les types de données de chaque champ

Ce fichier remplace l'ancien `db/schema.sql` (qui était en MySQL).

**Les 7 models créés :**

| Model | Table en BDD | Rôle |
|---|---|---|
| `User` | `users` | Étudiants et encadrants |
| `Project` | `projects` | Les projets supervisés |
| `TeamMember` | `team_members` | Qui est dans quel projet |
| `KanbanCard` | `kanban_cards` | Les tâches du tableau Kanban |
| `Deliverable` | `deliverables` | Les fichiers déposés |
| `Message` | `messages` | Le chat par projet |
| `CardHistory` | `card_history` | Historique des déplacements Kanban |

---

### Étape 4 — Configuration de la connexion (.env)
On a créé le fichier `.env` à la racine du backend :
```
DATABASE_URL="postgresql://postgres:root@localhost:5432/plateforme_projets"
```

Décomposition de cette URL :
- `postgresql://` → le type de base de données
- `postgres` → l'utilisateur PostgreSQL
- `root` → le mot de passe
- `localhost` → la BDD est sur notre propre machine
- `5432` → le port PostgreSQL
- `plateforme_projets` → le nom de la base

---

### Étape 5 — La migration (création des tables)
On a lancé la commande :
```bash
npx prisma migrate dev --name init
```

Ce que Prisma a fait automatiquement :
1. Lu le fichier `schema.prisma`
2. Généré un fichier SQL (`migrations/20260523144613_init/migration.sql`)
3. Exécuté ce SQL sur PostgreSQL
4. Créé les 7 tables avec toutes leurs colonnes et relations
5. Généré le **Prisma Client** — le code qui permet d'utiliser la BDD en JavaScript

---

### Étape 6 — Le client Prisma (connexion dans le code)
On a créé `src/config/prisma.js` :
```js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
module.exports = prisma;
```

Ce fichier crée **une seule connexion** à la base de données, partagée dans toute l'application.
Chaque controller l'importe pour faire ses requêtes :
```js
const prisma = require('../config/prisma');
// Ensuite on peut faire :
const users = await prisma.user.findMany();
```

---

## 4. Les relations entre les tables

Les relations définissent comment les tables se parlent entre elles.

### Users → Projects (1 encadrant supervise N projets)
```
Un encadrant peut avoir plusieurs projets.
Un projet n'a qu'un seul encadrant.
→ Si l'encadrant est supprimé, ses projets sont supprimés aussi (CASCADE)
```

### Projects ⇄ Users via TeamMember (N:N)
```
Un étudiant peut être dans plusieurs projets.
Un projet peut avoir plusieurs étudiants.
→ La table team_members fait le lien (table pivot)
→ Si le projet ou l'étudiant est supprimé, le lien est supprimé (CASCADE)
```

### Projects → KanbanCards (1 projet a N cartes)
```
Chaque carte Kanban appartient à un projet.
→ Si le projet est supprimé, ses cartes sont supprimées (CASCADE)
```

### User → KanbanCard (assignation)
```
Une carte peut être assignée à un étudiant.
→ Si l'étudiant est supprimé, la carte reste mais devient non assignée (SET NULL)
```

### Projects → Deliverables (1 projet a N livrables)
```
Les fichiers uploadés sont liés à un projet.
→ Si le projet est supprimé, les livrables sont supprimés (CASCADE)
```

### Projects → Messages (chat par projet)
```
Chaque projet a son propre canal de chat.
→ Si le projet est supprimé, les messages sont supprimés (CASCADE)
```

### KanbanCards → CardHistory (historique)
```
Chaque déplacement d'une carte est enregistré.
→ Qui a bougé la carte, depuis quelle colonne, vers quelle colonne
→ Si la carte est supprimée, l'historique est supprimé (CASCADE)
```

---

## 5. Comment faire une requête BDD — exemples concrets

### Récupérer tous les projets
```js
const projets = await prisma.project.findMany();
```

### Créer un utilisateur
```js
const user = await prisma.user.create({
  data: {
    nom: 'Dupont',
    prenom: 'Jean',
    email: 'jean@isen.fr',
    password_hash: '...',
    role: 'student'
  }
});
```

### Récupérer les cartes Kanban d'un projet avec le nom de la personne assignée
```js
const cartes = await prisma.kanbanCard.findMany({
  where: { project_id: 1 },
  include: {
    assignee: { select: { nom: true, prenom: true } }
  }
});
```

### Déplacer une carte Kanban
```js
await prisma.kanbanCard.update({
  where: { id: 5 },
  data: { statut: 'done', position: 0 }
});
```

---

## 6. Commandes utiles

```bash
# Lancer le serveur backend
npm run dev

# Créer une nouvelle migration après modification du schema
npx prisma migrate dev --name nom_de_la_migration

# Ouvrir l'interface visuelle de la BDD (Prisma Studio)
npm run db:studio

# Régénérer le client Prisma
npm run db:generate
```

---

## 7. Structure des fichiers liés à la BDD

```
backend/
├── prisma/
│   ├── schema.prisma          → définition des 7 tables et relations
│   ├── seed.js                → données de test (à créer)
│   └── migrations/
│       └── 20260523144613_init/
│           └── migration.sql  → SQL généré automatiquement par Prisma
├── src/
│   └── config/
│       └── prisma.js          → connexion à la BDD (PrismaClient)
└── .env                       → DATABASE_URL (ne jamais commiter ce fichier !)
```

---

## 8. À retenir pour la soutenance

- **PostgreSQL** = la base de données (le "coffre-fort" des données)
- **Prisma** = l'outil qui crée les tables et permet de les utiliser en JavaScript
- **schema.prisma** = le plan de toutes les tables
- **migration** = l'action de créer les tables dans la BDD à partir du plan
- **PrismaClient** = la connexion entre notre code et la BDD
- **.env** = le fichier qui contient l'adresse et le mot de passe de la BDD
