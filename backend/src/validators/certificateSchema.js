const { z } = require('zod');

// rapikan spasi dan buang karakter kontrol (termasuk baris baru)
const clean = (s) => s.replace(/[\u0000-\u001F\u007F\s]+/g, ' ').trim();

const required = (label, max) =>
  z
    .string({ message: `${label} wajib diisi` })
    .transform(clean)
    .pipe(
      z
        .string()
        .min(1, `${label} wajib diisi`)
        .max(max, `${label} maksimal ${max} karakter`)
    );

const optional = (label, max) =>
  z
    .string()
    .transform(clean)
    .pipe(z.string().max(max, `${label} maksimal ${max} karakter`))
    .optional()
    .transform((v) => v || undefined);

const isoDate = z
  .string({ message: 'Tanggal wajib diisi' })
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal tidak valid')
  .refine((v) => {
    const d = new Date(`${v}T00:00:00Z`);
    return (
      !Number.isNaN(d.getTime()) &&
      d.toISOString().slice(0, 10) === v &&
      v >= '1900-01-01' &&
      v <= '2100-12-31'
    );
  }, 'Tanggal tidak valid');

const certificateBody = z.object({
  recipient: required('Nama penerima', 60),
  title: required('Judul', 40),
  description: optional('Keterangan', 200).refine(
    (v) => v === undefined || !/\S{31,}/.test(v),
    'Keterangan mengandung kata yang terlalu panjang'
  ),
  date: isoDate,
  place: optional('Tempat', 40),
  signerName: optional('Nama penandatangan', 40),
  signerRole: optional('Jabatan', 40),
  number: optional('Nomor sertifikat', 40),
  theme: z.enum(['orange', 'green', 'blue'], { message: 'Tema tidak valid' }).default('orange'),
});

module.exports = { certificateBody };