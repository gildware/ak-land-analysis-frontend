import {
  Accordion,
  AccordionContent,
  AccordionPanel,
  AccordionTitle,
} from "flowbite-react";
import StatusBadge from "./StatusBadge";
import NDVIChart from "./charts/NDVIChart";
import { useAnalysisStore } from "../store/useAnalysisStore";

export function AnalysisList({ analyses }: any) {
  const selectAnalysis = useAnalysisStore((s) => s.selectAnalysis);
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
      <Accordion collapseAll>
        {analyses.map((analysis: any) => (
          <AccordionPanel key={analysis.id}>
            <AccordionTitle>
              <div
                className="flex w-92 items-center gap-3"
                onClick={() => selectAnalysis(analysis.id)}
              >
                {/* Left text takes all available space */}
                <span className="flex-1 truncate font-medium text-gray-700">
                  <b>{analysis.indexType}</b> (
                  <small>
                    {formatDate(analysis.dateFrom)} -{" "}
                    {formatDate(analysis.dateTo)}
                  </small>
                  )
                </span>

                {/* Badge stays at the far right (before chevron) */}
                <StatusBadge status={analysis.status} />
              </div>
            </AccordionTitle>
            <AccordionContent>
              <NDVIChart analysis={analysis} />
            </AccordionContent>
          </AccordionPanel>
        ))}
      </Accordion>
    </>
  );
}
