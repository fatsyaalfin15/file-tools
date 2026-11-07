const multer = require('multer');
const AppError = require('../utils/AppError');

const MULTER_ERRORS = {
  LIMIT_FILE_SIZE: [413, 'Ukuran file terlalu besar (maksimal 4 MB)'],
  LIMIT_FILE_COUNT: [400, 'Jumlah file melebihi batas'],
  LIMIT_UNEXPECTED_FILE: [400, 'Field file tidak sesuai atau jumlah file berlebih'],
};

function notFound(req, res, next) {
  next(new AppError('Endpoint tidak ditemukan', 404));
}

// Express mengenali error handler dari 4 parameternya, jadi `next` wajib ada
function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (err instanceof multer.MulterError) {
    const [status, message] = MULTER_ERRORS[err.code] ?? [400, 'Upload file gagal'];
    return res.status(status).json({ message });
  }
   if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Format data tidak valid' });
  }
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ message: 'Data terlalu besar' });
  }
  console.error(err); // error tak terduga: catat di server, jangan bocor ke klien
  res.status(500).json({ message: 'Terjadi kesalahan pada server' });
}

module.exports = { notFound, errorHandler };