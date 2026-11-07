import { useEffect, useRef, useState } from "react";
import { createCertificate } from "../lib/api";
import type { CertificateData } from "../types/certificate";
import { useGeneratedFile } from "./useGeneratedFile";

export function useCertificate() {
  const { file, set } = useGeneratedFile();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const controller = useRef<AbortController | null>(null);

  useEffect(() => () => controller.current?.abort(), []);

  async function generate(data: CertificateData) {
    controller.current?.abort();
    const ctrl = new AbortController();
    controller.current = ctrl;

    setLoading(true);
    setError("");

    try {
      const { blob, filename } = await createCertificate(data, ctrl.signal);
      if (ctrl.signal.aborted) return;
      set(blob, filename);
    } catch (err) {
      if (ctrl.signal.aborted) return;
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      if (!ctrl.signal.aborted) setLoading(false);
    }
  }

  return { file, loading, error, setError, generate };
}
