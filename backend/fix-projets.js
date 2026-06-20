const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// IDs à ne jamais toucher dans le projet ISEN 3
const PROTECTED_IDS = [156, 157, 159, 160]; // Aziz, Loukou, Chrys, Assane
const SPECIAL_EMAILS = [
  'alex.komenan@junia.com',
  'etudiant1@junia.com','etudiant2@junia.com','etudiant3@junia.com','etudiant4@junia.com',
  'admin@isen.fr',
];

// Mapping projet ID → label promo
const RENAMES = [
  { id: 13, label: 'ISEN 3' },
  { id: 14, label: 'ISEN 1' },
  { id: 15, label: 'ISEN 2' },
  { id: 16, label: 'HEI 1'  },
  { id: 17, label: 'HEI 2'  },
  { id: 18, label: 'HEI 3'  },
  { id: 19, label: 'ISA 1'  },
  { id: 20, label: 'ISA 2'  },
  { id: 21, label: 'ISA 3'  },
];

const PROMOS = [
  { id: 14, classes: ['CIR 1', 'CSI 1'] },
  { id: 15, classes: ['CIR 2', 'CSI 2'] },
  { id: 16, classes: ['HEI 1'] },
  { id: 17, classes: ['HEI 2'] },
  { id: 18, classes: ['HEI 3'] },
  { id: 19, classes: ['ISA 1'] },
  { id: 20, classes: ['ISA 2'] },
  { id: 21, classes: ['ISA 3'] },
];

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Crée les groupes et assigne les étudiants de façon aléatoire
// Certains groupes seront vides, certains partiels, certains pleins
async function createGroups(projectId, students) {
  const shuffled = shuffle([...students]);
  const nbGroups = Math.ceil(shuffled.length / 3.8); // un peu plus que nécessaire pour avoir des groupes vides
  let idx = 0;

  for (let g = 1; g <= nbGroups; g++) {
    const roll = Math.random();
    let count;
    if      (roll < 0.15) count = 0; // 15% vide
    else if (roll < 0.30) count = 2; // 15% avec 2
    else if (roll < 0.50) count = 3; // 20% avec 3
    else if (roll < 0.75) count = 4; // 25% avec 4
    else                  count = 5; // 35% plein

    count = Math.min(count, shuffled.length - idx);

    const group = await prisma.projectGroup.create({
      data: { project_id: projectId, numero: g, capacite_max: 5 },
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

    if (idx >= shuffled.length) break;
  }
}

async function main() {
  // ── 1. Renommer tous les projets
  for (const { id, label } of RENAMES) {
    await prisma.project.update({
      where: { id },
      data: { titre: `Projet Informatique et Développement Logiciel ${label}` },
    });
  }
  console.log('✅ Projets renommés');

  // ── 2. Refaire les groupes des projets 14-21
  for (const { id, classes } of PROMOS) {
    await prisma.projectGroup.deleteMany({ where: { project_id: id } });
    await prisma.teamMember.deleteMany({ where: { project_id: id } });

    const students = await prisma.user.findMany({
      where: { role: 'student', email: { notIn: SPECIAL_EMAILS }, classe: { in: classes } },
      select: { id: true },
    });

    await createGroups(id, students);
    console.log(`✅ Projet ${id} (${classes.join('/')}) — ${students.length} étudiants regroupés`);
  }

  // ── 3. Ajouter les étudiants CIR 3/CSI 3 sur le projet 8 (ISEN 3)
  //       sans toucher Aziz, Assane, Loukou, Chrys ni Alex/etudiant1-4
  await prisma.projectGroup.deleteMany({ where: { project_id: 13 } });

  const isen3Students = await prisma.user.findMany({
    where: {
      role: 'student',
      email: { notIn: SPECIAL_EMAILS },
      id:    { notIn: PROTECTED_IDS },
      classe: { in: ['CIR 3', 'CSI 3'] },
    },
    select: { id: true },
  });

  await createGroups(13, isen3Students);
  console.log(`✅ Projet 13 (ISEN 3) — ${isen3Students.length} étudiants regroupés (Aziz/Assane/Loukou/Chrys préservés)`);

  console.log('\n🎉 Done !');
}

main()
  .catch(e => console.error(e.message))
  .finally(() => prisma.$disconnect());
