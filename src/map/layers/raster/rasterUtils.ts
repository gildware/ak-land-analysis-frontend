export function rasterSourceId(indexId: string) {
  return `raster-source-${indexId}`;
}

export function rasterLayerId(indexId: string) {
  return `raster-layer-${indexId}`;
}

export function buildTileUrl(
  baseUrl: string,
  indexId: string,
  landId: string,
  startDate: string,
  endDate: string,
) {
  return `${baseUrl}/api/tiles/${indexId.toLowerCase()}/${landId}/{z}/{x}/{y}.png?dateFrom=${startDate}&dateTo=${endDate}`;
}
