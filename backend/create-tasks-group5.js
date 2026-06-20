const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

const TASKS = [
  // DONE
  { titre: 'Initialisation du projet (repo, structure)',     statut: 'done',     priorite: 'haute',   assigned_to: 4 },
  { titre: 'Modélisation de la base de données',             statut: 'done',     priorite: 'haute',   assigned_to: 4 },
  { titre: 'Authentification JWT + gestion des rôles',       statut: 'done',     priorite: 'haute',   assigned_to: 4 },
  { titre: 'API REST — projets & équipes',                   statut: 'done',     priorite: 'haute',   assigned_to: 4 },
  { titre: 'Dashboard encadrant (vue globale)',              statut: 'done',     priorite: 'normale', assigned_to: 4 },
  { titre: 'Gestion des tâches — Kanban',                   statut: 'done',     priorite: 'normale', assigned_to: 4 },
  { titre: 'Système de messagerie par projet/groupe',        statut: 'done',     priorite: 'normale', assigned_to: 4 },
  { titre: 'Dépôt et validation des livrables',              statut: 'done',     priorite: 'normale', assigned_to: 4 },
  // EN COURS
  { titre: 'Système de notifications en temps réel',        statut: 'en_cours', priorite: 'haute',   assigned_to: 4 },
  { titre: 'Page de suivi des jalons',                      statut: 'en_cours', priorite: 'normale', assigned_to: 4 },
  { titre: 'Interface étudiant — tableau de bord',          statut: 'en_cours', priorite: 'normale', assigned_to: 4 },
  // TODO
  { titre: 'Module d\'évaluation et notation',              statut: 'todo',     priorite: 'haute',   assigned_to: 4 },
  { titre: 'Export PDF des rapports de projet',             statut: 'todo',     priorite: 'basse',   assigned_to: 4 },
  { titre: 'Tests unitaires et d\'intégration',             statut: 'todo',     priorite: 'haute',   assigned_to: null },
  { titre: 'Déploiement et documentation finale',           statut: 'todo',     priorite: 'haute',   assigned_to: null },
];

async function main() {
  await p.task.createMany({
    data: TASKS.map((t, i) => ({
      project_id:  13,
      titre:       t.titre,
      statut:      t.statut,
      priorite:    t.priorite,
      assigned_to: t.assigned_to,
      position:    i,
    }))
  });
  console.log(`✅ ${TASKS.length} tâches créées dans le projet 13 (groupe 5 — siralexkmn)`);
}

main().catch(e => console.error(e.message)).finally(() => p.$disconnect());
