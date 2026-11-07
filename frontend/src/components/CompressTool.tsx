import { useState } from "react";
import { useImageCompressor } from "../hooks/useImageCompressor";
import type { CompressOptions } from "../types/image";
import Card from "./Card";
import CompressSettings from "./CompressSettings";
import Dropzone from "./DropZone";
import ImagePreview from "./ImagePreview";

export default function CompressTool() {
  const { file, preview, result, loading, error, selectFile, compress, reset } =
    useImageCompressor();

  const [options, setOptions] = useState<CompressOptions>({
    quality: 75,
    format: "original",
    maxWidth: null,
  });

  return (
    <div className="space-y-4">
      <Dropzone
        onFiles={(files) => selectFile(files[0])}
        disabled={loading}
        compact={Boolean(file)}
      />

      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-100 p-3 text-sm text-red-700 dark:bg-red-900/40 dark:text-red-200"
        >
          {error}
        </p>
      )}

      {file && preview && (
        <div className="grid items-start gap-4 lg:grid-cols-5">
          <Card className="lg:col-span-2">
            <h2 className="mb-4 text-base font-semibold">Pengaturan</h2>
            <CompressSettings
              options={options}
              loading={loading}
              hasResult={Boolean(result)}
              onChange={setOptions}
              onSubmit={() => compress(options)}
            />
          </Card>

          <Card className="min-w-0 lg:col-span-3">
            <ImagePreview
              file={file}
              previewUrl={preview}
              result={result}
              loading={loading}
              onReset={reset}
            />
          </Card>
        </div>
      )}
    </div>
  );
}
