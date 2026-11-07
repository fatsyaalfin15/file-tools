const { z } = require('zod');

const compressBody = z.object({
  quality: z.coerce
    .number()
    .int('Kualitas harus bilangan bulat')
    .min(1, 'Kualitas minimal 1')
    .max(100, 'Kualitas maksimal 100')
    .default(75),
  format: z
    .enum(['original', 'jpeg', 'webp', 'png'], { message: 'Format tidak valid' })
    .default('original'),
  maxWidth: z.coerce
    .number()
    .int('Lebar harus bilangan bulat')
    .min(100, 'Lebar minimal 100 px')
    .max(8000, 'Lebar maksimal 8000 px')
    .optional(),
});

module.exports = { compressBody };