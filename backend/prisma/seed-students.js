// ============================================
// Seed — 100 étudiants répartis uniformément
// ISEN (50) · HEI (25) · ISA (25)
// ~4 étudiants par classe × promo
// node prisma/seed-students.js
// ============================================

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const STUDENTS = [
  // ── ISEN · CIR 1 ─────────────────────────────────────────────────────────
  { prenom: 'Lucas',     nom: 'Dubois',     email: 'lucas.dubois@junia.com',     formation: 'ISEN', classe: 'CIR 1', promo: '2027' },
  { prenom: 'Emma',      nom: 'Martin',     email: 'emma.martin@junia.com',      formation: 'ISEN', classe: 'CIR 1', promo: '2027' },
  { prenom: 'Pierre',    nom: 'Garnier',    email: 'pierre.garnier@junia.com',   formation: 'ISEN', classe: 'CIR 1', promo: '2027' },
  { prenom: 'Marie',     nom: 'Moulin',     email: 'marie.moulin@junia.com',     formation: 'ISEN', classe: 'CIR 1', promo: '2027' },
  { prenom: 'Julien',    nom: 'Henry',      email: 'julien.henry@junia.com',     formation: 'ISEN', classe: 'CIR 1', promo: '2027' },
  { prenom: 'Lucie',     nom: 'Dumas',      email: 'lucie.dumas@junia.com',      formation: 'ISEN', classe: 'CIR 1', promo: '2026' },
  { prenom: 'Nicolas',   nom: 'Rivière',    email: 'nicolas.riviere@junia.com',  formation: 'ISEN', classe: 'CIR 1', promo: '2026' },
  { prenom: 'Pauline',   nom: 'Faure',      email: 'pauline.faure@junia.com',    formation: 'ISEN', classe: 'CIR 1', promo: '2026' },
  { prenom: 'Alexandre', nom: 'Ferrand',    email: 'alexandre.ferrand@junia.com',formation: 'ISEN', classe: 'CIR 1', promo: '2026' },

  // ── ISEN · CIR 2 ─────────────────────────────────────────────────────────
  { prenom: 'Hugo',      nom: 'Bernard',    email: 'hugo.bernard@junia.com',     formation: 'ISEN', classe: 'CIR 2', promo: '2027' },
  { prenom: 'Florian',   nom: 'Mercier',    email: 'florian.mercier@junia.com',  formation: 'ISEN', classe: 'CIR 2', promo: '2027' },
  { prenom: 'Céline',    nom: 'Colin',      email: 'celine.colin@junia.com',     formation: 'ISEN', classe: 'CIR 2', promo: '2027' },
  { prenom: 'Quentin',   nom: 'Perrin',     email: 'quentin.perrin@junia.com',   formation: 'ISEN', classe: 'CIR 2', promo: '2027' },
  { prenom: 'Camille',   nom: 'Thomas',     email: 'camille.thomas@junia.com',   formation: 'ISEN', classe: 'CIR 2', promo: '2026' },
  { prenom: 'Margot',    nom: 'Masson',     email: 'margot.masson@junia.com',    formation: 'ISEN', classe: 'CIR 2', promo: '2026' },
  { prenom: 'Victor',    nom: 'Gérard',     email: 'victor.gerard@junia.com',    formation: 'ISEN', classe: 'CIR 2', promo: '2026' },
  { prenom: 'Laura',     nom: 'Denis',      email: 'laura.denis@junia.com',      formation: 'ISEN', classe: 'CIR 2', promo: '2026' },

  // ── ISEN · CIR 3 ─────────────────────────────────────────────────────────
  { prenom: 'Clément',   nom: 'Renard',     email: 'clement.renard@junia.com',   formation: 'ISEN', classe: 'CIR 3', promo: '2027' },
  { prenom: 'Élisa',     nom: 'Lemaire',    email: 'elisa.lemaire@junia.com',    formation: 'ISEN', classe: 'CIR 3', promo: '2027' },
  { prenom: 'Guillaume', nom: 'Roux',       email: 'guillaume.roux@junia.com',   formation: 'ISEN', classe: 'CIR 3', promo: '2027' },
  { prenom: 'Lola',      nom: 'Picard',     email: 'lola.picard@junia.com',      formation: 'ISEN', classe: 'CIR 3', promo: '2027' },
  { prenom: 'Théo',      nom: 'Petit',      email: 'theo.petit@junia.com',       formation: 'ISEN', classe: 'CIR 3', promo: '2026' },
  { prenom: 'Léa',       nom: 'Robert',     email: 'lea.robert@junia.com',       formation: 'ISEN', classe: 'CIR 3', promo: '2026' },
  { prenom: 'Xavier',    nom: 'Bellamy',    email: 'xavier.bellamy@junia.com',   formation: 'ISEN', classe: 'CIR 3', promo: '2026' },
  { prenom: 'Noémie',    nom: 'Vasseur',    email: 'noemie.vasseur@junia.com',   formation: 'ISEN', classe: 'CIR 3', promo: '2026' },

  // ── ISEN · CSI 1 ─────────────────────────────────────────────────────────
  { prenom: 'Maxime',    nom: 'Richard',    email: 'maxime.richard@junia.com',   formation: 'ISEN', classe: 'CSI 1', promo: '2027' },
  { prenom: 'Mohamed',   nom: 'Bouchard',   email: 'mohamed.bouchard@junia.com', formation: 'ISEN', classe: 'CSI 1', promo: '2027' },
  { prenom: 'Fatima',    nom: 'Marchand',   email: 'fatima.marchand@junia.com',  formation: 'ISEN', classe: 'CSI 1', promo: '2027' },
  { prenom: 'Karim',     nom: 'Allard',     email: 'karim.allard@junia.com',     formation: 'ISEN', classe: 'CSI 1', promo: '2027' },
  { prenom: 'Nadia',     nom: 'Gautier',    email: 'nadia.gautier@junia.com',    formation: 'ISEN', classe: 'CSI 1', promo: '2027' },
  { prenom: 'Youssef',   nom: 'Brun',       email: 'youssef.brun@junia.com',     formation: 'ISEN', classe: 'CSI 1', promo: '2026' },
  { prenom: 'Leila',     nom: 'Rey',        email: 'leila.rey@junia.com',        formation: 'ISEN', classe: 'CSI 1', promo: '2026' },
  { prenom: 'Amine',     nom: 'Charpentier',email: 'amine.charpentier@junia.com',formation: 'ISEN', classe: 'CSI 1', promo: '2026' },
  { prenom: 'Aisha',     nom: 'Ponsot',     email: 'aisha.ponsot@junia.com',     formation: 'ISEN', classe: 'CSI 1', promo: '2026' },

  // ── ISEN · CSI 2 ─────────────────────────────────────────────────────────
  { prenom: 'Sarah',     nom: 'Simon',      email: 'sarah.simon@junia.com',      formation: 'ISEN', classe: 'CSI 2', promo: '2027' },
  { prenom: 'Sofiane',   nom: 'Lucas',      email: 'sofiane.lucas@junia.com',    formation: 'ISEN', classe: 'CSI 2', promo: '2027' },
  { prenom: 'Nora',      nom: 'Fabre',      email: 'nora.fabre@junia.com',       formation: 'ISEN', classe: 'CSI 2', promo: '2027' },
  { prenom: 'Kevin',     nom: 'Gervais',    email: 'kevin.gervais@junia.com',    formation: 'ISEN', classe: 'CSI 2', promo: '2027' },
  { prenom: 'Nathan',    nom: 'Laurent',    email: 'nathan.laurent@junia.com',   formation: 'ISEN', classe: 'CSI 2', promo: '2026' },
  { prenom: 'Marine',    nom: 'Aubert',     email: 'marine.aubert@junia.com',    formation: 'ISEN', classe: 'CSI 2', promo: '2026' },
  { prenom: 'Dylan',     nom: 'Leblanc',    email: 'dylan.leblanc@junia.com',    formation: 'ISEN', classe: 'CSI 2', promo: '2026' },
  { prenom: 'Élodie',    nom: 'Piron',      email: 'elodie.piron@junia.com',     formation: 'ISEN', classe: 'CSI 2', promo: '2026' },

  // ── ISEN · CSI 3 ─────────────────────────────────────────────────────────
  { prenom: 'Thibault',  nom: 'Deschamps',  email: 'thibault.deschamps@junia.com',formation: 'ISEN', classe: 'CSI 3', promo: '2027' },
  { prenom: 'Aurore',    nom: 'Dupré',      email: 'aurore.dupre@junia.com',     formation: 'ISEN', classe: 'CSI 3', promo: '2027' },
  { prenom: 'Simon',     nom: 'Leroux',     email: 'simon.leroux@junia.com',     formation: 'ISEN', classe: 'CSI 3', promo: '2027' },
  { prenom: 'Laure',     nom: 'Poirier',    email: 'laure.poirier@junia.com',    formation: 'ISEN', classe: 'CSI 3', promo: '2027' },
  { prenom: 'Julie',     nom: 'Michel',     email: 'julie.michel@junia.com',     formation: 'ISEN', classe: 'CSI 3', promo: '2026' },
  { prenom: 'Tristan',   nom: 'Berger',     email: 'tristan.berger@junia.com',   formation: 'ISEN', classe: 'CSI 3', promo: '2026' },
  { prenom: 'Élise',     nom: 'Morin',      email: 'elise.morin@junia.com',      formation: 'ISEN', classe: 'CSI 3', promo: '2026' },
  { prenom: 'Axel',      nom: 'Renaud',     email: 'axel.renaud@junia.com',      formation: 'ISEN', classe: 'CSI 3', promo: '2026' },

  // ── HEI · HEI 1 ──────────────────────────────────────────────────────────
  { prenom: 'Antoine',   nom: 'Lefebvre',   email: 'antoine.lefebvre@junia.com', formation: 'HEI',  classe: 'HEI 1', promo: '2027' },
  { prenom: 'Chloé',     nom: 'Leroy',      email: 'chloe.leroy@junia.com',      formation: 'HEI',  classe: 'HEI 1', promo: '2027' },
  { prenom: 'Éléonore',  nom: 'Lefèvre',    email: 'eleonore.lefevre@junia.com', formation: 'HEI',  classe: 'HEI 1', promo: '2027' },
  { prenom: 'Damien',    nom: 'Bertrand',   email: 'damien.bertrand@junia.com',  formation: 'HEI',  classe: 'HEI 1', promo: '2027' },
  { prenom: 'Thomas',    nom: 'Moreau',     email: 'thomas.moreau@junia.com',    formation: 'HEI',  classe: 'HEI 1', promo: '2026' },
  { prenom: 'Charlotte', nom: 'Giraud',     email: 'charlotte.giraud@junia.com', formation: 'HEI',  classe: 'HEI 1', promo: '2026' },
  { prenom: 'Loïc',      nom: 'Arnaud',     email: 'loic.arnaud@junia.com',      formation: 'HEI',  classe: 'HEI 1', promo: '2026' },
  { prenom: 'Justine',   nom: 'Roussel',    email: 'justine.roussel@junia.com',  formation: 'HEI',  classe: 'HEI 1', promo: '2026' },

  // ── HEI · HEI 2 ──────────────────────────────────────────────────────────
  { prenom: 'Inès',      nom: 'Durand',     email: 'ines.durand@junia.com',      formation: 'HEI',  classe: 'HEI 2', promo: '2027' },
  { prenom: 'Raphaël',   nom: 'Girard',     email: 'raphael.girard@junia.com',   formation: 'HEI',  classe: 'HEI 2', promo: '2027' },
  { prenom: 'Fabien',    nom: 'Collet',     email: 'fabien.collet@junia.com',    formation: 'HEI',  classe: 'HEI 2', promo: '2027' },
  { prenom: 'Margaux',   nom: 'Legrand',    email: 'margaux.legrand@junia.com',  formation: 'HEI',  classe: 'HEI 2', promo: '2027' },
  { prenom: 'Manon',     nom: 'Dupont',     email: 'manon.dupont@junia.com',     formation: 'HEI',  classe: 'HEI 2', promo: '2026' },
  { prenom: 'Mathis',    nom: 'Lambert',    email: 'mathis.lambert@junia.com',   formation: 'HEI',  classe: 'HEI 2', promo: '2026' },
  { prenom: 'Gaëtan',    nom: 'Lebrun',     email: 'gaetan.lebrun@junia.com',    formation: 'HEI',  classe: 'HEI 2', promo: '2026' },
  { prenom: 'Solène',    nom: 'Prévost',    email: 'solene.prevost@junia.com',   formation: 'HEI',  classe: 'HEI 2', promo: '2026' },

  // ── HEI · HEI 3 ──────────────────────────────────────────────────────────
  { prenom: 'Océane',    nom: 'Fournier',   email: 'oceane.fournier@junia.com',  formation: 'HEI',  classe: 'HEI 3', promo: '2027' },
  { prenom: 'Valentin',  nom: 'Barbier',    email: 'valentin.barbier@junia.com', formation: 'HEI',  classe: 'HEI 3', promo: '2027' },
  { prenom: 'Lisa',      nom: 'Lecomte',    email: 'lisa.lecomte@junia.com',     formation: 'HEI',  classe: 'HEI 3', promo: '2027' },
  { prenom: 'Rémi',      nom: 'Pelletier',  email: 'remi.pelletier@junia.com',   formation: 'HEI',  classe: 'HEI 3', promo: '2027' },
  { prenom: 'Eva',       nom: 'Schneider',  email: 'eva.schneider@junia.com',    formation: 'HEI',  classe: 'HEI 3', promo: '2027' },
  { prenom: 'Alexis',    nom: 'Fontaine',   email: 'alexis.fontaine@junia.com',  formation: 'HEI',  classe: 'HEI 3', promo: '2026' },
  { prenom: 'Jade',      nom: 'Rousseau',   email: 'jade.rousseau@junia.com',    formation: 'HEI',  classe: 'HEI 3', promo: '2026' },
  { prenom: 'Bastien',   nom: 'Meyer',      email: 'bastien.meyer@junia.com',    formation: 'HEI',  classe: 'HEI 3', promo: '2026' },
  { prenom: 'Élodie',    nom: 'Brunet',     email: 'elodie.brunet@junia.com',    formation: 'HEI',  classe: 'HEI 3', promo: '2026' },

  // ── ISA · ISA 1 ──────────────────────────────────────────────────────────
  { prenom: 'Baptiste',  nom: 'Blanc',      email: 'baptiste.blanc@junia.com',   formation: 'ISA',  classe: 'ISA 1', promo: '2027' },
  { prenom: 'Zoé',       nom: 'Guérin',     email: 'zoe.guerin@junia.com',       formation: 'ISA',  classe: 'ISA 1', promo: '2027' },
  { prenom: 'Florent',   nom: 'Aubry',      email: 'florent.aubry@junia.com',    formation: 'ISA',  classe: 'ISA 1', promo: '2027' },
  { prenom: 'Célia',     nom: 'Remy',       email: 'celia.remy@junia.com',       formation: 'ISA',  classe: 'ISA 1', promo: '2027' },
  { prenom: 'Théodore',  nom: 'Bonin',      email: 'theodore.bonin@junia.com',   formation: 'ISA',  classe: 'ISA 1', promo: '2027' },
  { prenom: 'Louis',     nom: 'Boyer',      email: 'louis.boyer@junia.com',      formation: 'ISA',  classe: 'ISA 1', promo: '2026' },
  { prenom: 'Inès',      nom: 'Caron',      email: 'ines.caron@junia.com',       formation: 'ISA',  classe: 'ISA 1', promo: '2026' },
  { prenom: 'Mathieu',   nom: 'Leconte',    email: 'mathieu.leconte@junia.com',  formation: 'ISA',  classe: 'ISA 1', promo: '2026' },
  { prenom: 'Pauline',   nom: 'Lebrun',     email: 'pauline.lebrun@junia.com',   formation: 'ISA',  classe: 'ISA 1', promo: '2026' },

  // ── ISA · ISA 2 ──────────────────────────────────────────────────────────
  { prenom: 'Maëlys',    nom: 'Gauthier',   email: 'maelys.gauthier@junia.com',  formation: 'ISA',  classe: 'ISA 2', promo: '2027' },
  { prenom: 'Ethan',     nom: 'Perez',      email: 'ethan.perez@junia.com',      formation: 'ISA',  classe: 'ISA 2', promo: '2027' },
  { prenom: 'Sébastien', nom: 'Mounier',    email: 'sebastien.mounier@junia.com',formation: 'ISA',  classe: 'ISA 2', promo: '2027' },
  { prenom: 'Amélie',    nom: 'Lacombe',    email: 'amelie.lacombe@junia.com',   formation: 'ISA',  classe: 'ISA 2', promo: '2027' },
  { prenom: 'Yasmine',   nom: 'André',      email: 'yasmine.andre@junia.com',    formation: 'ISA',  classe: 'ISA 2', promo: '2026' },
  { prenom: 'Romain',    nom: 'Bonnet',     email: 'romain.bonnet@junia.com',    formation: 'ISA',  classe: 'ISA 2', promo: '2026' },
  { prenom: 'Tanguy',    nom: 'Girard',     email: 'tanguy.girard@junia.com',    formation: 'ISA',  classe: 'ISA 2', promo: '2026' },
  { prenom: 'Ambre',     nom: 'Peyroux',    email: 'ambre.peyroux@junia.com',    formation: 'ISA',  classe: 'ISA 2', promo: '2026' },

  // ── ISA · ISA 3 ──────────────────────────────────────────────────────────
  { prenom: 'Clara',     nom: 'Dupuis',     email: 'clara.dupuis@junia.com',     formation: 'ISA',  classe: 'ISA 3', promo: '2027' },
  { prenom: 'Éric',      nom: 'Morel',      email: 'eric.morel@junia.com',       formation: 'ISA',  classe: 'ISA 3', promo: '2027' },
  { prenom: 'Vanessa',   nom: 'Dupuy',      email: 'vanessa.dupuy@junia.com',    formation: 'ISA',  classe: 'ISA 3', promo: '2027' },
  { prenom: 'Laurent',   nom: 'Gilles',     email: 'laurent.gilles@junia.com',   formation: 'ISA',  classe: 'ISA 3', promo: '2027' },
  { prenom: 'Adrien',    nom: 'Leclerc',    email: 'adrien.leclerc@junia.com',   formation: 'ISA',  classe: 'ISA 3', promo: '2026' },
  { prenom: 'Amina',     nom: 'Chevalier',  email: 'amina.chevalier@junia.com',  formation: 'ISA',  classe: 'ISA 3', promo: '2026' },
  { prenom: 'Bertrand',  nom: 'Collet',     email: 'bertrand.collet@junia.com',  formation: 'ISA',  classe: 'ISA 3', promo: '2026' },
  { prenom: 'Sonia',     nom: 'Barthes',    email: 'sonia.barthes@junia.com',    formation: 'ISA',  classe: 'ISA 3', promo: '2026' },
];

