import type { ReactNode } from "react";
import type { PdfItem } from "../hooks/useImageToPdf";
import { formatBytes } from "../lib/image";

function IconButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-8 place-items-center rounded-lg text-slate-600 ring-1 ring-slate-200 transition hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-800"
    >
      {children}
    </button>
  );
}

type Props = {
  items: PdfItem[];
  disabled: boolean;
  onMove: (id: number, dir: -1 | 1) => void;
  onRemove: (id: number) => void;
};

export default function PdfImageList({ items, disabled, onMove, onRemove }: Props) {
  return (
    <ol className="space-y-2">
      {items.map((it, i) => (
        <li
          key={it.id}
          className="flex items-center gap-3 rounded-xl bg-white p-2 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
        >
          <span className="w-5 text-center text-xs font-semibold text-slate-400">{i + 1}</span>
          <img src={it.url} alt="" className="size-12 shrink-0 rounded-lg object-cover" />

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium" title={it.file.name}>
              {it.file.name}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {formatBytes(it.file.size)}
            </p>
          </div>

          <div className="flex shrink-0 gap-1">
            <IconButton
              label="Naikkan urutan"
              disabled={disabled || i === 0}
              onClick={() => onMove(it.id, -1)}
            >
              ↑
            </IconButton>
            <IconButton
              label="Turunkan urutan"
              disabled={disabled || i === items.length - 1}
              onClick={() => onMove(it.id, 1)}
            >
              ↓
            </IconButton>
            <IconButton label="Hapus gambar" disabled={disabled} onClick={() => onRemove(it.id)}>
              ✕
            </IconButton>
          </div>
        </li>
      ))}
    </ol>
  );
}
