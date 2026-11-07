export type Tool = "compress" | "pdf" | "certificate" | "metadata" | "watermark";

const TOOLS: { id: Tool; title: string; desc: string; icon: string; gradient: string }[] = [
  {
    id: "compress",
    title: "Kompres Gambar",
    desc: "Perkecil ukuran JPG, PNG, atau WebP.",
    icon: "🗜️",
    gradient: "from-orange-500 to-green-500",
  },
  {
    id: "pdf",
    title: "Gambar ke PDF",
    desc: "Gabungkan beberapa gambar jadi satu PDF.",
    icon: "📄",
    gradient: "from-sky-500 to-cyan-500",
  },
  {
    id: "certificate",
    title: "Sertifikat",
    desc: "Buat sertifikat PDF siap cetak.",
    icon: "🎓",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    id: "metadata",
    title: "Info dan Metadata",
    desc: "Lihat dan hapus lokasi serta data kamera.",
    icon: "🛡️",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    id: "watermark",
    title: "Watermark",
    desc: "Tambahkan teks hak cipta ke gambar.",
    icon: "💧",
    gradient: "from-rose-500 to-pink-500",
  },
];

type Props = { active: Tool; onChange: (tool: Tool) => void };

export default function ToolCards({ active, onChange }: Props) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {TOOLS.map((t) => {
        const selected = t.id === active;
        return (
          <li key={t.id} className="last:col-span-2 sm:last:col-span-1">
            <button
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(t.id)}
              className={`flex h-full w-full flex-col items-start rounded-2xl p-4 text-left transition ${
                selected
                  ? "bg-white shadow-lg ring-2 ring-orange-500 dark:bg-slate-900"
                  : "bg-white shadow-sm ring-1 ring-slate-200 hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900 dark:ring-slate-800"
              }`}
            >
              <span
                className={`grid size-10 place-items-center rounded-xl bg-linear-to-br text-xl text-white shadow ${t.gradient}`}
                aria-hidden
              >
                {t.icon}
              </span>
              <span className="mt-3 text-sm font-semibold">{t.title}</span>
              <span className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t.desc}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
