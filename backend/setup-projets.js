// =============================================================
// Setup projets PFA3 ISEN — depuis PDF Lancement-PFA3
// - Renomme/met à jour les projets existants
// - Crée Sujet 1 et Sujet 2
// - Met à jour les jalons selon le PDF
// - Crée des groupes et répartit les étudiants aléatoirement
//   (sans les comptes "spéciaux" à la main)
// =============================================================
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Jalons réels du PDF
const MILESTONES = [
  { titre: 'Démarrage',                   date: '2026-05-18', atteint: true,  atteint_le: new Date('2026-05-18') },
  { titre: 'Point de suivi 1',            date: '2026-05-20', atteint: true,  atteint_le: new Date('2026-05-20') },
  { titre: 'Point de suivi 2',            date: '2026-05-26', atteint: true,  atteint_le: new Date('2026-05-26') },
  { titre: 'Point de suivi 3',            date: '2026-06-01', atteint: false },
  { titre: 'Présentation de mi-parcours', date: '2026-06-08', atteint: false },
  { titre: 'Point de suivi 4',            date: '2026-06-15', atteint: false },
  { titre: 'Livraisons',                  date: '2026-06-20', atteint: false },
  { titre: 'Soutenances',                 date: '2026-06-23', atteint: false },
];

// Emails des comptes "spéciaux" à ne pas toucher
const SPECIAL_EMAILS = [
  'alex.komenan@junia.com',
  'etudiant1@junia.com', 'etudiant2@junia.com',
  'etudiant3@junia.com', 'etudiant4@junia.com',
  'admin@isen.fr',
];

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

async function createMilestonesForProject(projectId) {
  await prisma.milestone.deleteMany({ where: { project_id: projectId } });
  await prisma.milestone.createMany({
    data: MILESTONES.map(m => ({
      project_id: projectId,
      titre:      m.titre,
      date_cible: new Date(m.date),
      atteint:    m.atteint,
      atteint_le: m.atteint_le || null,
    }))
  });
  console.log(`   ✅ ${MILESTONES.length} jalons créés pour projet ${projectId}`);
}

async function createGroupsAndAssign(projectId, nbGroups, students) {
  // Supprimer anciens groupes (cascade supprime members)
  await prisma.projectGroup.deleteMany({ where: { project_id: projectId } });

  const shuffled = shuffle([...students]);
  let idx = 0;

  for (let g = 1; g <= nbGroups; g++) {
    // Nombre aléatoire de membres : entre 2 et 5, certains groupes vides
    const roll = Math.random();
    let count;
    if (roll < 0.15)      count = 0;  // 15% vide
    else if (roll < 0.30) count = 2;  // 15% partiel
    else if (roll < 0.50) count = 3;  // 20% partiel
    else if (roll < 0.75) count = 4;  // 25%
    else                  count = 5;  // 35% plein

    const group = await prisma.projectGroup.create({
      data: { project_id: projectId, numero: g, capacite_max: 5 }
    });

    const members = shuffled.slice(idx, idx + count);
    idx += count;

    for (let i = 0; i < members.length; i++) {
      const role = i === 0 ? 'lead' : 'member';
      await prisma.teamMember.upsert({
        where: { project_id_user_id: { project_id: projectId, user_id: members[i].id } },
        update: { group_id: group.id, role_in_project: role },
        create: { project_id: projectId, user_id: members[i].id, group_id: group.id, role_in_project: role },
      });
    }
    console.log(`   Groupe ${g} : ${members.length} membres`);
  }
}

async function main() {
  const supervisorId = 25; // Meryem Benyoussef

  // ── 1. Récupérer les étudiants générés (exclure comptes spéciaux)
  const allStudents = await prisma.user.findMany({
    where: { role: 'student', email: { notIn: SPECIAL_EMAILS } },
    select: { id: true },
  });
  console.log(`📋 ${allStudents.length} étudiants disponibles pour affectation`);

  const shuffledStudents = shuffle([...allStudents]);
  const half = Math.floor(shuffledStudents.length / 2);
  const pool1 = shuffledStudents.slice(0, half);
  const pool2 = shuffledStudents.slice(half);

  // ── 2. Sujet 1 — Plateforme de gestion et suivi des projets étudiants
  let projet1 = await prisma.project.findFirst({ where: { supervisor_id: supervisorId } });
  if (projet1) {
    projet1 = await prisma.project.update({
      where: { id: projet1.id },
      data: {
        titre: 'Plateforme de gestion et suivi des projets étudiants',
        description: 'Proposer une solution permettant aux encadrants de superviser, suivre et piloter efficacement l\'ensemble des projets étudiants, et aux étudiants de collaborer, s\'organiser et suivre la progression de leurs projets.',
        statut: 'en_cours',
        date_debut: new Date('2026-05-18'),
        date_fin:   new Date('2026-06-24'),
      }
    });
    console.log(`✅ Projet 1 mis à jour (ID ${projet1.id})`);
  } else {
    projet1 = await prisma.project.create({
      data: {
        titre: 'Plateforme de gestion et suivi des projets étudiants',
        description: 'Proposer une solution permettant aux encadrants de superviser, suivre et piloter efficacement l\'ensemble des projets étudiants.',
        supervisor_id: supervisorId,
        statut: 'en_cours',
        date_debut: new Date('2026-05-18'),
        date_fin:   new Date('2026-06-24'),
      }
    });
    console.log(`✅ Projet 1 créé (ID ${projet1.id})`);
  }
  await createMilestonesForProject(projet1.id);
  console.log(`   Création des groupes Sujet 1...`);
  await createGroupsAndAssign(projet1.id, 8, pool1);

  // ── 3. Sujet 2 — Plateforme de suivi pédagogique et aide à la décision
  let projet2 = await prisma.project.findFirst({
    where: { titre: { contains: 'pédagogique' } }
  });
  if (!projet2) {
    projet2 = await prisma.project.create({
      data: {
        titre: 'Plateforme de suivi pédagogique et aide à la décision',
        description: 'Proposer une solution permettant aux enseignants de centraliser, analyser et exploiter les données pédagogiques afin d\'améliorer le suivi des étudiants et faciliter la prise de décision.',
        supervisor_id: supervisorId,
        statut: 'en_cours',
        date_debut: new Date('2026-05-18'),
        date_fin:   new Date('2026-06-24'),
      }
    });
    console.log(`✅ Projet 2 créé (ID ${projet2.id})`);
  } else {
    console.log(`✅ Projet 2 déjà existant (ID ${projet2.id})`);
  }
  await createMilestonesForProject(projet2.id);
  console.log(`   Création des groupes Sujet 2...`);
  await createGroupsAndAssign(projet2.id, 8, pool2);

  // ── 4. Supprimer les anciens projets demo (Alpha/Beta/Gamma etc.)
  const toDelete = await prisma.project.findMany({
    where: {
      id: { notIn: [projet1.id, projet2.id] },
      supervisor_id: supervisorId,
    },
    select: { id: true, titre: true }
  });
  for (const p of toDelete) {
    await prisma.project.delete({ where: { id: p.id } });
    console.log(`🗑  Projet demo supprimé : "${p.titre}"`);
  }

  console.log('\n🎉 Done !');
  console.log(`   Sujet 1 : "${projet1.titre}" (ID ${projet1.id})`);
  console.log(`   Sujet 2 : "${projet2.titre}" (ID ${projet2.id})`);
}

main()
  .catch(e => console.error(e.message))
  .finally(() => prisma.$disconnect());
