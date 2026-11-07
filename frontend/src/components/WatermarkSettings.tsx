import { inputClass } from "../lib/ui";
import type {
  WatermarkColor,
  WatermarkOptions,
  WatermarkPosition,
  WatermarkSize,
} from "../types/watermark";
import Field from "./Field";
import Segmented from "./Segmented";

const POSITIONS: { value: WatermarkPosition; label: string; icon: string }[] = [
  { value: "top-left", label: "Kiri atas", icon: "↖" },
  { value: "top-right", label: "Kanan atas", icon: "↗" },
  { value: "center", label: "Tengah", icon: "◎" },
  { value: "bottom-left", label: "Kiri bawah", icon: "↙" },
  { value: "bottom-right", label: "Kanan bawah", icon: "↘" },
  { value: "tile", label: "Berulang", icon: "▦" },
];

const SIZES: { value: WatermarkSize; label: string }[] = [
  { value: "small", label: "Kecil" },
  { value: "medium", label: "Sedang" },
  { value: "large", label: "Besar" },
];

const COLORS: { value: WatermarkColor; label: string }[] = [
  { value: "white", label: "Putih" },
  { value: "black", label: "Hitam" },
];

type Props = {
  options: WatermarkOptions;
  loading: boolean;
  hasResult: boolean;
  onChange: (options: WatermarkOptions) => void;
  onSubmit: () => void;
};

export default function WatermarkSettings({
  options,
  loading,
  hasResult,
  onChange,
  onSubmit,
}: Props) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-5"
    >
      <Field id="wm-text" label="Teks watermark">
        <input
          id="wm-text"
          value={options.text}
          maxLength={40}
          onChange={(e) => onChange({ ...options, text: e.target.value })}
          placeholder="Contoh: © Nama kamu"
          className={inputClass}
        />
      </Field>

      <div>
        <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
          Posisi
        </span>
        <div role="radiogroup" aria-label="Posisi watermark" className="grid grid-cols-3 gap-2">
          {POSITIONS.map((p) => {
            const selected = options.position === p.value;
            return (
              <button
                key={p.value}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onChange({ ...options, position: p.value })}
                className={`flex flex-col items-center rounded-lg px-2 py-2 text-xs font-medium transition ${
                  selected
                    ? "bg-white text-orange-700 ring-2 ring-orange-500 dark:bg-slate-800 dark:text-orange-300"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                }`}
              >
                <span className="text-lg leading-none" aria-hidden>
                  {p.icon}
                </span>
                <span className="mt-1">{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <Segmented
        label="Ukuran teks"
        value={options.size}
        options={SIZES}
        onChange={(size) => onChange({ ...options, size })}
      />

      <Segmented
        label="Warna teks"
        value={options.color}
        options={COLORS}
        onChange={(color) => onChange({ ...options, color })}
      />

      <div>
        <div className="mb-1 flex items-center justify-between">
          <label
            htmlFor="wm-opacity"
            className="text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            Kepekatan
          </label>
          <span className="text-sm font-semibold text-orange-600 dark:text-orange-300">
            {options.opacity}%
          </span>
        </div>
        <input
          id="wm-opacity"
          type="range"
          min={10}
          max={100}
          step={5}
          value={options.opacity}
          onChange={(e) => onChange({ ...options, opacity: Number(e.target.value) })}
          className="w-full accent-orange-600"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-orange-600 px-4 py-2.5 font-medium text-white transition hover:bg-orange-700 disabled:opacity-60"
      >
        {loading ? "Memproses..." : hasResult ? "Terapkan ulang" : "Terapkan watermark"}
      </button>
    </form>
  );
}
