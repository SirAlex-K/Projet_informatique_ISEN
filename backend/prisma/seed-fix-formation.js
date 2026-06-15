// ============================================
// Fix — assigne formation/classe/promo aux
// étudiants qui n'en ont pas encore
// node prisma/seed-fix-formation.js
// ============================================

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Les 24 slots disponibles (formation × classe × promo)
const SLOTS = [
  { formation: 'ISEN', classe: 'CIR 1', promo: '2027' },
  { formation: 'ISEN', classe: 'CIR 1', promo: '2026' },
  { formation: 'ISEN', classe: 'CIR 2', promo: '2027' },
  { formation: 'ISEN', classe: 'CIR 2', promo: '2026' },
  { formation: 'ISEN', classe: 'CIR 3', promo: '2027' },
  { formation: 'ISEN', classe: 'CIR 3', promo: '2026' },
  { formation: 'ISEN', classe: 'CSI 1', promo: '2027' },
  { formation: 'ISEN', classe: 'CSI 1', promo: '2026' },
  { formation: 'ISEN', classe: 'CSI 2', promo: '2027' },
  { formation: 'ISEN', classe: 'CSI 2', promo: '2026' },
  { formation: 'ISEN', classe: 'CSI 3', promo: '2027' },
  { formation: 'ISEN', classe: 'CSI 3', promo: '2026' },
  { formation: 'HEI',  classe: 'HEI 1', promo: '2027' },
  { formation: 'HEI',  classe: 'HEI 1', promo: '2026' },
  { formation: 'HEI',  classe: 'HEI 2', promo: '2027' },
  { formation: 'HEI',  classe: 'HEI 2', promo: '2026' },
  { formation: 'HEI',  classe: 'HEI 3', promo: '2027' },
  { formation: 'HEI',  classe: 'HEI 3', promo: '2026' },
  { formation: 'ISA',  classe: 'ISA 1', promo: '2027' },
  { formation: 'ISA',  classe: 'ISA 1', promo: '2026' },
  { formation: 'ISA',  classe: 'ISA 2', promo: '2027' },
  { formation: 'ISA',  classe: 'ISA 2', promo: '2026' },
  { formation: 'ISA',  classe: 'ISA 3', promo: '2027' },
  { formation: 'ISA',  classe: 'ISA 3', promo: '2026' },
];

async function main() {
  // Récupère les étudiants sans formation
  const unassigned = await prisma.user.findMany({
    where: { role: 'student', formation: null },
    orderBy: { id: 'asc' },
  });

  if (unassigned.length === 0) {
    console.log('✅ Tous les étudiants ont déjà une formation assignée.');
    return;
  }

  console.log(`🔍 ${unassigned.length} étudiant(s) sans formation trouvé(s).\n`);

  // Compte combien d'étudiants sont déjà dans chaque slot
  const counts = await Promise.all(
    SLOTS.map(s => prisma.user.count({
      where: { role: 'student', formation: s.formation, classe: s.classe, promo: s.promo },
    }))
  );

  // Pour chaque étudiant sans formation, on choisit le slot le moins peuplé
  for (const student of unassigned) {
    const minCount = Math.min(...counts);
    const slotIndex = counts.indexOf(minCount);
    const slot = SLOTS[slotIndex];

    await prisma.user.update({
      where: { id: student.id },
      data: { formation: slot.formation, classe: slot.classe, promo: slot.promo },
    });

    counts[slotIndex]++;
    console.log(`  ✔ ${student.prenom} ${student.nom} → ${slot.formation} ${slot.classe} (${slot.promo})`);
  }

  console.log(`\n✅ ${unassigned.length} étudiant(s) mis à jour.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
