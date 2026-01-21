import { api } from "./http";

/* ======================
 * TYPES
 * ====================== */

export type IndexType = "NDVI";

export interface CreateAnalysisPayload {
  landId: string;
  indexType: IndexType;
  dateFrom: string; // ISO string
  dateTo: string; // ISO string
}

export interface NDVIStats {
  min: number;
  max: number;
  mean: number;
  stDev: number;
  noDataCount: number;
  sampleCount: number;
}

export interface AnalysisResultItem {
  interval: {
    from: string;
    to: string;
  };
  outputs: {
    ndvi: {
      bands: {
        B0: {
          stats: NDVIStats;
        };
      };
    };
  };
}
export interface DailyRaster {
  png: string | null;
  tiff: string | null;
}

export interface DailyAnalysis {
  date: string; // YYYY-MM-DD
  stats: NDVIStats | null;
  raster: DailyRaster | null;
}

export interface Analysis {
  id: string;
  landId: string;
  indexType: IndexType;
  dateFrom: string;
  dateTo: string;
  status: "pending" | "running" | "completed" | "failed" | "checking";
  result?: {
    data: AnalysisResultItem[];
    status: string;
  };
  daily: DailyAnalysis[]; // ✅ ADD THIS
  createdAt: string;
}

/* ======================
 * API FUNCTIONS
 * ====================== */

/**
 * Create analysis (NDVI)
 */
export async function createAnalysis(
  payload: CreateAnalysisPayload,
): Promise<Analysis> {
  const { data } = await api.post<Analysis>("/analysis", payload);
  return data;
}

/**
 * Get analyses by land
 */
export async function fetchAnalyses(landId: string): Promise<Analysis[]> {
  const { data } = await api.get<Analysis[]>(`/analysis/${landId}`);
  return data;
}
