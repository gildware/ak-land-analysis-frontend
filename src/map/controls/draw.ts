import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { Map } from "mapbox-gl";

export function addDraw(
  map: Map,
  onChange: (geom: GeoJSON.Geometry) => void,
  onDelete: () => void,
) {
  const draw = new MapboxDraw({
    displayControlsDefault: false,
    controls: { polygon: true, trash: true },
  });

  map.addControl(draw, "top-left");

  map.on("draw.create", () => {
    const f = draw.getAll().features[0];
    if (f) onChange(f.geometry);
  });

  map.on("draw.update", () => {
    const f = draw.getAll().features[0];
    if (f) onChange(f.geometry);
  });

  map.on("draw.delete", onDelete);

  return draw;
}
