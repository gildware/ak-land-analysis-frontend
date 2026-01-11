import type { IndexDefinition } from "./indexTypes";

export const INDEX_CATALOG: Record<string, IndexDefinition> = {
  NDVI: {
    id: "NDVI",
    label: "NDVI",
    sensor: "Sentinel-2",
    resolution: 10,
    minZoom: 8,
    maxZoom: 15,
    colorRamp: "ndvi",
  },
};
