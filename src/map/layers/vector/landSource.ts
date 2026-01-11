import type { GeoJSONSourceSpecification } from "mapbox-gl";
import type { FeatureCollection } from "geojson";

export const LAND_SOURCE_ID = "land-source";

const emptyFeatureCollection: FeatureCollection = {
  type: "FeatureCollection",
  features: [],
};

export const createLandSource = (): GeoJSONSourceSpecification => ({
  type: "geojson",
  data: emptyFeatureCollection,
});
