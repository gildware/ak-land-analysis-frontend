import type { ApiLand } from "../../api/land.api";
import type { Land } from "./Land";
import { getAreaSqm } from "./landMetrics";

export function apiLandToDomain(apiLand: ApiLand): Land {
  return {
    ...apiLand,
    areaSqm: getAreaSqm(apiLand.geometry),
  };
}
