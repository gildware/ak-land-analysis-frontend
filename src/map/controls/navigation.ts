import mapboxgl, { Map } from "mapbox-gl";

export function addNavigation(map: Map) {
  map.addControl(new mapboxgl.NavigationControl(), "top-right");
}
