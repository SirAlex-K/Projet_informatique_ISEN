const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const group5 = await p.projectGroup.findUnique({
    where: { project_id_numero: { project_id: 13, numero: 5 } }
  });

  // Retirer tous les membres sauf siralexkmn (ID 4)
  const r = await p.teamMember.updateMany({
    where: { project_id: 13, group_id: group5.id, user_id: { not: 4 } },
    data:  { group_id: null }
  });

  console.log(`✅ ${r.count} membre(s) retiré(s) du groupe 5 — siralexkmn seul restant`);
}

main().catch(e => console.error(e.message)).finally(() => p.$disconnect());
