import type { Polygon } from "geojson";
import bbox from "@turf/bbox";
import area from "@turf/area";

export function getPolygonBounds(
  geometry: Polygon,
): [number, number, number, number] {
  return bbox(geometry) as [number, number, number, number];
}

export function getAreaSqm(geometry: Polygon): number {
  return area(geometry);
}

export function sqmToHectares(sqm: number): number {
  return sqm / 10_000;
}

export function sqmToAcres(sqm: number): number {
  return sqm * 0.000247105;
}
