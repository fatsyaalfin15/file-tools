export type Tool = "compress" | "pdf" | "certificate";

const TOOLS: { id: Tool; label: string; icon: string; ready: boolean }[] = [
  { id: "compress", label: "Kompres Gambar", icon: "🗜️", ready: true },
  { id: "pdf", label: "Gambar ke PDF", icon: "📄", ready: false },
  { id: "certificate", label: "Sertifikat", icon: "🎓", ready: false },
];

type Props = { active: Tool; onChange: (tool: Tool) => void };

export default function ToolTabs({ active, onChange }: Props) {
  return (
    <div
      role="tablist"
      className="flex gap-1 overflow-x-auto rounded-xl bg-white/70 p-1 shadow ring-1 ring-slate-200 dark:bg-slate-900/70 dark:ring-slate-700"
    >
      {TOOLS.map((t) => {
        const selected = t.id === active;
        return (
          <button
            key={t.id}
            role="tab"
            aria-selected={selected}
            disabled={!t.ready}
            onClick={() => onChange(t.id)}
            className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
              selected
                ? "bg-indigo-600 text-white shadow"
                : t.ready
                  ? "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  : "cursor-not-allowed text-slate-400 dark:text-slate-500"
            }`}
          >
            <span aria-hidden>{t.icon}</span>
            {t.label}
            {!t.ready && (
              <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-semibold uppercase text-slate-500 dark:bg-slate-700 dark:text-slate-300">
                Segera
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
