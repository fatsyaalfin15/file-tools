import { useImageInspector } from "../hooks/useImageInspector";
import { formatBytes } from "../lib/image";
import { remainingData } from "../lib/info";
import Card from "./Card";
import Dropzone from "./DropZone";
import ImageInfoPanel from "./ImageInfoPanel";
import ZoomableImage from "./ZoomableImage";

function InfoSkeleton() {
  return (
    <div className="animate-pulse space-y-3" aria-busy="true" aria-label="Membaca informasi gambar">
      <div className="h-16 rounded-xl bg-slate-200 dark:bg-slate-800" />
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-28 rounded-xl bg-slate-200 dark:bg-slate-800" />
      ))}
    </div>
  );
}

export default function MetadataTool() {
  const {
    file,
    preview,
    info,
    cleaned,
    cleanedInfo,
    loading,
    cleaning,
    error,
    open,
    clean,
    reset,
  } = useImageInspector();

  const remaining = cleanedInfo ? remainingData(cleanedInfo) : null;

  return (
    <div className="space-y-4">
      <Dropzone
        onFiles={(files) => open(files[0])}
        disabled={loading || cleaning}
        compact={Boolean(file)}
      />

      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-100 p-3 text-sm text-red-700 dark:bg-red-900/40 dark:text-red-200"
        >
          {error}
        </p>
      )}

      {file && preview && (
        <div className="grid items-start gap-4 lg:grid-cols-5">
          <Card className="min-w-0 lg:col-span-2">
            <ZoomableImage
              src={preview}
              alt="Gambar yang diperiksa"
              caption={file.name}
              imgClassName="h-56"
            />
            <p className="mt-2 truncate text-sm font-medium" title={file.name}>
              {file.name}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{formatBytes(file.size)}</p>

            <button
              type="button"
              onClick={clean}
              disabled={!info || cleaning}
              className="mt-4 w-full rounded-lg bg-orange-600 px-4 py-2.5 font-medium text-white transition hover:bg-orange-700 disabled:opacity-60"
            >
              {cleaning ? "Membersihkan..." : cleaned ? "Bersihkan ulang" : "Hapus semua metadata"}
            </button>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Gambar disimpan ulang tanpa EXIF, GPS, XMP, dan teks tersembunyi. Untuk JPEG dan WebP,
              penyimpanan ulang memakai kualitas tinggi (95).
            </p>

            {cleaned && (
              <div
                role="status"
                className="mt-4 rounded-lg bg-green-50 p-3 ring-1 ring-green-200 dark:bg-green-950/40 dark:ring-green-900"
              >
                <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                  Metadata dihapus
                </p>
                <p className="mt-1 text-xs text-green-700 dark:text-green-200">
                  Ukuran file: {formatBytes(file.size)} menjadi {formatBytes(cleaned.size)}
                </p>
                {remaining && (
                  <p className="mt-1 text-xs text-green-700 dark:text-green-200">
                    {remaining.length === 0
                      ? "Terverifikasi: hasil tidak memuat EXIF, GPS, XMP, IPTC, maupun teks tersembunyi."
                      : `Masih ditemukan: ${remaining.join(", ")}.`}
                  </p>
                )}
                <a
                  href={cleaned.url}
                  download={cleaned.filename}
                  className="mt-3 inline-flex rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
                >
                  ⬇ Unduh gambar bersih
                </a>
              </div>
            )}

            <button
              type="button"
              onClick={reset}
              className="mt-4 text-xs text-slate-500 underline hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            >
              Hapus dan mulai lagi
            </button>
          </Card>

          <Card className="min-w-0 lg:col-span-3">
            <h3 className="mb-4 text-base font-semibold">Informasi gambar</h3>
            {loading && <InfoSkeleton />}
            {!loading && info && <ImageInfoPanel info={info} />}
          </Card>
        </div>
      )}
    </div>
  );
}
