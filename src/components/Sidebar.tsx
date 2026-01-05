import Analysis from "./Analysis";
import DateRange from "./forms/DateRange";
import IndicesSelector from "./forms/IndicesSelector";

export default function Sidebar() {
  return (
    <div className="h-full w-full overflow-y-auto pr-1 lg:w-125">
      <div className="space-y-4">
        {/* <SatelliteSelector /> */}
        <DateRange />
        <IndicesSelector />
        <Analysis />
      </div>
    </div>
  );
}
