const exifr = require('exifr');
const AppError = require('../utils/AppError');
const { readImage, FORMATS } = require('../utils/sharpImage');

// hanya tag yang kita tampilkan, supaya parsing cepat dan ringan
const OPTIONS = {
  pick: [
    'Make',
    'Model',
    'LensModel',
    'Software',
    'DateTimeOriginal',
    'CreateDate',
    'ISO',
    'FNumber',
    'ExposureTime',
    'FocalLength',
  ],
  reviveValues: false, // tanggal tetap berupa teks, tanpa konversi zona waktu
  translateValues: false,
};

const finite = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : null);
const round = (n, digits) => Math.round(n * 10 ** digits) / 10 ** digits;

// data berasal dari file pengguna, jadi buang karakter kontrol dan batasi panjangnya
function cleanText(value, max = 80) {
  if (typeof value !== 'string') return null;
  const text = value.replace(/[\u0000-\u001F\u007F]+/g, ' ').trim().slice(0, max);
  return text || null;
}

function exifDate(value) {
  if (typeof value !== 'string') return null;
  const m = value.match(/^(\d{4}):(\d{2}):(\d{2})[ T](\d{2}):(\d{2}):(\d{2})/);
  if (!m || m[1] === '0000') return null;
  return `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}`; // waktu setempat, tanpa zona waktu
}

function formatExposure(t) {
  const value = finite(t);
  if (!value || value <= 0) return null;
  return value >= 1 ? `${round(value, 1)} dtk` : `1/${Math.round(1 / value)} dtk`;
}

// JPEG bisa dibaca langsung. PNG dan WebP lebih andal lewat blok EXIF hasil ekstraksi sharp.
async function readExif(original, exifBlock) {
  const candidates = [original];
  if (exifBlock) {
    candidates.push(exifBlock);
    if (exifBlock.subarray(0, 4).toString('latin1') === 'Exif') {
      candidates.push(exifBlock.subarray(6)); // buang header "Exif\0\0"
    }
  }

  for (const input of candidates) {
    try {
      const tags = await exifr.parse(input, OPTIONS);
      const gps = await exifr.gps(input).catch(() => undefined);
      if (tags || gps) return { tags: tags ?? {}, gps };
    } catch {
      // coba kandidat berikutnya
    }
  }
  return { tags: {}, gps: undefined };
}

function toGps(gps) {
  const lat = finite(gps?.latitude);
  const lon = finite(gps?.longitude);
  if (lat === null || lon === null) return null;
  if (Math.abs(lat) > 90 || Math.abs(lon) > 180) return null;
  return { latitude: round(lat, 5), longitude: round(lon, 5) };
}

async function inspectImage(input) {
  const { meta, width, height } = await readImage(input);

  const { tags, gps } = meta.exif ? await readExif(input, meta.exif) : { tags: {}, gps: undefined };
  const iso = Array.isArray(tags.ISO) ? tags.ISO[0] : tags.ISO;
  const fNumber = finite(tags.FNumber);
  const focal = finite(tags.FocalLength);

  return {
    format: meta.format,
    width,
    height,
    megapixels: round((width * height) / 1_000_000, 1),
    sizeBytes: input.length,
    colorSpace: meta.space ?? 'srgb',
    hasAlpha: Boolean(meta.hasAlpha),
    density: finite(meta.density),
    orientation: finite(meta.orientation),
    progressive: Boolean(meta.isProgressive),
    embedded: {
      exif: Boolean(meta.exif),
      icc: Boolean(meta.icc),
      xmp: Boolean(meta.xmp),
      iptc: Boolean(meta.iptc),
    },
    // PNG bisa menyimpan teks tersembunyi (misalnya prompt gambar buatan AI)
    textChunks: (meta.comments ?? []).slice(0, 10).map((c) => ({
      keyword: cleanText(c.keyword, 40) ?? '(tanpa nama)',
      length: String(c.text ?? '').length,
    })),
    camera: {
      make: cleanText(tags.Make),
      model: cleanText(tags.Model),
      lens: cleanText(tags.LensModel),
      software: cleanText(tags.Software),
    },
    shot: {
      takenAt: exifDate(tags.DateTimeOriginal ?? tags.CreateDate),
      iso: finite(iso),
      aperture: fNumber ? `f/${round(fNumber, 1)}` : null,
      exposure: formatExposure(tags.ExposureTime),
      focalLength: focal ? `${Math.round(focal)} mm` : null,
    },
    gps: toGps(gps),
  };
}

// sharp membuang EXIF, GPS, XMP, IPTC, dan teks tersembunyi kecuali diminta menyimpannya
async function stripMetadata(input) {
  const { meta, open } = await readImage(input);

  let img = open().rotate(); // terapkan orientasi EXIF dulu, supaya gambar tidak berubah arah
  if (meta.format === 'jpeg') {
    img = img.jpeg({ quality: 95, chromaSubsampling: '4:4:4' });
  } else if (meta.format === 'png') {
    img = img.png({ compressionLevel: 9 }); // lossless
  } else {
    img = img.webp({ quality: 95 });
  }

  let buffer;
  try {
    buffer = await img.toBuffer();
  } catch {
    throw new AppError('Gagal memproses gambar', 422);
  }
  return { buffer, ...FORMATS[meta.format] };
}

module.exports = { inspectImage, stripMetadata };
