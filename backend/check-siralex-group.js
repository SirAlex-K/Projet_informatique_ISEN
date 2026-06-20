const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
// Vérifie le groupe de siralexkmn (ID 4) dans projet 13
p.teamMember.findUnique({
  where: { project_id_user_id: { project_id: 13, user_id: 4 } },
  include: { group: { select: { id: true, numero: true } } }
}).then(r => {
  if (!r) return console.log('siralexkmn NON TROUVÉ dans projet 13');
  console.log(`siralexkmn — groupe: ${r.group ? 'Groupe ' + r.group.numero + ' (DB id ' + r.group.id + ')' : 'AUCUN'} — role: ${r.role_in_project}`);
}).finally(() => p.$disconnect());
