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
 * TYPES
 * ====================== */

interface NDVIStats {
  mean: number;
  min: number;
  max: number;
}

interface AnalysisInterval {
  from: string; // ISO date
}

interface AnalysisDataItem {
  interval: AnalysisInterval;
  outputs?: {
    ndvi?: {
      bands?: {
        B0?: {
          stats?: NDVIStats;
        };
      };
    };
  };
}

interface AnalysisResult {
  data?: AnalysisDataItem[];
}

interface Analysis {
  result?: AnalysisResult;
}

interface NDVIChartProps {
  analysis?: Analysis;
}

interface ChartPoint {
  date: string;
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
  if (!analysis?.result?.data?.length) {
    return <p>No NDVI data available</p>;
  }

  const chartData: ChartPoint[] = analysis.result.data
    .map((item): ChartPoint | null => {
      const stats = item.outputs?.ndvi?.bands?.B0?.stats;

      if (!stats || typeof stats.mean !== "number") return null;

      return {
        date: formatDate(item.interval.from),
        ndvi: Number(stats.mean.toFixed(3)),
        min: Number(stats.min.toFixed(3)),
        max: Number(stats.max.toFixed(3)),
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
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[-1, 1]} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="ndvi"
            stroke="#22c55e"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NDVIChart;
