// ============================================
// Seed DEMO — données riches adaptées de data.txt
// Scénario : 3 groupes (Alpha en avance, Beta dans
// les temps, Gamma en retard critique)
// Usage : node prisma/seed-demo.js
// ⚠️ Vide les tables (sauf users) avant de remplir
// ============================================

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seed démo...');

  const hash = await bcrypt.hash('password123', 10);
  const adminHash = await bcrypt.hash('admin2026', 10);

  // ==========================================================
  // 0. NETTOYAGE (ordre inverse des clés étrangères)
  // ==========================================================
  await prisma.evaluation.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.deliverableReview.deleteMany();
  await prisma.deliverable.deleteMany();
  await prisma.taskHistory.deleteMany();
  await prisma.task.deleteMany();
  await prisma.message.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.project.deleteMany();
  console.log('✅ Tables nettoyées (users conservés)');

  // ==========================================================
  // 1. UTILISATEURS (upsert = créés s'ils n'existent pas)
  // ==========================================================
  const upsertUser = (nom, prenom, email, role, pwd = hash) =>
    prisma.user.upsert({
      where: { email },
      update: {},
      create: { nom, prenom, email, password_hash: pwd, role },
    });

  // -- Comptes historiques (inchangés) --
  const admin      = await upsertUser('Admin', 'ISEN', 'admin@isen.fr', 'admin', adminHash);
  const meryem     = await upsertUser('Benyoussef', 'Meryem', 'meryem.benyoussef@junia.com', 'supervisor');
  const alex       = await upsertUser('Komenan', 'Alex', 'alex.komenan@junia.com', 'student');
  const etu1       = await upsertUser('Etudiant1', 'Prénom1', 'etudiant1@junia.com', 'student');
  const etu2       = await upsertUser('Etudiant2', 'Prénom2', 'etudiant2@junia.com', 'student');
  const etu3       = await upsertUser('Etudiant3', 'Prénom3', 'etudiant3@junia.com', 'student');
  const etu4       = await upsertUser('Etudiant4', 'Prénom4', 'etudiant4@junia.com', 'student');

  // -- Encadrants (ex-TEACHER de data.txt) --
  const marc       = await upsertUser('Lefebvre', 'Marc', 'marc.lefebvre@junia.com', 'supervisor');
  const sophie     = await upsertUser('Marchand', 'Sophie', 'sophie.marchand@junia.com', 'supervisor');

  // -- Jurys (le schéma n'a pas de rôle JURY → supervisors) --
  const eric       = await upsertUser('Dupont', 'Éric', 'eric.dupont@junia.com', 'supervisor');
  const nathalie   = await upsertUser('Renard', 'Nathalie', 'nathalie.renard@junia.com', 'supervisor');
  const patrick    = await upsertUser('Vidal', 'Patrick', 'patrick.vidal@junia.com', 'supervisor');

  // -- Étudiants des 3 groupes --
  const lucas   = await upsertUser('Bernard', 'Lucas', 'lucas.bernard@etu.junia.com', 'student');
  const emma    = await upsertUser('Moreau', 'Emma', 'emma.moreau@etu.junia.com', 'student');
  const nathan  = await upsertUser('Simon', 'Nathan', 'nathan.simon@etu.junia.com', 'student');
  const chloe   = await upsertUser('Petit', 'Chloé', 'chloe.petit@etu.junia.com', 'student');
  const hugo    = await upsertUser('Leroy', 'Hugo', 'hugo.leroy@etu.junia.com', 'student');
  const ines    = await upsertUser('Garcia', 'Inès', 'ines.garcia@etu.junia.com', 'student');
  const theo    = await upsertUser('Roux', 'Théo', 'theo.roux@etu.junia.com', 'student');
  const maxime  = await upsertUser('Laurent', 'Maxime', 'maxime.laurent@etu.junia.com', 'student');
  const jade    = await upsertUser('Durand', 'Jade', 'jade.durand@etu.junia.com', 'student');
  const axel    = await upsertUser('Fontaine', 'Axel', 'axel.fontaine@etu.junia.com', 'student');

  console.log('✅ Utilisateurs créés (1 admin, 6 encadrants, 11 étudiants + 4 génériques)');

  // ==========================================================
  // 2. PROJETS (les "groupes" de data.txt → 1 projet = 1 groupe)
  // ==========================================================
  const pfa = await prisma.project.create({
    data: {
      titre: 'Plateforme de gestion et suivi des projets étudiants',
      description: 'Sujet 1 — Solution permettant aux encadrants de superviser les projets étudiants et aux étudiants de collaborer et suivre leur progression.',
      supervisor_id: meryem.id,
      date_debut: new Date('2026-05-18'),
      date_fin: new Date('2026-06-24'),
      statut: 'en_cours',
    },
  });

  const alpha = await prisma.project.create({
    data: {
      titre: 'Mixeur Audio PIC18F25K40 — Groupe Alpha',
      description: 'Conception d\'un mixeur audio 4 canaux en assembleur sur PIC18F25K40. Schéma KiCad, routage PCB, drivers SPI/I2C, calibration. Groupe EN AVANCE (92%).',
      supervisor_id: marc.id,
      date_debut: new Date('2025-10-01'),
      date_fin: new Date('2026-06-20'),
      statut: 'en_cours',
    },
  });

  const beta = await prisma.project.create({
    data: {
      titre: 'Mixeur Audio PIC18F25K40 — Groupe Beta',
      description: 'Mixeur audio 4 entrées mono, sortie stéréo, VU-mètre LED. Groupe DANS LES TEMPS (58%) malgré 3 semaines de retard PCB.',
      supervisor_id: marc.id,
      date_debut: new Date('2025-10-01'),
      date_fin: new Date('2026-06-20'),
      statut: 'en_cours',
    },
  });

  const gamma = await prisma.project.create({
    data: {
      titre: 'Mixeur Audio PIC18F25K40 — Groupe Gamma',
      description: 'Groupe EN RETARD CRITIQUE (21%) : PCB bloqué par erreurs DRC, firmware ne compile pas, rapport insuffisant. Plan de rattrapage en cours.',
      supervisor_id: marc.id,
      date_debut: new Date('2025-10-01'),
      date_fin: new Date('2026-06-20'),
      statut: 'en_retard',
    },
  });

  console.log('✅ 4 projets créés (PFA + Alpha + Beta + Gamma)');

  // ==========================================================
  // 3. MEMBRES DES ÉQUIPES
  // ==========================================================
  const addMembers = (projectId, lead, members) =>
    prisma.teamMember.createMany({
      data: [
        { project_id: projectId, user_id: lead.id, role_in_project: 'lead' },
        ...members.map(m => ({ project_id: projectId, user_id: m.id, role_in_project: 'member' })),
      ],
    });

  await addMembers(pfa.id, alex, [etu1, etu2, etu3, etu4]);
  await addMembers(alpha.id, lucas, [emma, nathan, chloe]);
  await addMembers(beta.id, hugo, [ines, theo]);
  await addMembers(gamma.id, maxime, [jade, axel]);

  console.log('✅ Membres ajoutés (4 équipes)');

  // ==========================================================
  // 4. TÂCHES (BLOCKED n\'existe pas → todo avec ⚠️ en description)
  // ==========================================================
  const t = (project_id, titre, statut, priorite, assigned_to, description = null, deadline = null) =>
    ({ project_id, titre, statut, priorite, assigned_to, description, deadline });

  // -- Alpha : quasi tout terminé --
  await prisma.task.createMany({ data: [
    t(alpha.id, 'Analyse du cahier des charges',                       'done',     'haute',   lucas.id,  '4 entrées audio, potentiomètres numériques, sortie stéréo.'),
    t(alpha.id, 'Sélection composants et BOM',                         'done',     'haute',   emma.id,   'PIC18F25K40, MCP42100, TL072, MCP3208, LM7805/7905.'),
    t(alpha.id, 'Schéma électronique KiCad (Rev 1.0)',                 'done',     'haute',   emma.id,   'Alimentation ±12V, 4 canaux analogiques, bus SPI.'),
    t(alpha.id, 'Routage PCB 2 couches (JLCPCB)',                      'done',     'haute',   nathan.id, 'Clearance 0.2mm, vias 0.8mm, plan de masse bottom.'),
    t(alpha.id, 'Soudure composants SMD et traversants',               'done',     'normale', lucas.id,  'CMS 0805 à la pâte. Tests continuité OK.'),
    t(alpha.id, 'Driver SPI assembleur (MCP42100)',                    'done',     'haute',   lucas.id,  'SPI mode 0,0 @ 1MHz. Validé à l\'oscilloscope.'),
    t(alpha.id, 'Driver ADC MCP3208 (lecture entrées audio)',          'done',     'haute',   lucas.id,  'Lecture 12 bits par canal.'),
    t(alpha.id, 'Gestion des interruptions (Timer0 + INT)',            'done',     'normale', chloe.id,  'Timer0 1ms + debounce boutons.'),
    t(alpha.id, 'Interface LCD I2C + encodeur rotatif',                'done',     'normale', chloe.id,  'I2C bitbang pour HD44780 via PCF8574.'),
    t(alpha.id, 'Tests intégration et calibration',                    'done',     'haute',   lucas.id,  'THD+N < 0.05% à -10dBu.'),
    t(alpha.id, 'Rapport technique final (68 pages)',                  'done',     'haute',   emma.id),
    t(alpha.id, 'Slides de soutenance',                                'done',     'normale', nathan.id),
    t(alpha.id, 'Révision PCB v2.0 — découplage',                      'en_cours', 'basse',   nathan.id, 'Condensateurs 100nF plus proches des VDD.'),
  ]});

  // -- Beta : moitié fait --
  await prisma.task.createMany({ data: [
    t(beta.id, 'Analyse du cahier des charges',                        'done',     'haute',   hugo.id),
    t(beta.id, 'Sélection composants et BOM',                          'done',     'haute',   ines.id,   'Choix MCP4131 (moins de broches).'),
    t(beta.id, 'Schéma électronique KiCad',                            'done',     'haute',   ines.id,   'Revoir découplage op-amp en Rev 1.1.'),
    t(beta.id, 'Routage PCB et validation DRC',                        'done',     'haute',   theo.id,   'Retard 3 semaines (erreurs silkscreen).'),
    t(beta.id, 'Soudure et tests de continuité',                       'done',     'normale', hugo.id,   'Court-circuit VCC/GND corrigé.'),
    t(beta.id, 'Driver SPI MCP4131 en assembleur',                     'en_cours', 'haute',   hugo.id,   'Problème timing SCK résolu (mode 0,0).'),
    t(beta.id, 'Driver ADC MCP3208',                                   'en_cours', 'haute',   theo.id,   'En attente stabilisation SPI.'),
    t(beta.id, 'Gestion des interruptions',                            'todo',     'normale', ines.id),
    t(beta.id, 'Interface LCD I2C',                                    'todo',     'normale', ines.id),
    t(beta.id, 'Tests intégration et calibration',                     'todo',     'haute',   hugo.id),
    t(beta.id, 'Rapport technique',                                    'en_cours', 'haute',   ines.id,   '18 pages sur ~60 estimées.'),
    t(beta.id, 'Slides de soutenance',                                 'todo',     'normale', theo.id),
  ]});

  // -- Gamma : presque rien, blocages --
  await prisma.task.createMany({ data: [
    t(gamma.id, 'Analyse du cahier des charges',                       'done',     'haute',   maxime.id, 'Rendu avec 15 jours de retard, specs incomplètes.'),
    t(gamma.id, 'Sélection composants et BOM',                         'done',     'haute',   jade.id,   'Rupture stock MCP42100 — 4 semaines de délai.'),
    t(gamma.id, 'Schéma électronique KiCad',                           'done',     'haute',   maxime.id, 'Erreurs relevées : polarité condensateurs inversée.'),
    t(gamma.id, 'Routage PCB et fabrication',                          'todo',     'haute',   axel.id,   '⚠️ BLOQUÉ : 28 erreurs DRC non résolues.'),
    t(gamma.id, 'Soudure des composants',                              'todo',     'haute',   maxime.id, '⏳ En attente réception PCB.'),
    t(gamma.id, 'Driver SPI en assembleur',                            'todo',     'haute',   maxime.id, '⚠️ BLOQUÉ : ne compile pas (mnémoniques PIC16 au lieu de PIC18).'),
    t(gamma.id, 'Driver ADC MCP3208',                                  'todo',     'haute',   jade.id),
    t(gamma.id, 'Gestion des interruptions',                           'todo',     'normale', axel.id,   'Deadline dépassée.'),
    t(gamma.id, 'Rapport technique',                                   'en_cours', 'haute',   jade.id,   '6 pages — insuffisant selon M. Lefebvre.'),
    t(gamma.id, 'Tests intégration',                                   'todo',     'haute',   maxime.id, '⚠️ Hardware non opérationnel.'),
    t(gamma.id, 'Slides de soutenance',                                'todo',     'haute',   maxime.id, 'Risque de non-présentation.'),
  ]});

  // -- PFA (le vrai projet de l'équipe) --
  await prisma.task.createMany({ data: [
    t(pfa.id, 'Initialiser le projet backend',     'done',     'haute',   alex.id),
    t(pfa.id, 'Schéma BDD — 12 modèles',           'done',     'haute',   alex.id),
    t(pfa.id, 'Authentification JWT + rôles',      'done',     'haute',   alex.id),
    t(pfa.id, 'Interface Kanban (frontend)',       'en_cours', 'normale', etu1.id),
    t(pfa.id, 'Dashboard encadrant',               'en_cours', 'normale', etu2.id),
    t(pfa.id, 'Page de gestion des livrables',     'todo',     'normale', etu3.id),
    t(pfa.id, 'Système de notifications',          'todo',     'basse',   etu4.id),
    t(pfa.id, 'Tests & corrections',               'todo',     'haute',   null),
  ]});

  console.log('✅ Tâches créées (44 au total)');

  // ==========================================================
  // 5. JALONS
  // ==========================================================
  await prisma.milestone.createMany({ data: [
    // PFA (dates réelles du PDF)
    { project_id: pfa.id, titre: 'Démarrage du projet',        date_cible: new Date('2026-05-18'), atteint: true, atteint_le: new Date('2026-05-18') },
    { project_id: pfa.id, titre: 'Point de suivi 1',           date_cible: new Date('2026-05-20'), atteint: true, atteint_le: new Date('2026-05-20') },
    { project_id: pfa.id, titre: 'Point de suivi 2',           date_cible: new Date('2026-05-26'), atteint: true, atteint_le: new Date('2026-05-26') },
    { project_id: pfa.id, titre: 'Point de suivi 3',           date_cible: new Date('2026-06-01'), atteint: false },
    { project_id: pfa.id, titre: 'Présentation mi-parcours',   date_cible: new Date('2026-06-08'), atteint: false },
    { project_id: pfa.id, titre: 'Livraison finale',           date_cible: new Date('2026-06-20'), atteint: false },
    { project_id: pfa.id, titre: 'Soutenance',                 date_cible: new Date('2026-06-23'), atteint: false },
    // Mixeur audio (checkpoints de data.txt)
    { project_id: alpha.id, titre: 'Cahier des charges',       date_cible: new Date('2025-10-25'), atteint: true, atteint_le: new Date('2025-10-22') },
    { project_id: alpha.id, titre: 'PCB fabriqué et soudé',    date_cible: new Date('2026-01-15'), atteint: true, atteint_le: new Date('2026-01-14') },
    { project_id: alpha.id, titre: 'Firmware complet',         date_cible: new Date('2026-03-30'), atteint: true, atteint_le: new Date('2026-03-28') },
    { project_id: alpha.id, titre: 'Soutenance',               date_cible: new Date('2026-06-18'), atteint: false },
    { project_id: beta.id,  titre: 'Cahier des charges',       date_cible: new Date('2025-10-25'), atteint: true, atteint_le: new Date('2025-10-24') },
    { project_id: beta.id,  titre: 'PCB fabriqué et soudé',    date_cible: new Date('2026-01-20'), atteint: true, atteint_le: new Date('2026-01-28') },
    { project_id: beta.id,  titre: 'Firmware complet',         date_cible: new Date('2026-04-15'), atteint: false },
    { project_id: beta.id,  titre: 'Soutenance',               date_cible: new Date('2026-06-18'), atteint: false },
    { project_id: gamma.id, titre: 'Cahier des charges',       date_cible: new Date('2025-10-25'), atteint: true, atteint_le: new Date('2025-11-10') },
    { project_id: gamma.id, titre: 'PCB fabriqué et soudé',    date_cible: new Date('2026-01-20'), atteint: false },
    { project_id: gamma.id, titre: 'Firmware complet',         date_cible: new Date('2026-04-15'), atteint: false },
    { project_id: gamma.id, titre: 'Soutenance (reportée)',    date_cible: new Date('2026-07-10'), atteint: false },
  ]});

  console.log('✅ Jalons créés');

  // ==========================================================
  // 6. LIVRABLES + REVIEWS
  // (APPROVED→accepte, REVISION_REQUESTED→revision, UNDER_REVIEW→pas de review)
  // ==========================================================
  const d = (project_id, uploaded_by, nom_fichier, type_fichier, taille) =>
    ({ project_id, uploaded_by, nom_fichier, chemin_fichier: `/uploads/${nom_fichier}`, type_fichier, taille });

  const delA1 = await prisma.deliverable.create({ data: d(alpha.id, emma.id,   'Schema_Electronique_Alpha_V2.pdf', 'pdf', 2400000) });
  const delA2 = await prisma.deliverable.create({ data: d(alpha.id, nathan.id, 'Fichiers_Gerber_PCB_Alpha.zip',    'zip', 8100000) });
  const delA3 = await prisma.deliverable.create({ data: d(alpha.id, lucas.id,  'Code_Assembleur_Final_Alpha.asm',  'asm', 96000) });
  const delA4 = await prisma.deliverable.create({ data: d(alpha.id, emma.id,   'Rapport_Technique_Alpha_v1.pdf',   'pdf', 5600000) });
  const delB1 = await prisma.deliverable.create({ data: d(beta.id,  ines.id,   'Schema_Electronique_Beta_V1.pdf',  'pdf', 1900000) });
  const delB2 = await prisma.deliverable.create({ data: d(beta.id,  hugo.id,   'Code_SPI_Beta_WIP.asm',            'asm', 41000) });
  const delG1 = await prisma.deliverable.create({ data: d(gamma.id, maxime.id, 'Schema_Electronique_Gamma_V1.pdf', 'pdf', 1700000) });
  const delG2 = await prisma.deliverable.create({ data: d(gamma.id, jade.id,   'Rapport_Partiel_Gamma_6p.pdf',     'pdf', 480000) });
  const delG3 = await prisma.deliverable.create({ data: d(gamma.id, maxime.id, 'Code_ASM_Gamma_Tentative.asm',     'asm', 12000) });

  await prisma.deliverableReview.createMany({ data: [
    { deliverable_id: delA1.id, reviewer_id: marc.id,   decision: 'accepte',  commentaire: 'Schéma V2 validé — découplage correct, routage SPI propre.' },
    { deliverable_id: delA2.id, reviewer_id: marc.id,   decision: 'accepte',  commentaire: 'Gerber conformes, envoi en fabrication approuvé.' },
    { deliverable_id: delA3.id, reviewer_id: sophie.id, decision: 'accepte',  commentaire: 'Firmware complet et bien commenté. Validé à l\'oscilloscope.' },
    { deliverable_id: delA4.id, reviewer_id: marc.id,   decision: 'accepte',  commentaire: 'Rapport validé avec mention Très Bien. Section SPI remarquable.' },
    { deliverable_id: delB1.id, reviewer_id: marc.id,   decision: 'revision', commentaire: 'Revoir le découplage alimentation op-amp avant la Rev 1.1.' },
    { deliverable_id: delG1.id, reviewer_id: marc.id,   decision: 'revision', commentaire: 'Condensateurs électrolytiques inversés, net power non connecté.' },
    { deliverable_id: delG2.id, reviewer_id: marc.id,   decision: 'revision', commentaire: '6 pages insuffisant — 25 pages minimum avant le 30 avril.' },
    { deliverable_id: delG3.id, reviewer_id: sophie.id, decision: 'rejete',   commentaire: 'Ne compile pas : mnémoniques PIC16 au lieu de PIC18. À reprendre entièrement.' },
  ]});

  console.log('✅ Livrables (9) + reviews (8) créés');

  // ==========================================================
  // 7. MESSAGES (le schéma n'a ni sujet ni destinataire :
  //    un message appartient au chat du projet)
  // ==========================================================
  await prisma.message.createMany({ data: [
    // PFA
    { project_id: pfa.id, sender_id: alex.id,    contenu: 'Bonjour l\'équipe ! Backend opérationnel, on passe au frontend.', is_read: true },
    { project_id: pfa.id, sender_id: meryem.id,  contenu: 'Bon travail ! Pensez à préparer la démo pour le point de suivi 3.', is_read: true },
    // Alpha
    { project_id: alpha.id, sender_id: marc.id,   contenu: 'J\'ai examiné votre schéma V2. Excellent travail ! Je valide, vous pouvez lancer la commande PCB.', is_read: true },
    { project_id: alpha.id, sender_id: lucas.id,  contenu: 'Merci M. Lefebvre ! Commande passée sur JLCPCB, délai 8-10 jours. On avance sur l\'assembleur en parallèle.', is_read: true },
    { project_id: alpha.id, sender_id: lucas.id,  contenu: 'Mme Marchand, on observe un glitch sur SCK en fin de transfert SPI. Comment gérer le bit SSPSTAT:BF ?', is_read: true },
    { project_id: alpha.id, sender_id: sophie.id, contenu: 'Bonne observation ! Testez BF avant de modifier CS#, et ajoutez un NOP pour respecter le tCSH du MCP42100.', is_read: true },
    { project_id: alpha.id, sender_id: marc.id,   contenu: 'Rapport validé avec mention Très Bien. Félicitations à toute l\'équipe !', is_read: true },
    // Beta
    { project_id: beta.id, sender_id: hugo.id,    contenu: 'Problème sérieux : le MCP4131 ne reconnaît pas la commande Write Wiper, oscillations parasites sur SCK.', is_read: true },
    { project_id: beta.id, sender_id: sophie.id,  contenu: 'Vous êtes en mode SPI 1,1 alors que le MCP4131 veut le mode 0,0. Corrigez SSPCON1 : CKP=0 et CKE=1.', is_read: true },
    { project_id: beta.id, sender_id: marc.id,    contenu: 'Point de suivi : 3 semaines de retard. Priorité au firmware, point de rattrapage lundi avec Mme Marchand.', is_read: true },
    { project_id: beta.id, sender_id: hugo.id,    contenu: 'Correction appliquée, le MCP4131 répond ! On fait tout pour rattraper le planning.', is_read: false },
    // Gamma
    { project_id: gamma.id, sender_id: marc.id,   contenu: '⚠️ ALERTE : retard critique. Présentez-vous demain 14h avec l\'état exact de votre avancement. Projet en danger de non-soutenance.', is_read: true },
    { project_id: gamma.id, sender_id: maxime.id, contenu: 'Nous sommes désolés. Rupture de stock composants, code qui ne compile pas, et Axel malade 2 semaines. Nous serons là demain.', is_read: true },
    { project_id: gamma.id, sender_id: sophie.id, contenu: 'Votre code utilise des mnémoniques PIC16. Pour le PIC18F25K40 : MOVFF, Access Bank, #include p18f25k40.inc. Reprenez les bases.', is_read: true },
    { project_id: gamma.id, sender_id: marc.id,   contenu: 'Plan de rattrapage : schéma corrigé avant le 21/02, SPI fonctionnel avant le 07/03. Point hebdomadaire chaque lundi 17h.', is_read: true },
    { project_id: gamma.id, sender_id: jade.id,   contenu: 'Rapport partiel déposé (6 pages). Le DRC a encore 12 erreurs — peut-on avoir une session en salle de TP ?', is_read: false },
  ]});

  console.log('✅ Messages créés (16)');

  // ==========================================================
  // 8. NOTIFICATIONS
  // ==========================================================
  await prisma.notification.createMany({ data: [
    { user_id: alex.id,   project_id: pfa.id,   type: 'milestone_reached',     contenu: 'Jalon "Point de suivi 2" atteint !' },
    { user_id: etu1.id,   project_id: pfa.id,   type: 'task_assigned',         contenu: 'Vous avez été assigné à la tâche "Interface Kanban"' },
    { user_id: lucas.id,  project_id: alpha.id, type: 'deliverable_reviewed',  contenu: 'Votre rapport technique a été accepté (mention Très Bien)' },
    { user_id: hugo.id,   project_id: beta.id,  type: 'comment_added',         contenu: 'Mme Marchand a répondu à votre question SPI' },
    { user_id: maxime.id, project_id: gamma.id, type: 'deliverable_reviewed',  contenu: 'Votre code assembleur a été rejeté — à reprendre' },
    { user_id: maxime.id, project_id: gamma.id, type: 'project_updated',       contenu: 'Plan de rattrapage instauré — point hebdomadaire lundi 17h' },
  ]});

  console.log('✅ Notifications créées');

  // ==========================================================
  // 9. ÉVALUATIONS
  // (le schéma a note+commentaire — les 4 critères de data.txt
  //  sont fusionnés dans le commentaire, globalGrade → note.
  //  Gamma : pas de note possible (null interdit) → pas d'évaluation,
  //  le suivi est exprimé via les messages/reviews)
  // ==========================================================
  await prisma.evaluation.createMany({ data: [
    { project_id: pfa.id,   evaluator_id: meryem.id,   note: 16.5,  commentaire: 'Très bon projet, architecture solide et présentation claire.' },
    { project_id: alpha.id, evaluator_id: eric.id,     note: 17.25, commentaire: '[Technique 17.5 | Rapport 18 | Présentation 16.5 | Équipe 17] Excellente maîtrise du PIC18F25K40. Driver SPI propre et validé oscilloscope. Niveau professionnel.' },
    { project_id: alpha.id, evaluator_id: nathalie.id, note: 17.38, commentaire: '[Technique 18 | Rapport 17 | Présentation 18.5 | Équipe 16] THD+N < 0.05%, très bon résultat. Démonstration live parfaite.' },
    { project_id: alpha.id, evaluator_id: patrick.id,  note: 16.88, commentaire: '[Technique 16 | Rapport 17.5 | Présentation 16 | Équipe 18] Coordination exemplaire. À améliorer : gestion d\'erreurs firmware (pas de watchdog).' },
  ]});

  console.log('✅ Évaluations créées (4)');

  // ==========================================================
  // RÉSUMÉ
  // ==========================================================
  console.log('\n🎉 ============================================');
  console.log('   SEED DÉMO TERMINÉ');
  console.log('============================================');
  console.log('Comptes de test (mdp: password123, admin: admin2026) :');
  console.log('  admin       : admin@isen.fr');
  console.log('  encadrant   : meryem.benyoussef@junia.com (projet PFA)');
  console.log('  encadrant   : marc.lefebvre@junia.com (3 groupes mixeur audio)');
  console.log('  encadrant   : sophie.marchand@junia.com');
  console.log('  étudiant TL : alex.komenan@junia.com (PFA)');
  console.log('  étudiant TL : lucas.bernard@etu.junia.com (Alpha — en avance)');
  console.log('  étudiant TL : hugo.leroy@etu.junia.com (Beta — dans les temps)');
  console.log('  étudiant TL : maxime.laurent@etu.junia.com (Gamma — en retard)');
  console.log('============================================\n');
}

main()
  .catch((e) => { console.error('❌ Erreur seed :', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
