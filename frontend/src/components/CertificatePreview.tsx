import type { GeneratedFile } from "../types/file";

type Props = { file: GeneratedFile | null; loading: boolean };

export default function CertificatePreview({ file, loading }: Props) {
  if (!file) {
    return (
      <div
        className={`flex aspect-[1.414/1] w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 p-4 text-center text-sm text-slate-400 dark:border-slate-700 ${
          loading ? "animate-pulse" : ""
        }`}
      >
        <span className="text-3xl" aria-hidden>
          🎓
        </span>
        <span className="mt-2">
          {loading ? "Membuat sertifikat..." : "Pratinjau sertifikat muncul di sini"}
        </span>
      </div>
    );
  }

  return (
    <div>
      <iframe
        src={`${file.url}#view=Fit&toolbar=0`}
        title="Pratinjau sertifikat"
        className="hidden aspect-[1.414/1] w-full rounded-xl bg-slate-100 sm:block dark:bg-slate-800"
      />
      <p className="rounded-lg bg-slate-100 p-3 text-center text-sm text-slate-500 sm:hidden dark:bg-slate-800 dark:text-slate-400">
        Pratinjau tidak tersedia di layar kecil. Unduh PDF untuk melihatnya.
      </p>

      <a
        href={file.url}
        download={file.filename}
        className="mt-4 flex w-full items-center justify-center rounded-lg bg-orange-600 px-4 py-2.5 font-medium text-white hover:bg-orange-700"
      >
        ⬇ Unduh sertifikat (PDF)
      </a>
    </div>
  );
}
