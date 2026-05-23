// ============================================
// Prisma Client — singleton
// On crée une seule instance partagée dans
// toute l'application pour éviter les fuites
// de connexions en développement.
// ============================================

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = prisma;
