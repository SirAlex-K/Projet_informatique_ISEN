const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.notification.findMany({ orderBy: { created_at: 'desc' }, take: 10, include: { user: { select: { prenom: true, nom: true } } } })
  .then(r => { console.log('Dernières notifs:', JSON.stringify(r, null, 2)); })
  .catch(e => console.error('Erreur:', e.message))
  .finally(() => prisma.$disconnect());
