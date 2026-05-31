// ============================================
// Seed — données de test pour la soutenance
// Données issues du fichier ISEN3_25-26_Lancement-PFA3.pdf
// node prisma/seed.js
// ============================================

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding...');

  const hash = await bcrypt.hash('password123', 10);
  const adminHash = await bcrypt.hash('admin2026', 10);

  // ---- Admin ----
  const admin = await prisma.user.upsert({
    where: { email: 'admin@isen.fr' },
    update: {},
    create: { nom: 'Admin', prenom: 'ISEN', email: 'admin@isen.fr', password_hash: adminHash, role: 'admin' }
  });

  // ---- Supervisor (données réelles PDF) ----
  const supervisor = await prisma.user.upsert({
    where: { email: 'meryem.benyoussef@junia.com' },
    update: {},
    create: { nom: 'Benyoussef', prenom: 'Meryem', email: 'meryem.benyoussef@junia.com', password_hash: hash, role: 'supervisor' }
  });

  // ---- Étudiants (Équipe 5 — Sujet 1) ----
  const leader = await prisma.user.upsert({
    where: { email: 'alex.komenan@junia.com' },
    update: {},
    create: { nom: 'Komenan', prenom: 'Alex', email: 'alex.komenan@junia.com', password_hash: hash, role: 'student' }
  });

  const student1 = await prisma.user.upsert({
    where: { email: 'etudiant1@junia.com' },
    update: {},
    create: { nom: 'Etudiant1', prenom: 'Prénom1', email: 'etudiant1@junia.com', password_hash: hash, role: 'student' }
  });

  const student2 = await prisma.user.upsert({
    where: { email: 'etudiant2@junia.com' },
    update: {},
    create: { nom: 'Etudiant2', prenom: 'Prénom2', email: 'etudiant2@junia.com', password_hash: hash, role: 'student' }
  });

  const student3 = await prisma.user.upsert({
    where: { email: 'etudiant3@junia.com' },
    update: {},
    create: { nom: 'Etudiant3', prenom: 'Prénom3', email: 'etudiant3@junia.com', password_hash: hash, role: 'student' }
  });

  const student4 = await prisma.user.upsert({
    where: { email: 'etudiant4@junia.com' },
    update: {},
    create: { nom: 'Etudiant4', prenom: 'Prénom4', email: 'etudiant4@junia.com', password_hash: hash, role: 'student' }
  });


  console.log('✅ Users créés');

  // ---- Projet (données réelles PDF) ----
  const project = await prisma.project.upsert({
    where: { id: 1 },
    update: {},
    create: {
      titre: 'Plateforme de gestion et suivi des projets étudiants',
      description: 'Sujet 1 — Proposer une solution permettant aux encadrants de superviser les projets étudiants et aux étudiants de collaborer et suivre leur progression.',
      supervisor_id: supervisor.id,
      date_debut: new Date('2026-05-18'),
      date_fin: new Date('2026-06-24'),
      statut: 'en_cours'
    }
  });

  console.log('✅ Projet créé');

  // ---- Team Members ----
  await prisma.teamMember.upsert({
    where: { project_id_user_id: { project_id: project.id, user_id: leader.id } },
    update: {},
    create: { project_id: project.id, user_id: leader.id, role_in_project: 'lead' }
  });
  for (const student of [student1, student2, student3, student4]) {
    await prisma.teamMember.upsert({
      where: { project_id_user_id: { project_id: project.id, user_id: student.id } },
      update: {},
      create: { project_id: project.id, user_id: student.id, role_in_project: 'member' }
    });
  }

  console.log('✅ Membres de l\'équipe ajoutés (1 TL + 4 membres)');

  // ---- Tâches ----
  await Promise.all([
    prisma.task.create({ data: { project_id: project.id, titre: 'Initialiser le projet backend', statut: 'done', priorite: 'haute', assigned_to: leader.id } }),
    prisma.task.create({ data: { project_id: project.id, titre: 'Schéma BDD — 12 modèles', statut: 'done', priorite: 'haute', assigned_to: leader.id } }),
    prisma.task.create({ data: { project_id: project.id, titre: 'Authentification JWT + rôles', statut: 'done', priorite: 'haute', assigned_to: leader.id } }),
    prisma.task.create({ data: { project_id: project.id, titre: 'Interface Kanban (frontend)', statut: 'en_cours', priorite: 'normale', assigned_to: student1.id } }),
    prisma.task.create({ data: { project_id: project.id, titre: 'Dashboard encadrant', statut: 'en_cours', priorite: 'normale', assigned_to: student2.id } }),
    prisma.task.create({ data: { project_id: project.id, titre: 'Page de gestion des livrables', statut: 'todo', priorite: 'normale', assigned_to: student3.id } }),
    prisma.task.create({ data: { project_id: project.id, titre: 'Système de notifications', statut: 'todo', priorite: 'basse', assigned_to: student4.id } }),
    prisma.task.create({ data: { project_id: project.id, titre: 'Tests & corrections', statut: 'todo', priorite: 'haute', assigned_to: null } }),
  ]);

  console.log('✅ Tâches créées');

  // ---- Jalons réels (données PDF) ----
  await prisma.milestone.createMany({
    data: [
      { project_id: project.id, titre: 'Démarrage du projet', date_cible: new Date('2026-05-18'), atteint: true, atteint_le: new Date('2026-05-18') },
      { project_id: project.id, titre: 'Point de suivi 1', date_cible: new Date('2026-05-20'), atteint: true, atteint_le: new Date('2026-05-20') },
      { project_id: project.id, titre: 'Point de suivi 2', date_cible: new Date('2026-05-26'), atteint: true, atteint_le: new Date('2026-05-26') },
      { project_id: project.id, titre: 'Point de suivi 3', date_cible: new Date('2026-06-01'), atteint: false },
      { project_id: project.id, titre: 'Présentation mi-parcours', date_cible: new Date('2026-06-08'), atteint: false },
      { project_id: project.id, titre: 'Point de suivi 4', date_cible: new Date('2026-06-15'), atteint: false },
      { project_id: project.id, titre: 'Livraison finale', date_cible: new Date('2026-06-20'), atteint: false },
      { project_id: project.id, titre: 'Soutenance', date_cible: new Date('2026-06-23'), atteint: false },
    ]
  });

  console.log('✅ Jalons créés (données réelles PDF)');

  // ---- Messages ----
  await prisma.message.createMany({
    data: [
      { project_id: project.id, sender_id: leader.id, contenu: 'Bonjour l\'équipe ! Backend opérationnel, on passe au frontend.' },
      { project_id: project.id, sender_id: supervisor.id, contenu: 'Bon travail ! Pensez à préparer la démo pour le point de suivi 3.' },
    ]
  });

  console.log('✅ Messages créés');

  // ---- Notifications ----
  await prisma.notification.createMany({
    data: [
      { user_id: leader.id, project_id: project.id, type: 'milestone_reached', contenu: 'Jalon "Point de suivi 2" atteint !' },
      { user_id: student1.id, project_id: project.id, type: 'task_assigned', contenu: 'Vous avez été assigné à la tâche "Interface Kanban"' },
    ]
  });

  console.log('✅ Notifications créées');

  // ---- Evaluation (par l'encadrant) ----
  await prisma.evaluation.create({
    data: {
      project_id: project.id,
      evaluator_id: supervisor.id,
      note: 16.5,
      commentaire: 'Tres bon projet, architecture solide et presentation claire.'
    }
  });

  console.log('✅ Evaluation creee');

  console.log('\n🎉 Seed terminé avec succès !');
  console.log('\n   Comptes de test :');
  console.log('   admin      : admin@isen.fr          | admin2026');
  console.log('   supervisor : meryem.benyoussef@junia.com | password123');
  console.log('   TL (student): alex.komenan@junia.com  | password123');
  console.log('   student    : etudiant1@junia.com ... etudiant4@junia.com | password123');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
