import { create } from "zustand";
import { createAnalysis, fetchAnalyses, Analysis } from "../api/analysis.api";

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

  selectedAnalysisId: string | null;
  selectedAnalysisDate: string | null;
  selectedIndexType: string | null;

  selectAnalysis: (analysisId: string) => void;
  selectAnalysisDate: (date: string) => void;
  selectIndexType: (indexType: string) => void;

  ndviOpacity: number;
  setNdviOpacity: (value: number) => void;
  isPlaying: boolean;
  play: () => void;
  stop: () => void;
}

/* ======================
 * STORE
 * ====================== */

export const useAnalysisStore = create<
  AnalysisStore & {
    selectedAnalysisId: string | null;
    selectedAnalysisDate: string | null;
    selectedIndexType: string | null;
    selectAnalysis: (id: string) => void;
    selectAnalysisDate: (date: string) => void;
    selectIndexType: (indexType: string) => void;
  }
>((set) => ({
  analyses: [],
  loading: false,

  selectedAnalysisId: null,
  selectedAnalysisDate: null,
  selectedIndexType: null,

  selectAnalysis: (id) =>
    set({
      selectedAnalysisId: id,
      selectedAnalysisDate: null,
    }),

  selectAnalysisDate: (date) =>
    set({
      selectedAnalysisDate: date,
    }),
  selectIndexType: (indexType) =>
    set({
      selectedIndexType: indexType,
    }),
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
  ndviOpacity: 0.8,

  setNdviOpacity: (value) =>
    set({
      ndviOpacity: value,
    }),
  isPlaying: false,

  play: () => set({ isPlaying: true }),
  stop: () => set({ isPlaying: false }),
}));
