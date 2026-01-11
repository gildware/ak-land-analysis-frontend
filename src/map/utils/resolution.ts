const EARTH_RADIUS = 6378137;
const TILE_SIZE = 512;

export function metersPerPixel(latitude: number, zoom: number): number {
  const latRad = (latitude * Math.PI) / 180;

  return (
    (Math.cos(latRad) * 2 * Math.PI * EARTH_RADIUS) /
    (TILE_SIZE * Math.pow(2, zoom))
  );
}
