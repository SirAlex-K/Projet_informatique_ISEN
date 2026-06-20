// Rollback du script setup-projets.js
// 1. Supprime le projet 10 (Sujet 2 créé à tort)
// 2. Supprime les 8 groupes aléatoires créés sur le projet 8
// 3. Retire les étudiants aléatoires ajoutés sur le projet 8
//    (garde uniquement Alex + etudiant1-4)
// 4. Restore les 7 jalons originaux du projet 8 (seed-demo)
// 5. Recrée le projet Electronique (vide — données perdues)
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const SPECIAL_EMAILS = [
  'alex.komenan@junia.com',
  'etudiant1@junia.com', 'etudiant2@junia.com',
  'etudiant3@junia.com', 'etudiant4@junia.com',
];

const ORIGINAL_MILESTONES = [
  { titre: 'Démarrage du projet',      date_cible: new Date('2026-05-18'), atteint: true,  atteint_le: new Date('2026-05-18') },
  { titre: 'Point de suivi 1',         date_cible: new Date('2026-05-20'), atteint: true,  atteint_le: new Date('2026-05-20') },
  { titre: 'Point de suivi 2',         date_cible: new Date('2026-05-26'), atteint: true,  atteint_le: new Date('2026-05-26') },
  { titre: 'Point de suivi 3',         date_cible: new Date('2026-06-01'), atteint: false },
  { titre: 'Présentation mi-parcours', date_cible: new Date('2026-06-08'), atteint: false },
  { titre: 'Livraison finale',         date_cible: new Date('2026-06-20'), atteint: false },
  { titre: 'Soutenance',               date_cible: new Date('2026-06-23'), atteint: false },
];

async function main() {
  // ── 1. Supprimer projet 10 (cascade)
  await prisma.project.delete({ where: { id: 10 } });
  console.log('✅ Projet 10 (Sujet 2) supprimé');

  // ── 2. Supprimer tous les groupes du projet 8 (cascade nullifie group_id dans team_members)
  await prisma.projectGroup.deleteMany({ where: { project_id: 8 } });
  console.log('✅ Groupes aléatoires du projet 8 supprimés');

  // ── 3. Retirer les étudiants aléatoires — garder uniquement les comptes spéciaux
  const specialUsers = await prisma.user.findMany({
    where: { email: { in: SPECIAL_EMAILS } },
    select: { id: true },
  });
  const keepIds = specialUsers.map(u => u.id);

  const removed = await prisma.teamMember.deleteMany({
    where: { project_id: 8, user_id: { notIn: keepIds } },
  });
  console.log(`✅ ${removed.count} étudiants aléatoires retirés du projet 8`);

  // ── 4. Restaurer les jalons originaux
  await prisma.milestone.deleteMany({ where: { project_id: 8 } });
  await prisma.milestone.createMany({
    data: ORIGINAL_MILESTONES.map(m => ({ project_id: 8, ...m })),
  });
  console.log('✅ 7 jalons originaux restaurés sur le projet 8');

  // ── 5. Remettre le titre/description d'origine sur le projet 8
  await prisma.project.update({
    where: { id: 8 },
    data: {
      titre:       'Plateforme de gestion et suivi des projets étudiants',
      description: 'Sujet 1 — Solution permettant aux encadrants de superviser les projets étudiants et aux étudiants de collaborer et suivre leur progression.',
      statut:      'en_cours',
      date_debut:  new Date('2026-05-18'),
      date_fin:    new Date('2026-06-24'),
    },
  });
  console.log('✅ Projet 8 remis à son état d\'origine');

  // ── 6. Recréer le projet Electronique (les données originales sont perdues)
  const elec = await prisma.project.create({
    data: {
      titre:        'Projet Electronique Numérique 2026-2027 ISEN 3',
      description:  '',
      supervisor_id: 25,
      statut:       'en_cours',
      date_debut:   new Date('2026-05-18'),
      date_fin:     new Date('2026-06-24'),
    },
  });
  console.log(`✅ Projet Electronique recréé (ID ${elec.id}) — ⚠️ ses données originales (tâches, groupes, etc.) sont perdues`);

  console.log('\n🎉 Rollback terminé');
}

main()
  .catch(e => console.error('Erreur:', e.message))
  .finally(() => prisma.$disconnect());
