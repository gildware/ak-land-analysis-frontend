import type { Map as MapboxMap, RasterTileSource } from "mapbox-gl";

const SOURCE_ID = "ndvi-raster-source";
const LAYER_ID = "ndvi-raster-layer";

export class NdviRasterLayer {
  constructor(private map: MapboxMap) {}

  private buildTileUrl(landId: string, date: string) {
    const baseURL: string =
      import.meta.env.VITE_API_URL ?? "http://localhost:4000";
    return `${baseURL}/api/tiles/ndvi/${landId}/{z}/{x}/{y}.png?date=${date}`;
  }

  setDate(landId: string, date: string) {
    const tileUrl = this.buildTileUrl(landId, date);

    // Find first symbol layer (correct insertion point)
    const before = this.map
      .getStyle()
      .layers?.find((l) => l.type === "symbol")?.id;

    // 1️⃣ Create source + layer if missing
    if (!this.map.getSource(SOURCE_ID)) {
      this.map.addSource(SOURCE_ID, {
        type: "raster",
        tiles: [tileUrl],
        tileSize: 256,
      });

      this.map.addLayer(
        {
          id: LAYER_ID,
          type: "raster",
          source: SOURCE_ID,
          paint: {
            "raster-opacity": 1,
          },
        },
        before, // 🔥 ENSURE ABOVE BASEMAP
      );

      return;
    }

    // 2️⃣ Update tiles (date switch)
    const source = this.map.getSource(SOURCE_ID) as RasterTileSource;
    source.setTiles([tileUrl]);
  }

  clear() {
    if (this.map.getLayer(LAYER_ID)) {
      this.map.removeLayer(LAYER_ID);
    }
    if (this.map.getSource(SOURCE_ID)) {
      this.map.removeSource(SOURCE_ID);
    }
  }
}
