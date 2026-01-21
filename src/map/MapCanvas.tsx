import { useEffect, useRef, useState } from "react";
import type { Position } from "geojson";

import { MapCore } from "./core/MapCore";
import { MapboxEngine } from "./engine";
import { setupLandAOI } from "./bootstrap/useLandAOI";

import { useLandStore } from "../store/useLandStore";
import { useAnalysisStore } from "../store/useAnalysisStore";

import type { LandFeature } from "../domain/land/landTypes";
import { NdviRasterLayer } from "./layers/raster/NdviRasterLayer";

import "./MapView.css";

/* ─────────────────────────────────────────────
 * SINGLE MAP INSTANCE
 * ───────────────────────────────────────────── */
const mapCore = new MapCore(MapboxEngine);

export default function MapCanvas() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const landAOIRef = useRef<ReturnType<typeof setupLandAOI> | null>(null);
  const rasterRef = useRef<NdviRasterLayer | null>(null);

  /* ───────────── stores ───────────── */

  const lands = useLandStore((s) => s.lands);
  const selectedLandId = useLandStore((s) => s.selectedLandId);
  const setDraftGeometry = useLandStore((s) => s.setDraftGeometry);
  const clearDraft = useLandStore((s) => s.clearDraft);

  const analyses = useAnalysisStore((s) => s.analyses);
  const selectedAnalysisId = useAnalysisStore((s) => s.selectedAnalysisId);
  const selectedAnalysisDate = useAnalysisStore((s) => s.selectedAnalysisDate);
  const ndviOpacity = useAnalysisStore((s) => s.ndviOpacity);
  useEffect(() => {
    if (rasterRef.current) {
      rasterRef.current.setOpacity(ndviOpacity);
    }
  }, [ndviOpacity]);
  /* ───────────── ui ───────────── */

  const [metersPerPixel, setMetersPerPixel] = useState<number | null>(null);
  const lastZoomedLandId = useRef<string | null>(null);

  /* ─────────────────────────────────────────────
   * MAP INIT (ONCE)
   * ───────────────────────────────────────────── */
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

      rasterRef.current = new NdviRasterLayer(map);

      mapCore.onResolutionChange((mpp) => {
        setMetersPerPixel(mpp);
      });
    });

    return () => {
      mapCore.destroy();
    };
  }, [setDraftGeometry, clearDraft]);

  /* ─────────────────────────────────────────────
   * RASTER HANDLING (analysis + date)
   * ───────────────────────────────────────────── */
  useEffect(() => {
    const raster = rasterRef.current;

    if (
      !raster ||
      !selectedLandId ||
      !selectedAnalysisId ||
      !selectedAnalysisDate
    ) {
      raster?.clear();
      return;
    }

    const analysis = analyses.find((a) => a.id === selectedAnalysisId);
    if (!analysis) {
      raster.clear();
      return;
    }

    const daily = analysis.daily.find((d) => d.date === selectedAnalysisDate);

    // No raster for this day → clear
    if (!daily?.raster?.png) {
      raster.clear();
      return;
    }

    // 🔹 Compute image bounds from land geometry
    const land = lands.find((l) => l.id === selectedLandId);
    if (!land) return;
    const ring = land.geometry.coordinates[0] as Position[];

    let minLng = Infinity;
    let minLat = Infinity;
    let maxLng = -Infinity;
    let maxLat = -Infinity;

    for (const [lng, lat] of ring) {
      minLng = Math.min(minLng, lng);
      minLat = Math.min(minLat, lat);
      maxLng = Math.max(maxLng, lng);
      maxLat = Math.max(maxLat, lat);
    }
    const imageCoordinates: [
      [number, number],
      [number, number],
      [number, number],
      [number, number],
    ] = [
      [minLng, maxLat], // top-left (NW)
      [maxLng, maxLat], // top-right (NE)
      [maxLng, minLat], // bottom-right (SE)
      [minLng, minLat], // bottom-left (SW)
    ];

    raster.setImage(daily.raster.png, imageCoordinates);
  }, [
    lands,
    analyses,
    selectedLandId,
    selectedAnalysisId,
    selectedAnalysisDate,
  ]);

  /* ─────────────────────────────────────────────
   * AOI DRAWING + COLORING
   * ───────────────────────────────────────────── */
  useEffect(() => {
    const aoi = landAOIRef.current;
    if (!aoi) return;

    if (!selectedLandId) {
      aoi.setFeatures([]);
      lastZoomedLandId.current = null;
      return;
    }

    const land = lands.find((l) => l.id === selectedLandId);
    if (!land) {
      aoi.setFeatures([]);
      lastZoomedLandId.current = null;
      return;
    }

    let ndviValue: number | undefined;

    if (selectedAnalysisId && selectedAnalysisDate) {
      const analysis = analyses.find((a) => a.id === selectedAnalysisId);
      const daily = analysis?.daily.find(
        (d) => d.date === selectedAnalysisDate,
      );

      ndviValue = daily?.stats?.mean;
    }

    const feature: LandFeature = {
      type: "Feature",
      geometry: land.geometry,
      properties: {
        id: land.id,
        name: land.name,
        selected: true,
        value: ndviValue,
      },
    };

    aoi.setFeatures([feature]);

    if (lastZoomedLandId.current !== land.id) {
      aoi.zoomToLand(land.geometry);
      lastZoomedLandId.current = land.id;
    }
  }, [
    lands,
    analyses,
    selectedLandId,
    selectedAnalysisId,
    selectedAnalysisDate,
  ]);

  /* ─────────────────────────────────────────────
   * RENDER
   * ───────────────────────────────────────────── */

  function describeResolution(mpp: number): string {
    if (mpp <= 3) return "Very High (Drone / Planet)";
    if (mpp <= 10) return "High (Sentinel-2)";
    if (mpp <= 30) return "Medium (Landsat)";
    return "Low (overview)";
  }

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="map-container absolute inset-0" />

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
