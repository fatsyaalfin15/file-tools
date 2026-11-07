export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 h-72 w-40rem -translate-x-1/2 rounded-full bg-indigo-400/30 blur-3xl dark:bg-indigo-600/20" />
        <div className="absolute -right-20 top-24 h-56 w-56 rounded-full bg-violet-400/30 blur-3xl dark:bg-violet-600/20" />
      </div>

      <div className="mx-auto max-w-3xl px-4 pb-12 pt-14 text-center sm:pt-20">
        <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/70 px-3 py-1 text-xs font-medium text-indigo-700 dark:border-indigo-900 dark:bg-slate-900/70 dark:text-indigo-300">
          <span className="size-1.5 rounded-full bg-green-500" />
          Gratis · Tanpa daftar · File tidak disimpan
        </span>

        <h1 className="mt-5 text-balance text-4xl font-extrabold tracking-tight sm:text-6xl bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Semua alat file yang kamu butuhkan dalam satu tempat
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-base text-slate-600 sm:text-lg dark:text-slate-300">
          Kompres gambar, ubah gambar ke PDF, dan buat sertifikat dalam hitungan detik, langsung
          dari browser.
        </p>

        <a
          href="#alat"
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-700"
        >
          Mulai sekarang <span aria-hidden>↓</span>
        </a>
      </div>
    </section>
  );
}
