import type { ImageInfo } from "../types/inspect";

const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export const FORMAT_LABEL: Record<ImageInfo["format"], string> = {
  jpeg: "JPEG",
  png: "PNG",
  webp: "WebP",
};

// "2024-05-03T14:22:10" (waktu setempat saat foto diambil) menjadi "3 Mei 2024, 14.22"
export function formatTakenAt(value: string | null): string | null {
  if (!value) return null;
  const m = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!m) return null;
  const month = MONTHS[Number(m[2]) - 1];
  if (!month) return null;
  return `${Number(m[3])} ${month} ${m[1]}, ${m[4]}.${m[5]}`;
}

export function colorSpaceLabel(space: string): string {
  const labels: Record<string, string> = {
    srgb: "sRGB",
    "b-w": "Hitam putih",
    cmyk: "CMYK",
    rgb16: "RGB 16-bit",
    grey16: "Abu-abu 16-bit",
  };
  return labels[space] ?? space;
}

export function orientationLabel(orientation: number | null): string | null {
  return orientation && orientation !== 1 ? `Diputar otomatis (EXIF ${orientation})` : null;
}

export function mapUrl(lat: number, lon: number): string {
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=16/${lat}/${lon}`;
}

// Jenis data pribadi yang tersimpan di dalam gambar
export function privacyRisks(info: ImageInfo): string[] {
  const risks: string[] = [];
  if (info.gps) risks.push("lokasi GPS");
  if (info.camera.make || info.camera.model || info.camera.lens)
    risks.push("jenis kamera atau ponsel");
  if (info.shot.takenAt) risks.push("waktu pengambilan");
  if (info.camera.software) risks.push("aplikasi pengedit");
  if (info.embedded.xmp || info.embedded.iptc)
    risks.push("data XMP atau IPTC (bisa memuat nama penulis)");
  if (info.textChunks.length > 0) risks.push("teks tersembunyi di dalam file");
  return risks;
}

// Data yang masih tersisa setelah gambar dibersihkan (seharusnya kosong)
export function remainingData(info: ImageInfo): string[] {
  const left: string[] = [];
  if (info.gps) left.push("GPS");
  if (info.embedded.exif) left.push("EXIF");
  if (info.embedded.xmp) left.push("XMP");
  if (info.embedded.iptc) left.push("IPTC");
  if (info.textChunks.length > 0) left.push("teks tersembunyi");
  return left;
}
