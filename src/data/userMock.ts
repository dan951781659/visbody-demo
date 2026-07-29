import { FreeTrainingType } from "@/types/training";

export type TrainingRecordSource = "plan_follow" | "free_training" | "movement_follow";

export type TrainingRecordMode = "strength" | "pilates" | "cardio";

export type DataMetric = {
  label: string;
  value: string;
  unit: string;
  delta?: string;
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
  | "notifications-outline"
  | "shield-outline"
  | "help-circle-outline"
  | "information-circle-outline"
  | "flag-outline"
  | "color-palette-outline"
  | "log-out-outline";

export type SettingsMenuItem = {
  id: string;
  title: string;
  subtitle: string;
  icon: SettingsMenuIcon;
};

export type RecordRangeFilter = "7d" | "30d" | "all";
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
  updatedAt: "2026-07-18 21:30",
  metrics: [
    { label: "本周训练", value: "4", unit: "次", delta: "较上周 +1 次" },
    { label: "累计时长", value: "2.5", unit: "小时", delta: "本周 +45 分钟" },
    { label: "训练容量", value: "18.6", unit: "吨", delta: "较上周 +8%" },
    { label: "消耗热量", value: "1,240", unit: "千卡", delta: "较上周 +6%" },
  ],
};

export const bodyDataSnapshot: UserDataSnapshot = {
  updatedAt: "2026-07-15 10:20",
  metrics: [
    { label: "体重", value: "68.5", unit: "kg", delta: "较上次 -0.3 kg" },
    { label: "体脂率", value: "18.2", unit: "%", delta: "较上次 -0.5%" },
    { label: "骨骼肌", value: "31.4", unit: "kg", delta: "较上次 +0.2 kg" },
    { label: "BMI", value: "22.1", unit: "", delta: "正常范围" },
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
    id: "training-goals",
    title: "运动目标",
    subtitle: "每日时长、卡路里与每周频次",
    icon: "flag-outline",
  },
  {
    id: "color-scheme",
    title: "配色管理",
    subtitle: "经典荧光与设备蓝主题切换",
    icon: "color-palette-outline",
  },
  {
    id: "notifications",
    title: "通知与提醒",
    subtitle: "训练提醒、计划进度通知",
    icon: "notifications-outline",
  },
  {
    id: "privacy",
    title: "隐私与安全",
    subtitle: "账号安全、数据授权",
    icon: "shield-outline",
  },
  {
    id: "help",
    title: "帮助与反馈",
    subtitle: "常见问题、意见反馈",
    icon: "help-circle-outline",
  },
  {
    id: "about",
    title: "关于 APP",
    subtitle: "版本信息、服务条款",
    icon: "information-circle-outline",
  },
];

export const trainingRecords: TrainingRecord[] = [
  {
    id: "rec-001",
    title: "力量：全身训练",
    date: "2026-07-19",
    timeLabel: "今天 08:30",
    durationSeconds: 2700,
    durationLabel: "45 分钟",
    capacityKg: 8200,
    metricLabel: "8,200 kg",
    mode: "strength",
    modeLabel: "力量训练",
    source: "plan_follow",
    sourceLabel: "计划跟练",
    trainingType: "strength",
    trainingTypeLabel: "力量训练",
    finishedAt: Date.parse("2026-07-19T08:30:00"),
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
  },
  {
    id: "rec-004",
    title: "力量：上肢推力",
    date: "2026-07-15",
    timeLabel: "7月15日 18:20",
    durationSeconds: 2100,
    durationLabel: "35 分钟",
    capacityKg: 6400,
    metricLabel: "6,400 kg",
    mode: "strength",
    modeLabel: "力量训练",
    source: "plan_follow",
    sourceLabel: "计划跟练",
    trainingType: "strength",
    trainingTypeLabel: "力量训练",
    finishedAt: Date.parse("2026-07-15T18:20:00"),
  },
  {
    id: "rec-005",
    title: "自由训练：力量模式",
    date: "2026-07-12",
    timeLabel: "7月12日 20:00",
    durationSeconds: 2400,
    durationLabel: "40 分钟",
    capacityKg: 7100,
    metricLabel: "7,100 kg",
    mode: "strength",
    modeLabel: "力量训练",
    source: "free_training",
    sourceLabel: "自由训练",
    trainingType: "strength",
    trainingTypeLabel: "力量训练",
    finishedAt: Date.parse("2026-07-12T20:00:00"),
  },
  {
    id: "rec-006",
    title: "普拉提：呼吸与延展",
    date: "2026-07-08",
    timeLabel: "7月8日 09:10",
    durationSeconds: 1200,
    durationLabel: "20 分钟",
    caloriesKcal: 160,
    metricLabel: "160 千卡",
    mode: "pilates",
    modeLabel: "普拉提",
    source: "movement_follow",
    sourceLabel: "动作跟练",
    trainingType: "pilates",
    trainingTypeLabel: "普拉提",
    finishedAt: Date.parse("2026-07-08T09:10:00"),
  },
  {
    id: "rec-007",
    title: "力量：下肢训练",
    date: "2026-06-28",
    timeLabel: "6月28日 17:45",
    durationSeconds: 3000,
    durationLabel: "50 分钟",
    capacityKg: 9300,
    metricLabel: "9,300 kg",
    mode: "strength",
    modeLabel: "力量训练",
    source: "plan_follow",
    sourceLabel: "计划跟练",
    trainingType: "strength",
    trainingTypeLabel: "力量训练",
    finishedAt: Date.parse("2026-06-28T17:45:00"),
  },
  {
    id: "rec-008",
    title: "自由训练：阻力有氧",
    date: "2026-06-20",
    timeLabel: "6月20日 06:50",
    durationSeconds: 1800,
    durationLabel: "30 分钟",
    caloriesKcal: 380,
    metricLabel: "380 千卡",
    mode: "cardio",
    modeLabel: "有氧燃脂",
    source: "free_training",
    sourceLabel: "自由训练",
    trainingType: "resistance_cardio",
    trainingTypeLabel: "阻力有氧",
    finishedAt: Date.parse("2026-06-20T06:50:00"),
  },
];

export const recordRangeOptions: { id: RecordRangeFilter; label: string }[] = [
  { id: "7d", label: "近 7 天" },
  { id: "30d", label: "近 30 天" },
  { id: "all", label: "全部" },
];

export const recordSourceOptions: { id: RecordSourceFilter; label: string }[] = [
  { id: "all", label: "全部类型" },
  { id: "plan_follow", label: "计划跟练" },
  { id: "free_training", label: "自由训练" },
  { id: "movement_follow", label: "动作跟练" },
];

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
  range: RecordRangeFilter,
  source: RecordSourceFilter,
): TrainingRecord[] {
  let filtered = [...records];

  if (source !== "all") {
    filtered = filtered.filter((record) => record.source === source);
  }

  if (range !== "all") {
    const days = range === "7d" ? 7 : 30;
    const cutoff = new Date("2026-07-19T00:00:00");
    cutoff.setDate(cutoff.getDate() - days);
    filtered = filtered.filter((record) => new Date(`${record.date}T00:00:00`) >= cutoff);
  }

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
  if (date === "2026-07-19") return "今天";
  if (date === "2026-07-18") return "昨天";

  const [, month, day] = date.split("-");
  return `${Number(month)}月${Number(day)}日`;
}

export function getRecordModeIcon(mode: TrainingRecordMode): "barbell-outline" | "body-outline" | "heart-outline" {
  if (mode === "pilates") return "body-outline";
  if (mode === "cardio") return "heart-outline";
  return "barbell-outline";
}
