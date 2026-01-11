import type { Map as MapboxMap, Layer } from "mapbox-gl";
import type { Polygon } from "geojson";
import bbox from "@turf/bbox";
import { createLandSource, LAND_SOURCE_ID } from "./landSource";
import { landFillLayer, landLineLayer } from "./landStyles";
import type { LandFeature } from "../../../domain/land/landTypes";

export class LandLayer {
  constructor(private map: MapboxMap) {}

  add() {
    if (this.map.getSource(LAND_SOURCE_ID)) return;

    this.map.addSource(LAND_SOURCE_ID, createLandSource());

    const before = this.map
      .getStyle()
      .layers?.find((l: Layer) => l.type === "symbol")?.id;

    this.map.addLayer(landFillLayer, before);
    this.map.addLayer(landLineLayer, before);
  }

  setFeatures(features: LandFeature[]) {
    const source = this.map.getSource(LAND_SOURCE_ID) as
      | mapboxgl.GeoJSONSource
      | undefined;

    if (!source) return;

    source.setData({
      type: "FeatureCollection",
      features,
    });
  }

  zoomToLand(geometry: Polygon) {
    const [minX, minY, maxX, maxY] = bbox(geometry);

    this.map.fitBounds(
      [
        [minX, minY],
        [maxX, maxY],
      ],
      {
        padding: 60,
        duration: 600,
      },
    );
  }
}
