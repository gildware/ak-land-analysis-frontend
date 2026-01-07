import { Map } from "mapbox-gl";
import { INDEX_HANDLERS } from "../layers/indexRegistry";

export function useIndexLayers(
  map: Map | null,
  indices: string[],
  payload: any,
) {
  if (!map) return;

  Object.entries(INDEX_HANDLERS).forEach(([key, handler]) => {
    if (indices.includes(key)) handler(map, payload[key]);
    else handler(map);
  });
}
