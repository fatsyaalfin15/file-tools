const pdfService = require('../services/pdfService');
const AppError = require('../utils/AppError');

exports.imagesToPdf = async (req, res) => {
  if (!req.files?.length) throw new AppError('Pilih minimal satu gambar', 400);

  const pdf = await pdfService.imagesToPdf(
    req.files.map((f) => f.buffer), // urutan sama dengan urutan unggahan
    req.validated
  );

  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'attachment; filename="gambar-ke-pdf.pdf"',
    'Cache-Control': 'no-store',
  });
  res.send(pdf);
};