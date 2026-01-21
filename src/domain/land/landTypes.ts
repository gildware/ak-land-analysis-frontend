import type { Feature, Polygon } from "geojson";

export interface LandFeature extends Feature<Polygon> {
  properties: {
    id: string;
    name?: string;
    areaSqm?: number;

    // 🔥 ADD THESE
    selected?: boolean;
    value?: number;
  };
}
