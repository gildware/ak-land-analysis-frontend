import type { Map as MapboxMap } from "mapbox-gl";
import { rasterLayerId, rasterSourceId } from "./rasterUtils";

export class RasterLayer {
  constructor(
    private map: MapboxMap,
    private indexId: string,
    private tileUrl: string,
    private bounds: [number, number, number, number],
    private opacity = 1,
  ) {}

  add() {
    const sourceId = rasterSourceId(this.indexId);
    const layerId = rasterLayerId(this.indexId);

    if (this.map.getLayer(layerId)) return;

    this.map.addSource(sourceId, {
      type: "raster",
      tiles: [this.tileUrl],
      tileSize: 256,
      bounds: this.bounds,
    });

    this.map.addLayer({
      id: layerId,
      type: "raster",
      source: sourceId,
      paint: {
        "raster-opacity": this.opacity,
      },
    });
  }

  remove() {
    const sourceId = rasterSourceId(this.indexId);
    const layerId = rasterLayerId(this.indexId);

    if (this.map.getLayer(layerId)) {
      this.map.removeLayer(layerId);
    }
    if (this.map.getSource(sourceId)) {
      this.map.removeSource(sourceId);
    }
  }
}
