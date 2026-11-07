import { useState } from "react";
import { useWatermark } from "../hooks/useWatermark";
import { formatBytes } from "../lib/image";
import type { WatermarkOptions } from "../types/watermark";
import Card from "./Card";
import Dropzone from "./DropZone";
import Segmented from "./Segmented";
import WatermarkSettings from "./WatermarkSettings";
import ZoomableImage from "./ZoomableImage";

const VIEWS: { value: "result" | "original"; label: string }[] = [
  { value: "result", label: "Dengan watermark" },
  { value: "original", label: "Asli" },
];

export default function WatermarkTool() {
  const { file, preview, result, loading, error, open, apply, reset } = useWatermark();
  const [view, setView] = useState<"result" | "original">("result");

  const [options, setOptions] = useState<WatermarkOptions>({
    text: "",
    position: "bottom-right",
    size: "medium",
    opacity: 50,
    color: "white",
  });

  async function submit() {
    const ok = await apply(options);
    if (ok) setView("result");
  }

  const showResult = result !== null && view === "result";

  return (
    <div className="space-y-4">
      <Dropzone onFiles={(files) => open(files[0])} disabled={loading} compact={Boolean(file)} />

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
          <Card className="lg:col-span-2">
            <h3 className="mb-4 text-base font-semibold">Pengaturan</h3>
            <WatermarkSettings
              options={options}
              loading={loading}
              hasResult={Boolean(result)}
              onChange={setOptions}
              onSubmit={submit}
            />
          </Card>

          <Card className="min-w-0 lg:col-span-3">
            {result && (
              <div className="mb-3">
                <Segmented
                  label="Tampilan"
                  value={view}
                  options={VIEWS}
                  onChange={(value) => {
                    if (value === "result" || value === "original") setView(value);
                  }}
                />
              </div>
            )}

            <div className={loading ? "animate-pulse opacity-60" : ""}>
              <ZoomableImage
                src={showResult ? result.url : preview}
                alt={showResult ? "Gambar dengan watermark" : "Gambar asli"}
                caption={showResult ? "Dengan watermark" : file.name}
                imgClassName="h-64 sm:h-80"
              />
            </div>

            {!result && (
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                Tulis teks di samping, lalu klik Terapkan watermark. Hasilnya muncul di sini.
              </p>
            )}

            {result && (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-slate-100 p-3 dark:bg-slate-800">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Ukuran hasil: {formatBytes(result.size)}
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

            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              Hasil juga tidak membawa data lokasi atau EXIF dari gambar asli.
            </p>

            <button
              type="button"
              onClick={reset}
              className="mt-3 text-xs text-slate-500 underline hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            >
              Hapus dan mulai lagi
            </button>
          </Card>
        </div>
      )}
    </div>
  );
}
