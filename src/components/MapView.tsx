import { useEffect, useRef, type JSX } from "react";
import mapboxgl, {
  Map as MapboxMap,
  GeoJSONSource,
  LngLatBounds,
} from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { useLandStore } from "../store/useLandStore.ts";
import "./MapView.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN as string;

const SOURCE_ID = "lands-source";
const FILL_ID = "lands-fill";
const LINE_ID = "lands-line";

export default function MapView(): JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const drawRef = useRef<MapboxDraw | null>(null);

  const lands = useLandStore((s) => s.lands);
  const selectedLandId = useLandStore((s) => s.selectedLandId);
  const setDraftGeometry = useLandStore((s) => s.setDraftGeometry);
  const clearDraft = useLandStore((s) => s.clearDraft);
  const startDate = useLandStore((s) => s.startDate);
  const endDate = useLandStore((s) => s.endDate);
  const selectedMapIndices = useLandStore((s) => s.selectedMapIndices);

  /* =========================
   * INIT MAP (ONCE)
   * ========================= */
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [74.9167, 33.8667],
      zoom: 12,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: { polygon: true, trash: true },
    });
    map.addControl(draw, "top-left");

    map.on("load", () => {
      map.addSource(SOURCE_ID, {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });

      const before = map
        .getStyle()
        .layers?.find((l) => l.type === "symbol")?.id;

      map.addLayer(
        {
          id: FILL_ID,
          type: "fill",
          source: SOURCE_ID,
          paint: {
            "fill-color": "#22c55e",
            "fill-opacity": 0.4,
          },
        },
        before,
      );

      map.addLayer(
        {
          id: LINE_ID,
          type: "line",
          source: SOURCE_ID,
          paint: {
            "line-color": "#14532d",
            "line-width": 2,
          },
        },
        before,
      );
    });

    /* DRAW → STORE */
    map.on("draw.create", () => {
      const feature = draw.getAll().features[0];
      if (feature) setDraftGeometry(feature.geometry);
    });

    map.on("draw.update", () => {
      const feature = draw.getAll().features[0];
      if (feature) setDraftGeometry(feature.geometry);
    });

    map.on("draw.delete", clearDraft);

    mapRef.current = map;
    drawRef.current = draw;

    return () => {
      map.remove();
      mapRef.current = null;
      drawRef.current = null;
    };
  }, []);

  /* =========================
   * UPDATE DATA + APPLY FILTER
   * ========================= */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const source = map.getSource(SOURCE_ID) as GeoJSONSource | undefined;
    if (!source || !map.getLayer(FILL_ID)) return;

    source.setData({
      type: "FeatureCollection",
      features: lands.map((l) => ({
        type: "Feature",
        geometry: l.geometry,
        properties: { id: l.id },
      })),
    });

    if (!selectedLandId) {
      map.setFilter(FILL_ID, null);
      map.setFilter(LINE_ID, null);
    } else {
      const filter: any = ["==", ["get", "id"], selectedLandId];
      map.setFilter(FILL_ID, filter);
      map.setFilter(LINE_ID, filter);
    }
  }, [lands, selectedLandId]);

  /* =========================
   * ZOOM TO SELECTED LAND
   * ========================= */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedLandId) return;

    const land = lands.find((l) => l.id === selectedLandId);
    if (!land) return;

    const coords = land.geometry.coordinates[0] as number[][];

    const bounds = coords.reduce(
      (b, c) => b.extend(c as [number, number]),
      new LngLatBounds(
        coords[0] as [number, number],
        coords[0] as [number, number],
      ),
    );

    map.fitBounds(bounds, {
      padding: 60,
      duration: 600,
    });
  }, [selectedLandId, lands]);

  /* =========================
   * NDVI RASTER LAYER
   * ========================= */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    console.log("NDVI LAYER EFFECT", {
      startDate,
      endDate,
      selectedMapIndices,
      selectedLandId,
    });
    const showNDVI = selectedMapIndices.includes("NDVI");

    if (!showNDVI || !selectedLandId || !startDate || !endDate) {
      if (map.getLayer("ndvi-layer")) map.removeLayer("ndvi-layer");
      if (map.getSource("ndvi")) map.removeSource("ndvi");
      return;
    }

    const land = lands.find((l) => l.id === selectedLandId);
    if (!land) return;

    const coords = land.geometry.coordinates[0] as number[][];
    const lons = coords.map((c) => c[0]);
    const lats = coords.map((c) => c[1]);

    const bounds: [number, number, number, number] = [
      Math.min(...lons),
      Math.min(...lats),
      Math.max(...lons),
      Math.max(...lats),
    ];
    const baseURL: string =
      import.meta.env.VITE_API_URL ?? "http://localhost:4000";

    const ndviTileUrl =
      `${baseURL}/api/tiles/ndvi/${selectedLandId}/{z}/{x}/{y}.png` +
      `?dateFrom=${startDate}&dateTo=${endDate}`;

    if (map.getLayer("ndvi-layer")) map.removeLayer("ndvi-layer");
    if (map.getSource("ndvi")) map.removeSource("ndvi");

    map.addSource("ndvi", {
      type: "raster",
      tiles: [ndviTileUrl],
      tileSize: 256,
      bounds,
    });

    map.addLayer({
      id: "ndvi-layer",
      type: "raster",
      source: "ndvi",
      paint: {
        "raster-opacity": 0.75,
      },
    });
  }, [selectedMapIndices, selectedLandId, startDate, endDate, lands]);

  return <div ref={containerRef} className="map-container" />;
}
