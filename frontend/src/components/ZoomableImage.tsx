import { useState } from "react";
import ImageLightbox from "./ImageLightbox";

type Props = {
  src: string;
  alt: string;
  caption?: string;
  imgClassName?: string;
};

export default function ZoomableImage({ src, alt, caption, imgClassName = "" }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Perbesar: ${alt}`}
        className="group relative block w-full cursor-zoom-in overflow-hidden rounded-lg focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:outline-none"
      >
        <img
          src={src}
          alt={alt}
          className={`w-full rounded-lg bg-slate-100 object-contain dark:bg-slate-800 ${imgClassName}`}
        />
        <span className="pointer-events-none absolute bottom-2 right-2 rounded-md bg-black/60 px-2 py-1 text-xs font-medium text-white sm:opacity-0 sm:transition sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100">
          🔍 Perbesar
        </span>
      </button>

      {open && (
        <ImageLightbox src={src} alt={alt} caption={caption} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
