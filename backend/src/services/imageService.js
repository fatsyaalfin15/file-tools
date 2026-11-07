const sharp = require('sharp');
const AppError = require('../utils/AppError');

sharp.cache(false); // hemat memori

const LIMIT_PIXELS = 50_000_000; // tolak gambar di atas 50 megapiksel (cegah decompression bomb)

const FORMATS = {
  jpeg: { mime: 'image/jpeg', ext: 'jpg' },
  png: { mime: 'image/png', ext: 'png' },
  webp: { mime: 'image/webp', ext: 'webp' },
};

async function compressImage(input, { quality, format, maxWidth }) {
  const open = () => sharp(input, { limitInputPixels: LIMIT_PIXELS });

  let meta;
  try {
    meta = await open().metadata();
  } catch {
    throw new AppError('File bukan gambar yang valid', 400);
  }

  // periksa isi file yang sebenarnya, bukan ekstensi atau mimetype dari klien (SVG ikut ditolak)
  if (!FORMATS[meta.format]) {
    throw new AppError('Format gambar harus JPG, PNG, atau WebP', 400);
  }

  const target = format === 'original' ? meta.format : format;

  // rotate() menerapkan orientasi EXIF; metadata lain (termasuk lokasi GPS) otomatis dibuang
  let img = open().rotate();
  if (maxWidth) img = img.resize({ width: maxWidth, withoutEnlargement: true });

  if (target === 'jpeg') {
    img = img.flatten({ background: '#ffffff' }).jpeg({ quality, mozjpeg: true });
  } else if (target === 'webp') {
    img = img.webp({ quality });
  } else {
    img = img.png({ compressionLevel: 9, palette: true, quality });
  }

  let output;
  try {
    output = await img.toBuffer();
  } catch {
    throw new AppError('Gagal memproses gambar', 422);
  }

  // kalau hasilnya malah lebih besar (gambar sudah optimal), kembalikan file asli
  if (!maxWidth && target === meta.format && output.length >= input.length) {
    return { buffer: input, ...FORMATS[meta.format] };
  }
  return { buffer: output, ...FORMATS[target] };
}

module.exports = { compressImage };