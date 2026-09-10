import {
  TrainingRecord,
  TrainingRecordMode,
  TrainingRecordSource,
} from "@/data/userMock";
import { formatIsoDate, parseIsoDate } from "@/utils/dailyStats";
import type {
  CalendarDay,
  ChartBucket,
  DatePeriod,
  ListFilterState,
  MuscleHeatmapData,
  MuscleLoadMap,
  MuscleZoneId,
  PeriodMetricSummary,
  PeriodStatsBundle,
  PeriodSummary,
  QualitySeries,
  StructureCharts,
  StructureSlice,
  TrainingRecordsRange,
  VolumeSeries,
} from "@/types/trainingRecord";

export const MUSCLE_ZONE_IDS: MuscleZoneId[] = [
  "chest",
  "core",
  "arms",
  "glutes",
  "legs",
  "back",
  "rearShoulders",
  "hamstrings",
];

export const FRONT_MUSCLE_IDS: MuscleZoneId[] = ["chest", "core", "arms", "glutes", "legs"];
export const BACK_MUSCLE_IDS: MuscleZoneId[] = ["back", "rearShoulders", "hamstrings"];

export const MUSCLE_LABELS: Record<MuscleZoneId, string> = {
  chest: "胸部",
  core: "核心",
  arms: "手臂",
  glutes: "臀部",
  legs: "腿部",
  back: "背部",
  rearShoulders: "后肩",
  hamstrings: "腘绳肌",
};

export const MODE_COLORS: Record<TrainingRecordMode, string> = {
  strength: "#4DA3FF",
  pilates: "#B38BFF",
  cardio: "#FF974D",
};

export const SOURCE_COLORS: Record<TrainingRecordSource, string> = {
  plan_follow: "#4DA3FF",
  free_training: "#FF974D",
  movement_follow: "#94A3B8",
};

const WEEKDAY_ZH = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

export function addDaysIso(iso: string, days: number): string {
  const date = parseIsoDate(iso);
  date.setDate(date.getDate() + days);
  return formatIsoDate(date);
}

export function getMonthStart(isoOrYm: string): string {
  const ym = isoOrYm.slice(0, 7);
  return `${ym}-01`;
}

