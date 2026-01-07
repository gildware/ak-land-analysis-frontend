import { Map } from "mapbox-gl";

export function toggleNDVI(
  map: Map,
  opts?: {
    tileUrl: string;
    bounds: [number, number, number, number];
  },
) {
  if (!opts) {
    if (map.getLayer("ndvi-layer")) map.removeLayer("ndvi-layer");
    if (map.getSource("ndvi")) map.removeSource("ndvi");
    return;
  }

  if (map.getLayer("ndvi-layer")) map.removeLayer("ndvi-layer");
  if (map.getSource("ndvi")) map.removeSource("ndvi");

  map.addSource("ndvi", {
    type: "raster",
    tiles: [opts.tileUrl],
    tileSize: 512,
    bounds: opts.bounds,
  });

  map.addLayer({
    id: "ndvi-layer",
    type: "raster",
    source: "ndvi",
    paint: {
      "raster-opacity": 0.75,
      "raster-resampling": "linear",
    },
  });
}
