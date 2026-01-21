import { useEffect, useRef } from "react";
import { useAnalysisStore } from "../../store/useAnalysisStore";

const FRAME_MS = 900;

export default function DailyNDVITimeline() {
  /* ───────────── hooks (ALWAYS run) ───────────── */

  const analyses = useAnalysisStore((s) => s.analyses);
  const selectedAnalysisId = useAnalysisStore((s) => s.selectedAnalysisId);
  const selectedDate = useAnalysisStore((s) => s.selectedAnalysisDate);

  const selectDate = useAnalysisStore((s) => s.selectAnalysisDate);
  const isPlaying = useAnalysisStore((s) => s.isPlaying);
  const play = useAnalysisStore((s) => s.play);
  const stop = useAnalysisStore((s) => s.stop);

  const timerRef = useRef<number | null>(null);

  /* ───────────── derived data ───────────── */

  const analysis = selectedAnalysisId
    ? analyses.find((a) => a.id === selectedAnalysisId)
    : null;

  const days = analysis?.daily?.filter((d) => d.raster?.png) ?? [];

  /* ───────────── animation effect ───────────── */

  useEffect(() => {
    if (!isPlaying || days.length === 0) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    let index = days.findIndex((d) => d.date === selectedDate);
    if (index < 0) index = -1;

    timerRef.current = window.setInterval(() => {
      index += 1;

      if (index >= days.length) {
        stop();
        return;
      }

      selectDate(days[index].date);
    }, FRAME_MS);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPlaying, days, selectedDate, selectDate, stop]);

  /* ───────────── render guards (AFTER hooks) ───────────── */

  if (!selectedAnalysisId || days.length === 0) return null;

  /* ───────────── UI ───────────── */

  return (
    <div className="flex items-center gap-2 py-2">
      {/* ▶️ Play / Stop */}
      <button
        onClick={() => (isPlaying ? stop() : play())}
        className={`rounded px-3 py-1 text-xs font-semibold ${
          isPlaying ? "bg-red-500 text-white" : "bg-green-600 text-white"
        }`}
      >
        {isPlaying ? "Stop" : "Play"}
      </button>

      {/* Dates */}
      <div className="flex gap-2 overflow-x-auto">
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
              {typeof d.stats?.mean === "number" && (
                <div className="font-semibold">{d.stats.mean.toFixed(2)}</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// import { useAnalysisStore } from "../../store/useAnalysisStore";

// export default function DailyNDVITimeline() {
//   const analyses = useAnalysisStore((s) => s.analyses);
//   const selectedAnalysisId = useAnalysisStore((s) => s.selectedAnalysisId);
//   const selectedDate = useAnalysisStore((s) => s.selectedAnalysisDate);
//   const selectDate = useAnalysisStore((s) => s.selectAnalysisDate);

//   if (!selectedAnalysisId) return null;

//   const analysis = analyses.find((a) => a.id === selectedAnalysisId);
//   if (!analysis?.daily?.length) return null;

//   // ✅ ONLY days with raster
//   const days = analysis.daily
//     .filter((d) => d.raster?.png)
//     .map((d) => ({
//       date: d.date,
//       mean: d.stats?.mean,
//     }));

//   if (days.length === 0) return null;

//   return (
//     <div className="flex gap-2 py-2">
//       {days.map((d) => {
//         const active = selectedDate === d.date;

//         return (
//           <button
//             key={d.date}
//             onClick={() => selectDate(d.date)}
//             className={`min-w-[72px] shrink-0 rounded px-2 py-1 text-xs transition ${
//               active
//                 ? "bg-green-600 text-white"
//                 : "bg-gray-200 hover:bg-gray-300"
//             }`}
//           >
//             <div>{d.date}</div>
//             {typeof d.mean === "number" && (
//               <div className="font-semibold">{d.mean.toFixed(2)}</div>
//             )}
//           </button>
//         );
//       })}
//     </div>
//   );
// }
