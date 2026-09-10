import {
  FreeTrainingType,
  ResistanceMode,
  TrainingReport,
  TrainingReportScene,
} from "@/types/training";
import { buildTrainingReport, createDefaultPreset } from "@/data/trainingMock";
import type { MetricTrend, MuscleLoadMap } from "@/types/trainingRecord";
import { getDynamicDateGroupTitle } from "@/utils/trainingRecordStats";

export type TrainingRecordSource = "plan_follow" | "free_training" | "movement_follow";

export type TrainingRecordMode = "strength" | "pilates" | "cardio";

export type DataMetric = {
  label: string;
  value: string;
  unit: string;
  /** Legacy free-form hint; prefer structured trend fields below. */
  delta?: string;
  trend?: MetricTrend;
  changeValue?: number | null;
  /** Formatted absolute delta, e.g. `1次` / `00:45:00`. Flat uses `持平`. */
  changeLabel?: string;
};

export type UserProfile = {
  id: string;
  nickname: string;
  avatarInitials: string;
  avatarColor: string;
  avatarUri?: string;
  accountSummary: string;
  gender: "male" | "female" | "other";
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  height: string;
  heightUnit: "cm" | "ft";
  weight: string;
  weightUnit: "kg" | "lbs";
};

export type UserDataSnapshot = {
  updatedAt: string;
  metrics: DataMetric[];
};

export type TrainingRecord = {
  id: string;
  title: string;
  date: string;
  timeLabel: string;
  durationSeconds: number;
  durationLabel: string;
  capacityKg?: number;
  caloriesKcal?: number;
  energyKj?: number;
  metricLabel: string;
  mode: TrainingRecordMode;
  modeLabel: string;
  source: TrainingRecordSource;
  sourceLabel: string;
  trainingType: FreeTrainingType;
  trainingTypeLabel: string;
  finishedAt: number;
  /** Optional AI score for period trend charts. */
  aiScore?: number;
  /** Relative muscle stimulus used by the heatmap. */
  muscleLoad?: MuscleLoadMap;
  /** Session counts per muscle zone. */
  muscleSessions?: MuscleLoadMap;
  report?: TrainingReport;
};

export type ActiveTrainingPlan = {
  id: string;
  name: string;
  currentDay: number;
  totalDays: number;
  progress: number;
  nextSessionLabel: string;
  statusLabel: string;
};

export type SettingsMenuIcon =
  | "heart-outline"
  | "shield-outline"
  | "information-circle-outline"
  | "flag-outline"
  | "log-out-outline";

export type SettingsMenuItem = {
  id: string;
  title: string;
  subtitle?: string;
  icon: SettingsMenuIcon;
};

export type AppEdition = "standard" | "overseas";

export const APP_VERSION = "v1.0.0";

export const APP_EDITION_LABELS: Record<AppEdition, string> = {
  standard: "标准版",
  overseas: "海外版",
};

export type RecordSourceFilter = "all" | TrainingRecordSource;
export type UserDataTab = "sport" | "body";

export const mockUser: UserProfile = {
  id: "user-demo-001",
  nickname: "运动达人",
  avatarInitials: "运",
  avatarColor: "#3B82F6",
  accountSummary: "MotionStation 会员 · 已绑定设备",
  gender: "female",
  birthYear: "1997",
  birthMonth: "08",
  birthDay: "16",
  height: "165",
  heightUnit: "cm",
  weight: "55",
  weightUnit: "kg",
};

export const sportDataSnapshot: UserDataSnapshot = {
  updatedAt: "2026-07-19 21:30",
  metrics: [],
};

export const bodyDataSnapshot: UserDataSnapshot = {
  updatedAt: "2026-07-15 10:20",
  metrics: [
    {
      label: "体重",
      value: "68.5",
      unit: "kg",
      trend: "down",
      changeValue: -0.3,
      changeLabel: "0.3kg",
    },
    {
      label: "体脂率",
      value: "18.2",
      unit: "%",
      trend: "down",
      changeValue: -0.5,
      changeLabel: "0.5%",
    },
    {
      label: "骨骼肌",
      value: "31.4",
      unit: "kg",
      trend: "up",
      changeValue: 0.2,
      changeLabel: "0.2kg",
    },
    {
      label: "BMI",
      value: "22.1",
      unit: "",
      trend: "flat",
      changeValue: 0,
      changeLabel: "持平",
    },
  ],
};

