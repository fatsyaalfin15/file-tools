export type OutputFormat = "original" | "jpeg" | "webp" | "png";

export type CompressOptions = {
  quality: number;
  format: OutputFormat;
  maxWidth: number | null;
};

export type CompressResult = {
  blob: Blob;
  filename: string;
  url: string;
  size: number;
};
