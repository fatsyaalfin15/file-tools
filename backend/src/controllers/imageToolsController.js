const metadataService = require('../services/metadataService');
const watermarkService = require('../services/watermarkService');
const AppError = require('../utils/AppError');
const safeBaseName = require('../utils/safeName');

function requireFile(req) {
  if (!req.file) throw new AppError('Pilih file gambar terlebih dahulu', 400);
  return req.file;
}

function sendImage(res, { buffer, mime }, filename) {
  res.set({
    'Content-Type': mime,
    'Content-Disposition': `attachment; filename="${filename}"`,
    'Cache-Control': 'no-store',
  });
  res.send(buffer);
}

exports.inspect = async (req, res) => {
  const file = requireFile(req);
  res.set('Cache-Control', 'no-store');
  res.json(await metadataService.inspectImage(file.buffer));
};

exports.stripMetadata = async (req, res) => {
  const file = requireFile(req);
  const result = await metadataService.stripMetadata(file.buffer);
  sendImage(res, result, `${safeBaseName(file.originalname, 'gambar')}-bersih.${result.ext}`);
};

exports.watermark = async (req, res) => {
  const file = requireFile(req);
  const result = await watermarkService.applyWatermark(file.buffer, req.validated);
  sendImage(res, result, `${safeBaseName(file.originalname, 'gambar')}-watermark.${result.ext}`);
};
