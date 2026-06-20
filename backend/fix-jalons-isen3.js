const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

const JALONS = [
  { titre: 'Démarrage',                   date_cible: new Date('2026-05-18'), atteint: true,  atteint_le: new Date('2026-05-18') },
  { titre: 'Point de suivi 1',            date_cible: new Date('2026-05-20'), atteint: true,  atteint_le: new Date('2026-05-20') },
  { titre: 'Point de suivi 2',            date_cible: new Date('2026-05-26'), atteint: true,  atteint_le: new Date('2026-05-26') },
  { titre: 'Point de suivi 3',            date_cible: new Date('2026-06-01'), atteint: true,  atteint_le: new Date('2026-06-01') },
  { titre: 'Présentation de mi-parcours', date_cible: new Date('2026-06-08'), atteint: true,  atteint_le: new Date('2026-06-08') },
  { titre: 'Point de suivi 4',            date_cible: new Date('2026-06-15'), atteint: true,  atteint_le: new Date('2026-06-15') },
  { titre: 'Livraisons',                  date_cible: new Date('2026-06-20'), atteint: false },
  { titre: 'Soutenances',                 date_cible: new Date('2026-06-23'), atteint: false },
];

async function main() {
  await p.milestone.deleteMany({ where: { project_id: 13 } });
  await p.milestone.createMany({
    data: JALONS.map(j => ({ project_id: 13, ...j }))
  });
  console.log(`✅ ${JALONS.length} jalons mis à jour sur le projet 13 (ISEN 3)`);
}

main().catch(e => console.error(e.message)).finally(() => p.$disconnect());
