// Crée un projet par promo (ISEN 1, ISEN 2, HEI 1-3, ISA 1-3)
// et assigne tous les étudiants de chaque classe en groupes de 5.
// ISEN 3 (projet 8) déjà existant — non touché.
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const SPECIAL_EMAILS = [
  'alex.komenan@junia.com',
  'etudiant1@junia.com', 'etudiant2@junia.com',
  'etudiant3@junia.com', 'etudiant4@junia.com',
  'admin@isen.fr',
];

const MILESTONES = [
  { titre: 'Démarrage',        date: '2026-05-18', atteint: true,  atteint_le: new Date('2026-05-18') },
  { titre: 'Point de suivi 1', date: '2026-06-01', atteint: true,  atteint_le: new Date('2026-06-01') },
  { titre: 'Point de suivi 2', date: '2026-06-15', atteint: true,  atteint_le: new Date('2026-06-15') },
  { titre: 'Livraisons',       date: '2026-06-20', atteint: false },
  { titre: 'Soutenances',      date: '2026-06-24', atteint: false },
];

// Un projet par niveau — ISEN 3 déjà existant
const PROMOS = [
  { label: 'ISEN 1', classes: ['CIR 1', 'CSI 1'] },
  { label: 'ISEN 2', classes: ['CIR 2', 'CSI 2'] },
  { label: 'HEI 1',  classes: ['HEI 1'] },
  { label: 'HEI 2',  classes: ['HEI 2'] },
  { label: 'HEI 3',  classes: ['HEI 3'] },
  { label: 'ISA 1',  classes: ['ISA 1'] },
  { label: 'ISA 2',  classes: ['ISA 2'] },
  { label: 'ISA 3',  classes: ['ISA 3'] },
];

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

async function createGroups(projectId, students) {
  const shuffled = shuffle([...students]);
  let idx = 0;
  let num = 1;

  while (idx < shuffled.length) {
    const roll = Math.random();
    let count = roll < 0.10 ? 3 : roll < 0.25 ? 4 : 5;
    count = Math.min(count, shuffled.length - idx);
    if (count === 0) break;

    const group = await prisma.projectGroup.create({
      data: { project_id: projectId, numero: num, capacite_max: 5 },
    });

    const members = shuffled.slice(idx, idx + count);
    idx += count;

    for (let i = 0; i < members.length; i++) {
      await prisma.teamMember.upsert({
        where:  { project_id_user_id: { project_id: projectId, user_id: members[i].id } },
        update: { group_id: group.id, role_in_project: i === 0 ? 'lead' : 'member' },
        create: { project_id: projectId, user_id: members[i].id, group_id: group.id, role_in_project: i === 0 ? 'lead' : 'member' },
      });
    }
    num++;
  }
  return num - 1;
}

async function main() {
  const supervisorId = 25; // Meryem Benyoussef

  for (const { label, classes } of PROMOS) {
    const students = await prisma.user.findMany({
      where: { role: 'student', email: { notIn: SPECIAL_EMAILS }, classe: { in: classes } },
      select: { id: true },
    });

    if (students.length === 0) {
      console.log(`⚠️  ${label} : aucun étudiant`);
      continue;
    }

    const project = await prisma.project.create({
      data: {
        titre:       `Plateforme de gestion et suivi des projets étudiants — ${label}`,
        description: "Proposer une solution permettant aux encadrants de superviser, suivre et piloter efficacement l'ensemble des projets étudiants, et aux étudiants de collaborer, s'organiser et suivre la progression de leurs projets.",
        supervisor_id: supervisorId,
        statut:      'en_cours',
        date_debut:  new Date('2026-05-18'),
        date_fin:    new Date('2026-06-24'),
      },
    });

    await prisma.milestone.createMany({
      data: MILESTONES.map(m => ({
        project_id: project.id,
        titre:      m.titre,
        date_cible: new Date(m.date),
        atteint:    m.atteint,
        atteint_le: m.atteint_le || null,
      })),
    });

    const nbGroups = await createGroups(project.id, students);
    console.log(`✅ ${label} — ID ${project.id} | ${students.length} étudiants | ${nbGroups} groupes`);
  }

  console.log('\n🎉 Done !');
}

main()
  .catch(e => console.error(e.message))
  .finally(() => prisma.$disconnect());
