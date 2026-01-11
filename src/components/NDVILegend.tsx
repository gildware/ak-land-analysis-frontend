// NDVILegend.tsx

import { NDVI_COLOR_SCALE } from "./ NDVIColorScale";

export default function NDVILegend() {
  return (
    <div className="mt-3">
      <div className="mb-1 flex justify-between text-xs text-gray-600">
        <span>Low</span>
        <span>High</span>
      </div>

      {/* Color bar */}
      <div className="flex h-3 w-full overflow-hidden rounded">
        {NDVI_COLOR_SCALE.map((stop, i) => (
          <div
            key={i}
            className="flex-1"
            style={{ backgroundColor: stop.color }}
          />
        ))}
      </div>

      {/* Tick labels */}
      <div className="mt-1 flex justify-between text-[10px] text-gray-500">
        {NDVI_COLOR_SCALE.map((stop) => (
          <span key={stop.value}>{stop.value}</span>
        ))}
      </div>
    </div>
  );
}
