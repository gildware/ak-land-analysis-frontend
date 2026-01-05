declare module "@mapbox/mapbox-gl-draw" {
  import type { IControl } from "mapbox-gl";

  export default class MapboxDraw implements IControl {
    constructor(options?: any);

    onAdd(map: any): HTMLElement;
    onRemove(): void;

    getAll(): {
      type: "FeatureCollection";
      features: any[];
    };

    deleteAll(): void;
  }
}
