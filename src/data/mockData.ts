import type { Device, NearbyDevice, ProductLineOption } from "@/types/training";
import { myTrainingPlans } from "@/data/planMock";
import { parseIsoDate } from "@/utils/dailyStats";

export type ProductOption = {
  id: string;
  name: string;
  subtitle: string;
};

export type WeekDay = {
  label: string;
  date: number;
  active?: boolean;
};

export type TrainingMetric = {
  label: string;
  value: string;
  unit: string;
  delta?: string;
};

export type SceneCategory = {
  id: string;
  title: string;
  subtitle: string;
  gradient: [string, string];
  moveCount: number;
};

export type ContentItem = {
  id: string;
  title: string;
  subtitle: string;
  meta: string;
  badge?: string;
  gradient: [string, string];
};

export const products: ProductOption[] = [
  { id: "visbody", name: "Visbody", subtitle: "维塑数字健康平台" },
  { id: "motionstation", name: "MotionStation", subtitle: "智能训练运动站" },
];

export const productLines: ProductLineOption[] = [
  { id: "wellnesshub", name: "WellnessHub", subtitle: "数字健康平台" },
  { id: "vapro6", name: "VA Pro6", subtitle: "3D 体测设备" },
  { id: "motionstation", name: "MotionStation", subtitle: "智能训练运动站" },
];

export const defaultDevices: Device[] = [
  {
    id: "ms-1024",
    productId: "motionstation",
    name: "MS-1024",
    subtitle: "",
    connection: "connected",
  },
];

export const nearbyDevices: NearbyDevice[] = [
  { id: "nearby-ms-3141", name: "MS-3141", status: "idle", loggedIn: true },
  { id: "nearby-ms-5502", name: "MS-5502", status: "idle", loggedIn: false },
  { id: "nearby-ms-6690", name: "MS-6690", status: "busy" },
];

/** @deprecated 今日摘要已改用 `buildDailySummaryStats`；保留类型供兼容。 */
export const weekDays: WeekDay[] = [
  { label: "周一", date: 14 },
  { label: "周二", date: 15 },
  { label: "周三", date: 16 },
  { label: "周四", date: 17 },
  { label: "周五", date: 18, active: true },
  { label: "周六", date: 19 },
  { label: "周日", date: 20 },
];

/** @deprecated 今日摘要已改用目标完成度指标。 */
export const trainingMetrics: TrainingMetric[] = [
  { label: "消耗", value: "375", unit: "千卡", delta: "较昨日 +12%" },
  { label: "时长", value: "19", unit: "分钟", delta: "较昨日 +5%" },
  { label: "频次", value: "2", unit: "天", delta: "与昨日持平" },
];

export const sceneCategories: SceneCategory[] = [
  {
    id: "strength",
    title: "力量训练",
    subtitle: "增肌与力量提升",
    gradient: ["#1a1a2e", "#e94560"],
    moveCount: 24,
  },
  {
    id: "pilates",
    title: "普拉提",
    subtitle: "核心控制与呼吸",
    gradient: ["#0f2027", "#2c5364"],
    moveCount: 18,
  },
  {
    id: "cardio",
    title: "有氧燃脂",
    subtitle: "心肺与耐力训练",
    gradient: ["#200122", "#6f0000"],
    moveCount: 16,
  },
  {
    id: "stretch",
    title: "拉伸康复",
    subtitle: "恢复与灵活性",
    gradient: ["#134e5e", "#71b280"],
    moveCount: 12,
  },
];

export const featuredMoves: ContentItem[] = [
  {
    id: "move-kettlebell-squat",
    title: "壶铃深蹲",
    subtitle: "下肢力量与稳定性",
    meta: "中级 · 12 分钟",
    badge: "新",
    gradient: ["#1a1a2e", "#16213e"],
  },
  {
    id: "move-pilates-core",
    title: "普拉提核心流",
    subtitle: "呼吸引导的核心训练",
    meta: "初级 · 10 分钟",
    gradient: ["#0f2027", "#2c5364"],
  },
  {
    id: "move-power-row",
    title: "力量划船",
    subtitle: "背部与核心链驱动",
    meta: "初级 · 8 分钟",
    gradient: ["#232526", "#414345"],
  },
];

export type TodayPlanSession = {
  /** 已加入计划 ID，对应探索库 / 我的计划详情 */
  planId: string;
  name: string;
  weekDayLabel: string;
};

export type TodayPlanReminderKind = "training" | "rest" | "free";

export type TodayPlanReminder = {
  kind: TodayPlanReminderKind;
  label: string;
  title: string;
  subtitle: string;
  sessions: TodayPlanSession[];
};

/**
 * 与设备端 `resolveHomeTrainingState` 一致：
 * - 训练日：当月 12 / 14 / 18
 * - 休息日：当月 13 / 15 / 17
 * - 其余有加入计划时为 free（设备端隐藏提醒；App 展示「暂无计划」态）
 */
const DEVICE_TRAINING_DAYS = [12, 14, 18];
const DEVICE_REST_DAYS = [13, 15, 17];

function buildJoinedPlanSessions(date: Date): TodayPlanSession[] {
  const activePlans = myTrainingPlans.ongoing.filter((plan) => plan.status === "active");
  // 设备端演示：14 日展示最多 2 节，其余训练日展示 1 节
  const limit = date.getDate() === 14 ? 2 : 1;
  return activePlans.slice(0, limit).map((plan) => {
    const week = Math.max(1, Math.ceil(plan.currentDay / 7));
    return {
      planId: plan.id,
      name: plan.title,
      weekDayLabel: `(第${week}周/第${plan.currentDay}天)`,
    };
  });
}

export function getTodayPlanReminder(dateInput: Date | string = new Date()): TodayPlanReminder {
  const date = typeof dateInput === "string" ? parseIsoDate(dateInput) : dateInput;
  const dayOfMonth = date.getDate();

  if (DEVICE_REST_DAYS.includes(dayOfMonth)) {
    return {
      kind: "rest",
      label: "今日计划提醒",
      title: "今天是休息日",
      subtitle: "今天仍可选择自由训练。",
      sessions: [],
    };
  }

  if (DEVICE_TRAINING_DAYS.includes(dayOfMonth)) {
    const sessions = buildJoinedPlanSessions(date);
    return {
      kind: "training",
      label: "今日计划提醒",
      title: `今日有 ${sessions.length} 节计划训练`,
      subtitle: "基于你已加入的计划。",
      sessions,
    };
  }

  return {
    kind: "free",
    label: "今日计划提醒",
    title: "今日暂无计划训练",
    subtitle: "可选择自由训练。",
    sessions: [],
  };
}

export const bodyDataPlaceholder = {
  title: "身体数据",
  status: "暂无数据",
  hint: "连接体测设备或第三方数据源后将在此展示",
};
