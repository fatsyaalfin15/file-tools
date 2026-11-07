const sharp = require('sharp');
const { PDFDocument } = require('pdf-lib');
const AppError = require('../utils/AppError');

sharp.cache(false);

const LIMIT_PIXELS = 50_000_000; // tolak gambar di atas 50 megapiksel
const MAX_SIDE = 2500; // perkecil gambar raksasa supaya PDF tidak membengkak
const ALLOWED = ['jpeg', 'png', 'webp'];

const PAGES = { a4: [595.28, 841.89], letter: [612, 792] }; // poin, tegak
const MARGINS = { none: 0, small: 20, medium: 40 };
const FIT_LONG_SIDE = 842;

// pdf-lib hanya bisa menyisipkan JPG/PNG, jadi semua gambar dinormalkan lewat Sharp
async function prepareImage(input, index) {
  const label = `File ke-${index + 1}`;
  const open = () => sharp(input, { limitInputPixels: LIMIT_PIXELS });

  let meta;
  try {
    meta = await open().metadata();
  } catch {
    throw new AppError(`${label} bukan gambar yang valid`, 400);
  }
  if (!ALLOWED.includes(meta.format)) {
    throw new AppError(`${label} harus berformat JPG, PNG, atau WebP`, 400);
  }

  let img = open()
    .rotate() // terapkan orientasi EXIF
    .resize({ width: MAX_SIDE, height: MAX_SIDE, fit: 'inside', withoutEnlargement: true });

  img = meta.hasAlpha
    ? img.png({ compressionLevel: 9 })
    : img.jpeg({ quality: 85, mozjpeg: true });

  try {
    const { data, info } = await img.toBuffer({ resolveWithObject: true });
    return { data, width: info.width, height: info.height, isPng: info.format === 'png' };
  } catch {
    throw new AppError(`Gagal memproses ${label.toLowerCase()}`, 422);
  }
}

function pageDimensions(img, { pageSize, orientation }, margin) {
  if (pageSize === 'fit') {
    const scale = FIT_LONG_SIDE / Math.max(img.width, img.height);
    return [img.width * scale + margin * 2, img.height * scale + margin * 2];
  }

  const [w, h] = PAGES[pageSize];
  const landscape =
    orientation === 'landscape' || (orientation === 'auto' && img.width > img.height);
  return landscape ? [h, w] : [w, h];
}

async function imagesToPdf(buffers, options) {
  const pdf = await PDFDocument.create();
  const margin = MARGINS[options.margin];

  // diproses satu per satu supaya pemakaian memori tetap rendah
  for (let i = 0; i < buffers.length; i++) {
    const img = await prepareImage(buffers[i], i);
    const embedded = img.isPng ? await pdf.embedPng(img.data) : await pdf.embedJpg(img.data);

    const [pw, ph] = pageDimensions(img, options, margin);
    const page = pdf.addPage([pw, ph]);

    const scale = Math.min((pw - margin * 2) / img.width, (ph - margin * 2) / img.height);
    const width = img.width * scale;
    const height = img.height * scale;

    page.drawImage(embedded, {
      x: (pw - width) / 2,
      y: (ph - height) / 2,
      width,
      height,
    });
  }

  pdf.setTitle('Gambar ke PDF');
  pdf.setCreator('Alat File');
  pdf.setProducer('Alat File');
  return Buffer.from(await pdf.save());
}

module.exports = { imagesToPdf };