// Supprime les étudiants créés par l'ancien seed-2000.js (emails de type prenom.nom123@junia.com)
// node prisma/cleanup-seed-2000.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Les emails générés par l'ancien script se terminent par un chiffre avant @junia.com
  const targets = await prisma.user.findMany({
    where: {
      email: { endsWith: '@junia.com' },
      role: 'student',
    },
    select: { id: true, email: true },
  });

  // Garder uniquement ceux dont l'email a un chiffre juste avant @
  const toDelete = targets.filter(u => /\d@junia\.com$/.test(u.email));

  if (toDelete.length === 0) {
    console.log('Rien à supprimer.');
    return;
  }

  const ids = toDelete.map(u => u.id);
  console.log(`🗑  ${toDelete.length} étudiants à supprimer...`);

  // Supprimer les TeamMember d'abord (FK)
  const { count: tmCount } = await prisma.teamMember.deleteMany({
    where: { user_id: { in: ids } },
  });
  console.log(`   ✔ ${tmCount} TeamMember supprimés`);

  // Supprimer les users
  const { count: uCount } = await prisma.user.deleteMany({
    where: { id: { in: ids } },
  });
  console.log(`   ✔ ${uCount} utilisateurs supprimés`);

  console.log('\n✅ Nettoyage terminé.');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
