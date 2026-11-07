import { useEffect, useRef, useState } from "react";
import { addWatermark } from "../lib/api";
import type { WatermarkOptions } from "../types/watermark";
import { useGeneratedFile } from "./useGeneratedFile";
import { useSingleImage } from "./useSingleImage";

export function useWatermark() {
  const { file, preview, select, clear: clearImage } = useSingleImage();
  const { file: result, set: setResult, clear: clearResult } = useGeneratedFile();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const controller = useRef<AbortController | null>(null);

  useEffect(() => () => controller.current?.abort(), []);

  function open(next: File) {
    const problem = select(next);
    if (problem) {
      setError(problem);
      return;
    }
    controller.current?.abort();
    clearResult();
    setLoading(false);
    setError("");
  }

  async function apply(options: WatermarkOptions): Promise<boolean> {
    if (!file) return false;
    if (!options.text.trim()) {
      setError("Teks watermark wajib diisi");
      return false;
    }

    controller.current?.abort();
    const ctrl = new AbortController();
    controller.current = ctrl;

    setLoading(true);
    setError("");

    try {
      const { blob, filename } = await addWatermark(file, options, ctrl.signal);
      if (ctrl.signal.aborted) return false;
      setResult(blob, filename);
      return true;
    } catch (err) {
      if (!ctrl.signal.aborted) setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      return false;
    } finally {
      if (!ctrl.signal.aborted) setLoading(false);
    }
  }

  function reset() {
    controller.current?.abort();
    clearImage();
    clearResult();
    setLoading(false);
    setError("");
  }

  return { file, preview, result, loading, error, open, apply, reset };
}
