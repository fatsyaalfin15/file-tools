const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const AppError = require('../utils/AppError');

const W = 841.89; // A4 mendatar (poin)
const H = 595.28;

const hex = (h) =>
  rgb(
    parseInt(h.slice(1, 3), 16) / 255,
    parseInt(h.slice(3, 5), 16) / 255,
    parseInt(h.slice(5, 7), 16) / 255
  );

const THEMES = {
  orange: { main: '#ea580c', accent: '#16a34a', soft: '#fff7ed' },
  green: { main: '#16a34a', accent: '#ea580c', soft: '#f0fdf4' },
  blue: { main: '#1d4ed8', accent: '#b45309', soft: '#eff6ff' },
};

const INK = hex('#1e293b');
const MUTED = hex('#64748b');

const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

function formatDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

// kecilkan ukuran huruf sampai teks muat di lebar yang tersedia
function fitSize(font, text, max, min, maxWidth) {
  let size = max;
  while (size > min && font.widthOfTextAtSize(text, size) > maxWidth) size -= 1;
  return size;
}

function wrap(font, text, size, maxWidth) {
  const lines = [];
  let line = '';
  for (const word of text.split(' ')) {
    const test = line ? `${line} ${word}` : word;
    if (!line || font.widthOfTextAtSize(test, size) <= maxWidth) {
      line = test;
    } else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

// font bawaan PDF hanya mendukung huruf Latin, jadi periksa dulu supaya errornya jelas
function assertEncodable(font, texts) {
  for (const text of texts) {
    if (!text) continue;
    try {
      font.encodeText(text);
    } catch {
      throw new AppError(
        'Teks mengandung karakter yang tidak didukung. Gunakan huruf Latin (A–Z, termasuk aksen umum).',
        400
      );
    }
  }
}

async function createCertificate(data) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([W, H]);

  const serif = await pdf.embedFont(StandardFonts.TimesRomanBold);
  const script = await pdf.embedFont(StandardFonts.TimesRomanBoldItalic);
  const sans = await pdf.embedFont(StandardFonts.Helvetica);
  const sansBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const title = data.title.toUpperCase();
  const description = data.description ?? 'atas partisipasi dan kontribusinya yang luar biasa.';
  const dateText = [data.place, formatDate(data.date)].filter(Boolean).join(', ');

  assertEncodable(sans, [
    title,
    data.recipient,
    description,
    dateText,
    data.signerName,
    data.signerRole,
    data.number,
  ]);

  const t = THEMES[data.theme];
  const main = hex(t.main);
  const accent = hex(t.accent);

  const drawAt = (text, font, size, cx, y, color) =>
    page.drawText(text, { x: cx - font.widthOfTextAtSize(text, size) / 2, y, size, font, color });
  const center = (text, font, size, y, color) => drawAt(text, font, size, W / 2, y, color);

  // latar dan bingkai
  page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: hex(t.soft) });
  page.drawRectangle({ x: 24, y: 24, width: W - 48, height: H - 48, borderColor: main, borderWidth: 6 });
  page.drawRectangle({ x: 38, y: 38, width: W - 76, height: H - 76, borderColor: accent, borderWidth: 1.5 });
  for (const [cx, cy] of [[24, 24], [W - 24, 24], [24, H - 24], [W - 24, H - 24]]) {
    page.drawRectangle({ x: cx - 9, y: cy - 9, width: 18, height: 18, color: accent });
  }

  // nomor sertifikat
  if (data.number) center(data.number, sans, 10, H - 66, MUTED);

  // judul dan pemisah
  const titleSize = fitSize(serif, title, 44, 20, 640);
  center(title, serif, titleSize, H - 125, main);

  page.drawLine({ start: { x: W / 2 - 100, y: H - 150 }, end: { x: W / 2 - 12, y: H - 150 }, thickness: 1.5, color: accent });
  page.drawLine({ start: { x: W / 2 + 12, y: H - 150 }, end: { x: W / 2 + 100, y: H - 150 }, thickness: 1.5, color: accent });
  page.drawCircle({ x: W / 2, y: H - 150, size: 3.5, color: accent });

  // penerima
  center('Diberikan kepada', sans, 15, H - 195, MUTED);

  const nameSize = fitSize(script, data.recipient, 46, 18, 640);
  center(data.recipient, script, nameSize, H - 250, INK);

  const underline = Math.min(script.widthOfTextAtSize(data.recipient, nameSize) + 80, 700);
  page.drawLine({
    start: { x: (W - underline) / 2, y: H - 262 },
    end: { x: (W + underline) / 2, y: H - 262 },
    thickness: 1,
    color: accent,
  });

  // keterangan
  wrap(sans, description, 15, 620)
    .slice(0, 4)
    .forEach((line, i) => center(line, sans, 15, H - 305 - i * 22, INK));

  // tempat dan tanggal (kiri)
  const dateSize = fitSize(sans, dateText, 13, 9, 400);
  page.drawText(dateText, { x: 90, y: 110, size: dateSize, font: sans, color: INK });

  // tanda tangan (kanan)
  if (data.signerName || data.signerRole) {
    const sx = W - 190;
    page.drawLine({ start: { x: sx - 110, y: 128 }, end: { x: sx + 110, y: 128 }, thickness: 1, color: INK });

    let ty = 110;
    if (data.signerName) {
      drawAt(data.signerName, sansBold, fitSize(sansBold, data.signerName, 13, 8, 220), sx, ty, INK);
      ty -= 16;
    }
    if (data.signerRole) {
      drawAt(data.signerRole, sans, fitSize(sans, data.signerRole, 11, 8, 220), sx, ty, MUTED);
    }
  }

  pdf.setTitle(`Sertifikat ${data.recipient}`);
  pdf.setCreator('Alat File');
  pdf.setProducer('Alat File');
  return Buffer.from(await pdf.save());
}

module.exports = { createCertificate };