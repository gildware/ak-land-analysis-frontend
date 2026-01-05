import { Card } from "flowbite-react";
import { useLandStore } from "../../store/useLandStore";
import IndexButton from "./IndexButton";
import { VEGETATION_INDICES } from "../../vegetationIndices";

const IndicesSelector = () => {
  const selectedAnalysisIndices = useLandStore(
    (s) => s.selectedAnalysisIndices,
  );
  const toggleAnalysisIndex = useLandStore((s) => s.toggleAnalysisIndex);

  return (
    <Card>
      <b>Vegetation Indices</b>

      <div className="mt-3 flex flex-wrap gap-3">
        {VEGETATION_INDICES.map((index) => (
          <IndexButton
            key={index.key}
            label={index.label}
            description={index.description}
            active={selectedAnalysisIndices.includes(index.key)}
            onClick={() => toggleAnalysisIndex(index.key)}
          />
        ))}
      </div>
    </Card>
  );
};

export default IndicesSelector;
