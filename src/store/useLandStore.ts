import { create } from "zustand";
import type { Geometry, Polygon } from "geojson";
import area from "@turf/area";
import { fetchLands, createLand as createLandApi } from "../api/land.api";
import type { DailyNDVI } from "../domain/analysis/ndviTypes";
import { fetchDailyNDVI } from "../api/ndvi.api";

/* ======================
 * TYPES
 * ====================== */

export interface Land {
  id: string;
  name: string;
  geometry: Polygon;
  areaSqm: number;
}

interface DraftGeometry {
  geometry: Polygon;
  areaSqm: number;
}

interface CreateLandInput {
  name: string;
  geometry: Geometry;
}

interface LandStore {
  /* ---------- CORE ---------- */
  lands: Land[];
  selectedLandId: string | null;

  /* ---------- DRAFT (LIVE) ---------- */
  draftGeometry: DraftGeometry | null;

  /* ---------- ANALYSIS ---------- */
  startDate: Date | null;
  endDate: Date | null;
  selectedMapIndices: string[];
  selectedAnalysisIndices: string[];
  showNDVI: boolean;

  /* ---------- UI ---------- */
  isLocked: boolean;
  loading: boolean;
  error: string | null;

  /* ---------- ACTIONS ---------- */
  setDraftGeometry: (geometry: Geometry) => void;
  clearDraft: () => void;

  loadLands: () => Promise<void>;
  createLand: (input: CreateLandInput) => Promise<Land>;
  selectLand: (landId: string) => void;
  clearSelectedLand: () => void;

  setStartDate: (date: Date | null) => void;
  clearStartDate: () => void;
  setEndDate: (date: Date | null) => void;
  clearEndDate: () => void;

  toggleMapIndex: (index: string) => void;
  clearMapIndices: () => void;
  toggleAnalysisIndex: (index: string) => void;
  clearAnalysisIndices: () => void;
}

/* ======================
 * STORE
 * ====================== */

export const useLandStore = create<LandStore>((set, get) => ({
  lands: [],
  selectedLandId: null,

  /* ---------- DRAFT ---------- */
  draftGeometry: null,

  /* ---------- ANALYSIS ---------- */
  startDate: null,
  endDate: null,
  selectedMapIndices: [],
  selectedAnalysisIndices: [],
  showNDVI: false,

  /* ---------- UI ---------- */
  isLocked: false,
  loading: false,
  error: null,

  /* ---------- LIVE DRAFT AREA ---------- */

  setDraftGeometry: (geometry) => {
    const polygon = geometry as Polygon;

    set({
      draftGeometry: {
        geometry: polygon,
        areaSqm: area(polygon),
      },
      isLocked: true,
    });
  },

  clearDraft: () =>
    set({
      draftGeometry: null,
      isLocked: false,
    }),

  /* ---------- LAND ---------- */

  loadLands: async () => {
    set({ loading: true, error: null });
    try {
      const apiLands = await fetchLands();

      set({
        lands: apiLands.map((l) => ({
          id: l.id,
          name: l.name,
          geometry: l.geometry as Polygon,
          areaSqm: area(l.geometry as Polygon),
        })),
        loading: false,
      });
    } catch (err: any) {
      set({
        error: err?.message ?? "Failed to load lands",
        loading: false,
      });
    }
  },

  createLand: async ({ name }) => {
    const draft = get().draftGeometry;
    if (!draft) throw new Error("No draft geometry");

    set({ loading: true, error: null });

    try {
      const apiLand = await createLandApi({
        name,
        geometry: draft.geometry,
      });

      const land: Land = {
        id: apiLand.id,
        name: apiLand.name,
        geometry: draft.geometry,
        areaSqm: draft.areaSqm,
      };

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

  /* ---------- DATE ---------- */

  setStartDate: (startDate) => set({ startDate }),
  clearStartDate: () => set({ startDate: null }),
  setEndDate: (endDate) => set({ endDate }),
  clearEndDate: () => set({ endDate: null }),

  /* ---------- MAP INDICES ---------- */

  toggleMapIndex: (index) =>
    set((state) => ({
      selectedMapIndices: state.selectedMapIndices.includes(index)
        ? state.selectedMapIndices.filter((i) => i !== index)
        : [...state.selectedMapIndices, index],
    })),

  clearMapIndices: () => set({ selectedMapIndices: [] }),

  toggleAnalysisIndex: (index) =>
    set(() => ({
      selectedAnalysisIndices: [index], // always keep only latest
    })),

  clearAnalysisIndices: () => set({ selectedAnalysisIndices: [] }),
}));
