import type {
  Map as MapboxMap,
  RasterLayerSpecification,
  ImageSourceSpecification,
} from "mapbox-gl";

const SOURCE_ID = "ndvi-raster-source";
const LAYER_ID = "ndvi-raster-layer";

export class NdviRasterLayer {
  constructor(private map: MapboxMap) {}

  private toAbsoluteUrl(relativePath: string) {
    const apiBase = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

    return `${apiBase}/${relativePath.replace(/^\/+/, "")}`;
  }

  setImage(
    rasterPath: string, // 👈 IMPORTANT: comes from API response
    coordinates: [
      [number, number],
      [number, number],
      [number, number],
      [number, number],
    ],
  ) {
    const imageUrl = this.toAbsoluteUrl(rasterPath);
    console.log("NdviRasterLayer setImage", { imageUrl, coordinates });
    const source: ImageSourceSpecification = {
      type: "image",
      url: imageUrl,
      coordinates,
    };

    const before = this.map
      .getStyle()
      .layers?.find((l) => l.type === "symbol")?.id;

    if (!this.map.getSource(SOURCE_ID)) {
      this.map.addSource(SOURCE_ID, source);

      const layer: RasterLayerSpecification = {
        id: LAYER_ID,
        type: "raster",
        source: SOURCE_ID,
        paint: {
          "raster-opacity": 1,
        },
      };

      this.map.addLayer(layer, before);
      return;
    }

    const imgSource = this.map.getSource(SOURCE_ID) as mapboxgl.ImageSource;
    imgSource.updateImage({
      url: imageUrl,
      coordinates,
    });
  }

  clear() {
    if (this.map.getLayer(LAYER_ID)) {
      this.map.removeLayer(LAYER_ID);
    }
    if (this.map.getSource(SOURCE_ID)) {
      this.map.removeSource(SOURCE_ID);
    }
  }

  setOpacity(value: number) {
    if (!this.map.getLayer(LAYER_ID)) return;

    this.map.setPaintProperty(LAYER_ID, "raster-opacity", value);
  }
}
