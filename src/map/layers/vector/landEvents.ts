import type { Map as MapboxMap } from "mapbox-gl";
import type { Polygon } from "geojson";
import { computeLandAreaSqm } from "../../../domain/land/computeArea";

export function bindLandDrawEvents(
  map: MapboxMap,
  draw: any,
  callbacks: {
    onCreate: (geometry: Polygon, areaSqm: number) => void;
    onUpdate: (geometry: Polygon, areaSqm: number) => void;
    onDelete: () => void;
  },
) {
  map.on("draw.create", () => {
    const feature = draw.getAll().features[0];
    if (!feature) return;

    const geometry = feature.geometry as Polygon;
    const areaSqm = computeLandAreaSqm(geometry);
    callbacks.onCreate(geometry, areaSqm);
  });

  map.on("draw.update", () => {
    const feature = draw.getAll().features[0];
    if (!feature) return;

    const geometry = feature.geometry as Polygon;
    const areaSqm = computeLandAreaSqm(geometry);
    callbacks.onUpdate(geometry, areaSqm);
  });

  map.on("draw.delete", callbacks.onDelete);
}
