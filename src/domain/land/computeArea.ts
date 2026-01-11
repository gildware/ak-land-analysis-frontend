import type { Polygon } from "geojson";
import area from "@turf/area";

export function computeLandAreaSqm(geometry: Polygon): number {
  return area(geometry);
}

export function sqmToHectares(sqm: number): number {
  return sqm / 10_000;
}

export function sqmToAcres(sqm: number): number {
  return sqm * 0.000247105;
}
