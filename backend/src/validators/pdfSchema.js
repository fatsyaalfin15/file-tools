const { z } = require('zod');

const imagesToPdfBody = z.object({
  pageSize: z
    .enum(['a4', 'letter', 'fit'], { message: 'Ukuran halaman tidak valid' })
    .default('a4'),
  orientation: z
    .enum(['auto', 'portrait', 'landscape'], { message: 'Orientasi tidak valid' })
    .default('auto'),
  margin: z
    .enum(['none', 'small', 'medium'], { message: 'Margin tidak valid' })
    .default('small'),
});

module.exports = { imagesToPdfBody };