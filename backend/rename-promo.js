const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const UPDATES = [
  { id: 13, titre: 'Projet Informatique et Développement Logiciel ISEN 3 2025-2026' },
  { id: 14, titre: 'Projet Informatique et Développement Logiciel ISEN 1 2027-2028' },
  { id: 15, titre: 'Projet Informatique et Développement Logiciel ISEN 2 2026-2027' },
  { id: 16, titre: 'Projet Informatique et Développement Logiciel HEI 1 2027-2028'  },
  { id: 17, titre: 'Projet Informatique et Développement Logiciel HEI 2 2026-2027'  },
  { id: 18, titre: 'Projet Informatique et Développement Logiciel HEI 3 2025-2026'  },
  { id: 19, titre: 'Projet Informatique et Développement Logiciel ISA 1 2027-2028'  },
  { id: 20, titre: 'Projet Informatique et Développement Logiciel ISA 2 2026-2027'  },
  { id: 21, titre: 'Projet Informatique et Développement Logiciel ISA 3 2025-2026'  },
];

async function main() {
  for (const { id, titre } of UPDATES) {
    await prisma.project.update({ where: { id }, data: { titre } });
    console.log(`✅ ${titre}`);
  }
  console.log('\n🎉 Done !');
}

main().catch(e => console.error(e.message)).finally(() => prisma.$disconnect());
