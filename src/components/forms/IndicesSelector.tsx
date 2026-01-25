import { Select } from "flowbite-react";
import { useLandStore } from "../../store/useLandStore";
import { VEGETATION_INDICES } from "../../vegetationIndices";

const IndicesSelector = () => {
  const selectedAnalysisIndices = useLandStore(
    (s) => s.selectedAnalysisIndices,
  );
  const toggleAnalysisIndex = useLandStore((s) => s.toggleAnalysisIndex);

  const handleChange = (e: any) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(
      (opt: any) => opt.value,
    );

    // toggle based on diff
    VEGETATION_INDICES.forEach((index) => {
      const isSelected = selectedOptions.includes(index.key);
      const isActive = selectedAnalysisIndices.includes(index.key);

      if (isSelected !== isActive) {
        toggleAnalysisIndex(index.key);
      }
    });
  };

  return (
    <div>
      <b>Vegetation Indices</b>

      <div className="mt-3">
        <Select value={selectedAnalysisIndices} onChange={handleChange}>
          <option key="index">Select Index</option>
          {VEGETATION_INDICES.map((index) => (
            <option key={index.key} value={index.key}>
              {index.label}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
};

export default IndicesSelector;

// import { Card } from "flowbite-react";
// import { useLandStore } from "../../store/useLandStore";
// import IndexButton from "./IndexButton";
// import { VEGETATION_INDICES } from "../../vegetationIndices";

// const IndicesSelector = () => {
//   const selectedAnalysisIndices = useLandStore(
//     (s) => s.selectedAnalysisIndices,
//   );
//   const toggleAnalysisIndex = useLandStore((s) => s.toggleAnalysisIndex);

//   return (
//     <Card>
//       <b>Vegetation Indices</b>

//       <div className="mt-3 flex flex-wrap gap-3">
//         {VEGETATION_INDICES.map((index) => (
//           <IndexButton
//             key={index.key}
//             label={index.label}
//             description={index.description}
//             active={selectedAnalysisIndices.includes(index.key)}
//             onClick={() => toggleAnalysisIndex(index.key)}
//           />
//         ))}
//       </div>
//     </Card>
//   );
// };

// export default IndicesSelector;
