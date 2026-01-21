import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

/* ======================
 * TYPES (UPDATED)
 * ====================== */

interface NDVIStats {
  mean: number;
  min: number;
  max: number;
}

interface AnalysisResultItem {
  date: string; // ISO string
  value: NDVIStats | null;
}

interface Analysis {
  result?: AnalysisResultItem[];
}

interface NDVIChartProps {
  analysis?: Analysis;
}

interface ChartPoint {
  date: string; // formatted label
  rawDate: string; // YYYY-MM-DD
  ndvi: number;
  min: number;
  max: number;
}

/* ======================
 * HELPERS
 * ====================== */

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
}

/* ======================
 * COMPONENT
 * ====================== */

const NDVIChart = ({ analysis }: NDVIChartProps) => {
  console.log("NDVIChart received analysis:", analysis);

  if (!analysis?.result?.length) {
    return <p>No NDVI data available</p>;
  }

  const chartData: ChartPoint[] = analysis.result
    .map((item): ChartPoint | null => {
      if (!item.value || typeof item.value.mean !== "number") {
        return null;
      }

      return {
        date: formatDate(item.date),
        rawDate: item.date.slice(0, 10), // YYYY-MM-DD
        ndvi: Number(item.value.mean.toFixed(3)),
        min: Number(item.value.min.toFixed(3)),
        max: Number(item.value.max.toFixed(3)),
      };
    })
    .filter((item): item is ChartPoint => item !== null);

  if (!chartData.length) {
    return <p>No valid NDVI values for selected period</p>;
  }

  return (
    <div style={{ width: "100%", height: 280 }}>
      <h4 style={{ marginBottom: 8 }}>NDVI Trend</h4>

      <ResponsiveContainer>
        <LineChart
          data={chartData}
          // onClick={(e) => {
          //   if (!e || e.activeIndex == null) return;

          //   const point = chartData[e.activeIndex];
          //   if (!point) return;

          //   console.log("Clicked NDVI day:", point.rawDate);
          //   selectDate(point.rawDate); // YYYY-MM-DD
          // }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[-1, 1]} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="ndvi"
            stroke="#22c55e"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NDVIChart;
