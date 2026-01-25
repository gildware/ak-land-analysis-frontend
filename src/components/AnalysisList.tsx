import { FiChevronDown } from "react-icons/fi";
import StatusBadge from "./StatusBadge";
import { useAnalysisStore } from "../store/useAnalysisStore";
import { useEffect, useState } from "react";
import VegetationIndexChart from "./charts/VegetationIndexChart";

export function AnalysisList({ analyses }: any) {
  const selectAnalysis = useAnalysisStore((s) => s.selectAnalysis);
  const selectedAnalysisId = useAnalysisStore((s) => s.selectedAnalysisId);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (analyses.length > 0) {
      selectAnalysis(analyses[0].id);
    }
  }, [analyses]);

  const selectedAnalysis = analyses.find(
    (a: any) => a.id === selectedAnalysisId,
  );

  function formatDate(dateString: any) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <>
      <h2>Analysis Reports</h2>

      {/* ACCORDION */}
      <div className="rounded-lg border bg-white">
        {/* HEADER */}
        <button
          onClick={() => setOpen(!open)}
          className="flex w-full items-center justify-between px-4 py-3 text-left"
        >
          {selectedAnalysis ? (
            <div className="flex w-full items-center gap-3">
              <span className="flex-1 truncate font-medium text-gray-700">
                <b>{selectedAnalysis.indexType}</b>{" "}
                <small>
                  ({formatDate(selectedAnalysis.dateFrom)} -{" "}
                  {formatDate(selectedAnalysis.dateTo)})
                </small>
              </span>
              <StatusBadge status={selectedAnalysis.status} />
            </div>
          ) : (
            <span>Select analysis</span>
          )}

          {/* ARROW */}
          <FiChevronDown
            className={`ml-2 text-xl transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* CONTENT */}
        {open && (
          <div className="border-t">
            <ul className="divide-y">
              {analyses.map((analysis: any) => (
                <li
                  key={analysis.id}
                  onClick={() => {
                    selectAnalysis(analysis.id);
                    setOpen(false); // close accordion
                  }}
                  className="flex cursor-pointer items-center justify-between px-4 py-2 hover:bg-gray-100"
                >
                  <span>
                    <b>{analysis.indexType}</b>{" "}
                    <small>
                      ({formatDate(analysis.dateFrom)} -{" "}
                      {formatDate(analysis.dateTo)})
                    </small>
                  </span>
                  <StatusBadge status={analysis.status} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* CHART */}
      {selectedAnalysis && (
        <div className="mt-4">
          <VegetationIndexChart analysis={selectedAnalysis} />
        </div>
      )}
    </>
  );
}

// import {
//   Accordion,
//   AccordionContent,
//   AccordionPanel,
//   AccordionTitle,
// } from "flowbite-react";
// import StatusBadge from "./StatusBadge";
// import { useAnalysisStore } from "../store/useAnalysisStore";
// import { useEffect } from "react";
// import VegetationIndexChart from "./charts/VegetationIndexChart";

// export function AnalysisList({ analyses }: any) {
//   useEffect(() => {
//     console.log("Analyses updated:", analyses);
//     if (analyses.length > 0) {
//       console.log("First analysis:", analyses[0]);
//       selectAnalysis(analyses[0].id);
//     }
//   }, [analyses]);
//   const selectAnalysis = useAnalysisStore((s) => s.selectAnalysis);
//   function formatDate(dateString: any) {
//     if (!dateString) return "";

//     const date = new Date(dateString);

//     return date.toLocaleDateString("en-GB", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   }
//   return (
//     <>
//       <h2>Analysis Reports</h2>
//       <Accordion collapseAll>
//         {analyses.map((analysis: any) => (
//           <AccordionPanel key={analysis.id}>
//             <AccordionTitle>
//               <div
//                 className="flex w-92 items-center gap-3"
//                 onClick={() => selectAnalysis(analysis.id)}
//               >
//                 {/* Left text takes all available space */}
//                 <span className="flex-1 truncate font-medium text-gray-700">
//                   <b>{analysis.indexType}</b> (
//                   <small>
//                     {formatDate(analysis.dateFrom)} -{" "}
//                     {formatDate(analysis.dateTo)}
//                   </small>
//                   )
//                 </span>

//                 {/* Badge stays at the far right (before chevron) */}
//                 <StatusBadge status={analysis.status} />
//               </div>
//             </AccordionTitle>
//             <AccordionContent>
//               <VegetationIndexChart analysis={analysis} />
//               {/* <NDVIChart analysis={analysis} /> */}
//             </AccordionContent>
//           </AccordionPanel>
//         ))}
//       </Accordion>
//     </>
//   );
// }
