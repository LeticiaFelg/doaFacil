// src/middleware/upload.js
// Configura o multer para receber imagens e salvá-las em disco.

const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

// Garante que a pasta de uploads existe
const UPLOADS_DIR = path.resolve(process.env.UPLOADS_DIR || './uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),

  // Nome do arquivo: timestamp + extensão original
  // Ex: 1716900000000.jpg
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}${ext}`);
  },
});

// Aceita apenas imagens
function fileFilter(_req, file, cb) {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Formato não suportado. Use JPG, PNG, WEBP ou GIF.'));
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5 MB padrão
  },
});

module.exports = upload;