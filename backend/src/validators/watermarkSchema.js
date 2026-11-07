const { z } = require('zod');

// rapikan spasi dan buang karakter kontrol (termasuk baris baru)
const clean = (s) => s.replace(/[\u0000-\u001F\u007F\s]+/g, ' ').trim();

const watermarkBody = z.object({
  text: z
    .string({ message: 'Teks watermark wajib diisi' })
    .transform(clean)
    .pipe(
      z
        .string()
        .min(1, 'Teks watermark wajib diisi')
        .max(40, 'Teks watermark maksimal 40 karakter')
    ),
  position: z
    .enum(['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right', 'tile'], {
      message: 'Posisi tidak valid',
    })
    .default('bottom-right'),
  size: z.enum(['small', 'medium', 'large'], { message: 'Ukuran tidak valid' }).default('medium'),
  opacity: z.coerce
    .number()
    .int('Transparansi harus bilangan bulat')
    .min(10, 'Transparansi minimal 10')
    .max(100, 'Transparansi maksimal 100')
    .default(50),
  color: z.enum(['white', 'black'], { message: 'Warna tidak valid' }).default('white'),
});

module.exports = { watermarkBody };
