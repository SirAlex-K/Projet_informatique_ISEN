const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

// Les 5 membres de l'équipe projet 13
const TEAM = [4, 156, 157, 159, 160]; // siralexkmn, Aziz, Loukou, Chrys, Assane

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

async function main() {
  const tasks = await p.task.findMany({
    where: { project_id: 13 },
    select: { id: true, titre: true },
    orderBy: { position: 'asc' },
  });

  // Distribuer round-robin sur le pool mélangé pour garantir que personne n'est oublié
  const pool = shuffle([...TEAM]);
  const updates = tasks.map((t, i) => ({
    id: t.id,
    assigned_to: pool[i % pool.length],
  }));

  for (const { id, assigned_to } of updates) {
    await p.task.update({ where: { id }, data: { assigned_to } });
  }

  // Afficher la répartition
  const counts = {};
  for (const { assigned_to } of updates) counts[assigned_to] = (counts[assigned_to] || 0) + 1;

  const users = await p.user.findMany({
    where: { id: { in: TEAM } },
    select: { id: true, prenom: true, nom: true },
  });
  users.forEach(u => console.log(`${u.prenom} ${u.nom} : ${counts[u.id] || 0} tâche(s)`));
  console.log(`\n✅ ${tasks.length} tâches redistribuées entre ${TEAM.length} membres`);
}

main().catch(e => console.error(e.message)).finally(() => p.$disconnect());
