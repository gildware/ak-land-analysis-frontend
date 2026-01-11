import type { Map as MapboxMap } from "mapbox-gl";
import type { Polygon } from "geojson";
import { LandLayer } from "../layers/vector/LandLayer";
import { createDrawControl } from "../controls/draw/DrawControl";
import { bindLandDrawEvents } from "../layers/vector/landEvents";
import type { LandFeature } from "../../domain/land/landTypes";

export function setupLandAOI(
  map: MapboxMap,
  options: {
    onCreate: (geometry: Polygon) => void;
    onUpdate: (geometry: Polygon) => void;
    onDelete: () => void;
  },
) {
  const landLayer = new LandLayer(map);
  landLayer.add();

  const draw = createDrawControl();
  map.addControl(draw, "top-left");

  bindLandDrawEvents(map, draw, {
    onCreate: options.onCreate,
    onUpdate: options.onUpdate,
    onDelete: options.onDelete,
  });

  return {
    setFeatures(features: LandFeature[]) {
      landLayer.setFeatures(features);
    },

    zoomToLand(geometry: Polygon) {
      landLayer.zoomToLand(geometry);
    },
  };
}
