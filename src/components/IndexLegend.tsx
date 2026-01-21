import { INDEX_COLOR_SCALES } from "../utils/indexColorScales";

export default function IndexLegend({ indexType }: { indexType: string }) {
  const scale =
    INDEX_COLOR_SCALES[indexType as keyof typeof INDEX_COLOR_SCALES];

  if (!scale) return null;

  return (
    <div className="mt-3">
      {/* Low / High */}
      <div className="mb-1 flex justify-between text-xs text-gray-600">
        <span>Low</span>
        <span>High</span>
      </div>

      {/* Color bar */}
      <div className="flex h-3 overflow-hidden rounded">
        {scale.map((s, i) => (
          <div
            key={i}
            className="flex-1"
            style={{ backgroundColor: s.color }}
          />
        ))}
      </div>

      {/* Labels */}
      <div className="mt-1 flex text-[10px] text-gray-600">
        {scale.map((s, i) => (
          <div key={i} className="flex-1 text-center leading-tight">
            {s.label}
          </div>
        ))}
      </div>
    </div>
  );
}
