import type { TrainingRecordMode, TrainingRecordSource } from "@/data/userMock";

export type TrainingRecordsRange = "week" | "month" | "all";

export type RecordModeFilter = "all" | TrainingRecordMode;

export type MuscleZoneId =
  | "chest"
  | "core"
  | "arms"
  | "glutes"
  | "legs"
  | "back"
  | "rearShoulders"
  | "hamstrings";

export type MuscleLoadMap = Partial<Record<MuscleZoneId, number>>;

export type DatePeriod = {
  start: string;
  end: string;
};

export type ChartBucket = {
  key: string;
  label: string;
  start: string;
  end: string;
};

export type VolumeSeries = {
  strength: number[];
  pilates: number[];
  cardio: number[];
  movingAverage: number[];
  labels: string[];
};

export type QualitySeries = {
  scores: number[];
  labels: string[];
  hasData: boolean;
};

export type StructureSlice = {
  id: string;
  label: string;
  value: number;
  color: string;
};

export type StructureCharts = {
  source: StructureSlice[];
  mode: StructureSlice[];
  totalSessions: number;
};

export type MuscleHeatmapData = {
  load: Record<MuscleZoneId, number>;
  sessions: Record<MuscleZoneId, number>;
  maxLoad: number;
};

export type MetricTrend = "up" | "down" | "flat" | "new" | "empty";

export type PeriodMetricSummary = {
  value: number;
  previousValue: number;
  /** Absolute delta: current - previous. Null when comparison is unavailable. */
  changeValue: number | null;
  trend: MetricTrend;
};

export type PeriodSummary = {
  sessions: PeriodMetricSummary;
  durationSeconds: PeriodMetricSummary;
  capacityKg: PeriodMetricSummary;
  caloriesKcal: PeriodMetricSummary;
  /** e.g. 较上周 / 较上月 */
  compareLabel: string;
};

export type CalendarDay = {
  date: string;
  day: number;
  sessions: number;
  /** Up to 3 recent session modes for calendar dots (newest first). */
  modeMarks: TrainingRecordMode[];
};

export type PeriodStatsBundle = {
  period: DatePeriod;
  periodLabel: string;
  summary: PeriodSummary;
  volume: VolumeSeries;
  quality: QualitySeries;
  structure: StructureCharts;
  muscles: MuscleHeatmapData;
  /** Present only for month range. */
  calendar?: CalendarDay[];
};

export type ListFilterState = {
  source: "all" | TrainingRecordSource;
  mode: RecordModeFilter;
  startMonth?: string;
  endMonth?: string;
};
