import type { Analysis } from "../../api/analysis.api";

export function extractDailyNDVI(analysis: Analysis) {
  if (!analysis.result?.data) return [];

  return analysis.result.data.map((item) => ({
    date: item.interval.from.slice(0, 10),
    mean: item.outputs.ndvi.bands.B0.stats.mean,
  }));
}
