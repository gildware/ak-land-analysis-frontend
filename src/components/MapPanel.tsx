import { Card } from "flowbite-react";
import { useLandStore } from "../store/useLandStore";
import { VEGETATION_INDICES } from "../vegetationIndices";
import IndexButton from "./forms/IndexButton";
import DailyNDVITimeline from "./analysis/DailyNDVITimeline";
import MapCanvas from "../map/MapCanvas";
import { sqmToHectares } from "../domain/land/landMetrics";
import { useEffect } from "react";
import NDVILegend from "./NDVILegend";

export default function MapPanel() {
  const selectedLand = useLandStore(
    (s) => s.lands.find((l) => l.id === s.selectedLandId) || null,
  );
  const selectedLandId = useLandStore((s) => s.selectedLandId);
  const startDate = useLandStore((s) => s.startDate);
  const endDate = useLandStore((s) => s.endDate);

  const selectedMapIndices = useLandStore((s) => s.selectedMapIndices);
  const toggleMapIndex = useLandStore((s) => s.toggleMapIndex);
  const canShowRaster = () => {
    return selectedLand && startDate && endDate;
  };
  const draftGeometry = useLandStore((s) => s.draftGeometry);

  return (
    <>
      <Card className="flex h-full min-w-0 flex-col overflow-hidden shadow-lg">
        <div className="flex flex-1 items-center justify-center rounded-lg bg-gray-200">
          <MapCanvas />
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
        {/* <span>Select Index to View on Map</span>
        <div className="flex flex-wrap gap-3">
          {VEGETATION_INDICES.map((index) => (
            <IndexButton
              key={index.key}
              label={index.label}
              disabled={!canShowRaster()}
              description={index.description}
              active={selectedMapIndices.includes(index.key)}
              onClick={() => toggleMapIndex(index.key)}
            />
          ))}
        </div> */}
        <NDVILegend />
        <div className="mr-2 w-full min-w-0 overflow-x-auto overflow-y-hidden">
          <DailyNDVITimeline />
        </div>
        {/* {!canShowRaster() && (
          <small>
            Note: Please Select Land, Start Date & End Date to enable
          </small>
        )} */}
      </Card>
    </>
  );
}
