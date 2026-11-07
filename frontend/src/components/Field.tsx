import type { ReactNode } from "react";

type Props = { id: string; label: string; optional?: boolean; children: ReactNode };

export default function Field({ id, label, optional, children }: Props) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200"
      >
        {label}
        {optional && <span className="ml-1 font-normal text-slate-400">(opsional)</span>}
      </label>
      {children}
    </div>
  );
}
