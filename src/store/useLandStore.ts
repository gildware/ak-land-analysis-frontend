import { create } from "zustand";
import type { Geometry } from "geojson";
import { fetchLands, createLand as createLandApi } from "../api/land.api.ts";

/* ======================
 * TYPES
 * ====================== */

export interface Land {
  id: string;
  name: string;
  geometry: any;
}

interface CreateLandInput {
  name: string;
  geometry: Geometry;
}

interface LandStore {
  lands: Land[];
  selectedLandId: string | null;

  draftGeometry: Geometry | null;

  startDate: Date | null;
  endDate: Date | null;

  isLocked: boolean;
  showNDVI: boolean;

  loading: boolean;
  error: string | null;

  setDraftGeometry: (geometry: Geometry) => void;
  clearDraft: () => void;

  lock: () => void;
  unlock: () => void;

  loadLands: () => Promise<void>;
  selectLand: (landId: string) => void;
  clearSelectedLand: () => void;

  createLand: (input: CreateLandInput) => Promise<Land>;

  setStartDate: (date: any) => void;
  clearStartDate: () => void;
  setEndDate: (date: any) => void;
  clearEndDate: () => void;

  toggleMapIndex: (index: string) => void;
  clearMapIndices: () => void;
  selectedMapIndices: string[];

  toggleAnalysisIndex: (index: string) => void;
  clearAnalysisIndices: () => void;
  selectedAnalysisIndices: string[];
}

export const useLandStore = create<LandStore>((set) => ({
  lands: [],
  selectedLandId: null,

  draftGeometry: null,

  startDate: null,
  endDate: null,
  isLocked: false,
  showNDVI: false,

  loading: false,
  error: null,

  setDraftGeometry: (geometry) =>
    set({
      draftGeometry: geometry,
      isLocked: true,
    }),

  clearDraft: () =>
    set({
      draftGeometry: null,
      isLocked: false,
    }),

  lock: () => set({ isLocked: true }),
  unlock: () => set({ isLocked: false }),

  loadLands: async () => {
    set({ loading: true, error: null });
    try {
      const lands = await fetchLands();
      set({ lands, loading: false });
    } catch (err: any) {
      set({
        error: err?.message ?? "Failed to load lands",
        loading: false,
      });
    }
  },

  selectLand: (landId) =>
    set({
      selectedLandId: landId,
      draftGeometry: null,
      isLocked: true,
    }),

  clearSelectedLand: () =>
    set({
      selectedLandId: null,
      isLocked: false,
    }),

  createLand: async ({ name, geometry }) => {
    set({ loading: true, error: null });
    try {
      const land = await createLandApi({ name, geometry });

      set((state) => ({
        lands: [...state.lands, land],
        selectedLandId: land.id,
        draftGeometry: null,
        isLocked: true,
        loading: false,
      }));

      return land;
    } catch (err: any) {
      set({
        error: err?.message ?? "Failed to create land",
        loading: false,
      });
      throw err;
    }
  },

  /* ======================
   * ACTIONS — DATE / NDVI
   * ====================== */

  setStartDate: (startDate) => set({ startDate }),
  clearStartDate: () => set({ startDate: null }),
  setEndDate: (endDate) => set({ endDate }),
  clearEndDate: () => set({ endDate: null }),
  selectedMapIndices: [],
  selectedAnalysisIndices: [],
  toggleMapIndex: (index) =>
    set((state) => ({
      selectedMapIndices: state.selectedMapIndices.includes(index)
        ? state.selectedMapIndices.filter((i) => i !== index)
        : [...state.selectedMapIndices, index],
    })),

  clearMapIndices: () => set({ selectedMapIndices: [] }),

  toggleAnalysisIndex: (index) =>
    set((state) => ({
      selectedAnalysisIndices: state.selectedAnalysisIndices.includes(index)
        ? state.selectedAnalysisIndices.filter((i) => i !== index)
        : [...state.selectedAnalysisIndices, index],
    })),

  clearAnalysisIndices: () => set({ selectedAnalysisIndices: [] }),
}));
