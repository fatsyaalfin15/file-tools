import { useState } from "react";
import { PDF_MAX_FILES, PDF_MAX_MB, useImagesToPdf } from "../hooks/useImageToPdf";
import { formatBytes } from "../lib/image";
import type { PdfOptions } from "../types/pdf";
import Card from "./Card";
import Dropzone from "./DropZone";
import PdfImageList from "./PdfImageList";
import PdfSettings from "./PdfSettings";

export default function PdfTool() {
  const { items, result, loading, error, addFiles, remove, move, clear, generate, resetResult } =
    useImagesToPdf();

  const [options, setOptions] = useState<PdfOptions>({
    pageSize: "a4",
    orientation: "auto",
    margin: "small",
  });

  return (
    <div className="space-y-4">
      <Dropzone
        onFiles={addFiles}
        multiple
        maxMb={PDF_MAX_MB}
        disabled={loading}
        compact={items.length > 0}
      />

      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-100 p-3 text-sm text-red-700 dark:bg-red-900/40 dark:text-red-200"
        >
          {error}
        </p>
      )}

      {items.length > 0 && (
        <div className="grid items-start gap-4 lg:grid-cols-5">
          <Card className="min-w-0 lg:col-span-3">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-semibold">
                Gambar ({items.length}/{PDF_MAX_FILES})
              </h3>
              <button
                type="button"
                onClick={clear}
                disabled={loading}
                className="text-xs text-slate-500 underline hover:text-slate-700 disabled:opacity-50 dark:text-slate-400 dark:hover:text-slate-200"
              >
                Hapus semua
              </button>
            </div>
            <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
              Urutan di sini menjadi urutan halaman PDF. Gunakan tombol panah untuk mengubahnya.
            </p>
            <PdfImageList items={items} disabled={loading} onMove={move} onRemove={remove} />
          </Card>

          <Card className="lg:col-span-2">
            <h3 className="mb-4 text-base font-semibold">Pengaturan</h3>
            <PdfSettings
              options={options}
              loading={loading}
              count={items.length}
              hasResult={Boolean(result)}
              onChange={(next) => {
                setOptions(next);
                resetResult();
              }}
              onSubmit={() => generate(options)}
            />

            {result && (
              <div className="mt-4 rounded-lg bg-green-50 p-3 ring-1 ring-green-200 dark:bg-green-950/40 dark:ring-green-900">
                <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                  PDF siap · {items.length} halaman · {formatBytes(result.size)}
                </p>
                <a
                  href={result.url}
                  download={result.filename}
                  className="mt-2 inline-flex rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
                >
                  ⬇ Unduh PDF
                </a>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
