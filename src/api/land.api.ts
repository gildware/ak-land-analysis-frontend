import { api } from "./http";

/* ======================
 * TYPES
 * ====================== */

export interface GeoJSONGeometry {
  type: "Polygon";
  coordinates: number[][][];
}

export interface Land {
  id: string;
  name: string;
  geometry: GeoJSONGeometry;
  createdAt?: string;
}

export interface CreateLandPayload {
  name: string;
  geometry: GeoJSONGeometry;
}

/* ======================
 * API FUNCTIONS
 * ====================== */

/**
 * Create land
 */
export async function createLand(payload: any): Promise<Land> {
  const { data } = await api.post<Land>("/lands", payload);
  return data;
}

/**
 * Get all lands
 */
export async function fetchLands(): Promise<Land[]> {
  const { data } = await api.get<Land[]>("/lands");
  return data;
}

/**
 * Get land by ID
 */
export async function fetchLandById(id: string): Promise<Land> {
  const { data } = await api.get<Land>(`/lands/${id}`);
  return data;
}
