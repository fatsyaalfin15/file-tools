const multer = require('multer');
const AppError = require('../utils/AppError');

const MB = 1024 * 1024;
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// memoryStorage: file hanya ada di RAM selama diproses, tidak pernah ditulis ke disk
function imageUpload({ maxFiles = 1, maxSizeMb = 4 } = {}) {
  return multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: maxSizeMb * MB, files: maxFiles, fields: 10, parts: 30 },
    fileFilter: (req, file, cb) => {
      // mimetype dikirim oleh klien, jadi ini hanya penyaring awal
      if (!IMAGE_TYPES.includes(file.mimetype)) {
        return cb(new AppError('Format file harus JPG, PNG, atau WebP', 400));
      }
      cb(null, true);
    },
  });
}

module.exports = { imageUpload };