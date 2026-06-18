// Upsert des 5 membres réels de l'équipe en CIR 3 ISEN 2026
// node prisma/seed-team.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const TEAM = [
  { prenom: 'Aziz',   nom: 'Diop',    email: 'aziz.diop@junia.com'    },
  { prenom: 'Ange',   nom: 'Loukou',  email: 'ange.loukou@junia.com'   },
  { prenom: 'Alex',   nom: 'Komenan', email: 'alex.komenan@junia.com'  },
  { prenom: 'Chrys',  nom: 'Ngbesso', email: 'chrys.ngbesso@junia.com' },
  { prenom: 'Assane', nom: 'Diakite', email: 'assane.diakite@junia.com'},
];

async function main() {
  const hash = await bcrypt.hash('password123', 10);

  for (const t of TEAM) {
    const user = await prisma.user.upsert({
      where:  { email: t.email },
      update: { prenom: t.prenom, nom: t.nom, formation: 'ISEN', classe: 'CIR 3', promo: '2026' },
      create: {
        prenom: t.prenom, nom: t.nom, email: t.email,
        password_hash: hash, role: 'student',
        formation: 'ISEN', classe: 'CIR 3', promo: '2026'
      }
    });
    console.log(`✔ ${user.prenom} ${user.nom} (id: ${user.id})`);
  }

  console.log('\n✅ Les 5 étudiants sont prêts. Mot de passe : password123');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
