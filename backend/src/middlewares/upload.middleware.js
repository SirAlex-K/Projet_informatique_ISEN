// ============================================
// Middleware Upload — CDC : Dépôt de fichiers (Multer)
// Gère la réception et la validation des fichiers envoyés par les étudiants.
// Formats autorisés : PDF, ZIP, DOCX, PNG, JPG
// Taille maximale   : 10 MB
// Stockage          : dossier /uploads/ à la racine du backend
// ============================================

const multer = require('multer');
const path   = require('path');

// Configuration du stockage sur disque
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // dossier de destination (doit exister)
  },
  filename: (req, file, cb) => {
    // Nom unique : timestamp + nombre aléatoire + extension d'origine
    // Évite les collisions de noms entre fichiers différents
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

// Filtre par type MIME — rejette tout format non autorisé avant l'upload
const fileFilter = (req, file, cb) => {
  const allowed = [
    'application/pdf',
    'application/zip',
    'application/x-zip-compressed',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'image/png',
    'image/jpeg'
  ];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);  // accepter le fichier
  } else {
    cb(new Error('Format non autorisé. Formats acceptés : PDF, ZIP, DOCX, PNG, JPG'), false);
  }
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB en octets
});
