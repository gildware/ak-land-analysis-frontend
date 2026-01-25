import { Card } from "flowbite-react";
import AnalysisBase from "./AnalysisBase";
import DateRange from "./forms/DateRange";
import IndicesSelector from "./forms/IndicesSelector";
import LandSelection from "./LandSelection";
import AnanlysisListCard from "./AnanlysisListCard";

export default function Sidebar() {
  return (
    <div className="h-full w-full overflow-y-auto pr-1 lg:w-125">
      <div className="space-y-4">
        <Card>
          <LandSelection />
          <DateRange />
          <IndicesSelector />
          <AnalysisBase />
        </Card>

        <AnanlysisListCard />
      </div>
    </div>
  );
}