// Distribution : ISEN 50 · HEI 25 · ISA 25 = 100
// Chaque classe × promo : 4 étudiants (quelques slots à 5 pour atteindre 100)

async function main() {
  console.log(`🌱 Insertion de ${STUDENTS.length} étudiants...\n`);
  const hash = await bcrypt.hash('password123', 10);

  const stats = {};

  for (const s of STUDENTS) {
    await prisma.user.upsert({
      where: { email: s.email },
      update: { nom: s.nom, prenom: s.prenom, formation: s.formation, classe: s.classe, promo: s.promo },
      create: {
        nom: s.nom, prenom: s.prenom, email: s.email,
        password_hash: hash, role: 'student',
        formation: s.formation, classe: s.classe, promo: s.promo,
      },
    });
    const key = `${s.formation} ${s.classe} (${s.promo})`;
    stats[key] = (stats[key] || 0) + 1;
  }

  console.log('Distribution :');
  Object.entries(stats)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([k, v]) => console.log(`  ${k.padEnd(22)} → ${v} étudiants`));

  const byFormation = STUDENTS.reduce((acc, s) => {
    acc[s.formation] = (acc[s.formation] || 0) + 1;
    return acc;
  }, {});
  console.log('\nTotal par formation :');
  Object.entries(byFormation).forEach(([f, n]) => console.log(`  ${f} : ${n}`));
  console.log(`\n✅ ${STUDENTS.length} étudiants insérés. Mot de passe commun : password123`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
