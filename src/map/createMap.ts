// src/map/createMap.ts
import mapboxgl, { Map } from "mapbox-gl";
import { MAP_DEFAULTS, MAP_STYLE } from "./mapConfig";

export function createMap(container: HTMLDivElement): Map {
  const map = new mapboxgl.Map({
    container,
    style: MAP_STYLE,
    ...MAP_DEFAULTS,
  });

  map.once("load", () => {
    map.setPixelRatio(window.devicePixelRatio || 2);
  });

  return map;
}
