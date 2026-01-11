import type { Polygon } from "geojson";

export interface Land {
  id: string;
  name: string;
  geometry: Polygon;

  /**
   * Derived / computed values
   */
  areaSqm: number;

  /**
   * Optional metadata (future-safe)
   */
  createdAt?: string;
  updatedAt?: string;
}
