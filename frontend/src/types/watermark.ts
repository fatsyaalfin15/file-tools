export type WatermarkPosition =
  | "top-left"
  | "top-right"
  | "center"
  | "bottom-left"
  | "bottom-right"
  | "tile";

export type WatermarkSize = "small" | "medium" | "large";
export type WatermarkColor = "white" | "black";

export type WatermarkOptions = {
  text: string;
  position: WatermarkPosition;
  size: WatermarkSize;
  opacity: number;
  color: WatermarkColor;
};
