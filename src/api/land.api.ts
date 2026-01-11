import { api } from "./http";
import type { Polygon } from "geojson";

/* ======================
 * TYPES
 * ====================== */

export interface ApiLand {
  id: string;
  name: string;
  geometry: Polygon;
}

export interface CreateLandPayload {
  name: string;
  geometry: Polygon;
}

/* ======================
 * API
 * ====================== */

export async function createLand(payload: CreateLandPayload): Promise<ApiLand> {
  const { data } = await api.post<ApiLand>("/lands", payload);
  return data;
}

export async function fetchLands(): Promise<ApiLand[]> {
  const { data } = await api.get<ApiLand[]>("/lands");
  return data;
}
