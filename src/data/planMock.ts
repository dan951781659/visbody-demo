export type GeneratedPlan = {
  id: string;
  name: string;
  cycleLabel: string;
  createdAtLabel: string;
  statusLabel: string;
  summary: string;
};

export type MyTrainingPlanStatus = "active" | "completed" | "quit" | "ended";

export type MyTrainingPlan = {
  id: string;
  title: string;
  durationLabel: string;
  progress: number;
  currentDay: number;
  totalDays: number;
  status: MyTrainingPlanStatus;
  statusLabel: string;
  dateLabel?: string;
  isPersonalized?: boolean;
};

export type MyTrainingPlansTab = "ongoing" | "history";

export type ProfileFieldType = "text" | "multi" | "single";

export type ProfileFieldConfig = {
  key: string;
  label: string;
  required?: boolean;
  type: ProfileFieldType;
  placeholder: string;
  multiline?: boolean;
};

export type ProfileStepConfig = {
  id: string;
  title: string;
  subtitle: string;
  fields: ProfileFieldConfig[];
};

export type GenerationStep = {
  id: string;
  label: string;
};

/** @deprecated Prefer myTrainingPlans; kept for any legacy references */
export const generatedPlans: GeneratedPlan[] = [
  {
    id: "plan-lean-lower-3w-4x",
    name: "春季减脂计划",
    cycleLabel: "30 天周期",
    createdAtLabel: "进行中",
    statusLabel: "进行中",
    summary: "个性化 · 第 12 / 30 天",
  },
  {
    id: "plan-strength-2w-3x",
    name: "核心优先计划",
    cycleLabel: "14 天周期",
    createdAtLabel: "进行中",
    statusLabel: "进行中",
    summary: "第 2 / 14 天",
  },
];

/** Aligned with device-side plan-b-my-training-plans myPlansData */
export const myTrainingPlans: Record<MyTrainingPlansTab, MyTrainingPlan[]> = {
  ongoing: [
    {
      id: "plan-lean-lower-3w-4x",
      title: "春季减脂计划",
      durationLabel: "30 天",
      progress: 40,
      currentDay: 12,
      totalDays: 30,
      status: "active",
      statusLabel: "进行中",
      isPersonalized: true,
    },
    {
      id: "plan-strength-2w-3x",
      title: "核心优先计划",
      durationLabel: "14 天",
      progress: 14,
      currentDay: 2,
      totalDays: 14,
      status: "active",
      statusLabel: "进行中",
    },
  ],
  history: [
    {
      id: "plan-pilates-core-4w-5x",
      title: "入门周计划",
      durationLabel: "7 天",
      progress: 100,
      currentDay: 7,
      totalDays: 7,
      status: "completed",
      statusLabel: "已完成",
      dateLabel: "2026年3月15日",
    },
    {
      id: "plan-cardio-burn-4w-4x",
      title: "精瘦力量 21 天",
      durationLabel: "21 天",
      progress: 30,
      currentDay: 6,
      totalDays: 21,
      status: "quit",
      statusLabel: "已退出",
      dateLabel: "2026年2月20日",
      isPersonalized: true,
    },
    {
      id: "plan-upper-control-2w-3x",
      title: "周末运动计划",
      durationLabel: "8 天",
      progress: 0,
      currentDay: 0,
      totalDays: 8,
      status: "ended",
      statusLabel: "已结束",
      dateLabel: "2026年1月10日",
      isPersonalized: true,
    },
  ],
};

export const profileSteps: ProfileStepConfig[] = [
  {
    id: "health",
    title: "健康背景",
    subtitle: "了解健康状况，规避训练风险",
    fields: [
      {
        key: "diseaseHistory",
        label: "疾病史",
        type: "multi",
        placeholder: "请选择疾病史（可多选）",
      },
      {
        key: "medications",
        label: "当前用药",
        type: "text",
        placeholder: "请填写当前用药情况",
        multiline: true,
      },
      {
        key: "exerciseContraindications",
        label: "运动禁忌",
        type: "text",
        placeholder: "请填写运动禁忌",
        multiline: true,
      },
    ],
  },
  {
    id: "lifestyle",
    title: "生活方式",
    subtitle: "结合日常习惯，优化训练与营养建议",
    fields: [
      {
        key: "activityLevel",
        label: "日常活动量",
        type: "multi",
        placeholder: "请选择日常活动量",
      },
      {
        key: "sleepDuration",
        label: "睡眠时长",
        type: "multi",
        placeholder: "请选择睡眠时长",
      },
      {
        key: "dailyParams",
        label: "每日参数",
        type: "multi",
        placeholder: "请选择每日参数",
      },
      {
        key: "dietPreference",
        label: "饮食要求或偏好",
        type: "multi",
        placeholder: "请选择饮食要求或偏好",
      },
      {
        key: "preferredIngredients",
        label: "偏好食材",
        type: "text",
        placeholder: "请填写偏好食材",
        multiline: true,
      },
    ],
  },
  {
    id: "goals",
    title: "运动目标与偏好",
    subtitle: "明确训练方向与注意事项",
    fields: [
      {
        key: "trainingGoals",
        label: "训练目标",
        type: "multi",
        placeholder: "请选择训练目标",
      },
      {
        key: "trainingFrequency",
        label: "训练频率",
        type: "multi",
        placeholder: "请选择训练频率",
      },
      {
        key: "sessionDuration",
        label: "单次训练时长",
        type: "multi",
        placeholder: "请选择单次训练时长",
      },
      {
        key: "focusAreas",
        label: "重点训练部位",
        type: "multi",
        placeholder: "请选择重点训练部位",
      },
      {
        key: "injuryAreas",
        label: "需注意的伤病部位",
        type: "multi",
        placeholder: "请选择需注意的伤病部位",
      },
      {
        key: "bodyGoals",
        label: "形体管理目标",
        type: "multi",
        placeholder: "请选择形体管理目标",
      },
      {
        key: "abilityGoals",
        label: "运动能力提升需求",
        type: "multi",
        placeholder: "请选择运动能力提升需求",
      },
    ],
  },
  {
    id: "outline",
    title: "训练大纲偏好",
    subtitle: "选择期望的训练周期，并补充其他说明",
    fields: [
      {
        key: "trainingCycle",
        label: "训练周期",
        type: "single",
        placeholder: "请选择训练周期",
      },
      {
        key: "extraInfo",
        label: "补充信息",
        type: "text",
        placeholder: "请填写补充说明（选填）",
        multiline: true,
      },
    ],
  },
];

export const generationSteps: GenerationStep[] = [
  { id: "health", label: "分析健康档案" },
  { id: "body", label: "解读体测数据" },
  { id: "goals", label: "生成训练目标" },
  { id: "plan", label: "编排周期训练计划" },
  { id: "nutrition", label: "规划营养建议" },
  { id: "notes", label: "整理复盘与注意事项" },
];

export const PROFILE_STEP_COUNT = profileSteps.length;
