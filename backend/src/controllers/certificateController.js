const certificateService = require('../services/certificateService');
const safeBaseName = require('../utils/safeName');

exports.create = async (req, res) => {
  const pdf = await certificateService.createCertificate(req.validated);

  // ".pdf" ditambahkan dulu supaya safeBaseName tidak memotong nama yang mengandung titik (mis. "Dr. Budi")
  const name = `sertifikat-${safeBaseName(`${req.validated.recipient}.pdf`, 'penerima')}.pdf`;

  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment; filename="${name}"`,
    'Cache-Control': 'no-store',
  });
  res.send(pdf);
};