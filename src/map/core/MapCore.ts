import type { Map } from "mapbox-gl";
import type { MapEngine } from "../engine/types";
import { MAP_CONFIG } from "./mapConfig";
import { metersPerPixel } from "../utils/resolution";

export class MapCore {
  private map: Map | null = null;
  private isLoaded = false;
  private readyCallbacks: Array<(map: Map) => void> = [];

  private resolutionCallbacks: Array<(mpp: number) => void> = [];

  constructor(private engine: MapEngine) {}

  create(container: HTMLElement) {
    if (this.map) return this.map;

    this.map = this.engine.createMap({
      container,
      ...MAP_CONFIG,
    });

    this.map.on("load", () => {
      this.isLoaded = true;
      this.readyCallbacks.forEach((cb) => cb(this.map!));
      this.readyCallbacks = [];

      // Track resolution changes
      this.map!.on("move", () => this.emitResolution());
      this.emitResolution();
    });

    return this.map;
  }

  private emitResolution() {
    if (!this.map) return;

    const center = this.map.getCenter();
    const zoom = this.map.getZoom();

    const mpp = metersPerPixel(center.lat, zoom);
    this.resolutionCallbacks.forEach((cb) => cb(mpp));
  }

  onResolutionChange(cb: (metersPerPixel: number) => void) {
    this.resolutionCallbacks.push(cb);
  }

  onReady(cb: (map: Map) => void) {
    if (this.isLoaded && this.map) {
      cb(this.map);
    } else {
      this.readyCallbacks.push(cb);
    }
  }

  destroy() {
    if (this.map) {
      this.map.remove();
      this.map = null;
      this.isLoaded = false;
      this.readyCallbacks = [];
      this.resolutionCallbacks = [];
    }
  }
}
