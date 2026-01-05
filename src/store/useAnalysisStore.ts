import { create } from "zustand";
import { createAnalysis, fetchAnalyses } from "../api/analysis.api";

/* ======================
 * TYPES
 * ====================== */

export interface Analysis {
  id: string;
  landId: string;
  status: "pending" | "running" | "completed" | "failed";
  indices: string[];
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface RunAnalysisPayload {
  landId: string;
  indices: string[];
  startDate: string;
  endDate: string;
}

interface AnalysisStore {
  analyses: Analysis[];
  loading: boolean;

  loadAnalyses: (landId: string) => Promise<void>;
  runAnalysis: (payload: RunAnalysisPayload) => Promise<void>;
}

/* ======================
 * STORE
 * ====================== */

export const useAnalysisStore = create<AnalysisStore>((set) => ({
  analyses: [],
  loading: false,

  loadAnalyses: async (landId) => {
    set({ loading: true });
    try {
      const analyses = await fetchAnalyses(landId);
      set({ analyses, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  runAnalysis: async (payload: any) => {
    set({ loading: true });
    try {
      const job = await createAnalysis(payload);
      set((state: any) => ({
        analyses: [job, ...state.analyses],
        loading: false,
      }));
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
}));
