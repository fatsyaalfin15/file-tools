const { rateLimit } = require('express-rate-limit');
const AppError = require('../utils/AppError');

// Memproses gambar memakai banyak CPU, jadi batasnya lebih ketat dari proyek cuaca
module.exports = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (req, res, next) =>
    next(new AppError('Terlalu banyak permintaan, coba lagi beberapa menit lagi', 429)),
});