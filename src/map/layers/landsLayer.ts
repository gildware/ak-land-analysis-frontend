import { Map, GeoJSONSource } from "mapbox-gl";

export const SOURCE_ID = "lands-source";
export const FILL_ID = "lands-fill";
export const LINE_ID = "lands-line";

export function initLandsLayer(map: Map) {
  map.addSource(SOURCE_ID, {
    type: "geojson",
    data: { type: "FeatureCollection", features: [] },
  });

  const before = map.getStyle().layers?.find(l => l.type === "symbol")?.id;

  map.addLayer(
    {
      id: FILL_ID,
      type: "fill",
      source: SOURCE_ID,
      paint: {
        "fill-color": "#22c55e",
        "fill-opacity": 0.4,
      },
    },
    before,
  );

  map.addLayer(
    {
      id: LINE_ID,
      type: "line",
      source: SOURCE_ID,
      paint: {
        "line-color": "#14532d",
        "line-width": 2,
      },
    },
    before,
  );
}

export function updateLands(
  map: Map,
  features: GeoJSON.Feature[],
  selectedId?: string,
) {
  const source = map.getSource(SOURCE_ID) as GeoJSONSource;
  source.setData({ type: "FeatureCollection", features });

  if (!selectedId) {
    map.setFilter(FILL_ID, null);
    map.setFilter(LINE_ID, null);
  } else {
    const filter: any = ["==", ["get", "id"], selectedId];
    map.setFilter(FILL_ID, filter);
    map.setFilter(LINE_ID, filter);
  }
}
