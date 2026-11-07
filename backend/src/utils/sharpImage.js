const sharp = require('sharp');
const AppError = require('./AppError');

sharp.cache(false); // hemat memori

const LIMIT_PIXELS = 50_000_000; // tolak gambar di atas 50 megapiksel (cegah decompression bomb)

const FORMATS = {
  jpeg: { mime: 'image/jpeg', ext: 'jpg' },
  png: { mime: 'image/png', ext: 'png' },
  webp: { mime: 'image/webp', ext: 'webp' },
};

// Membaca gambar dan memeriksa ISI file yang sebenarnya (bukan ekstensi atau mimetype dari klien)
async function readImage(input) {
  const open = () => sharp(input, { limitInputPixels: LIMIT_PIXELS });

  let meta;
  try {
    meta = await open().metadata();
  } catch (err) {
    if (/pixel limit/i.test(err.message)) {
      throw new AppError('Resolusi gambar terlalu besar (maksimal 50 megapiksel)', 400);
    }
    throw new AppError('File bukan gambar yang valid', 400);
  }

  if (!FORMATS[meta.format]) {
    throw new AppError('Format gambar harus JPG, PNG, atau WebP', 400);
  }
  if ((meta.pages ?? 1) > 1) {
    throw new AppError('Gambar animasi belum didukung', 400);
  }
  if (meta.width * meta.height > LIMIT_PIXELS) {
    throw new AppError('Resolusi gambar terlalu besar (maksimal 50 megapiksel)', 400);
  }

  // orientasi EXIF 5 sampai 8 berarti gambar ditampilkan dengan lebar dan tinggi tertukar
  const swap = (meta.orientation ?? 1) >= 5;
  return {
    meta,
    open,
    width: swap ? meta.height : meta.width,
    height: swap ? meta.width : meta.height,
  };
}

module.exports = { readImage, FORMATS };
