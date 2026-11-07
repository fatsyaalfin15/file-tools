import { useEffect, useRef, useState } from "react";
import { compressImage } from "../lib/api";
import { validateImage } from "../lib/image";
import type { CompressOptions, CompressResult } from "../types/image";

export function useImageCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<CompressResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const urls = useRef(new Set<string>()); // semua object URL aktif, supaya bisa dibersihkan
  const controller = useRef<AbortController | null>(null);

  function makeUrl(blob: Blob) {
    const url = URL.createObjectURL(blob);
    urls.current.add(url);
    return url;
  }

  function release(url: string | null | undefined) {
    if (!url) return;
    URL.revokeObjectURL(url);
    urls.current.delete(url);
  }

  // bersihkan saat komponen dilepas
  useEffect(() => {
    const set = urls.current;
    return () => {
      controller.current?.abort();
      set.forEach((u) => URL.revokeObjectURL(u));
      set.clear();
    };
  }, []);

  function selectFile(next: File) {
    const problem = validateImage(next);
    if (problem) {
      setError(problem);
      return;
    }

    controller.current?.abort();
    release(preview);
    release(result?.url);

    setFile(next);
    setPreview(makeUrl(next));
    setResult(null);
    setLoading(false);
    setError("");
  }

  async function compress(options: CompressOptions) {
    if (!file) return;

    controller.current?.abort(); // batalkan permintaan sebelumnya yang masih berjalan
    const ctrl = new AbortController();
    controller.current = ctrl;

    setLoading(true);
    setError("");

    try {
      const { blob, filename } = await compressImage(file, options, ctrl.signal);
      if (ctrl.signal.aborted) return;
      release(result?.url);
      setResult({ blob, filename, url: makeUrl(blob), size: blob.size });
    } catch (err) {
      if (ctrl.signal.aborted) return;
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      if (!ctrl.signal.aborted) setLoading(false);
    }
  }

  function reset() {
    controller.current?.abort();
    release(preview);
    release(result?.url);
    setFile(null);
    setPreview(null);
    setResult(null);
    setLoading(false);
    setError("");
  }

  return { file, preview, result, loading, error, selectFile, compress, reset };
}
