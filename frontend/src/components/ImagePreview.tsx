import { useState } from "react";
import { formatBytes } from "../lib/image";
import type { CompressResult } from "../types/image";
import ImageLightbox from "./ImageLightbox";

const IMG = "h-48 w-full rounded-lg bg-slate-100 object-contain sm:h-56 dark:bg-slate-800";

type Viewer = { src: string; alt: string; caption: string };

function Zoomable({ src, alt, onOpen }: { src: string; alt: string; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Perbesar: ${alt}`}
      className="group relative block w-full cursor-zoom-in overflow-hidden rounded-lg focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:outline-none"
    >
      <img src={src} alt={alt} className={IMG} />
      <span className="pointer-events-none absolute bottom-2 right-2 rounded-md bg-black/60 px-2 py-1 text-xs font-medium text-white opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100">
        🔍 Perbesar
      </span>
    </button>
  );
}

type Props = {
  file: File;
  previewUrl: string;
  result: CompressResult | null;
  loading: boolean;
  onReset: () => void;
};

export default function ImagePreview({ file, previewUrl, result, loading, onReset }: Props) {
  const [viewer, setViewer] = useState<Viewer | null>(null);
  const saved = result ? Math.round((1 - result.size / file.size) * 100) : 0;

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        <figure className="min-w-0">
          <figcaption className="mb-1 flex justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Asli</span>
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {formatBytes(file.size)}
            </span>
          </figcaption>
          <Zoomable
            src={previewUrl}
            alt="Gambar asli"
            onOpen={() =>
              setViewer({
                src: previewUrl,
                alt: "Gambar asli",
                caption: `Asli · ${file.name} · ${formatBytes(file.size)}`,
              })
            }
          />
          <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400" title={file.name}>
            {file.name}
          </p>
        </figure>

        <figure className="min-w-0">
          <figcaption className="mb-1 flex justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Hasil</span>
            {result && (
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {formatBytes(result.size)}
              </span>
            )}
          </figcaption>
          {result ? (
            <Zoomable
              src={result.url}
              alt="Hasil kompres"
              onOpen={() =>
                setViewer({
                  src: result.url,
                  alt: "Hasil kompres",
                  caption: `Hasil · ${formatBytes(result.size)}`,
                })
              }
            />
          ) : (
            <div
              className={`${IMG} flex items-center justify-center border-2 border-dashed border-slate-300 text-sm text-slate-400 dark:border-slate-600 ${
                loading ? "animate-pulse" : ""
              }`}
            >
              {loading ? "Memproses..." : "Hasil muncul di sini"}
            </div>
          )}
        </figure>
      </div>

      {result && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-slate-100 p-3 dark:bg-slate-800">
          <p
            className={`text-sm font-semibold ${
              saved > 0
                ? "text-green-600 dark:text-green-400"
                : saved === 0
                  ? "text-slate-600 dark:text-slate-300"
                  : "text-amber-600 dark:text-amber-400"
            }`}
          >
            {saved > 0
              ? `Hemat ${saved}% (${formatBytes(file.size - result.size)})`
              : saved === 0
                ? "Ukuran tidak berubah, gambar sudah optimal"
                : `Ukuran bertambah ${Math.abs(saved)}%`}
          </p>
          <a
            href={result.url}
            download={result.filename}
            className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
          >
            ⬇ Unduh
          </a>
        </div>
      )}

      <button
        type="button"
        onClick={onReset}
        className="mt-3 text-xs text-slate-500 underline hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
      >
        Hapus dan mulai lagi
      </button>

      {viewer && (
        <ImageLightbox
          src={viewer.src}
          alt={viewer.alt}
          caption={viewer.caption}
          onClose={() => setViewer(null)}
        />
      )}
    </div>
  );
}
