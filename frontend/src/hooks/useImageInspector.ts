import { useEffect, useRef, useState } from "react";
import { inspectImage, stripMetadata } from "../lib/api";
import type { ImageInfo } from "../types/inspect";
import { useGeneratedFile } from "./useGeneratedFile";
import { useSingleImage } from "./useSingleImage";

export function useImageInspector() {
  const { file, preview, select, clear: clearImage } = useSingleImage();
  const { file: cleaned, set: setCleaned, clear: clearCleaned } = useGeneratedFile();

  const [info, setInfo] = useState<ImageInfo | null>(null);
  const [cleanedInfo, setCleanedInfo] = useState<ImageInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  const [error, setError] = useState("");
  const controller = useRef<AbortController | null>(null);

  useEffect(() => () => controller.current?.abort(), []);

  // membatalkan permintaan sebelumnya yang masih berjalan
  function newRequest() {
    controller.current?.abort();
    const ctrl = new AbortController();
    controller.current = ctrl;
    return ctrl;
  }

  async function open(next: File) {
    const problem = select(next);
    if (problem) {
      setError(problem);
      return;
    }

    const ctrl = newRequest();
    setInfo(null);
    setCleanedInfo(null);
    clearCleaned();
    setCleaning(false);
    setError("");
    setLoading(true);

    try {
      const data = await inspectImage(next, ctrl.signal);
      if (!ctrl.signal.aborted) setInfo(data);
    } catch (err) {
      if (!ctrl.signal.aborted) setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      if (!ctrl.signal.aborted) setLoading(false);
    }
  }

  async function clean() {
    if (!file) return;

    const ctrl = newRequest();
    setCleaning(true);
    setError("");

    try {
      const { blob, filename } = await stripMetadata(file, ctrl.signal);
      if (ctrl.signal.aborted) return;
      setCleaned(blob, filename);
      setCleanedInfo(null);

      // verifikasi: periksa ulang hasilnya. Kalau gagal, hasil tetap bisa diunduh.
      try {
        const checked = await inspectImage(
          new File([blob], filename, { type: blob.type }),
          ctrl.signal,
        );
        if (!ctrl.signal.aborted) setCleanedInfo(checked);
      } catch {
        // verifikasi hanya tambahan
      }
    } catch (err) {
      if (!ctrl.signal.aborted) setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      if (!ctrl.signal.aborted) setCleaning(false);
    }
  }

  function reset() {
    controller.current?.abort();
    clearImage();
    clearCleaned();
    setInfo(null);
    setCleanedInfo(null);
    setLoading(false);
    setCleaning(false);
    setError("");
  }

  return {
    file,
    preview,
    info,
    cleaned,
    cleanedInfo,
    loading,
    cleaning,
    error,
    open,
    clean,
    reset,
  };
}
