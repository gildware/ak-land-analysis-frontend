import { useAnalysisStore } from "../store/useAnalysisStore";
import { AnalysisList } from "./AnalysisList";
import { Card } from "flowbite-react";

const AnanlysisListCard = () => {
  const { analyses } = useAnalysisStore();
  return (
    <>
      {analyses && analyses.length > 0 && (
        <Card>
          <AnalysisList analyses={analyses} />
        </Card>
      )}
    </>
  );
};

export default AnanlysisListCard;
