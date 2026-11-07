const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const AppError = require('../utils/AppError');
const { readImage, FORMATS } = require('../utils/sharpImage');

// Font disertakan di proyek supaya hasilnya sama di laptop dan di server (server Linux sering tanpa font)
const FONT_FILE = path.join(__dirname, '..', '..', 'assets', 'fonts', 'DejaVuSans-Bold.ttf');
const HAS_FONT = fs.existsSync(FONT_FILE);
const FONT = HAS_FONT ? 'DejaVu Sans Bold 96' : 'sans bold 96';

// tinggi teks relatif terhadap sisi terpendek gambar
const SIZE_FACTOR = { small: 0.045, medium: 0.07, large: 0.11 };
const COLORS = {
  white: { text: '#ffffff', shadow: '#000000' },
  black: { text: '#000000', shadow: '#ffffff' },
};
const CLEAR = { r: 0, g: 0, b: 0, alpha: 0 };

const escapeMarkup = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

async function renderText(text, color, alphaPercent) {
  const options = {
    text: `<span foreground="${color}" alpha="${alphaPercent}%">${escapeMarkup(text)}</span>`,
    font: FONT,
    rgba: true,
  };
  if (HAS_FONT) options.fontfile = FONT_FILE;

  try {
    return await sharp({ text: options }).png().toBuffer({ resolveWithObject: true });
  } catch {
    throw new AppError('Teks watermark tidak dapat dirender', 400);
  }
}

async function fitInside(image, maxW, maxH) {
  if (image.info.width <= maxW && image.info.height <= maxH) return image;
  return sharp(image.data)
    .resize({ width: maxW, height: maxH, fit: 'inside' })
    .png()
    .toBuffer({ resolveWithObject: true });
}

// Membuat lapisan watermark (teks + bayangan tipis supaya terbaca di latar terang maupun gelap)
async function buildLayer({ text, color, size, opacity }, width, height) {
  const palette = COLORS[color];
  const unit = Math.min(width, height);

  const raw = await renderText(text, palette.text, opacity);

  let scale = Math.max(12, Math.round(unit * SIZE_FACTOR[size])) / raw.info.height;
  if (raw.info.width * scale > width * 0.9) scale = (width * 0.9) / raw.info.width;

  const tw = Math.max(1, Math.round(raw.info.width * scale));
  const th = Math.max(1, Math.round(raw.info.height * scale));

  const textBuf = await sharp(raw.data).resize(tw, th, { fit: 'fill' }).png().toBuffer();

  const shadowRaw = await renderText(text, palette.shadow, Math.max(5, Math.round(opacity * 0.6)));
  const sigma = Math.max(0.6, th * 0.04);
  const m = Math.ceil(sigma * 3); // ruang kosong agar blur tidak terpotong
  const offset = Math.max(1, Math.round(th * 0.05));
  const pad = m + offset + 2;

  const shadowBuf = await sharp(shadowRaw.data)
    .resize(tw, th, { fit: 'fill' })
    .extend({ top: m, bottom: m, left: m, right: m, background: CLEAR })
    .blur(sigma)
    .png()
    .toBuffer();

  const layer = await sharp({
    create: { width: tw + pad * 2, height: th + pad * 2, channels: 4, background: CLEAR },
  })
    .composite([
      { input: shadowBuf, left: pad + offset - m, top: pad + offset - m },
      { input: textBuf, left: pad, top: pad },
    ])
    .png()
    .toBuffer({ resolveWithObject: true });

  return { layer: await fitInside(layer, width, height), textHeight: th };
}

async function buildTile(layer, textHeight, width, height) {
  const rotated = await sharp(layer.data)
    .rotate(-30, { background: CLEAR })
    .png()
    .toBuffer();

  const gapX = Math.round(textHeight * 1.2);
  const gapY = Math.round(textHeight * 1.6);
  const tile = await sharp(rotated)
    .extend({ top: gapY, bottom: gapY, left: gapX, right: gapX, background: CLEAR })
    .png()
    .toBuffer({ resolveWithObject: true });

  return fitInside(tile, width, height);
}

async function applyWatermark(input, options) {
  const { meta, open, width, height } = await readImage(input);
  const { layer, textHeight } = await buildLayer(options, width, height);

  let overlay;
  if (options.position === 'tile') {
    const tile = await buildTile(layer, textHeight, width, height);
    overlay = { input: tile.data, tile: true };
  } else {
    const margin = Math.round(Math.min(width, height) * 0.03);
    const lw = layer.info.width;
    const lh = layer.info.height;
    const spots = {
      center: [(width - lw) / 2, (height - lh) / 2],
      'top-left': [margin, margin],
      'top-right': [width - lw - margin, margin],
      'bottom-left': [margin, height - lh - margin],
      'bottom-right': [width - lw - margin, height - lh - margin],
    };
    const [x, y] = spots[options.position];
    overlay = {
      input: layer.data,
      left: Math.min(Math.max(0, Math.round(x)), width - lw),
      top: Math.min(Math.max(0, Math.round(y)), height - lh),
    };
  }

  let img = open().rotate().composite([overlay]); // .rotate() menerapkan orientasi EXIF dulu
  // encoder JPEG biasa (bukan mozjpeg): puluhan kali lebih cepat untuk foto besar, dan ini bukan alat kompres
  if (meta.format === 'jpeg') img = img.jpeg({ quality: 92 });
  else if (meta.format === 'png') img = img.png({ compressionLevel: 9 });
  else img = img.webp({ quality: 92 });

  try {
    return { buffer: await img.toBuffer(), ...FORMATS[meta.format] };
  } catch {
    throw new AppError('Gagal menambahkan watermark', 422);
  }
}

module.exports = { applyWatermark };
