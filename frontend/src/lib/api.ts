import type { CertificateData } from "../types/certificate";
import type { CompressOptions } from "../types/image";
import type { ImageInfo } from "../types/inspect";
import type { PdfOptions } from "../types/pdf";
import type { WatermarkOptions } from "../types/watermark";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export type ApiFile = { blob: Blob; filename: string };

function filenameFrom(header: string | null, fallback: string) {
  return header?.match(/filename="([^"]+)"/)?.[1] ?? fallback;
}

// Mengirim permintaan dan mengubah semua kegagalan menjadi Error dengan pesan yang jelas.
// Error dari backend berbentuk JSON { message }.
async function send(path: string, init: RequestInit): Promise<Response> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, { method: "POST", ...init });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") throw err;
    throw new Error("Tidak dapat terhubung ke server");
  }

  if (!res.ok) {
    if (res.status === 413) throw new Error('Ukuran file terlalu besar (maksimal 4 MB)')
    let message = "Terjadi kesalahan";
    try {
      message = (await res.json()).message ?? message;
    } catch {
      // respons bukan JSON, pakai pesan bawaan
    }
    throw new Error(message);
  }
  return res;
}

async function postForFile(
  path: string,
  init: RequestInit,
  fallbackName: string,
): Promise<ApiFile> {
  const res = await send(path, init);
  return {
    blob: await res.blob(),
    filename: filenameFrom(res.headers.get("Content-Disposition"), fallbackName),
  };
}

async function postForJson<T>(path: string, init: RequestInit): Promise<T> {
  const res = await send(path, init);
  return (await res.json()) as T;
}

export function compressImage(file: File, options: CompressOptions, signal?: AbortSignal) {
  const form = new FormData();
  form.append("quality", String(options.quality));
  form.append("format", options.format);
  if (options.maxWidth) form.append("maxWidth", String(options.maxWidth));
  form.append("file", file);

  return postForFile("/api/images/compress", { body: form, signal }, "gambar-compressed");
}

export function imagesToPdf(files: File[], options: PdfOptions, signal?: AbortSignal) {
  const form = new FormData();
  form.append("pageSize", options.pageSize);
  form.append("orientation", options.orientation);
  form.append("margin", options.margin);
  files.forEach((f) => form.append("files", f)); // urutan array = urutan halaman

  return postForFile("/api/pdf/from-images", { body: form, signal }, "gambar-ke-pdf.pdf");
}

export function createCertificate(data: CertificateData, signal?: AbortSignal) {
  return postForFile(
    "/api/certificates",
    {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      signal,
    },
    "sertifikat.pdf",
  );
}

export function inspectImage(file: File, signal?: AbortSignal) {
  const form = new FormData();
  form.append("file", file);
  return postForJson<ImageInfo>("/api/images/inspect", { body: form, signal });
}

export function stripMetadata(file: File, signal?: AbortSignal) {
  const form = new FormData();
  form.append("file", file);
  return postForFile("/api/images/strip-metadata", { body: form, signal }, "gambar-bersih");
}

export function addWatermark(file: File, options: WatermarkOptions, signal?: AbortSignal) {
  const form = new FormData();
  form.append("text", options.text);
  form.append("position", options.position);
  form.append("size", options.size);
  form.append("opacity", String(options.opacity));
  form.append("color", options.color);
  form.append("file", file);

  return postForFile("/api/images/watermark", { body: form, signal }, "gambar-watermark");
}
