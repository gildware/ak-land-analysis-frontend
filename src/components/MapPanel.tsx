import { Card } from "flowbite-react";
import { useLandStore } from "../store/useLandStore";
import DailyNDVITimeline from "./analysis/DailyNDVITimeline";
import MapCanvas from "../map/MapCanvas";
import { sqmToHectares } from "../domain/land/landMetrics";
import NDVILegend from "./NDVILegend";
import { useAnalysisStore } from "../store/useAnalysisStore";

export default function MapPanel() {
  const selectedLand = useLandStore(
    (s) => s.lands.find((l) => l.id === s.selectedLandId) || null,
  );
  const draftGeometry = useLandStore((s) => s.draftGeometry);
  const ndviOpacity = useAnalysisStore((s) => s.ndviOpacity);
  const setNdviOpacity = useAnalysisStore((s) => s.setNdviOpacity);
  return (
    <>
      <Card className="flex h-full min-w-0 flex-col overflow-hidden shadow-lg">
        <div className="flex flex-1 items-center justify-center rounded-lg bg-gray-200">
          <MapCanvas />
        </div>
        <div className="mt-2">
          <label className="mb-1 block text-xs text-gray-600">
            NDVI Opacity
          </label>

          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={ndviOpacity}
            onChange={(e) => setNdviOpacity(Number(e.target.value))}
            className="w-full"
          />
        </div>
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
        <NDVILegend />

        <div
          className="relative -mx-3 mt-2 overflow-x-auto px-3"
          style={{ maxWidth: 910 }}
        >
          <div className="min-w-max">
            <DailyNDVITimeline />
          </div>
        </div>
      </Card>
    </>
  );
}
