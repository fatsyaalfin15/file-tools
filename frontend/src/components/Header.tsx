import { useDarkMode } from "../hooks/useDarkMode";

const LINKS = [
  { href: "#alat", label: "Alat" },
  { href: "#cara-kerja", label: "Cara kerja" },
  { href: "#keamanan", label: "Keamanan" },
];

export default function Header() {
  const { dark, toggle } = useDarkMode();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <a href="#" className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-linear-to-br from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/30">
            <svg
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
              <path d="M14 3v5h5" />
            </svg>
          </span>
          <span className="text-lg font-bold tracking-tight">Alat File</span>
        </a>

        <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex dark:text-slate-300">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="transition hover:text-indigo-600 dark:hover:text-indigo-300"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          onClick={toggle}
          aria-label={dark ? "Ganti ke mode terang" : "Ganti ke mode gelap"}
          className="grid size-9 place-items-center rounded-lg text-lg ring-1 ring-slate-200 transition hover:bg-slate-100 dark:ring-slate-700 dark:hover:bg-slate-800"
        >
          {dark ? "☀️" : "🌙"}
        </button>
      </div>
    </header>
  );
}
