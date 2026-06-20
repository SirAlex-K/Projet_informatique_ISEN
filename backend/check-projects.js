const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.project.findMany({ select: { id: true, titre: true, supervisor_id: true } })
  .then(r => console.log(JSON.stringify(r, null, 2)))
  .finally(() => p.$disconnect());
