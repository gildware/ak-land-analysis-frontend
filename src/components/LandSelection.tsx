import { Card, Select } from "flowbite-react";
import LandSavePanel from "./forms/LandSavePanel";
import { useLandStore } from "../store/useLandStore";

const LandSelection = () => {
  const { lands, selectedLandId, selectLand, loading } = useLandStore();
  const selectedLand = useLandStore(
    (s) => s.lands.find((l) => l.id === s.selectedLandId) || null,
  );
  return (
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
  );
};

export default LandSelection;
