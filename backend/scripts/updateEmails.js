const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const normalize = (str) =>
  (str || '').trim().toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

async function main() {
  const users = await prisma.user.findMany({
    where: { role: { in: ['student', 'supervisor'] } },
    select: { id: true, nom: true, prenom: true, email: true, role: true }
  });

  const usedEmails = new Set(
    (await prisma.user.findMany({ select: { email: true } })).map(u => u.email)
  );

  for (const u of users) {
    const p = normalize(u.prenom);
    const n = normalize(u.nom);
    const domain = u.role === 'student' ? 'student.junia.com' : 'junia.com';
    let newEmail = `${p}.${n}@${domain}`;

    // Si le nouvel email est déjà pris par un autre utilisateur, ajoute un suffixe
    let suffix = 2;
    while (usedEmails.has(newEmail) && newEmail !== u.email) {
      newEmail = `${p}.${n}${suffix}@${domain}`;
      suffix++;
    }

    if (u.email !== newEmail) {
      await prisma.user.update({ where: { id: u.id }, data: { email: newEmail } });
      usedEmails.add(newEmail);
      console.log(`${u.prenom} ${u.nom} : ${u.email} → ${newEmail}`);
    }
  }

  console.log('Mise à jour terminée.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
