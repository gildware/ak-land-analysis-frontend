import mapboxgl from "mapbox-gl";
import type { MapEngine } from "./types";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN as string;

export const MapboxEngine: MapEngine = {
  createMap({ container, style, center, zoom, bearing = 0, pitch = 0 }) {
    return new mapboxgl.Map({
      container,
      style,
      center,
      zoom,
      bearing,
      pitch,
      antialias: true,
      preserveDrawingBuffer: true,
    });
  },
};
