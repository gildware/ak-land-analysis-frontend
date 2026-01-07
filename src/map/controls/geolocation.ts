import mapboxgl, { Map } from "mapbox-gl";

export function addGeolocation(map: Map) {
  const geo = new mapboxgl.GeolocateControl({
    positionOptions: { enableHighAccuracy: true },
    trackUserLocation: true,
    showUserHeading: true,
  });

  map.addControl(geo, "top-right");
  map.once("load", () => geo.trigger());
}
