import AnalysisBase from "./AnalysisBase";
import DateRange from "./forms/DateRange";
import IndicesSelector from "./forms/IndicesSelector";
import LandSelection from "./LandSelection";

export default function Sidebar() {
  return (
    <div className="h-full w-full overflow-y-auto pr-1 lg:w-125">
      <div className="space-y-4">
        {/* <SatelliteSelector /> */}
        <LandSelection />
        <DateRange />
        <IndicesSelector />
        <AnalysisBase />
      </div>
    </div>
  );
}
