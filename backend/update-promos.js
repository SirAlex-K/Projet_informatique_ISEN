const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const MAP = {
  '2025': '2024-2025',
  '2026': '2025-2026',
  '2027': '2026-2027',
  '2028': '2027-2028',
  '2029': '2028-2029',
  '2030': '2029-2030',
};

async function main() {
  for (const [ancien, nouveau] of Object.entries(MAP)) {
    const r = await prisma.user.updateMany({
      where: { promo: ancien },
      data:  { promo: nouveau },
    });
    if (r.count > 0) console.log(`✅ '${ancien}' → '${nouveau}' : ${r.count} utilisateurs`);
  }
  console.log('\n🎉 Done !');
}

main().catch(e => console.error(e.message)).finally(() => prisma.$disconnect());
