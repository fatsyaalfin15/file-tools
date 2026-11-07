import { useEffect, useRef, useState } from "react";
import { imagesToPdf } from "../lib/api";
import { validateImage } from "../lib/image";
import type { PdfOptions } from "../types/pdf";
import { useGeneratedFile } from "./useGeneratedFile";

const MB = 1024 * 1024
export const PDF_MAX_FILES = 10
export const PDF_MAX_MB = 4
export const PDF_MAX_TOTAL_MB = 4 // semua gambar dikirim dalam satu permintaan
export type PdfItem = { id: number; file: File; url: string };

export function useImagesToPdf() {
  const [items, setItems] = useState<PdfItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { file: result, set: setResult, clear: resetResult } = useGeneratedFile();

  const urls = useRef(new Set<string>());
  const nextId = useRef(1);
  const controller = useRef<AbortController | null>(null);

  useEffect(() => {
    const set = urls.current;
    return () => {
      controller.current?.abort();
      set.forEach((u) => URL.revokeObjectURL(u));
      set.clear();
    };
  }, []);

  function addFiles(files: File[]) {
  const accepted: PdfItem[] = []
  let problem = ''
  let total = items.reduce((sum, i) => sum + i.file.size, 0)

  for (const file of files) {
    if (items.length + accepted.length >= PDF_MAX_FILES) {
      if (!problem) problem = `Maksimal ${PDF_MAX_FILES} gambar`
      break
    }
    const issue = validateImage(file, PDF_MAX_MB)
    if (issue) {
      if (!problem) problem = `${file.name}: ${issue}`
      continue
    }
    if (total + file.size > PDF_MAX_TOTAL_MB * MB) {
      if (!problem) problem = `Total ukuran semua gambar maksimal ${PDF_MAX_TOTAL_MB} MB`
      continue
    }
    total += file.size
    const url = URL.createObjectURL(file)
    urls.current.add(url)
    accepted.push({ id: nextId.current++, file, url })
  }

  setError(problem)
  if (accepted.length > 0) {
    setItems((prev) => [...prev, ...accepted])
    resetResult() // daftar berubah, jadi hasil lama tidak berlaku lagi
  }
}
  function remove(id: number) {
    const item = items.find((i) => i.id === id);
    if (item) {
      URL.revokeObjectURL(item.url);
      urls.current.delete(item.url);
    }
    setItems((prev) => prev.filter((i) => i.id !== id));
    setError("");
    resetResult();
  }

  function move(id: number, dir: -1 | 1) {
    setItems((prev) => {
      const i = prev.findIndex((x) => x.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
    resetResult();
  }

  function clear() {
    controller.current?.abort();
    urls.current.forEach((u) => URL.revokeObjectURL(u));
    urls.current.clear();
    setItems([]);
    setLoading(false);
    setError("");
    resetResult();
  }

  async function generate(options: PdfOptions) {
    if (items.length === 0) return;

    controller.current?.abort();
    const ctrl = new AbortController();
    controller.current = ctrl;

    setLoading(true);
    setError("");

    try {
      const { blob, filename } = await imagesToPdf(
        items.map((i) => i.file),
        options,
        ctrl.signal,
      );
      if (ctrl.signal.aborted) return;
      setResult(blob, filename);
    } catch (err) {
      if (ctrl.signal.aborted) return;
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      if (!ctrl.signal.aborted) setLoading(false);
    }
  }

  return { items, result, loading, error, addFiles, remove, move, clear, generate, resetResult };
}
