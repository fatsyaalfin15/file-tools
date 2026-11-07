import { inputClass } from "../lib/ui";
import type { CertificateData, CertificateTheme } from "../types/certificate";
import Field from "./Field";

const THEMES: { value: CertificateTheme; label: string; swatch: string }[] = [
  { value: "orange", label: "Oranye", swatch: "bg-orange-500" },
  { value: "green", label: "Hijau", swatch: "bg-green-500" },
  { value: "blue", label: "Biru", swatch: "bg-blue-600" },
];

type Props = {
  data: CertificateData;
  loading: boolean;
  onChange: (patch: Partial<CertificateData>) => void;
  onSubmit: () => void;
};

export default function CertificateForm({ data, loading, onChange, onSubmit }: Props) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-4"
    >
      <Field id="recipient" label="Nama penerima">
        <input
          id="recipient"
          value={data.recipient}
          maxLength={60}
          onChange={(e) => onChange({ recipient: e.target.value })}
          placeholder="Contoh: Alvin Fatsya"
          className={inputClass}
        />
      </Field>

      <Field id="title" label="Judul sertifikat">
        <input
          id="title"
          value={data.title}
          maxLength={40}
          onChange={(e) => onChange({ title: e.target.value })}
          className={inputClass}
        />
      </Field>

      <Field id="description" label="Keterangan" optional>
        <textarea
          id="description"
          rows={3}
          value={data.description}
          maxLength={200}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="atas partisipasinya sebagai peserta dalam Seminar Nasional Teknologi 2026"
          className={inputClass}
        />
        <p className="mt-1 text-right text-xs text-slate-400">{data.description.length}/200</p>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="date" label="Tanggal">
          <input
            id="date"
            type="date"
            value={data.date}
            onChange={(e) => onChange({ date: e.target.value })}
            className={inputClass}
          />
        </Field>
        <Field id="place" label="Tempat" optional>
          <input
            id="place"
            value={data.place}
            maxLength={40}
            onChange={(e) => onChange({ place: e.target.value })}
            placeholder="Contoh: Jambi"
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="signerName" label="Nama penandatangan" optional>
          <input
            id="signerName"
            value={data.signerName}
            maxLength={40}
            onChange={(e) => onChange({ signerName: e.target.value })}
            className={inputClass}
          />
        </Field>
        <Field id="signerRole" label="Jabatan" optional>
          <input
            id="signerRole"
            value={data.signerRole}
            maxLength={40}
            onChange={(e) => onChange({ signerRole: e.target.value })}
            placeholder="Contoh: Ketua Panitia"
            className={inputClass}
          />
        </Field>
      </div>

      <Field id="number" label="Nomor sertifikat" optional>
        <input
          id="number"
          value={data.number}
          maxLength={40}
          onChange={(e) => onChange({ number: e.target.value })}
          placeholder="Contoh: No. 001/SEM/2026"
          className={inputClass}
        />
      </Field>

      <div>
        <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
          Warna tema
        </span>
        <div role="radiogroup" aria-label="Warna tema" className="flex gap-2">
          {THEMES.map((t) => {
            const selected = data.theme === t.value;
            return (
              <button
                key={t.value}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onChange({ theme: t.value })}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  selected
                    ? "bg-white ring-2 ring-orange-500 dark:bg-slate-800"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                }`}
              >
                <span className={`size-3.5 rounded-full ${t.swatch}`} aria-hidden />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-orange-600 px-4 py-2.5 font-medium text-white transition hover:bg-orange-700 disabled:opacity-60"
      >
        {loading ? "Membuat sertifikat..." : "Buat sertifikat"}
      </button>
    </form>
  );
}
