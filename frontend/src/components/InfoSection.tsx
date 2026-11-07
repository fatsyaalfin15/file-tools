import type { ReactNode } from "react";

export type InfoRow = { label: string; value: ReactNode; warn?: boolean };

type Props = {
  title: string;
  rows: InfoRow[];
  emptyText?: string;
};

export default function InfoSection({ title, rows, emptyText = "Tidak ada data." }: Props) {
  // baris tanpa nilai tidak ditampilkan
  const visible = rows.filter((r) => r.value !== null && r.value !== undefined && r.value !== "");

  return (
    <section>
      <h4 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">{title}</h4>

      {visible.length === 0 ? (
        <p className="rounded-xl bg-white px-3 py-2 text-sm text-slate-500 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-800">
          {emptyText}
        </p>
      ) : (
        <dl className="divide-y divide-slate-200 rounded-xl bg-white ring-1 ring-slate-200 dark:divide-slate-800 dark:bg-slate-900 dark:ring-slate-800">
          {visible.map((r) => (
            <div key={r.label} className="flex items-start justify-between gap-4 px-3 py-2 text-sm">
              <dt className="shrink-0 text-slate-500 dark:text-slate-400">{r.label}</dt>
              <dd
                className={`min-w-0 wrap-break text-right font-medium ${
                  r.warn ? "text-red-600 dark:text-red-400" : "text-slate-800 dark:text-slate-100"
                }`}
              >
                {r.value}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}