export const activeTrainingPlan: ActiveTrainingPlan = {
  id: "plan-lean-lower-3w-4x",
  name: "春季减脂计划",
  currentDay: 12,
  totalDays: 30,
  progress: 0.4,
  nextSessionLabel: "第 12 天 · 下肢强化 · 预计 40 分钟",
  statusLabel: "进行中",
};

export const settingsMenuItems: SettingsMenuItem[] = [
  {
    id: "favorites",
    title: "我的收藏",
    icon: "heart-outline",
  },
  {
    id: "training-goals",
    title: "运动目标",
    icon: "flag-outline",
  },
  {
    id: "privacy",
    title: "隐私与安全",
    icon: "shield-outline",
  },
  {
    id: "about",
    title: "关于 APP",
    icon: "information-circle-outline",
  },
];

export const recordSourceOptions: { id: RecordSourceFilter; label: string }[] = [
  { id: "all", label: "全部类型" },
  { id: "plan_follow", label: "计划跟练" },
  { id: "free_training", label: "自由训练" },
  { id: "movement_follow", label: "动作跟练" },
];

export type RecordModeFilterOption = "all" | TrainingRecordMode;

export const recordModeOptions: { id: RecordModeFilterOption; label: string }[] = [
  { id: "all", label: "全部场景" },
  { id: "strength", label: "力量训练" },
  { id: "pilates", label: "普拉提" },
  { id: "cardio", label: "有氧燃脂" },
];

function resolveRecordScene(record: Omit<TrainingRecord, "report">): TrainingReportScene {
  if (record.source === "plan_follow") return "plan-training";
  if (record.source === "movement_follow") return "movement";
  if (record.trainingType === "pilates") return "pilates";
  return "free";
}

function buildRecordReport(record: Omit<TrainingRecord, "report">): TrainingReport {
  const preset = createDefaultPreset(record.trainingType);
  if (record.trainingType === "strength") {
    preset.mode = "standard";
    preset.equipment = "barbell";
    preset.resistanceBarbell = record.capacityKg ? Math.max(10, Math.round(record.capacityKg / Math.max(1, record.durationSeconds / 60))) : 20;
  } else if (record.trainingType === "pilates") {
    preset.mode = "spring";
    preset.equipment = "nonbarbell";
    preset.resistanceLeft = 12;
  } else {
    preset.mode = "standard" as ResistanceMode;
    preset.equipment = "nonbarbell";
    preset.resistanceLeft = 8;
    preset.resistanceRight = 8;
  }

  const isMovement = record.source === "movement_follow";
  const isPlan = record.source === "plan_follow";

  return buildTrainingReport({
    id: record.id,
    title: record.title,
    preset,
    durationSeconds: record.durationSeconds,
    userName: mockUser.nickname,
    userAvatar: mockUser.avatarInitials,
    source: record.source,
    scene: resolveRecordScene(record),
    sceneLabel: record.modeLabel,
    finishedAt: record.finishedAt,
    planName: isPlan ? "春季减脂计划" : undefined,
    planDayName: isPlan ? "第 2 周 · 第 3 天" : undefined,
    finalAiScore: isMovement || isPlan ? 88 + (record.id.charCodeAt(record.id.length - 1) % 10) : undefined,
    accuracyDistribution:
      isMovement || isPlan
        ? { better: 18, good: 34, perfect: 48 }
        : undefined,
    planMoves: isPlan
      ? [
          {
            name: "杠铃深蹲",
            targetSets: 4,
            targetReps: 10,
            actualSets: 4,
            actualReps: 40,
            durationSeconds: Math.round(record.durationSeconds * 0.35),
            aiSupported: true,
            aiQuality: {
              perfectRate: 78,
              summary: "深蹲深度整体稳定，偶有膝盖内扣。",
              topErrors: [
                { label: "膝盖内扣", percent: 12 },
                { label: "幅度不足", percent: 8 },
              ],
            },
          },
          {
            name: "罗马尼亚硬拉",
            targetSets: 3,
            targetReps: 12,
            actualSets: 3,
            actualReps: 36,
            durationSeconds: Math.round(record.durationSeconds * 0.3),
            aiSupported: true,
            aiQuality: {
              perfectRate: 84,
              summary: "髋铰链轨迹良好，注意保持背部中立。",
              topErrors: [{ label: "圆背", percent: 9 }],
            },
          },
          {
            name: "平板支撑",
            targetSets: 3,
            targetReps: 45,
            actualSets: 3,
            actualReps: 135,
            durationSeconds: Math.round(record.durationSeconds * 0.2),
            aiSupported: false,
          },
        ]
      : isMovement
        ? [
            {
              name: record.title.replace(/^[^：:]+[：:]/, "").trim() || record.title,
              targetSets: 3,
              targetReps: 12,
              actualSets: 3,
              actualReps: 34,
              durationSeconds: record.durationSeconds,
              aiSupported: true,
              aiQuality: {
                perfectRate: 82,
                summary: "动作完成度较高，可继续加强离心控制。",
                topErrors: [
                  { label: "节奏偏快", percent: 11 },
                  { label: "核心不稳", percent: 7 },
                ],
              },
            },
          ]
        : undefined,
    coachNote: isMovement
      ? "动作质量稳定。下次可适当提高阻力，并延长离心阶段。"
      : undefined,
  });
}

