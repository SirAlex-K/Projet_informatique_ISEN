// ============================================
// Seed — données de test pour la soutenance
// node prisma/seed.js
// ============================================

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding...');

  // ---- Users ----
  const hash = await bcrypt.hash('password123', 10);

  const supervisor = await prisma.user.upsert({
    where: { email: 'dupont.marc@isen.fr' },
    update: {},
    create: { nom: 'Dupont', prenom: 'Marc', email: 'dupont.marc@isen.fr', password_hash: hash, role: 'supervisor' }
  });

  const leader = await prisma.user.upsert({
    where: { email: 'alex.komenan@isen.fr' },
    update: {},
    create: { nom: 'Komenan', prenom: 'Alex', email: 'alex.komenan@isen.fr', password_hash: hash, role: 'team_leader' }
  });

  const student1 = await prisma.user.upsert({
    where: { email: 'etudiant1@isen.fr' },
    update: {},
    create: { nom: 'Martin', prenom: 'Sophie', email: 'etudiant1@isen.fr', password_hash: hash, role: 'student' }
  });

  const student2 = await prisma.user.upsert({
    where: { email: 'etudiant2@isen.fr' },
    update: {},
    create: { nom: 'Bernard', prenom: 'Lucas', email: 'etudiant2@isen.fr', password_hash: hash, role: 'student' }
  });

  const jury = await prisma.user.upsert({
    where: { email: 'jury1@isen.fr' },
    update: {},
    create: { nom: 'Leroy', prenom: 'Claire', email: 'jury1@isen.fr', password_hash: hash, role: 'jury' }
  });

  console.log('✅ Users créés');

  // ---- Project ----
  const project = await prisma.project.upsert({
    where: { id: 1 },
    update: {},
    create: {
      titre: 'Plateforme de Gestion des Projets Étudiants',
      description: 'Application web de suivi des projets ISEN — Sujet 1',
      supervisor_id: supervisor.id,
      date_debut: new Date('2025-09-01'),
      date_fin: new Date('2026-06-30'),
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
  await prisma.teamMember.upsert({
    where: { project_id_user_id: { project_id: project.id, user_id: student1.id } },
    update: {},
    create: { project_id: project.id, user_id: student1.id, role_in_project: 'member' }
  });
  await prisma.teamMember.upsert({
    where: { project_id_user_id: { project_id: project.id, user_id: student2.id } },
    update: {},
    create: { project_id: project.id, user_id: student2.id, role_in_project: 'member' }
  });

  console.log('✅ Membres de l\'équipe ajoutés');

  // ---- Tasks ----
  const tasks = await Promise.all([
    prisma.task.create({
      data: { project_id: project.id, titre: 'Initialiser le projet backend', statut: 'done', priorite: 'haute', assigned_to: leader.id }
    }),
    prisma.task.create({
      data: { project_id: project.id, titre: 'Schéma BDD (entités & relations)', statut: 'done', priorite: 'haute', assigned_to: leader.id }
    }),
    prisma.task.create({
      data: { project_id: project.id, titre: 'Authentification JWT', statut: 'done', priorite: 'haute', assigned_to: leader.id }
    }),
    prisma.task.create({
      data: { project_id: project.id, titre: 'Interface Kanban (frontend)', statut: 'en_cours', priorite: 'normale', assigned_to: student1.id }
    }),
    prisma.task.create({
      data: { project_id: project.id, titre: 'Page de gestion des livrables', statut: 'en_cours', priorite: 'normale', assigned_to: student2.id }
    }),
    prisma.task.create({
      data: { project_id: project.id, titre: 'Système de notifications', statut: 'todo', priorite: 'basse', assigned_to: null }
    }),
  ]);

  console.log('✅ Tâches créées');

  // ---- Milestones ----
  await prisma.milestone.createMany({
    data: [
      { project_id: project.id, titre: 'Maquettes validées', date_cible: new Date('2025-10-15'), atteint: true, atteint_le: new Date('2025-10-12') },
      { project_id: project.id, titre: 'Backend opérationnel', date_cible: new Date('2026-01-31'), atteint: true, atteint_le: new Date('2026-01-28') },
      { project_id: project.id, titre: 'Version beta livrée', date_cible: new Date('2026-04-30'), atteint: false },
      { project_id: project.id, titre: 'Soutenance finale', date_cible: new Date('2026-06-20'), atteint: false },
    ]
  });

  console.log('✅ Jalons créés');

  // ---- Comments ----
  await prisma.comment.createMany({
    data: [
      { project_id: project.id, task_id: tasks[3].id, author_id: supervisor.id, contenu: 'Bien avancé, pensez à gérer le drag & drop mobile.' },
      { project_id: project.id, task_id: tasks[3].id, author_id: student1.id, contenu: 'Noted, je l\'ajoute dans la prochaine itération.' },
      { project_id: project.id, author_id: leader.id, contenu: 'Réunion de suivi prévue le 30 mai à 14h.' },
    ]
  });

  console.log('✅ Commentaires créés');

  // ---- Messages ----
  await prisma.message.createMany({
    data: [
      { project_id: project.id, sender_id: leader.id, contenu: 'Bonjour l\'équipe ! Bon courage pour la sprint !' },
      { project_id: project.id, sender_id: student1.id, contenu: 'Merci ! On avance bien sur le frontend.' },
      { project_id: project.id, sender_id: supervisor.id, contenu: 'Pensez à mettre à jour le Trello régulièrement.' },
    ]
  });

  console.log('✅ Messages créés');

  // ---- Notifications ----
  await prisma.notification.createMany({
    data: [
      { user_id: student1.id, project_id: project.id, type: 'task_assigned', contenu: 'Vous avez été assigné à la tâche "Interface Kanban"' },
      { user_id: student2.id, project_id: project.id, type: 'task_assigned', contenu: 'Vous avez été assigné à la tâche "Page de gestion des livrables"' },
      { user_id: leader.id, project_id: project.id, type: 'milestone_reached', contenu: 'Jalon "Backend opérationnel" atteint !' },
    ]
  });

  console.log('✅ Notifications créées');

  // ---- Evaluation ----
  await prisma.evaluation.create({
    data: {
      project_id: project.id,
      evaluator_id: jury.id,
      note: 16.5,
      commentaire: 'Très bon projet, architecture solide et présentation claire.'
    }
  });

  console.log('✅ Évaluation créée');

  console.log('\n🎉 Seed terminé avec succès !');
  console.log('   Comptes de test (mot de passe : password123)');
  console.log('   supervisor : dupont.marc@isen.fr');
  console.log('   team_leader: alex.komenan@isen.fr');
  console.log('   student    : etudiant1@isen.fr / etudiant2@isen.fr');
  console.log('   jury       : jury1@isen.fr');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
