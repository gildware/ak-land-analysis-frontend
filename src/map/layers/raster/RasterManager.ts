import type { Map as MapboxMap } from "mapbox-gl";
import { RasterLayer } from "./RasterLayer";
import { buildTileUrl } from "./rasterUtils";
import { INDEX_CATALOG } from "../../../domain/indices/indexCatalog";

export class RasterManager {
  private activeLayers: Map<string, RasterLayer> = new Map();

  constructor(
    private map: MapboxMap,
    private baseUrl: string,
  ) {}

  update(params: {
    indices: string[];
    landId: string;
    bounds: [number, number, number, number];
    startDate: string;
    endDate: string;
  }) {
    // Remove unused layers
    for (const [id, layer] of this.activeLayers.entries()) {
      if (!params.indices.includes(id)) {
        layer.remove();
        this.activeLayers.delete(id);
      }
    }

    // Add new layers
    for (const indexId of params.indices) {
      if (this.activeLayers.has(indexId)) continue;

      const def = INDEX_CATALOG[indexId];
      if (!def) continue;

      const tileUrl = buildTileUrl(
        this.baseUrl,
        indexId,
        params.landId,
        params.startDate,
        params.endDate,
      );

      const layer = new RasterLayer(this.map, indexId, tileUrl, params.bounds);

      layer.add();
      this.activeLayers.set(indexId, layer);
    }
  }

  clear() {
    for (const layer of this.activeLayers.values()) {
      layer.remove();
    }
    this.activeLayers.clear();
  }
}
