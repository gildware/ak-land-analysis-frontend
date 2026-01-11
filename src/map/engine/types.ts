import type { Map as MapboxMap } from "mapbox-gl";

export type MapEngine = {
  createMap: (options: {
    container: HTMLElement;
    style: string;
    center: [number, number];
    zoom: number;
    bearing?: number;
    pitch?: number;
  }) => MapboxMap;
};
