import type { ReactNode } from "react";

type Props = { children: ReactNode; className?: string };

export default function Card({ children, className = "" }: Props) {
  return (
    <section
      className={`rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 sm:p-5 dark:bg-slate-950/40 dark:ring-slate-800 ${className}`}
    >
      {children}
    </section>
  );
}
