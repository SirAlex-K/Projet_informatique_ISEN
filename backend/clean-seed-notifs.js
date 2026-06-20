const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// Supprime les notifs sans project_id (données seed en dur)
prisma.notification.deleteMany({ where: { project_id: null } })
  .then(r => console.log(`${r.count} notifs en dur supprimées`))
  .catch(e => console.error(e.message))
  .finally(() => prisma.$disconnect());
