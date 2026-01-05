import { Card, Select } from "flowbite-react";
import MapView from "./MapView";
import { useLandStore } from "../store/useLandStore";
import { VEGETATION_INDICES } from "../vegetationIndices";
import IndexButton from "./forms/IndexButton";
import LandSavePanel from "./forms/LandSavePanel";

export default function MapPanel() {
  const { lands, selectedLandId, selectLand, loading } = useLandStore();
  const selectedLand = useLandStore(
    (s) => s.lands.find((l) => l.id === s.selectedLandId) || null,
  );
  const startDate = useLandStore((s) => s.startDate);
  const endDate = useLandStore((s) => s.endDate);

  const selectedMapIndices = useLandStore((s) => s.selectedMapIndices);
  const toggleMapIndex = useLandStore((s) => s.toggleMapIndex);
  const canShowRaster = () => {
    return selectedLand && startDate && endDate;
  };
  return (
    <>
      <Card className="flex h-full flex-col shadow-lg">
        <Card className="flex h-15 shadow-lg">
          <div className="flex justify-between">
            <div className="mb-1 flex items-center justify-end gap-2">
              {selectedLand?.name && (
                <>
                  Currently Viewing :<b>{selectedLand?.name}</b>
                </>
              )}
            </div>
            <div className="mb-1 flex items-center justify-end gap-4">
              <div className="w-48">
                <Select
                  disabled={loading}
                  id="countries"
                  value={selectedLandId || ""}
                  onChange={(e) => {
                    const landId = e.target.value;
                    if (landId) {
                      selectLand(landId);
                    }
                  }}
                >
                  <option>Select Land</option>
                  {lands.map((land) => (
                    <option key={land.id} value={land.id}>
                      {land.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <LandSavePanel />
              </div>
            </div>
          </div>
        </Card>
        {/* Map fills remaining height */}
        <div className="flex flex-1 items-center justify-center rounded-lg bg-gray-200">
          <MapView />
        </div>
        <span>Select Index to View on Map</span>
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
        </div>
        {!canShowRaster() && (
          <small>
            Note: Please Select Land, Start Date & End Date to enable
          </small>
        )}
      </Card>
    </>
  );
}
