import { useAnalysisStore } from "../../store/useAnalysisStore";

export default function DailyNDVITimeline() {
  const analyses = useAnalysisStore((s) => s.analyses);
  const selectedAnalysisId = useAnalysisStore((s) => s.selectedAnalysisId);
  const selectedDate = useAnalysisStore((s) => s.selectedAnalysisDate);
  const selectDate = useAnalysisStore((s) => s.selectAnalysisDate);

  if (!selectedAnalysisId) return null;

  const analysis = analyses.find((a) => a.id === selectedAnalysisId);
  const data = analysis?.result?.data;
  if (!data?.length) return null;

  const days = data
    .map((d) => {
      const mean = d.outputs?.ndvi?.bands?.B0?.stats?.mean;
      if (typeof mean !== "number") return null;
      return { date: d.interval.from.slice(0, 10), mean };
    })
    .filter(Boolean) as { date: string; mean: number }[];

  return (
    <div className="flex gap-2 py-2">
      {days.map((d) => {
        const active = selectedDate === d.date;

        return (
          <button
            key={d.date}
            onClick={() => selectDate(d.date)}
            className={`min-w-[72px] shrink-0 rounded px-2 py-1 text-xs transition ${
              active
                ? "bg-green-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            <div>{d.date}</div>
            <div className="font-semibold">{d.mean.toFixed(2)}</div>
          </button>
        );
      })}
    </div>
  );
}
