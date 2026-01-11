export interface DailyNDVI {
  date: string; // YYYY-MM-DD
  mean: number; // 0 → 1
  min?: number;
  max?: number;
}
