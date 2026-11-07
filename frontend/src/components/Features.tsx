const STEPS = [
  { n: "1", title: "Unggah file", text: "Tarik file ke area unggah atau pilih dari perangkatmu." },
  {
    n: "2",
    title: "Atur pengaturan",
    text: "Tentukan kualitas, format, dan ukuran sesuai kebutuhan.",
  },
  {
    n: "3",
    title: "Unduh hasilnya",
    text: "Hasil langsung siap diunduh, tanpa perlu membuat akun.",
  },
];

const TRUST = [
  {
    icon: "🔒",
    title: "Privasi terjaga",
    text: "File hanya diproses di memori server dan tidak disimpan.",
  },
  { icon: "⚡", title: "Cepat", text: "Gambar diproses dengan Sharp, library berperforma tinggi." },
  { icon: "🆓", title: "Gratis", text: "Tanpa pendaftaran dan tanpa watermark." },
];

export default function Features() {
  return (
    <>
      <section id="cara-kerja" className="mx-auto max-w-5xl scroll-mt-20 px-4 py-14">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">Cara kerja</h2>
        <p className="mt-2 text-center text-slate-600 dark:text-slate-300">
          Tiga langkah sederhana, tanpa akun.
        </p>

        <ol className="mt-8 grid gap-4 sm:grid-cols-3">
          {STEPS.map((s) => (
            <li
              key={s.n}
              className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
            >
              <span className="grid size-9 place-items-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                {s.n}
              </span>
              <h3 className="mt-3 font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section
        id="keamanan"
        className="scroll-mt-20 border-y border-slate-200 bg-white py-14 dark:border-slate-800 dark:bg-slate-900/50"
      >
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">Aman dan praktis</h2>

          <ul className="mt-8 grid gap-8 sm:grid-cols-3">
            {TRUST.map((t) => (
              <li key={t.title} className="text-center">
                <span
                  className="mx-auto grid size-12 place-items-center rounded-xl bg-indigo-50 text-2xl dark:bg-indigo-950"
                  aria-hidden
                >
                  {t.icon}
                </span>
                <h3 className="mt-3 font-semibold">{t.title}</h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{t.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
