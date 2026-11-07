import type { CompressOptions, OutputFormat } from "../types/image";

const FORMATS: { value: OutputFormat; label: string }[] = [
  { value: "original", label: "Sama seperti aslinya" },
  { value: "webp", label: "WebP (biasanya paling kecil)" },
  { value: "jpeg", label: "JPEG" },
  { value: "png", label: "PNG" },
];

const WIDTHS = [
  { value: 0, label: "Ukuran asli" },
  { value: 1920, label: "1920 px (Full HD)" },
  { value: 1280, label: "1280 px (HD)" },
  { value: 800, label: "800 px" },
];

const PRESETS = [
  { label: "Kecil", value: 50 },
  { label: "Seimbang", value: 75 },
  { label: "Tinggi", value: 90 },
];

const field =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100";
const label = "mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200";

type Props = {
  options: CompressOptions;
  loading: boolean;
  hasResult: boolean;
  onChange: (options: CompressOptions) => void;
  onSubmit: () => void;
};

export default function CompressSettings({
  options,
  loading,
  hasResult,
  onChange,
  onSubmit,
}: Props) {
  return (
    <div className="space-y-5">
      <div>
        <div className="mb-1 flex items-center justify-between">
          <label
            htmlFor="quality"
            className="text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            Kualitas
          </label>
          <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-300">
            {options.quality}
          </span>
        </div>
        <input
          id="quality"
          type="range"
          min={1}
          max={100}
          value={options.quality}
          onChange={(e) => onChange({ ...options, quality: Number(e.target.value) })}
          className="w-full accent-indigo-600"
        />
        <div className="mt-2 flex gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => onChange({ ...options, quality: p.value })}
              className={`flex-1 rounded-lg px-2 py-1 text-xs font-medium transition ${
                options.quality === p.value
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="format" className={label}>
          Format hasil
        </label>
        <select
          id="format"
          value={options.format}
          onChange={(e) => onChange({ ...options, format: e.target.value as OutputFormat })}
          className={field}
        >
          {FORMATS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="width" className={label}>
          Lebar maksimal
        </label>
        <select
          id="width"
          value={options.maxWidth ?? 0}
          onChange={(e) => {
            const v = Number(e.target.value);
            onChange({ ...options, maxWidth: v === 0 ? null : v });
          }}
          className={field}
        >
          {WIDTHS.map((w) => (
            <option key={w.value} value={w.value}>
              {w.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={loading}
        className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white transition hover:bg-indigo-700 disabled:opacity-60"
      >
        {loading ? "Memproses..." : hasResult ? "Kompres ulang" : "Kompres gambar"}
      </button>
    </div>
  );
}
