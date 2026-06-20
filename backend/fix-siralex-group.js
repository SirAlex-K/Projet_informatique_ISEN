const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  // Trouver le groupe numéro 5 du projet 13
  const group5 = await p.projectGroup.findUnique({
    where: { project_id_numero: { project_id: 13, numero: 5 } }
  });
  if (!group5) return console.log('❌ Groupe 5 introuvable dans projet 13');

  // Remettre siralexkmn (ID 4) dans le groupe 5
  await p.teamMember.update({
    where: { project_id_user_id: { project_id: 13, user_id: 4 } },
    data: { group_id: group5.id, role_in_project: 'lead' }
  });

  console.log(`✅ siralexkmn remis dans Groupe 5 (DB id ${group5.id}) du projet 13`);
}

main().catch(e => console.error(e.message)).finally(() => p.$disconnect());
