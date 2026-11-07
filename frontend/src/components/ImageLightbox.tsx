import { useEffect, useRef } from "react";

type Props = { src: string; alt: string; caption?: string; onClose: () => void };

export default function ImageLightbox({ src, alt, caption, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();

    // cegah halaman di belakang ikut bergulir
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    // <dialog> bawaan browser: tombol Esc dan fokus keyboard sudah ditangani otomatis
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose(); // klik area gelap = tutup
      }}
      className="m-auto max-h-[92vh] max-w-[95vw] overflow-visible border-0 bg-transparent p-0 backdrop:bg-black/80 backdrop:backdrop-blur-sm"
    >
      <figure className="relative">
        <img
          src={src}
          alt={alt}
          className="max-h-[82vh] max-w-[95vw] rounded-lg bg-white object-contain shadow-2xl dark:bg-slate-900"
        />
        {caption && (
          <figcaption className="mt-2 text-center text-sm text-white/90">{caption}</figcaption>
        )}
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="absolute right-2 top-2 grid size-9 place-items-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
        >
          ✕
        </button>
      </figure>
    </dialog>
  );
}
