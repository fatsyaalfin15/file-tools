export type PageSize = "a4" | "letter" | "fit";
export type Orientation = "auto" | "portrait" | "landscape";
export type Margin = "none" | "small" | "medium";

export type PdfOptions = {
  pageSize: PageSize;
  orientation: Orientation;
  margin: Margin;
};
