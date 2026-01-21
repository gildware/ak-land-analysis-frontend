import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useAnalysisStore } from "../../store/useAnalysisStore";

/* ======================
 * TYPES
 * ====================== */

interface IndexStats {
  mean: number;
  min: number;
  max: number;
}

interface AnalysisResultItem {
  date: string;
  value: IndexStats | null;
}

interface Analysis {
  indexType: string;
  result?: AnalysisResultItem[];
}

interface ChartPoint {
  date: string;
  rawDate: string;
  value: number;
  min: number;
  max: number;
}

/* ======================
 * CONFIG BY INDEX
 * ====================== */

const INDEX_CONFIG: Record<
  string,
  { label: string; color: string; domain: [number, number] }
> = {
  NDVI: { label: "NDVI", color: "#22c55e", domain: [-1, 1] },
  EVI: { label: "EVI", color: "#16a34a", domain: [-1, 1] },
  SAVI: { label: "SAVI", color: "#15803d", domain: [-1, 1] },
  NDWI: { label: "NDWI", color: "#0ea5e9", domain: [-1, 1] },
};

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

const VegetationIndexChart = ({ analysis }: { analysis?: Analysis }) => {
  const selectDate = useAnalysisStore((s) => s.selectAnalysisDate);

  if (!analysis?.result?.length) {
    return <p>No data available</p>;
  }

  const config = INDEX_CONFIG[analysis.indexType] ?? INDEX_CONFIG["NDVI"]; // fallback

  const chartData: ChartPoint[] = analysis.result
    .map((item): ChartPoint | null => {
      if (!item.value || typeof item.value.mean !== "number") {
        return null;
      }

      return {
        date: formatDate(item.date),
        rawDate: item.date.slice(0, 10),
        value: Number(item.value.mean.toFixed(3)),
        min: Number(item.value.min.toFixed(3)),
        max: Number(item.value.max.toFixed(3)),
      };
    })
    .filter(Boolean) as ChartPoint[];

  if (!chartData.length) {
    return <p>No valid values for selected period</p>;
  }

  return (
    <div style={{ width: "100%", height: 280 }}>
      <h4 style={{ marginBottom: 8 }}>{config.label} Trend</h4>

      <ResponsiveContainer>
        <LineChart
          data={chartData}
          onClick={(e) => {
            if (!e || e.activeIndex == null) return;
            const point = chartData[e.activeIndex];
            if (!point) return;
            selectDate(point.rawDate);
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={config.domain} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke={config.color}
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VegetationIndexChart;
