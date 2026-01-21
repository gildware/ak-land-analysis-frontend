import { Card } from "flowbite-react";
import { useLandStore } from "../store/useLandStore";
import { useAnalysisStore } from "../store/useAnalysisStore";
import DailyNDVITimeline from "./analysis/DailyNDVITimeline";
import MapCanvas from "../map/MapCanvas";
import { sqmToHectares } from "../domain/land/landMetrics";
import IndexLegend from "./IndexLegend";

export default function MapPanel() {
  const selectedLand = useLandStore(
    (s) => s.lands.find((l) => l.id === s.selectedLandId) || null,
  );

  const draftGeometry = useLandStore((s) => s.draftGeometry);

  const analyses = useAnalysisStore((s) => s.analyses);
  const selectedAnalysisId = useAnalysisStore((s) => s.selectedAnalysisId);

  const opacity = useAnalysisStore((s) => s.ndviOpacity);
  const setOpacity = useAnalysisStore((s) => s.setNdviOpacity);

  const selectedAnalysis = analyses.find((a) => a.id === selectedAnalysisId);

  const indexType = selectedAnalysis?.indexType;

  return (
    <Card className="flex h-full min-w-0 flex-col overflow-hidden shadow-lg">
      {/* MAP */}
      <div className="flex flex-1 items-center justify-center rounded-lg bg-gray-200">
        <MapCanvas />
      </div>

      {/* OPACITY */}
      {indexType && (
        <div className="mt-2">
          <label className="mb-1 block text-xs text-gray-600">
            {indexType} Opacity
          </label>

          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={opacity}
            onChange={(e) => setOpacity(Number(e.target.value))}
            className="w-full"
          />
        </div>
      )}

      {/* AREA */}
      {selectedLand && (
        <div className="mt-2 text-sm text-gray-700">
          Area:{" "}
          <b>
            {(selectedLand.areaSqm
              ? sqmToHectares(selectedLand.areaSqm)
              : 0
            ).toFixed(2)}{" "}
            ha
          </b>
        </div>
      )}

      {draftGeometry && (
        <div className="mt-2 text-sm text-blue-700">
          Draft Area: <b>{(draftGeometry.areaSqm / 10_000).toFixed(2)} ha</b>
        </div>
      )}

      {/* LEGEND */}
      {indexType && <IndexLegend indexType={indexType} />}

      {/* TIMELINE (NO OVERFLOW) */}
      <div
        className="relative -mx-3 mt-2 overflow-x-auto px-3"
        style={{ maxWidth: 910 }}
      >
        <div className="min-w-max">
          <DailyNDVITimeline />
        </div>
      </div>
    </Card>
  );
}
