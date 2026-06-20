const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.user.findMany({
  where: { prenom: { in: ['Aziz','Assane','Loukou','Zipette'], mode: 'insensitive' } },
  select: { id: true, prenom: true, nom: true, email: true, classe: true }
}).then(r => console.log(JSON.stringify(r, null, 2))).finally(() => p.$disconnect());
