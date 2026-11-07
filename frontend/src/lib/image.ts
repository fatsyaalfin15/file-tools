export const ACCEPT = "image/jpeg,image/png,image/webp";
export const MAX_SIZE_MB = 4;

const TYPES = ACCEPT.split(",");

export function validateImage(file: File, maxMb = MAX_SIZE_MB): string | null {
  if (!TYPES.includes(file.type)) return "Format file harus JPG, PNG, atau WebP";
  if (file.size > maxMb * 1024 * 1024) {
    return `Ukuran file terlalu besar (maksimal ${maxMb} MB)`;
  }
  return null;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}
