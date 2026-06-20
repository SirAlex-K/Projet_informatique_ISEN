const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.teamMember.findMany({
  where: { project_id: 13 },
  include: {
    user:  { select: { id: true, prenom: true, nom: true, email: true } },
    group: { select: { id: true, numero: true } },
  },
  orderBy: { joined_at: 'asc' },
  take: 30,
}).then(r => r.forEach(m =>
  console.log(`${m.user.email} — groupe: ${m.group ? m.group.numero : 'AUCUN'} — role: ${m.role_in_project}`)
)).finally(() => p.$disconnect());
