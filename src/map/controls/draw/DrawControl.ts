import MapboxDraw from "@mapbox/mapbox-gl-draw";

export function createDrawControl() {
  return new MapboxDraw({
    displayControlsDefault: false,
    controls: {
      polygon: true,
      trash: true,
    },
  });
}
