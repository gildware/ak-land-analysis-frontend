import { Button } from "flowbite-react";
import { useLandStore } from "../store/useLandStore";
import { useAnalysisStore } from "../store/useAnalysisStore";
import { useEffect, useRef } from "react";

const AnalysisBase = () => {
  const selectedLand = useLandStore(
    (s) => s.lands.find((l) => l.id === s.selectedLandId) || null,
  );
  const startDate = useLandStore((s) => s.startDate);
  const endDate = useLandStore((s) => s.endDate);
  const selectedAnalysisIndices = useLandStore(
    (s) => s.selectedAnalysisIndices,
  );

  const canRunAnalysis = () => {
    return (
      selectedLand && startDate && endDate && selectedAnalysisIndices.length > 0
    );
  };
  const { runAnalysis, loadAnalyses } = useAnalysisStore();
  const pollingRef = useRef<number | null>(null);

  useEffect(() => {
    if (selectedLand) {
      loadAnalyses(selectedLand.id);
    }

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [selectedLand]);
  return (
    <div>
      <div className="flex justify-center text-center align-middle">
        <Button
          size="xl"
          className="w-full"
          color="green"
          disabled={!canRunAnalysis()}
          onClick={() => {
            runAnalysis({
              landId: selectedLand?.id,
              indexType: selectedAnalysisIndices[0],
              dateFrom: startDate,
              dateTo: endDate,
            } as any);
            // start polling analyses every 3s until none are pending
            if (selectedLand) {
              // clear existing poller if any
              if (pollingRef.current) {
                clearInterval(pollingRef.current);
                pollingRef.current = null;
              }

              // fetch immediately then poll
              loadAnalyses(selectedLand.id);
              pollingRef.current = window.setInterval(() => {
                loadAnalyses(selectedLand.id);
                const current = useAnalysisStore.getState().analyses;
                const hasPending = current?.some(
                  (a) =>
                    a.status === "pending" ||
                    a.status === "running" ||
                    a.status === "checking",
                );
                if (!hasPending && pollingRef.current) {
                  clearInterval(pollingRef.current);
                  pollingRef.current = null;
                }
              }, 3000) as unknown as number;
            }
          }}
        >
          Run Analysis
        </Button>
      </div>
      {!canRunAnalysis() && (
        <small>
          Note: Please Select Land, Start Date, End Date and Index to enable
        </small>
      )}
    </div>
  );
};

export default AnalysisBase;