export function getMonthEnd(isoOrYm: string): string {
  const [year, month] = isoOrYm.slice(0, 7).split("-").map(Number);
  const lastDay = new Date(year, month, 0).getDate();
  return `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
}

export function shiftMonth(ym: string, delta: number): string {
  const [year, month] = ym.split("-").map(Number);
  const date = new Date(year, month - 1 + delta, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

/** Monday-based week start for the date that contains `iso`. */
export function getWeekStartMondayIso(iso: string): string {
  const date = parseIsoDate(iso);
  const day = date.getDay();
  const offset = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + offset);
  return formatIsoDate(date);
}

export function resolveStatsAnchorDate(records: TrainingRecord[], fallback = "2026-07-19"): string {
  if (!records.length) return fallback;
  return [...records].sort((a, b) => b.finishedAt - a.finishedAt)[0].date;
}

export function getWeekPeriod(anchorIso: string, offset: number): DatePeriod {
  const baseStart = getWeekStartMondayIso(anchorIso);
  const start = addDaysIso(baseStart, offset * 7);
  return { start, end: addDaysIso(start, 6) };
}

export function getMonthPeriod(anchorIso: string, offset: number): DatePeriod {
  const ym = shiftMonth(anchorIso.slice(0, 7), offset);
  return { start: getMonthStart(ym), end: getMonthEnd(ym) };
}

export function getActivePeriod(
  range: Exclude<TrainingRecordsRange, "all">,
  anchorIso: string,
  weekOffset: number,
  monthOffset: number,
): DatePeriod {
  return range === "week"
    ? getWeekPeriod(anchorIso, weekOffset)
    : getMonthPeriod(anchorIso, monthOffset);
}

export function getPreviousPeriod(
  range: Exclude<TrainingRecordsRange, "all">,
  anchorIso: string,
  weekOffset: number,
  monthOffset: number,
): DatePeriod {
  return range === "week"
    ? getWeekPeriod(anchorIso, weekOffset - 1)
    : getMonthPeriod(anchorIso, monthOffset - 1);
}

export function formatPeriodSlash(period: DatePeriod): string {
  return `${period.start.replace(/-/g, "/")}-${period.end.replace(/-/g, "/")}`;
}

export function getStatPeriodLabel(_range: Exclude<TrainingRecordsRange, "all">, period: DatePeriod): string {
  return formatPeriodSlash(period);
}

export function buildWeekBuckets(period: DatePeriod): ChartBucket[] {
  return Array.from({ length: 7 }, (_, index) => {
    const date = addDaysIso(period.start, index);
    const weekday = WEEKDAY_ZH[parseIsoDate(date).getDay()];
    return { key: date, label: weekday, start: date, end: date };
  });
}

/** Device-aligned: split month into up to 4 contiguous segments. */
export function buildMonthBuckets(period: DatePeriod): ChartBucket[] {
  const labels: ChartBucket[] = [];
  let cursor = period.start;
  for (let i = 0; i < 4; i += 1) {
    if (cursor > period.end) break;
    const tentativeEnd = i === 3 ? period.end : addDaysIso(cursor, 6);
    const end = tentativeEnd > period.end ? period.end : tentativeEnd;
    labels.push({
      key: `${cursor}_${end}`,
      label: `${formatMd(cursor)}-${formatMd(end)}`,
      start: cursor,
      end,
    });
    cursor = addDaysIso(end, 1);
  }
  return labels;
}

function formatMd(iso: string): string {
  const [, month, day] = iso.split("-");
  return `${month}/${day}`;
}

export function computeMovingAverage(values: number[], windowSize = 3): number[] {
  return values.map((_, index) => {
    const start = Math.max(0, index - windowSize + 1);
    const section = values.slice(start, index + 1);
    const sum = section.reduce((acc, current) => acc + current, 0);
    return Math.round(sum / Math.max(1, section.length));
  });
}

export function getRecordCapacityKg(record: TrainingRecord): number {
  if (Number.isFinite(record.capacityKg) && (record.capacityKg ?? 0) > 0) {
    return Number(record.capacityKg);
  }
  if (Number.isFinite(record.report?.capacityKg) && (record.report?.capacityKg ?? 0) > 0) {
    return Number(record.report?.capacityKg);
  }
  if (record.mode === "cardio" || record.mode === "pilates") {
    const kcal = record.caloriesKcal ?? record.report?.caloriesKcal ?? 0;
    return Math.round(kcal * 4);
  }
  return 0;
}

export function getRecordAiScore(record: TrainingRecord): number | null {
  if (Number.isFinite(record.aiScore)) return Math.round(Number(record.aiScore));
  if (Number.isFinite(record.report?.finalAiScore)) {
    return Math.round(Number(record.report?.finalAiScore));
  }
  return null;
}

export function filterRecordsByPeriod(records: TrainingRecord[], period: DatePeriod): TrainingRecord[] {
  return records.filter((record) => record.date >= period.start && record.date <= period.end);
}

export function filterTrainingRecordsList(
  records: TrainingRecord[],
  filters: ListFilterState,
): TrainingRecord[] {
  let filtered = [...records];

  if (filters.source !== "all") {
    filtered = filtered.filter((record) => record.source === filters.source);
  }
  if (filters.mode !== "all") {
    filtered = filtered.filter((record) => record.mode === filters.mode);
  }
  if (filters.startMonth) {
    const start = getMonthStart(filters.startMonth);
    filtered = filtered.filter((record) => record.date >= start);
  }
  if (filters.endMonth) {
    const end = getMonthEnd(filters.endMonth);
    filtered = filtered.filter((record) => record.date <= end);
  }

  return filtered.sort((a, b) => b.finishedAt - a.finishedAt);
}

function emptyMuscleMap(): Record<MuscleZoneId, number> {
  return {
    chest: 0,
    core: 0,
    arms: 0,
    glutes: 0,
    legs: 0,
    back: 0,
    rearShoulders: 0,
    hamstrings: 0,
  };
}

function accumulateMuscle(target: Record<MuscleZoneId, number>, source?: MuscleLoadMap) {
  if (!source) return;
  MUSCLE_ZONE_IDS.forEach((id) => {
    target[id] += Number(source[id] || 0);
  });
}

function volumeForMode(records: TrainingRecord[], mode: TrainingRecordMode): number {
  return records
    .filter((record) => record.mode === mode)
    .reduce((sum, record) => sum + getRecordCapacityKg(record), 0);
}

function buildVolumeSeries(records: TrainingRecord[], buckets: ChartBucket[]): VolumeSeries {
  const strength = buckets.map((bucket) =>
    volumeForMode(
      records.filter((record) => record.date >= bucket.start && record.date <= bucket.end),
      "strength",
    ),
  );
  const pilates = buckets.map((bucket) =>
    volumeForMode(
      records.filter((record) => record.date >= bucket.start && record.date <= bucket.end),
      "pilates",
    ),
  );
  const cardio = buckets.map((bucket) =>
    volumeForMode(
      records.filter((record) => record.date >= bucket.start && record.date <= bucket.end),
      "cardio",
    ),
  );
  const totals = buckets.map((_, index) => strength[index] + pilates[index] + cardio[index]);
  return {
    strength,
    pilates,
    cardio,
    movingAverage: computeMovingAverage(totals, 3),
    labels: buckets.map((bucket) => bucket.label),
  };
}

function buildQualitySeries(records: TrainingRecord[], buckets: ChartBucket[]): QualitySeries {
  const scores = buckets.map((bucket) => {
    const inBucket = records.filter((record) => record.date >= bucket.start && record.date <= bucket.end);
    const scored = inBucket
      .map((record) => getRecordAiScore(record))
      .filter((value): value is number => value != null);
    if (!scored.length) return 0;
    return Math.round(scored.reduce((sum, value) => sum + value, 0) / scored.length);
  });
  const hasData = records.some((record) => getRecordAiScore(record) != null);
  return { scores, labels: buckets.map((bucket) => bucket.label), hasData };
}

function buildStructure(records: TrainingRecord[]): StructureCharts {
  const sourceCounts: Record<TrainingRecordSource, number> = {
    plan_follow: 0,
    free_training: 0,
    movement_follow: 0,
  };
  const modeCounts: Record<TrainingRecordMode, number> = {
    strength: 0,
    pilates: 0,
    cardio: 0,
  };

  records.forEach((record) => {
    sourceCounts[record.source] += 1;
    modeCounts[record.mode] += 1;
  });

  const source: StructureSlice[] = (
    [
      { id: "plan_follow", label: "计划跟练", value: sourceCounts.plan_follow, color: SOURCE_COLORS.plan_follow },
      { id: "free_training", label: "自由训练", value: sourceCounts.free_training, color: SOURCE_COLORS.free_training },
      { id: "movement_follow", label: "动作跟练", value: sourceCounts.movement_follow, color: SOURCE_COLORS.movement_follow },
    ] as const
  ).filter((item) => item.value > 0);

  const mode: StructureSlice[] = (
    [
      { id: "strength", label: "力量训练", value: modeCounts.strength, color: MODE_COLORS.strength },
      { id: "pilates", label: "普拉提", value: modeCounts.pilates, color: MODE_COLORS.pilates },
      { id: "cardio", label: "有氧燃脂", value: modeCounts.cardio, color: MODE_COLORS.cardio },
    ] as const
  ).filter((item) => item.value > 0);

  return { source, mode, totalSessions: records.length };
}

function buildMuscles(records: TrainingRecord[]): MuscleHeatmapData {
  const load = emptyMuscleMap();
  const sessions = emptyMuscleMap();
  records.forEach((record) => {
    accumulateMuscle(load, record.muscleLoad);
    accumulateMuscle(sessions, record.muscleSessions);
    if (!record.muscleSessions && record.muscleLoad) {
      MUSCLE_ZONE_IDS.forEach((id) => {
        if ((record.muscleLoad?.[id] ?? 0) > 0) sessions[id] += 1;
      });
    }
  });
  const maxLoad = Math.max(0, ...MUSCLE_ZONE_IDS.map((id) => load[id]));
  return { load, sessions, maxLoad };
}

export function mapZoneLevel(value: number, maxValue: number): number {
  if (!maxValue || value <= 0) return 0;
  const ratio = value / maxValue;
  if (ratio >= 0.9) return 5;
  if (ratio >= 0.7) return 4;
  if (ratio >= 0.5) return 3;
  if (ratio >= 0.3) return 2;
  return 1;
}

function sumDurationSeconds(records: TrainingRecord[]): number {
  return records.reduce((sum, record) => sum + (record.durationSeconds || 0), 0);
}

function sumCapacityKg(records: TrainingRecord[]): number {
  return records.reduce((sum, record) => sum + getRecordCapacityKg(record), 0);
}

function sumCaloriesKcal(records: TrainingRecord[]): number {
  return records.reduce((sum, record) => {
    const kcal = record.caloriesKcal ?? record.report?.caloriesKcal ?? 0;
    return sum + (Number.isFinite(kcal) ? Number(kcal) : 0);
  }, 0);
}

function buildMetricSummary(current: number, previous: number): PeriodMetricSummary {
  if (current <= 0 && previous <= 0) {
    return { value: current, previousValue: previous, changeValue: null, trend: "empty" };
  }
  if (previous <= 0 && current > 0) {
    return { value: current, previousValue: previous, changeValue: current, trend: "up" };
  }
  if (current <= 0 && previous > 0) {
    return { value: current, previousValue: previous, changeValue: -previous, trend: "down" };
  }
  const changeValue = current - previous;
  if (changeValue > 0) {
    return { value: current, previousValue: previous, changeValue, trend: "up" };
  }
  if (changeValue < 0) {
    return { value: current, previousValue: previous, changeValue, trend: "down" };
  }
  return { value: current, previousValue: previous, changeValue: 0, trend: "flat" };
}

export function buildPeriodSummary(
  currentRecords: TrainingRecord[],
  previousRecords: TrainingRecord[],
  range: Exclude<TrainingRecordsRange, "all">,
): PeriodSummary {
  return {
    sessions: buildMetricSummary(currentRecords.length, previousRecords.length),
    durationSeconds: buildMetricSummary(
      sumDurationSeconds(currentRecords),
      sumDurationSeconds(previousRecords),
    ),
    capacityKg: buildMetricSummary(sumCapacityKg(currentRecords), sumCapacityKg(previousRecords)),
    caloriesKcal: buildMetricSummary(
      sumCaloriesKcal(currentRecords),
      sumCaloriesKcal(previousRecords),
    ),
    compareLabel: range === "week" ? "较上周" : "较上月",
  };
}

export function buildMonthCalendar(records: TrainingRecord[], period: DatePeriod): CalendarDay[] {
  const byDate = new Map<string, TrainingRecord[]>();
  records.forEach((record) => {
    if (record.date < period.start || record.date > period.end) return;
    const existing = byDate.get(record.date) ?? [];
    existing.push(record);
    byDate.set(record.date, existing);
  });

  const days: CalendarDay[] = [];
  let cursor = period.start;
  while (cursor <= period.end) {
    const dayRecords = (byDate.get(cursor) ?? []).sort((a, b) => b.finishedAt - a.finishedAt);
    days.push({
      date: cursor,
      day: Number(cursor.slice(8, 10)),
      sessions: dayRecords.length,
      modeMarks: dayRecords.slice(0, 3).map((record) => record.mode),
    });
    cursor = addDaysIso(cursor, 1);
  }

  return days;
}

export function formatDurationSummary(seconds: number): string {
  const total = Math.max(0, Math.round(seconds));
  const hours = Math.floor(total / 3600);
  const mins = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function formatDurationDelta(seconds: number): string {
  const abs = Math.abs(Math.round(seconds));
  return formatDurationSummary(abs);
}

export function buildRecentSevenDaySportSnapshot(
  records: TrainingRecord[],
): {
  updatedAt: string;
  metrics: Array<{
    label: string;
    value: string;
    unit: string;
    trend: PeriodMetricSummary["trend"];
    changeValue: number | null;
    changeLabel: string;
  }>;
} {
  const anchor = resolveStatsAnchorDate(records);
  const current = { start: addDaysIso(anchor, -6), end: anchor };
  const previous = { start: addDaysIso(anchor, -13), end: addDaysIso(anchor, -7) };
  const summary = buildPeriodSummary(
    filterRecordsByPeriod(records, current),
    filterRecordsByPeriod(records, previous),
    "week",
  );

  const formatChange = (
    metric: PeriodMetricSummary,
    formatter: (delta: number) => string,
  ): string => {
    if (metric.trend === "flat") return "持平";
    if (metric.changeValue == null) return "-";
    return formatter(metric.changeValue);
  };

  return {
    updatedAt: `${anchor} 最近7天`,
    metrics: [
      {
        label: "训练次数",
        value: String(summary.sessions.value),
        unit: "次",
        trend: summary.sessions.trend,
        changeValue: summary.sessions.changeValue,
        changeLabel: formatChange(summary.sessions, (delta) => `${Math.abs(Math.round(delta))}次`),
      },
      {
        label: "累计时长",
        value: formatDurationSummary(summary.durationSeconds.value),
        unit: "",
        trend: summary.durationSeconds.trend,
        changeValue: summary.durationSeconds.changeValue,
        changeLabel: formatChange(summary.durationSeconds, formatDurationDelta),
      },
      {
        label: "训练容量",
        value: formatCapacitySummary(summary.capacityKg.value),
        unit: "kg",
        trend: summary.capacityKg.trend,
        changeValue: summary.capacityKg.changeValue,
        changeLabel: formatChange(
          summary.capacityKg,
          (delta) => `${formatCapacitySummary(Math.abs(delta))}kg`,
        ),
      },
      {
        label: "消耗热量",
        value: String(Math.round(summary.caloriesKcal.value)),
        unit: "kcal",
        trend: summary.caloriesKcal.trend,
        changeValue: summary.caloriesKcal.changeValue,
        changeLabel: formatChange(
          summary.caloriesKcal,
          (delta) => `${Math.abs(Math.round(delta))}kcal`,
        ),
      },
    ],
  };
}

export function formatCapacitySummary(kg: number): string {
  if (kg >= 10000) return `${(kg / 1000).toFixed(1)}k`;
  return String(Math.round(kg));
}

export function buildPeriodStats(
  records: TrainingRecord[],
  range: Exclude<TrainingRecordsRange, "all">,
  period: DatePeriod,
  previousPeriod?: DatePeriod,
): PeriodStatsBundle {
  const inPeriod = filterRecordsByPeriod(records, period);
  const previousRecords = previousPeriod
    ? filterRecordsByPeriod(records, previousPeriod)
    : [];
  const buckets = range === "week" ? buildWeekBuckets(period) : buildMonthBuckets(period);
  return {
    period,
    periodLabel: getStatPeriodLabel(range, period),
    summary: buildPeriodSummary(inPeriod, previousRecords, range),
    volume: buildVolumeSeries(inPeriod, buckets),
    quality: buildQualitySeries(inPeriod, buckets),
    structure: buildStructure(inPeriod),
    muscles: buildMuscles(inPeriod),
    calendar: range === "month" ? buildMonthCalendar(inPeriod, period) : undefined,
  };
}

export function hasActiveListFilters(filters: ListFilterState): boolean {
  return (
    filters.source !== "all" ||
    filters.mode !== "all" ||
    Boolean(filters.startMonth) ||
    Boolean(filters.endMonth)
  );
}

export function describeListFilters(filters: ListFilterState): string {
  const parts: string[] = [];
  if (filters.source === "plan_follow") parts.push("训练类型：计划跟练");
  if (filters.source === "free_training") parts.push("训练类型：自由训练");
  if (filters.source === "movement_follow") parts.push("训练类型：动作跟练");
  if (filters.mode === "strength") parts.push("场景：力量训练");
  if (filters.mode === "pilates") parts.push("场景：普拉提");
  if (filters.mode === "cardio") parts.push("场景：有氧燃脂");
  if (filters.startMonth || filters.endMonth) {
    const start = filters.startMonth ? formatMonthLabel(filters.startMonth) : "不限";
    const end = filters.endMonth ? formatMonthLabel(filters.endMonth) : "不限";
    parts.push(`月份：${start} 至 ${end}`);
  }
  return parts.join(" · ");
}

export function formatMonthLabel(ym: string): string {
  const [year, month] = ym.split("-");
  return `${year}年${Number(month)}月`;
}

export function getDynamicDateGroupTitle(date: string, todayIso?: string): string {
  const today = todayIso ?? formatIsoDate(new Date());
  const yesterday = addDaysIso(today, -1);
  if (date === today) return "今天";
  if (date === yesterday) return "昨天";
  const [, month, day] = date.split("-");
  return `${Number(month)}月${Number(day)}日`;
}
