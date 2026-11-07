import { useCallback, useEffect, useRef, useState } from "react";
import type { GeneratedFile } from "../types/file";

export function useGeneratedFile() {
  const [file, setFile] = useState<GeneratedFile | null>(null);
  const urlRef = useRef<string | null>(null);

  const revoke = () => {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = null;
  };

  useEffect(() => revoke, []);

  const set = useCallback((blob: Blob, filename: string) => {
    revoke();
    const url = URL.createObjectURL(blob);
    urlRef.current = url;
    setFile({ blob, filename, url, size: blob.size });
  }, []);

  const clear = useCallback(() => {
    revoke();
    setFile(null);
  }, []);

  return { file, set, clear };
}
