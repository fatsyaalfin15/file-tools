import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { MAX_SIZE_MB, validateImage } from "../lib/image";

function revoke(ref: RefObject<string | null>) {
  if (ref.current) URL.revokeObjectURL(ref.current);
  ref.current = null;
}

// Menyimpan satu gambar pilihan beserta URL pratinjaunya (dan membersihkannya agar tidak bocor memori)
export function useSingleImage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const urlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => revoke(urlRef);
  }, []);

  // mengembalikan pesan error bila file tidak valid, atau null bila berhasil
  const select = useCallback((next: File): string | null => {
    const problem = validateImage(next, MAX_SIZE_MB);
    if (problem) return problem;

    revoke(urlRef);
    const url = URL.createObjectURL(next);
    urlRef.current = url;
    setFile(next);
    setPreview(url);
    return null;
  }, []);

  const clear = useCallback(() => {
    revoke(urlRef);
    setFile(null);
    setPreview(null);
  }, []);

  return { file, preview, select, clear };
}
