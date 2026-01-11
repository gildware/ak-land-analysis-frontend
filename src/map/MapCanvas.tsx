import { useEffect, useRef, useState } from "react";
import { MapCore } from "./core/MapCore";
import { MapboxEngine } from "./engine";
import { setupLandAOI } from "./bootstrap/useLandAOI";
import { useLandStore } from "../store/useLandStore";
import type { LandFeature } from "../domain/land/landTypes";
import "./MapView.css";
import { useAnalysisStore } from "../store/useAnalysisStore";
import { NdviRasterLayer } from "./layers/raster/NdviRasterLayer";

const mapCore = new MapCore(MapboxEngine);

export default function MapCanvas() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const landAOIRef = useRef<ReturnType<typeof setupLandAOI> | null>(null);

  const lands = useLandStore((s) => s.lands);
  const selectedLandId = useLandStore((s) => s.selectedLandId);
  const setDraftGeometry = useLandStore((s) => s.setDraftGeometry);
  const clearDraft = useLandStore((s) => s.clearDraft);

  const analyses = useAnalysisStore((s) => s.analyses);
  const selectedAnalysisId = useAnalysisStore((s) => s.selectedAnalysisId);
  const selectedAnalysisDate = useAnalysisStore((s) => s.selectedAnalysisDate);

  const [metersPerPixel, setMetersPerPixel] = useState<number | null>(null);

  const lastZoomedLandId = useRef<string | null>(null);
  const ndviRasterRef = useRef<NdviRasterLayer | null>(null);

  // ─────────────────────────────────────────────
  // Map init (ONCE)
  // ─────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;

    mapCore.create(containerRef.current);

    mapCore.onReady((map) => {
      if (landAOIRef.current) return;

      landAOIRef.current = setupLandAOI(map, {
        onCreate: setDraftGeometry,
        onUpdate: setDraftGeometry,
        onDelete: clearDraft,
      });
      ndviRasterRef.current = new NdviRasterLayer(map);

      mapCore.onResolutionChange((mpp) => {
        setMetersPerPixel(mpp);
      });
    });

    return () => {
      mapCore.destroy();
    };
  }, []);

  useEffect(() => {
    const raster = ndviRasterRef.current;

    if (!raster || !selectedLandId || !selectedAnalysisDate) {
      raster?.clear();
      return;
    }

    raster.setDate(selectedLandId, selectedAnalysisDate);
  }, [selectedLandId, selectedAnalysisDate]);

  // ─────────────────────────────────────────────
  // Selected land / analysis / date → AOI render
  // ─────────────────────────────────────────────
  useEffect(() => {
    const aoi = landAOIRef.current;
    if (!aoi) return;

    // No land selected → clear AOI
    if (!selectedLandId) {
      aoi.setFeatures([]);
      lastZoomedLandId.current = null;
      return;
    }

    const land = lands.find((l) => l.id === selectedLandId);
    if (!land || !land.geometry) {
      aoi.setFeatures([]);
      lastZoomedLandId.current = null;
      return;
    }

    // ── Extract NDVI value for selected analysis date
    let ndviValue: number | undefined;

    if (selectedAnalysisId && selectedAnalysisDate) {
      const analysis = analyses.find((a) => a.id === selectedAnalysisId);

      const daily = analysis?.result?.data.find((d) =>
        d.interval.from.startsWith(selectedAnalysisDate),
      );

      ndviValue = daily?.outputs?.ndvi?.bands?.B0?.stats?.mean ?? undefined;
    }

    const feature: LandFeature = {
      type: "Feature",
      geometry: land.geometry,
      properties: {
        id: land.id,
        name: land.name,
        selected: true,
        value: ndviValue, // 🔥 THIS TRIGGERS COLOR UPDATE
      },
    };

    // 1️⃣ Update AOI feature (forces Mapbox redraw)
    aoi.setFeatures([feature]);

    // 2️⃣ Zoom ONLY when land changes (not date changes)
    if (lastZoomedLandId.current !== land.id) {
      aoi.zoomToLand(land.geometry);
      lastZoomedLandId.current = land.id;
    }
  }, [
    lands,
    selectedLandId,
    analyses,
    selectedAnalysisId,
    selectedAnalysisDate,
  ]);

  function describeResolution(mpp: number): string {
    if (mpp <= 3) return "Very High (Planet / Drone)";
    if (mpp <= 10) return "High (Sentinel-2 10m)";
    if (mpp <= 30) return "Medium (Landsat)";
    return "Low (overview)";
  }

  return (
    <div className="relative h-full w-full">
      {/* Map */}
      <div ref={containerRef} className="map-container absolute inset-0" />

      {/* Resolution Overlay */}
      {metersPerPixel !== null && (
        <div className="absolute bottom-10 left-3 rounded bg-white/80 px-2 py-1 text-xs shadow backdrop-blur">
          <div>
            Resolution: <b>{metersPerPixel.toFixed(2)} m/px</b>
          </div>
          <div className="text-[10px] text-gray-600">
            {describeResolution(metersPerPixel)}
          </div>
        </div>
      )}
    </div>
  );
}
