export type IndexType = "NDVI" | "EVI" | "SAVI" | "NDWI";

export const INDEX_COLOR_SCALES: Record<
  IndexType,
  { value: number; color: string; label: string }[]
> = {
  NDVI: [
    { value: -1, color: "#FF0000", label: "No vegetation / Water" },
    { value: 0.0, color: "#FFFF00", label: "Bare soil" },
    { value: 0.2, color: "#90EE90", label: "Sparse vegetation" },
    { value: 0.4, color: "#008000", label: "Moderate vegetation" },
    { value: 0.6, color: "#006400", label: "Healthy vegetation" },
  ],

  EVI: [
    { value: -1, color: "#8B0000", label: "Very low vegetation" },
    { value: 0.0, color: "#FFA500", label: "Low vegetation" },
    { value: 0.2, color: "#9ACD32", label: "Moderate vegetation" },
    { value: 0.4, color: "#228B22", label: "Healthy vegetation" },
    { value: 0.6, color: "#006400", label: "Dense vegetation" },
  ],

  SAVI: [
    { value: -1, color: "#A52A2A", label: "Bare soil" },
    { value: 0.0, color: "#DEB887", label: "Sparse cover" },
    { value: 0.2, color: "#ADFF2F", label: "Moderate cover" },
    { value: 0.4, color: "#32CD32", label: "Healthy cover" },
    { value: 0.6, color: "#006400", label: "Dense cover" },
  ],

  NDWI: [
    { value: -1, color: "#8B4513", label: "Dry land" },
    { value: 0.0, color: "#F4A460", label: "Low moisture" },
    { value: 0.2, color: "#87CEEB", label: "Moist soil" },
    { value: 0.4, color: "#1E90FF", label: "Water present" },
    { value: 0.6, color: "#00008B", label: "High water content" },
  ],
};
