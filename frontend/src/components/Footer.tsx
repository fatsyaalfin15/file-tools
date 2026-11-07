export default function Footer() {
  return (
    <footer className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
      © {new Date().getFullYear()} Alat File · Dibuat dengan React, Express, dan Sharp
    </footer>
  );
}
