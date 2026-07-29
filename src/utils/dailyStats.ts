import { TrainingGoals } from "@/types/userGoals";

export type DailyActivity = {
  /** YYYY-MM-DD */
  date: string;
  durationMinutes: number;
  caloriesKcal: number;
};

export type WeekDayStat = {
  label: string;
  date: number;
  /** YYYY-MM-DD */
  isoDate: string;
  active?: boolean;
};

export type GoalProgressMetric = {
  key: "calories" | "duration" | "frequency";
  label: string;
  value: number;
  goal: number;
  unit: string;
  /** 0–1，满额后封顶为 1 */
  progress: number;
  /** 右侧辅助说明，如「目标 300 千卡」或「本周」 */
  hint: string;
  color: string;
};

export type DailySummaryStats = {
  selectedDate: string;
  weekDays: WeekDayStat[];
  metrics: GoalProgressMetric[];
};

const WEEKDAY_LABELS = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"] as const;

/** 演示用活动数据：覆盖一周内多日，便于点击切换。 */
export const demoDailyActivities: DailyActivity[] = [
  { date: "2026-07-14", durationMinutes: 25, caloriesKcal: 210 },
  { date: "2026-07-15", durationMinutes: 0, caloriesKcal: 0 },
  { date: "2026-07-16", durationMinutes: 40, caloriesKcal: 320 },
  { date: "2026-07-17", durationMinutes: 30, caloriesKcal: 280 },
  { date: "2026-07-18", durationMinutes: 19, caloriesKcal: 375 },
  { date: "2026-07-19", durationMinutes: 45, caloriesKcal: 420 },
  { date: "2026-07-20", durationMinutes: 0, caloriesKcal: 0 },
];

/** 演示周锚定日：与现有 mock 训练记录一致（周五）。 */
export const DEMO_WEEK_ANCHOR = "2026-07-18";

export function parseIsoDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function formatIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** 以周一为周起始，返回所在周的周一 00:00。 */
export function getWeekStartMonday(date: Date): Date {
  const copy = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = copy.getDay(); // 0=Sun … 6=Sat
  const offset = day === 0 ? -6 : 1 - day;
  copy.setDate(copy.getDate() + offset);
  return copy;
}

export function buildWeekDays(anchorIso: string, selectedIso: string): WeekDayStat[] {
  const weekStart = getWeekStartMonday(parseIsoDate(anchorIso));
  return WEEKDAY_LABELS.map((label, index) => {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + index);
    const isoDate = formatIsoDate(day);
    return {
      label,
      date: day.getDate(),
      isoDate,
      active: isoDate === selectedIso,
    };
  });
}

export function sumDailyActivity(
  activities: DailyActivity[],
  isoDate: string,
): { durationMinutes: number; caloriesKcal: number } {
  return activities
    .filter((item) => item.date === isoDate)
    .reduce(
      (acc, item) => ({
        durationMinutes: acc.durationMinutes + item.durationMinutes,
        caloriesKcal: acc.caloriesKcal + item.caloriesKcal,
      }),
      { durationMinutes: 0, caloriesKcal: 0 },
    );
}

/** 统计该日期所在自然周内「发生过有效训练」的天数（时长或卡路里 > 0）。 */
export function countWeeklyActiveDays(activities: DailyActivity[], isoDate: string): number {
  const weekStart = getWeekStartMonday(parseIsoDate(isoDate));
  const weekDates = new Set(
    Array.from({ length: 7 }, (_, index) => {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + index);
      return formatIsoDate(day);
    }),
  );

  const activeDates = new Set<string>();
  activities.forEach((item) => {
    if (!weekDates.has(item.date)) return;
    if (item.durationMinutes > 0 || item.caloriesKcal > 0) {
      activeDates.add(item.date);
    }
  });
  return activeDates.size;
}

export function clampProgress(actual: number, goal: number): number {
  if (goal <= 0) return 0;
  return Math.min(1, Math.max(0, actual / goal));
}

/** 与设备端 Plan B 首页三环一致：消耗蓝 / 时长青 / 频次橙 */
export const GOAL_METRIC_COLORS = {
  calories: "#007AFF",
  duration: "#00D4FF",
  frequency: "#FF6B35",
} as const;

export function buildDailySummaryStats(
  selectedIso: string,
  goals: TrainingGoals,
  activities: DailyActivity[] = demoDailyActivities,
  weekAnchorIso: string = DEMO_WEEK_ANCHOR,
): DailySummaryStats {
  const day = sumDailyActivity(activities, selectedIso);
  const weeklyDays = countWeeklyActiveDays(activities, selectedIso);

  return {
    selectedDate: selectedIso,
    weekDays: buildWeekDays(weekAnchorIso, selectedIso),
    metrics: [
      {
        key: "calories",
        label: "消耗",
        value: day.caloriesKcal,
        goal: goals.dailyCaloriesKcal,
        unit: "千卡",
        progress: clampProgress(day.caloriesKcal, goals.dailyCaloriesKcal),
        hint: `目标 ${goals.dailyCaloriesKcal} 千卡`,
        color: GOAL_METRIC_COLORS.calories,
      },
      {
        key: "duration",
        label: "时长",
        value: day.durationMinutes,
        goal: goals.dailyDurationMinutes,
        unit: "分钟",
        progress: clampProgress(day.durationMinutes, goals.dailyDurationMinutes),
        hint: `目标 ${goals.dailyDurationMinutes} 分钟`,
        color: GOAL_METRIC_COLORS.duration,
      },
      {
        key: "frequency",
        label: "频次",
        value: weeklyDays,
        goal: goals.weeklyFrequency,
        unit: "次",
        progress: clampProgress(weeklyDays, goals.weeklyFrequency),
        hint: `本周 · 目标 ${goals.weeklyFrequency} 次`,
        color: GOAL_METRIC_COLORS.frequency,
      },
    ],
  };
}
