// Crée 2000 étudiants répartis équitablement par formation / classe / promo
// node prisma/seed-2000.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const PRENOMS = [
  'Lucas','Emma','Hugo','Léa','Nathan','Camille','Théo','Manon','Maxime','Lucie',
  'Antoine','Julie','Nicolas','Marie','Julien','Laura','Pierre','Pauline','Thomas','Chloé',
  'Clément','Élisa','Victor','Inès','Quentin','Marine','Florian','Margot','Axel','Jade',
  'Baptiste','Zoé','Simon','Céline','Romain','Élodie','Kevin','Ambre','Dylan','Lola',
  'Adrien','Yasmine','Mathieu','Solène','Bastien','Noémie','Valentin','Clara','Rémi','Laure',
  'Mohamed','Fatima','Karim','Nadia','Youssef','Leila','Amine','Aisha','Sofiane','Nora',
  'Raphaël','Margaux','Gaëtan','Océane','Tristan','Élise','Loïc','Justine','Damien','Charlotte',
  'Tanguy','Amina','Laurent','Vanessa','Éthan','Maëlys','Sébastien','Amélie','Bertrand','Sonia',
  'Guillaume','Thibault','Aurore','Éric','Florent','Célia','Théodore','Louis','Maël','Eva',
  'Alexis','Fabien','Lisa','Rémy','Éléonore','Mathis','Ryan','Mia','Inaya','Enzo',
];

const NOMS = [
  'Martin','Bernard','Dubois','Thomas','Robert','Richard','Petit','Durand','Leroy','Moreau',
  'Simon','Laurent','Lefebvre','Michel','Garcia','David','Bertrand','Roux','Vincent','Fournier',
  'Morel','Girard','André','Lefèvre','Lambert','Bonnet','François','Martinez','Legrand','Garnier',
  'Faure','Rousseau','Blanc','Guérin','Muller','Henry','Roussel','Nicolas','Perrin','Morin',
  'Mathieu','Clement','Gauthier','Dumont','Lopez','Fontaine','Chevalier','Robin','Masson','Sanchez',
  'Gerard','Nguyen','Boyer','Denis','Lemaire','Roy','Moulin','Renard','Giraud','Lacroix',
  'Caron','Aubry','Collet','Renaud','Picard','Colin','Fernandez','Barbier','Pelletier','Fleury',
  'Mercier','Dupont','Dumas','Vasseur','Gervais','Fabre','Leblanc','Gilles','Leconte','Aubert',
  'Charpentier','Poirier','Grondin','Deschamps','Lecomte','Prevost','Arnaud','Marchand','Meyer','Schneider',
  'Dupuis','Brun','Rey','Allard','Ponsot','Lebrun','Lacombe','Bonin','Leclerc','Cheikh',
];

// Toutes les combinaisons formation/classe/promo à couvrir équitablement
const SLOTS = [];
for (const [formation, classes] of [
  ['ISEN', ['CIR 1','CIR 2','CIR 3','CSI 1','CSI 2','CSI 3']],
  ['HEI',  ['HEI 1','HEI 2','HEI 3']],
  ['ISA',  ['ISA 1','ISA 2','ISA 3']],
]) {
  for (const classe of classes) {
    for (const promo of ['2026','2027']) {
      SLOTS.push({ formation, classe, promo });
    }
  }
}
// 6*2 + 3*2 + 3*2 = 24 slots → ~83 étudiants par slot pour 2000

const TARGET = 2000;

function slugify(str) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '');
}

async function main() {
  const hash = await bcrypt.hash('password123', 10);

  const students = [];
  for (let i = 0; i < TARGET; i++) {
    const slot   = SLOTS[i % SLOTS.length];
    const prenom = PRENOMS[i % PRENOMS.length];
    const nom    = NOMS[Math.floor(i / PRENOMS.length) % NOMS.length];
    const email  = `${slugify(prenom)}.${slugify(nom)}${i}@junia.com`;
    students.push({ prenom, nom, email, ...slot });
  }

  console.log(`🌱 Insertion de ${TARGET} étudiants...\n`);

  const BATCH = 100;
  let count = 0;

  for (let i = 0; i < students.length; i += BATCH) {
    const batch = students.slice(i, i + BATCH);
    await prisma.user.createMany({
      data: batch.map(s => ({
        prenom: s.prenom, nom: s.nom, email: s.email,
        password_hash: hash, role: 'student',
        formation: s.formation, classe: s.classe, promo: s.promo,
      })),
      skipDuplicates: true,
    });
    count += batch.length;
    process.stdout.write(`\r  ✔ ${count}/${TARGET}`);
  }

  // Résumé
  console.log('\n\n📊 Répartition :');
  const stats = {};
  for (const s of students) {
    const k = `${s.formation} ${s.classe} (${s.promo})`;
    stats[k] = (stats[k] || 0) + 1;
  }
  Object.entries(stats).sort(([a],[b]) => a.localeCompare(b))
    .forEach(([k,v]) => console.log(`   ${k.padEnd(22)} → ${v}`));

  console.log(`\n✅ ${TARGET} étudiants créés. Mot de passe : password123`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
