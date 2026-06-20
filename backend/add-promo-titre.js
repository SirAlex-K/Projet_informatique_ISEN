const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const UPDATES = [
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

async function main() {
  for (const { id, label } of UPDATES) {
    const titre = `Projet Informatique et Développement Logiciel ${label} 2025-2026`;
    await prisma.project.update({ where: { id }, data: { titre } });
    console.log(`✅ ${titre}`);
  }
  console.log('\n🎉 Done !');
}

main().catch(e => console.error(e.message)).finally(() => prisma.$disconnect());
