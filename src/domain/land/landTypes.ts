import type { Feature, Polygon } from "geojson";

export type LandFeature = Feature<
  Polygon,
  {
    id: string;
    name?: string;
    areaSqm?: number;
  }
>;
