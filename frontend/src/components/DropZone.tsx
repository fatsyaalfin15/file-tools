import { useState } from "react";
import { ACCEPT, MAX_SIZE_MB } from "../lib/image";

type Props = {
  onFiles: (files: File[]) => void;
  multiple?: boolean;
  maxMb?: number;
  disabled?: boolean;
  compact?: boolean;
};

export default function Dropzone({
  onFiles,
  multiple = false,
  maxMb = MAX_SIZE_MB,
  disabled,
  compact,
}: Props) {
  const [dragging, setDragging] = useState(false);

  function handleFiles(files: FileList | null) {
    const list = Array.from(files ?? []);
    if (list.length > 0) onFiles(multiple ? list : list.slice(0, 1));
  }

  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        if (!disabled) handleFiles(e.dataTransfer.files);
      }}
      className={`group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 text-center transition focus-within:ring-2 focus-within:ring-orange-500 ${
        compact ? "py-6" : "py-16 sm:py-20"
      } ${
        dragging
          ? "border-orange-500 bg-orange-50 dark:bg-orange-950/40"
          : "border-slate-300 bg-slate-50 hover:border-orange-400 hover:bg-orange-50/50 dark:border-slate-700 dark:bg-slate-950/40 dark:hover:border-orange-500"
      } ${disabled ? "pointer-events-none opacity-60" : ""}`}
    >
      <input
        type="file"
        accept={ACCEPT}
        multiple={multiple}
        disabled={disabled}
        className="sr-only"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = ""; // supaya file yang sama bisa dipilih ulang
        }}
      />

      <span
        className={`grid place-items-center rounded-2xl bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-300 ${
          compact ? "size-10" : "size-16"
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          className={compact ? "size-5" : "size-7"}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M12 16V4" />
          <path d="m7 9 5-5 5 5" />
          <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
        </svg>
      </span>

      {compact ? (
        <span className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          {multiple
            ? "Tambah gambar atau tarik file ke sini"
            : "Ganti gambar atau tarik file baru ke sini"}
        </span>
      ) : (
        <>
          <span className="mt-4 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow transition group-hover:bg-orange-700">
            {multiple ? "Pilih beberapa gambar" : "Pilih gambar"}
          </span>
          <span className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            atau tarik dan lepas gambar ke sini
          </span>
        </>
      )}

      <span className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        JPG, PNG, atau WebP · maksimal {maxMb} MB per file
      </span>
    </label>
  );
}
