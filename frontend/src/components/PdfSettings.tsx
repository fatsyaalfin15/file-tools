import type { Margin, Orientation, PageSize, PdfOptions } from "../types/pdf";
import Segmented from "./Segmented";

const PAGE_SIZES: { value: PageSize; label: string }[] = [
  { value: "a4", label: "A4" },
  { value: "letter", label: "Letter" },
  { value: "fit", label: "Sesuai gambar" },
];

const ORIENTATIONS: { value: Orientation; label: string }[] = [
  { value: "auto", label: "Otomatis" },
  { value: "portrait", label: "Tegak" },
  { value: "landscape", label: "Mendatar" },
];

const MARGINS: { value: Margin; label: string }[] = [
  { value: "none", label: "Tanpa" },
  { value: "small", label: "Kecil" },
  { value: "medium", label: "Sedang" },
];

type Props = {
  options: PdfOptions;
  loading: boolean;
  count: number;
  hasResult: boolean;
  onChange: (options: PdfOptions) => void;
  onSubmit: () => void;
};

export default function PdfSettings({
  options,
  loading,
  count,
  hasResult,
  onChange,
  onSubmit,
}: Props) {
  return (
    <div className="space-y-5">
      <Segmented
        label="Ukuran halaman"
        value={options.pageSize}
        options={PAGE_SIZES}
        onChange={(pageSize) => onChange({ ...options, pageSize })}
      />
      <Segmented
        label="Orientasi"
        value={options.orientation}
        options={ORIENTATIONS}
        disabled={options.pageSize === "fit"}
        onChange={(orientation) => onChange({ ...options, orientation })}
      />
      <Segmented
        label="Margin"
        value={options.margin}
        options={MARGINS}
        onChange={(margin) => onChange({ ...options, margin })}
      />

      <button
        type="button"
        onClick={onSubmit}
        disabled={loading || count === 0}
        className="w-full rounded-lg bg-orange-600 px-4 py-2.5 font-medium text-white transition hover:bg-orange-700 disabled:opacity-60"
      >
        {loading ? "Memproses..." : hasResult ? "Buat ulang PDF" : `Buat PDF (${count} halaman)`}
      </button>
    </div>
  );
}