const trainingRecordSeeds: Omit<TrainingRecord, "report">[] = [
  {
    id: "rec-001",
    title: "力量：全身训练",
    date: "2026-07-19",
    timeLabel: "今天 08:30",
    durationSeconds: 2700,
    durationLabel: "45 分钟",
    capacityKg: 8200,
    caloriesKcal: 450,
    metricLabel: "8,200 kg",
    mode: "strength",
    modeLabel: "力量训练",
    source: "plan_follow",
    sourceLabel: "计划跟练",
    trainingType: "strength",
    trainingTypeLabel: "力量训练",
    finishedAt: Date.parse("2026-07-19T08:30:00"),
    aiScore: 93,
    muscleLoad: { chest: 72, core: 58, arms: 64, glutes: 70, legs: 88, back: 55, rearShoulders: 40, hamstrings: 62 },
    muscleSessions: { chest: 1, core: 1, arms: 1, glutes: 1, legs: 1, back: 1, rearShoulders: 1, hamstrings: 1 },
  },
  {
    id: "rec-002",
    title: "普拉提：核心控制",
    date: "2026-07-18",
    timeLabel: "昨天 19:15",
    durationSeconds: 1800,
    durationLabel: "30 分钟",
    caloriesKcal: 210,
    metricLabel: "210 千卡",
    mode: "pilates",
    modeLabel: "普拉提",
    source: "movement_follow",
    sourceLabel: "动作跟练",
    trainingType: "pilates",
    trainingTypeLabel: "普拉提",
    finishedAt: Date.parse("2026-07-18T19:15:00"),
    aiScore: 88,
    muscleLoad: { chest: 20, core: 86, arms: 34, glutes: 48, legs: 36, back: 42, rearShoulders: 28, hamstrings: 30 },
    muscleSessions: { chest: 0, core: 1, arms: 1, glutes: 1, legs: 0, back: 1, rearShoulders: 0, hamstrings: 0 },
  },
  {
    id: "rec-003",
    title: "自由训练：阻力有氧",
    date: "2026-07-17",
    timeLabel: "7月17日 07:40",
    durationSeconds: 1500,
    durationLabel: "25 分钟",
    caloriesKcal: 420,
    metricLabel: "420 千卡",
    mode: "cardio",
    modeLabel: "有氧燃脂",
    source: "free_training",
    sourceLabel: "自由训练",
    trainingType: "resistance_cardio",
    trainingTypeLabel: "阻力有氧",
    finishedAt: Date.parse("2026-07-17T07:40:00"),
    muscleLoad: { chest: 30, core: 44, arms: 38, glutes: 52, legs: 68, back: 36, rearShoulders: 24, hamstrings: 46 },
    muscleSessions: { chest: 0, core: 1, arms: 1, glutes: 1, legs: 1, back: 0, rearShoulders: 0, hamstrings: 1 },
  },
  {
    id: "rec-004",
    title: "力量：上肢推力",
    date: "2026-07-15",
    timeLabel: "7月15日 18:20",
    durationSeconds: 2100,
    durationLabel: "35 分钟",
    capacityKg: 6400,
    caloriesKcal: 380,
    metricLabel: "6,400 kg",
    mode: "strength",
    modeLabel: "力量训练",
    source: "plan_follow",
    sourceLabel: "计划跟练",
    trainingType: "strength",
    trainingTypeLabel: "力量训练",
    finishedAt: Date.parse("2026-07-15T18:20:00"),
    aiScore: 90,
    muscleLoad: { chest: 90, core: 48, arms: 82, glutes: 28, legs: 34, back: 40, rearShoulders: 56, hamstrings: 22 },
    muscleSessions: { chest: 1, core: 1, arms: 1, glutes: 0, legs: 0, back: 1, rearShoulders: 1, hamstrings: 0 },
  },
  {
    id: "rec-005",
    title: "自由训练：力量模式",
    date: "2026-07-12",
    timeLabel: "7月12日 20:00",
    durationSeconds: 3600,
    durationLabel: "60 分钟",
    capacityKg: 8500,
    caloriesKcal: 600,
    metricLabel: "8,500 kg",
    mode: "strength",
    modeLabel: "力量训练",
    source: "free_training",
    sourceLabel: "自由训练",
    trainingType: "strength",
    trainingTypeLabel: "力量训练",
    finishedAt: Date.parse("2026-07-12T20:00:00"),
    muscleLoad: { chest: 60, core: 50, arms: 58, glutes: 64, legs: 76, back: 70, rearShoulders: 44, hamstrings: 58 },
    muscleSessions: { chest: 1, core: 1, arms: 1, glutes: 1, legs: 1, back: 1, rearShoulders: 1, hamstrings: 1 },
  },
  {
    id: "rec-009",
    title: "力量：核心与推举",
    date: "2026-07-10",
    timeLabel: "7月10日 18:40",
    durationSeconds: 4800,
    durationLabel: "80 分钟",
    capacityKg: 7020,
    caloriesKcal: 800,
    metricLabel: "7,020 kg",
    mode: "strength",
    modeLabel: "力量训练",
    source: "plan_follow",
    sourceLabel: "计划跟练",
    trainingType: "strength",
    trainingTypeLabel: "力量训练",
    finishedAt: Date.parse("2026-07-10T18:40:00"),
    aiScore: 87,
    muscleLoad: { chest: 70, core: 66, arms: 72, glutes: 40, legs: 48, back: 58, rearShoulders: 50, hamstrings: 36 },
    muscleSessions: { chest: 1, core: 1, arms: 1, glutes: 0, legs: 1, back: 1, rearShoulders: 1, hamstrings: 0 },
  },
  {
    id: "rec-006",
    title: "普拉提：呼吸与延展",
    date: "2026-07-08",
    timeLabel: "7月8日 09:10",
    durationSeconds: 2400,
    durationLabel: "40 分钟",
    caloriesKcal: 400,
    metricLabel: "400 千卡",
    mode: "pilates",
    modeLabel: "普拉提",
    source: "movement_follow",
    sourceLabel: "动作跟练",
    trainingType: "pilates",
    trainingTypeLabel: "普拉提",
    finishedAt: Date.parse("2026-07-08T09:10:00"),
    aiScore: 85,
    muscleLoad: { chest: 18, core: 78, arms: 26, glutes: 40, legs: 28, back: 46, rearShoulders: 22, hamstrings: 24 },
    muscleSessions: { chest: 0, core: 1, arms: 0, glutes: 1, legs: 0, back: 1, rearShoulders: 0, hamstrings: 0 },
  },
  {
    id: "rec-007",
    title: "力量：下肢训练",
    date: "2026-06-28",
    timeLabel: "6月28日 17:45",
    durationSeconds: 4200,
    durationLabel: "70 分钟",
    capacityKg: 12000,
    caloriesKcal: 720,
    metricLabel: "12,000 kg",
    mode: "strength",
    modeLabel: "力量训练",
    source: "plan_follow",
    sourceLabel: "计划跟练",
    trainingType: "strength",
    trainingTypeLabel: "力量训练",
    finishedAt: Date.parse("2026-06-28T17:45:00"),
    aiScore: 91,
    muscleLoad: { chest: 28, core: 52, arms: 30, glutes: 86, legs: 94, back: 48, rearShoulders: 26, hamstrings: 80 },
    muscleSessions: { chest: 0, core: 1, arms: 0, glutes: 1, legs: 1, back: 1, rearShoulders: 0, hamstrings: 1 },
  },
  {
    id: "rec-010",
    title: "力量：上背拉动",
    date: "2026-06-24",
    timeLabel: "6月24日 19:00",
    durationSeconds: 3900,
    durationLabel: "65 分钟",
    capacityKg: 11000,
    caloriesKcal: 680,
    metricLabel: "11,000 kg",
    mode: "strength",
    modeLabel: "力量训练",
    source: "plan_follow",
    sourceLabel: "计划跟练",
    trainingType: "strength",
    trainingTypeLabel: "力量训练",
    finishedAt: Date.parse("2026-06-24T19:00:00"),
    aiScore: 89,
    muscleLoad: { chest: 34, core: 48, arms: 56, glutes: 30, legs: 40, back: 88, rearShoulders: 62, hamstrings: 28 },
    muscleSessions: { chest: 0, core: 1, arms: 1, glutes: 0, legs: 0, back: 1, rearShoulders: 1, hamstrings: 0 },
  },
  {
    id: "rec-011",
    title: "自由训练：力量模式",
    date: "2026-06-22",
    timeLabel: "6月22日 08:15",
    durationSeconds: 3600,
    durationLabel: "60 分钟",
    capacityKg: 8200,
    caloriesKcal: 700,
    metricLabel: "8,200 kg",
    mode: "strength",
    modeLabel: "力量训练",
    source: "free_training",
    sourceLabel: "自由训练",
    trainingType: "strength",
    trainingTypeLabel: "力量训练",
    finishedAt: Date.parse("2026-06-22T08:15:00"),
    muscleLoad: { chest: 55, core: 50, arms: 60, glutes: 58, legs: 70, back: 64, rearShoulders: 40, hamstrings: 52 },
    muscleSessions: { chest: 1, core: 1, arms: 1, glutes: 1, legs: 1, back: 1, rearShoulders: 1, hamstrings: 1 },
  },
  {
    id: "rec-008",
    title: "自由训练：阻力有氧",
    date: "2026-06-20",
    timeLabel: "6月20日 06:50",
    durationSeconds: 3600,
    durationLabel: "60 分钟",
    capacityKg: 3040,
    caloriesKcal: 1500,
    metricLabel: "1,500 千卡",
    mode: "cardio",
    modeLabel: "有氧燃脂",
    source: "free_training",
    sourceLabel: "自由训练",
    trainingType: "resistance_cardio",
    trainingTypeLabel: "阻力有氧",
    finishedAt: Date.parse("2026-06-20T06:50:00"),
    muscleLoad: { chest: 26, core: 40, arms: 32, glutes: 50, legs: 62, back: 34, rearShoulders: 20, hamstrings: 44 },
    muscleSessions: { chest: 0, core: 1, arms: 0, glutes: 1, legs: 1, back: 0, rearShoulders: 0, hamstrings: 1 },
  },
];

