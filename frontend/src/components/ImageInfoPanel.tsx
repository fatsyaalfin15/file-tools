import { formatBytes } from "../lib/image";
import {
  FORMAT_LABEL,
  colorSpaceLabel,
  formatTakenAt,
  mapUrl,
  orientationLabel,
  privacyRisks,
} from "../lib/info";
import type { ImageInfo } from "../types/inspect";
import InfoSection from "./InfoSection";

export default function ImageInfoPanel({ info }: { info: ImageInfo }) {
  const risks = privacyRisks(info);
  const { camera, shot, gps } = info;

  const embedded = [
    info.embedded.exif && "EXIF",
    info.embedded.icc && "Profil warna (ICC)",
    info.embedded.xmp && "XMP",
    info.embedded.iptc && "IPTC",
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="space-y-5">
      {risks.length > 0 ? (
        <div
          role="status"
          className="rounded-xl bg-amber-50 p-3 ring-1 ring-amber-200 dark:bg-amber-950/40 dark:ring-amber-900"
        >
          <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
            Ditemukan data pribadi di dalam gambar
          </p>
          <p className="mt-1 text-sm text-amber-800 dark:text-amber-200">
            Tersimpan: {risks.join(", ")}.
          </p>
          <p className="mt-1 text-xs text-amber-700 dark:text-amber-300/80">
            Siapa pun yang menerima file ini dapat membacanya. Hapus sebelum dibagikan.
          </p>
        </div>
      ) : (
        <div
          role="status"
          className="rounded-xl bg-green-50 p-3 ring-1 ring-green-200 dark:bg-green-950/40 dark:ring-green-900"
        >
          <p className="text-sm font-semibold text-green-700 dark:text-green-300">
            Tidak ada data pribadi
          </p>
          <p className="mt-1 text-sm text-green-700 dark:text-green-200">
            Gambar ini tidak menyimpan lokasi, jenis kamera, maupun waktu pengambilan.
          </p>
        </div>
      )}

      <InfoSection
        title="Umum"
        rows={[
          { label: "Format", value: FORMAT_LABEL[info.format] },
          { label: "Dimensi", value: `${info.width} × ${info.height} px` },
          { label: "Resolusi", value: `${info.megapixels} megapiksel` },
          { label: "Ukuran file", value: formatBytes(info.sizeBytes) },
          { label: "Ruang warna", value: colorSpaceLabel(info.colorSpace) },
          { label: "Transparansi", value: info.hasAlpha ? "Ya" : "Tidak" },
          { label: "Kepadatan", value: info.density ? `${info.density} DPI` : null },
          { label: "Orientasi", value: orientationLabel(info.orientation) },
        ]}
      />

      <InfoSection
        title="Kamera dan pengaturan"
        emptyText="Tidak ada data kamera."
        rows={[
          { label: "Merek", value: camera.make },
          { label: "Model", value: camera.model },
          { label: "Lensa", value: camera.lens },
          { label: "Aplikasi pengedit", value: camera.software },
          { label: "Waktu pengambilan", value: formatTakenAt(shot.takenAt) },
          { label: "ISO", value: shot.iso !== null ? `ISO ${shot.iso}` : null },
          { label: "Bukaan", value: shot.aperture },
          { label: "Kecepatan rana", value: shot.exposure },
          { label: "Panjang fokus", value: shot.focalLength },
        ]}
      />

      <InfoSection
        title="Lokasi"
        emptyText="Tidak ada data lokasi."
        rows={
          gps
            ? [
                { label: "Koordinat", value: `${gps.latitude}, ${gps.longitude}`, warn: true },
                {
                  label: "Peta",
                  value: (
                    <a
                      href={mapUrl(gps.latitude, gps.longitude)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-600 underline hover:text-orange-700 dark:text-orange-300"
                    >
                      Buka di OpenStreetMap
                    </a>
                  ),
                },
              ]
            : []
        }
      />

      <InfoSection
        title="Data tertanam"
        emptyText="Tidak ada metadata tertanam."
        rows={[
          { label: "Blok metadata", value: embedded },
          {
            label: "Teks tersembunyi",
            value: info.textChunks.map((c) => c.keyword).join(", "),
          },
        ]}
      />
    </div>
  );
}
