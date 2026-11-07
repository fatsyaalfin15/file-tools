export type ImageInfo = {
  format: "jpeg" | "png" | "webp";
  width: number;
  height: number;
  megapixels: number;
  sizeBytes: number;
  colorSpace: string;
  hasAlpha: boolean;
  density: number | null;
  orientation: number | null;
  progressive: boolean;
  embedded: { exif: boolean; icc: boolean; xmp: boolean; iptc: boolean };
  textChunks: { keyword: string; length: number }[];
  camera: {
    make: string | null;
    model: string | null;
    lens: string | null;
    software: string | null;
  };
  shot: {
    takenAt: string | null;
    iso: number | null;
    aperture: string | null;
    exposure: string | null;
    focalLength: string | null;
  };
  gps: { latitude: number; longitude: number } | null;
};