export const trainingRecords: TrainingRecord[] = trainingRecordSeeds.map((record) => ({
  ...record,
  report: buildRecordReport(record),
}));

export function getRecentTrainingRecords(limit = 3): TrainingRecord[] {
  return [...trainingRecords]
    .sort((a, b) => b.finishedAt - a.finishedAt)
    .slice(0, limit);
}

export function getTrainingRecordById(id: string): TrainingRecord | undefined {
  return trainingRecords.find((record) => record.id === id);
}

export function filterTrainingRecords(
  records: TrainingRecord[],
  source: RecordSourceFilter,
  startDate?: string,
  endDate?: string,
): TrainingRecord[] {
  let filtered = [...records];

  if (source !== "all") {
    filtered = filtered.filter((record) => record.source === source);
  }

  if (startDate) filtered = filtered.filter((record) => record.date >= startDate);
  if (endDate) filtered = filtered.filter((record) => record.date <= endDate);

  return filtered.sort((a, b) => b.finishedAt - a.finishedAt);
}

export type GroupedTrainingRecords = {
  title: string;
  records: TrainingRecord[];
};

export function groupTrainingRecordsByDate(records: TrainingRecord[]): GroupedTrainingRecords[] {
  const groups = new Map<string, TrainingRecord[]>();

  records.forEach((record) => {
    const title = getDateGroupTitle(record.date);
    const existing = groups.get(title) ?? [];
    existing.push(record);
    groups.set(title, existing);
  });

  return Array.from(groups.entries()).map(([title, groupRecords]) => ({
    title,
    records: groupRecords,
  }));
}

function getDateGroupTitle(date: string): string {
  /** Demo seed dates are fixed in July 2026; map relative labels against that anchor. */
  const demoToday = "2026-07-19";
  return getDynamicDateGroupTitle(date, demoToday);
}

export function getRecordModeIcon(mode: TrainingRecordMode): "barbell-outline" | "body-outline" | "heart-outline" {
  if (mode === "pilates") return "body-outline";
  if (mode === "cardio") return "heart-outline";
  return "barbell-outline";
}
