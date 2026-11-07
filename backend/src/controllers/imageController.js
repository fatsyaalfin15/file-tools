const imageService = require('../services/imageService');
const AppError = require('../utils/AppError');
const safeBaseName = require('../utils/safeName');

exports.compress = async (req, res) => {
  if (!req.file) throw new AppError('Pilih file gambar terlebih dahulu', 400);

  const { buffer, mime, ext } = await imageService.compressImage(req.file.buffer, req.validated);
  const name = `${safeBaseName(req.file.originalname, 'gambar')}-compressed.${ext}`;

  res.set({
    'Content-Type': mime,
    'Content-Disposition': `attachment; filename="${name}"`,
    'Cache-Control': 'no-store',
  });
  res.send(buffer);
};