import { LAND_SOURCE_ID } from "./landSource";
import type { FillLayerSpecification, LineLayerSpecification } from "mapbox-gl";

export const LAND_FILL_LAYER_ID = "land-fill";
export const LAND_LINE_LAYER_ID = "land-line";

/**
 * EOS-style:
 * - Polygon fill must NOT block raster
 * - Keep fill transparent
 */
export const landFillLayer: FillLayerSpecification = {
  id: LAND_FILL_LAYER_ID,
  type: "fill",
  source: LAND_SOURCE_ID,
  paint: {
    // 🔥 DO NOT COLOR POLYGON IN RASTER MODE
    "fill-color": "#000000",
    "fill-opacity": 0.0,
  },
};

/**
 * Strong visible boundary like EOS
 */
export const landLineLayer: LineLayerSpecification = {
  id: LAND_LINE_LAYER_ID,
  type: "line",
  source: LAND_SOURCE_ID,
  paint: {
    "line-color": "#ffffff",
    "line-width": 2,
  },
};
