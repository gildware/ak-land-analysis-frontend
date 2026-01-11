export type IndexId = "NDVI" | "NDRE" | "NDWI";

export type IndexDefinition = {
  id: IndexId;
  label: string;
  sensor: "Sentinel-2" | "Landsat-8";
  resolution: number; // meters
  minZoom: number;
  maxZoom: number;
  colorRamp: string;
};
