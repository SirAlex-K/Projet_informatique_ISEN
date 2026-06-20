const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.user.findMany({
  where: { OR: [
    { email:  { contains: 'siral', mode: 'insensitive' } },
    { prenom: { contains: 'siral', mode: 'insensitive' } },
    { nom:    { contains: 'siral', mode: 'insensitive' } },
    { email:  { contains: 'alex.k', mode: 'insensitive' } },
  ]},
  select: { id: true, prenom: true, nom: true, email: true, classe: true, role: true }
}).then(r => console.log(JSON.stringify(r, null, 2))).finally(() => p.$disconnect());
