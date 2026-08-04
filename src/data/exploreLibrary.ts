import type {
  AiMoveItem,
  FilterConfig,
  LibraryItem,
  LibraryTab,
  MoveItem,
  PlanItem,
} from "@/types/content";

const gradients: [string, string][] = [
  ["#1a1a2e", "#e94560"],
  ["#0f2027", "#2c5364"],
  ["#200122", "#6f0000"],
  ["#134e5e", "#71b280"],
  ["#232526", "#414345"],
  ["#0f2027", "#203a43"],
  ["#1a1a2e", "#16213e"],
  ["#200122", "#4a0e0e"],
];

function gradientFor(index: number): [string, string] {
  return gradients[index % gradients.length];
}

const defaultKeyPoints = [
  "先建立稳定的起始姿势，并收紧核心。",
  "发力时驱动目标肌群，避免借助惯性。",
  "控制还原速度，保持动作轨迹一致。",
];

const defaultBreathing =
  "用力时呼气，还原时吸气。保持平稳呼吸，不要憋气。";

const defaultMistakes = [
  "耸肩，用颈部代偿。",
  "速度过快，缺乏控制。",
  "在动作末端失去关节对齐。",
];

export const moves: MoveItem[] = [
  {
    id: "move-kettlebell-squat",
    kind: "move",
    name: "壶铃深蹲",
    summary: "下肢力量与支撑控制训练。",
    scene: "Strength Training",
    equipment: "Handle",
    targetArea: "Legs",
    difficulty: "Intermediate",
    supportsAi: true,
    gradient: gradientFor(0),
    durationMinutes: 12,
    description:
      "这一下肢动作模式通过重复练习，提升深蹲深度、核心收紧与控制节奏。",
    keyPoints: defaultKeyPoints,
    breathing: defaultBreathing,
    commonMistakes: defaultMistakes,
  },
  {
    id: "move-power-row",
    kind: "move",
    name: "力量划船",
    summary: "背部链驱动与核心稳定。",
    scene: "Strength Training",
    equipment: "Dual Cable",
    targetArea: "Back",
    difficulty: "Beginner",
    supportsAi: true,
    gradient: gradientFor(1),
    durationMinutes: 18,
    description:
      "以拉动模式为主，强调肩胛控制、背阔肌参与，以及全程躯干稳定。",
    keyPoints: defaultKeyPoints,
    breathing: defaultBreathing,
    commonMistakes: defaultMistakes,
  },
  {
    id: "move-shoulder-press",
    kind: "move",
    name: "肩推",
    summary: "过头推举，强化上肢力量。",
    scene: "Strength Training",
    equipment: "Barbell",
    targetArea: "Shoulders",
    difficulty: "Advanced",
    supportsAi: false,
    gradient: gradientFor(2),
    durationMinutes: 15,
    description:
      "提升过头推举力量，同时强化肩部稳定与身体对齐姿态。",
    keyPoints: defaultKeyPoints,
    breathing: defaultBreathing,
    commonMistakes: defaultMistakes,
  },
  {
    id: "move-pilates-core-flow",
    kind: "move",
    name: "普拉提核心流",
    summary: "以呼吸引导的深层核心激活序列。",
    scene: "Pilates",
    equipment: "Bodyweight",
    targetArea: "Full Body",
    difficulty: "Beginner",
    supportsAi: true,
    gradient: gradientFor(3),
    durationMinutes: 10,
    description:
      "一组可控的核心序列，串联呼吸、躯干稳定与流畅过渡。",
    keyPoints: defaultKeyPoints,
    breathing: defaultBreathing,
    commonMistakes: defaultMistakes,
  },
  {
    id: "move-battle-rope-burn",
    kind: "move",
    name: "战绳燃脂",
    summary: "快速间歇，提升有氧耐力。",
    scene: "Cardio Fat Burn",
    equipment: "Dual Cable",
    targetArea: "Upper Limbs",
    difficulty: "Advanced",
    supportsAi: false,
    gradient: gradientFor(4),
    durationMinutes: 14,
    description:
      "高节奏间歇训练，挑战上肢耐力与心率反应。",
    keyPoints: defaultKeyPoints,
    breathing: defaultBreathing,
    commonMistakes: defaultMistakes,
  },
  {
    id: "move-deadlift-basics",
    kind: "move",
    name: "硬拉基础",
    summary: "后链力学与节奏控制。",
    scene: "Strength Training",
    equipment: "Barbell",
    targetArea: "Back",
    difficulty: "Intermediate",
    supportsAi: true,
    gradient: gradientFor(5),
    durationMinutes: 16,
    description:
      "介绍髋铰链力学、核心收紧与可控杠铃轨迹，用于后链训练。",
    keyPoints: defaultKeyPoints,
    breathing: defaultBreathing,
    commonMistakes: defaultMistakes,
  },
  {
    id: "move-glute-bridge",
    kind: "move",
    name: "臀桥",
    summary: "髋伸展与臀部激活。",
    scene: "Stretch Recovery",
    equipment: "Bodyweight",
    targetArea: "Glutes",
    difficulty: "Beginner",
    supportsAi: false,
    gradient: gradientFor(6),
    durationMinutes: 9,
    description:
      "基础臀部激活练习，强化髋伸展、骨盆控制与躯干稳定。",
    keyPoints: defaultKeyPoints,
    breathing: defaultBreathing,
    commonMistakes: defaultMistakes,
  },
  {
    id: "move-side-plank-lift",
    kind: "move",
    name: "侧平板抬升",
    summary: "侧链稳定，强化肩与核心。",
    scene: "Pilates",
    equipment: "Bodyweight",
    targetArea: "Shoulders",
    difficulty: "Intermediate",
    supportsAi: true,
    gradient: gradientFor(7),
    durationMinutes: 11,
    description:
      "挑战侧向躯干稳定，同时强化肩部对齐与可控呼吸。",
    keyPoints: defaultKeyPoints,
    breathing: defaultBreathing,
    commonMistakes: defaultMistakes,
  },
  {
    id: "move-goblet-lunge",
    kind: "move",
    name: "高脚杯弓步",
    summary: "单腿控制与姿态训练。",
    scene: "Strength Training",
    equipment: "Handle",
    targetArea: "Legs",
    difficulty: "Intermediate",
    supportsAi: true,
    gradient: gradientFor(0),
    durationMinutes: 12,
    description:
      "在有支撑负荷的模式下，提升单腿力量、平衡与膝轨迹控制。",
    keyPoints: defaultKeyPoints,
    breathing: defaultBreathing,
    commonMistakes: defaultMistakes,
  },
  {
    id: "move-breath-reset",
    kind: "move",
    name: "呼吸复位",
    summary: "轻柔呼吸序列，用于恢复放松。",
    scene: "Stretch Recovery",
    equipment: "Bodyweight",
    targetArea: "Full Body",
    difficulty: "Beginner",
    supportsAi: false,
    gradient: gradientFor(1),
    durationMinutes: 6,
    description:
      "低强度呼吸与活动度复位，在高强度训练后帮助身体放松。",
    keyPoints: defaultKeyPoints,
    breathing: defaultBreathing,
    commonMistakes: defaultMistakes,
  },
];

export const aiMoves: AiMoveItem[] = [
  {
    id: "ai-smart-squat-coach",
    kind: "aiMove",
    name: "智能深蹲教练",
    summary: "AI 反馈深蹲深度、髋部偏移与节奏。",
    scene: "Strength Training",
    equipment: "Barbell",
    targetArea: "Legs",
    difficulty: "Intermediate",
    gradient: gradientFor(2),
    durationMinutes: 12,
    description:
      "借助 AI 指导，实时监测深蹲深度、髋部对齐与动作节奏。",
    keyPoints: defaultKeyPoints,
    breathing: defaultBreathing,
    commonMistakes: defaultMistakes,
  },
  {
    id: "ai-form-row-guide",
    kind: "aiMove",
    name: "划船姿势指导",
    summary: "AI 指导拉动轨迹与肩部对齐。",
    scene: "Strength Training",
    equipment: "Dual Cable",
    targetArea: "Back",
    difficulty: "Beginner",
    gradient: gradientFor(3),
    durationMinutes: 14,
    description:
      "追踪划船动作的拉动轨迹、肩部位置与躯干稳定。",
    keyPoints: defaultKeyPoints,
    breathing: defaultBreathing,
    commonMistakes: defaultMistakes,
  },
  {
    id: "ai-pilates-breath-sync",
    kind: "aiMove",
    name: "普拉提呼吸同步",
    summary: "呼吸节奏指导与核心提示。",
    scene: "Pilates",
    equipment: "Bodyweight",
    targetArea: "Full Body",
    difficulty: "Beginner",
    gradient: gradientFor(4),
    durationMinutes: 10,
    description:
      "将呼吸节奏与核心激活提示同步，让普拉提动作更流畅。",
    keyPoints: defaultKeyPoints,
    breathing: defaultBreathing,
    commonMistakes: defaultMistakes,
  },
  {
    id: "ai-lunge-balance-assist",
    kind: "aiMove",
    name: "弓步平衡辅助",
    summary: "AI 辅助骨盆稳定与膝轨迹控制。",
    scene: "Strength Training",
    equipment: "Handle",
    targetArea: "Legs",
    difficulty: "Intermediate",
    gradient: gradientFor(5),
    durationMinutes: 13,
    description:
      "在弓步类动作中，帮助维持骨盆控制与膝盖对齐。",
    keyPoints: defaultKeyPoints,
    breathing: defaultBreathing,
    commonMistakes: defaultMistakes,
  },
  {
    id: "ai-cardio-pulse-trainer",
    kind: "aiMove",
    name: "有氧心率训练",
    summary: "燃脂间歇的节奏与强度提示。",
    scene: "Cardio Fat Burn",
    equipment: "Dual Cable",
    targetArea: "Full Body",
    difficulty: "Advanced",
    gradient: gradientFor(6),
    durationMinutes: 16,
    description:
      "指导间歇节奏与强度目标，适用于有氧体能训练模块。",
    keyPoints: defaultKeyPoints,
    breathing: defaultBreathing,
    commonMistakes: defaultMistakes,
  },
  {
    id: "ai-posture-reset",
    kind: "aiMove",
    name: "体态复位教练",
    summary: "实时纠正颈部与上背姿态。",
    scene: "Stretch Recovery",
    equipment: "Bodyweight",
    targetArea: "Upper Limbs",
    difficulty: "Beginner",
    gradient: gradientFor(7),
    durationMinutes: 8,
    description:
      "在复位练习中，提供颈、肩与上背对齐的体态反馈。",
    keyPoints: defaultKeyPoints,
    breathing: defaultBreathing,
    commonMistakes: defaultMistakes,
  },
  {
    id: "ai-shoulder-control-lab",
    kind: "aiMove",
    name: "肩部控制实验室",
    summary: "肩胛时序分析，让推举更安全。",
    scene: "Strength Training",
    equipment: "Handle",
    targetArea: "Shoulders",
    difficulty: "Advanced",
    gradient: gradientFor(0),
    durationMinutes: 15,
    description:
      "分析肩胛时序与肩部控制，提升过头推举质量。",
    keyPoints: defaultKeyPoints,
    breathing: defaultBreathing,
    commonMistakes: defaultMistakes,
  },
  {
    id: "ai-glute-drive-monitor",
    kind: "aiMove",
    name: "臀驱动监测",
    summary: "臀桥髋驱动质量评分。",
    scene: "Stretch Recovery",
    equipment: "Bodyweight",
    targetArea: "Glutes",
    difficulty: "Intermediate",
    gradient: gradientFor(1),
    durationMinutes: 9,
    description:
      "对桥式激活练习中的髋驱动质量与骨盆控制进行评分。",
    keyPoints: defaultKeyPoints,
    breathing: defaultBreathing,
    commonMistakes: defaultMistakes,
  },
];

export const plans: PlanItem[] = [
  {
    id: "plan-strength-2w-3x",
    kind: "plan",
    name: "力量入门 2 周",
    summary: "两周建立全身力量基础。",
    scene: "Strength Training",
    cycleWeeks: "2 Weeks",
    sessionsPerWeek: "3 Sessions",
    targetArea: "Full Body",
    difficulty: "Beginner",
    gradient: gradientFor(2),
    intro:
      "为期两周的入门计划，聚焦规范动作模式与稳定的每周训练量。",
    schedule: [
      {
        week: 1,
        days: [
          {
            day: 1,
            moves: [
              {
                name: "壶铃深蹲",
                sets: 3,
                repsOrDuration: "12 次",
                restSeconds: 45,
                weightKg: 16,
              },
              {
                name: "力量划船",
                sets: 3,
                repsOrDuration: "10 次",
                restSeconds: 45,
                weightKg: 18,
              },
            ],
          },
          {
            day: 2,
            moves: [
              {
                name: "高脚杯弓步",
                sets: 3,
                repsOrDuration: "每侧 10 次",
                restSeconds: 50,
                weightKg: 14,
              },
              {
                name: "肩推",
                sets: 3,
                repsOrDuration: "8 次",
                restSeconds: 60,
                weightKg: 12,
              },
            ],
          },
          {
            day: 3,
            moves: [
              {
                name: "臀桥",
                sets: 3,
                repsOrDuration: "14 次",
                restSeconds: 40,
              },
              {
                name: "呼吸复位",
                sets: 2,
                repsOrDuration: "40 秒",
                restSeconds: 20,
              },
            ],
          },
        ],
      },
      {
        week: 2,
        days: [
          {
            day: 1,
            moves: [
              {
                name: "壶铃深蹲",
                sets: 4,
                repsOrDuration: "10 次",
                restSeconds: 50,
                weightKg: 18,
              },
              {
                name: "肩推",
                sets: 3,
                repsOrDuration: "10 次",
                restSeconds: 55,
                weightKg: 14,
              },
            ],
          },
          {
            day: 2,
            moves: [
              {
                name: "力量划船",
                sets: 4,
                repsOrDuration: "10 次",
                restSeconds: 55,
                weightKg: 20,
              },
              {
                name: "高脚杯弓步",
                sets: 3,
                repsOrDuration: "每侧 12 次",
                restSeconds: 55,
                weightKg: 16,
              },
            ],
          },
          {
            day: 3,
            moves: [
              {
                name: "侧平板抬升",
                sets: 3,
                repsOrDuration: "每侧 40 秒",
                restSeconds: 25,
              },
              {
                name: "呼吸复位",
                sets: 2,
                repsOrDuration: "50 秒",
                restSeconds: 20,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "plan-lean-lower-3w-4x",
    kind: "plan",
    name: "精瘦下肢",
    summary: "聚焦下肢进阶，配合平衡训练。",
    scene: "Strength Training",
    cycleWeeks: "3 Weeks",
    sessionsPerWeek: "4 Sessions",
    targetArea: "Legs",
    difficulty: "Intermediate",
    isPersonalized: true,
    gradient: gradientFor(3),
    intro:
      "以下肢为主的训练模块，结合力量组、单腿控制与恢复练习。",
    schedule: [
      {
        week: 1,
        days: [
          {
            day: 1,
            moves: [
              {
                name: "壶铃深蹲",
                sets: 4,
                repsOrDuration: "10 次",
                restSeconds: 60,
                weightKg: 20,
              },
              {
                name: "高脚杯弓步",
                sets: 3,
                repsOrDuration: "每侧 10 次",
                restSeconds: 55,
                weightKg: 16,
              },
            ],
          },
          {
            day: 2,
            moves: [
              {
                name: "臀桥",
                sets: 4,
                repsOrDuration: "15 次",
                restSeconds: 45,
              },
              {
                name: "侧平板抬升",
                sets: 3,
                repsOrDuration: "每侧 35 秒",
                restSeconds: 30,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "plan-pilates-core-4w-5x",
    kind: "plan",
    name: "普拉提核心习惯",
    summary: "每日核心稳定与呼吸练习。",
    scene: "Pilates",
    cycleWeeks: "4 Weeks",
    sessionsPerWeek: "5 Sessions",
    targetArea: "Full Body",
    difficulty: "Beginner",
    gradient: gradientFor(4),
    intro:
      "高频普拉提训练，聚焦呼吸、躯干稳定与姿态控制。",
    schedule: [
      {
        week: 1,
        days: [
          {
            day: 1,
            moves: [
              {
                name: "普拉提核心流",
                sets: 3,
                repsOrDuration: "45 秒",
                restSeconds: 20,
              },
              {
                name: "呼吸复位",
                sets: 2,
                repsOrDuration: "50 秒",
                restSeconds: 20,
              },
            ],
          },
          {
            day: 2,
            moves: [
              {
                name: "侧平板抬升",
                sets: 3,
                repsOrDuration: "每侧 30 秒",
                restSeconds: 25,
              },
              {
                name: "臀桥",
                sets: 3,
                repsOrDuration: "14 次",
                restSeconds: 35,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "plan-back-posture-2w-4x",
    kind: "plan",
    name: "背部体态复位",
    summary: "恢复上背姿态与耐力。",
    scene: "Stretch Recovery",
    cycleWeeks: "2 Weeks",
    sessionsPerWeek: "4 Sessions",
    targetArea: "Back",
    difficulty: "Beginner",
    gradient: gradientFor(5),
    intro:
      "短时复位模块，聚焦上背姿态、呼吸与可控拉动训练量。",
    schedule: [
      {
        week: 1,
        days: [
          {
            day: 1,
            moves: [
              {
                name: "力量划船",
                sets: 3,
                repsOrDuration: "12 次",
                restSeconds: 45,
                weightKg: 16,
              },
              {
                name: "呼吸复位",
                sets: 2,
                repsOrDuration: "45 秒",
                restSeconds: 20,
              },
            ],
          },
          {
            day: 2,
            moves: [
              {
                name: "肩推",
                sets: 3,
                repsOrDuration: "10 次",
                restSeconds: 55,
                weightKg: 12,
              },
              {
                name: "呼吸复位",
                sets: 2,
                repsOrDuration: "40 秒",
                restSeconds: 20,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "plan-shoulder-power-3w-5x",
    kind: "plan",
    name: "肩部力量模块",
    summary: "提升过头能力与控制。",
    scene: "Strength Training",
    cycleWeeks: "3 Weeks",
    sessionsPerWeek: "5 Sessions",
    targetArea: "Shoulders",
    difficulty: "Advanced",
    gradient: gradientFor(6),
    intro:
      "以过头训练为主的模块，强调肩部稳定、推举训练量与恢复。",
    schedule: [
      {
        week: 1,
        days: [
          {
            day: 1,
            moves: [
              {
                name: "肩推",
                sets: 4,
                repsOrDuration: "8 次",
                restSeconds: 70,
                weightKg: 16,
              },
              {
                name: "侧平板抬升",
                sets: 3,
                repsOrDuration: "每侧 35 秒",
                restSeconds: 30,
              },
            ],
          },
          {
            day: 2,
            moves: [
              {
                name: "力量划船",
                sets: 4,
                repsOrDuration: "10 次",
                restSeconds: 55,
                weightKg: 20,
              },
              {
                name: "呼吸复位",
                sets: 2,
                repsOrDuration: "45 秒",
                restSeconds: 20,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "plan-cardio-burn-4w-4x",
    kind: "plan",
    name: "有氧燃脂进阶",
    summary: "渐进式有氧训练，用于燃脂调节。",
    scene: "Cardio Fat Burn",
    cycleWeeks: "4 Weeks",
    sessionsPerWeek: "4 Sessions",
    targetArea: "Full Body",
    difficulty: "Intermediate",
    isPersonalized: true,
    gradient: gradientFor(7),
    intro:
      "渐进式有氧计划，包含间歇节奏与全身体能训练。",
    schedule: [
      {
        week: 1,
        days: [
          {
            day: 1,
            moves: [
              {
                name: "战绳燃脂",
                sets: 4,
                repsOrDuration: "30 秒",
                restSeconds: 40,
              },
              {
                name: "呼吸复位",
                sets: 2,
                repsOrDuration: "40 秒",
                restSeconds: 20,
              },
            ],
          },
          {
            day: 2,
            moves: [
              {
                name: "壶铃深蹲",
                sets: 3,
                repsOrDuration: "12 次",
                restSeconds: 45,
                weightKg: 14,
              },
              {
                name: "呼吸复位",
                sets: 2,
                repsOrDuration: "45 秒",
                restSeconds: 20,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "plan-upper-control-2w-3x",
    kind: "plan",
    name: "上肢控制基础",
    summary: "上肢动作模式与姿态节奏。",
    scene: "Pilates",
    cycleWeeks: "2 Weeks",
    sessionsPerWeek: "3 Sessions",
    targetArea: "Upper Limbs",
    difficulty: "Beginner",
    isPersonalized: true,
    gradient: gradientFor(0),
    intro:
      "介绍上肢控制、姿态节奏与低负荷稳定训练。",
    schedule: [
      {
        week: 1,
        days: [
          {
            day: 1,
            moves: [
              {
                name: "力量划船",
                sets: 3,
                repsOrDuration: "10 次",
                restSeconds: 45,
                weightKg: 14,
              },
              {
                name: "侧平板抬升",
                sets: 2,
                repsOrDuration: "每侧 30 秒",
                restSeconds: 25,
              },
            ],
          },
          {
            day: 2,
            moves: [
              {
                name: "肩推",
                sets: 3,
                repsOrDuration: "8 次",
                restSeconds: 55,
                weightKg: 10,
              },
              {
                name: "呼吸复位",
                sets: 2,
                repsOrDuration: "40 秒",
                restSeconds: 20,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "plan-glute-activation-3w-3x",
    kind: "plan",
    name: "臀部激活周期",
    summary: "聚焦髋稳定与臀部耐力。",
    scene: "Stretch Recovery",
    cycleWeeks: "3 Weeks",
    sessionsPerWeek: "3 Sessions",
    targetArea: "Glutes",
    difficulty: "Intermediate",
    gradient: gradientFor(1),
    intro:
      "以臀部为主的训练周期，结合激活练习、髋稳定与恢复训练。",
    schedule: [
      {
        week: 1,
        days: [
          {
            day: 1,
            moves: [
              {
                name: "臀桥",
                sets: 4,
                repsOrDuration: "15 次",
                restSeconds: 45,
              },
              {
                name: "呼吸复位",
                sets: 2,
                repsOrDuration: "45 秒",
                restSeconds: 20,
              },
            ],
          },
          {
            day: 2,
            moves: [
              {
                name: "高脚杯弓步",
                sets: 3,
                repsOrDuration: "每侧 10 次",
                restSeconds: 50,
                weightKg: 12,
              },
              {
                name: "臀桥",
                sets: 3,
                repsOrDuration: "16 次",
                restSeconds: 40,
              },
            ],
          },
        ],
      },
    ],
  },
];

const sceneOptions = [
  { value: "Strength Training", label: "力量训练" },
  { value: "Pilates", label: "普拉提" },
  { value: "Cardio Fat Burn", label: "有氧燃脂" },
  { value: "Stretch Recovery", label: "拉伸康复" },
];

const equipmentOptions = [
  { value: "Dual Cable", label: "双拉索" },
  { value: "Bodyweight", label: "自重" },
  { value: "Barbell", label: "杠铃" },
  { value: "Handle", label: "握把" },
];

const targetAreaOptions = [
  { value: "Full Body", label: "全身" },
  { value: "Upper Limbs", label: "上肢" },
  { value: "Shoulders", label: "肩部" },
  { value: "Back", label: "背部" },
  { value: "Glutes", label: "臀部" },
  { value: "Legs", label: "腿部" },
];

const difficultyOptions = [
  { value: "Beginner", label: "初级" },
  { value: "Intermediate", label: "中级" },
  { value: "Advanced", label: "高级" },
];

export const VALUE_LABELS: Record<string, string> = Object.fromEntries([
  ...sceneOptions,
  ...equipmentOptions,
  ...targetAreaOptions,
  ...difficultyOptions,
  { value: "Yes", label: "支持" },
  { value: "No", label: "不支持" },
  { value: "Recommended", label: "推荐" },
  { value: "Personalized", label: "个性化" },
  { value: "2 Weeks", label: "2 周" },
  { value: "3 Weeks", label: "3 周" },
  { value: "4 Weeks", label: "4 周" },
  { value: "3 Sessions", label: "每周 3 次" },
  { value: "4 Sessions", label: "每周 4 次" },
  { value: "5 Sessions", label: "每周 5 次" },
  { value: "AI", label: "AI" },
].map(({ value, label }) => [value, label]));

export function formatLibraryValue(value: string): string {
  return VALUE_LABELS[value] ?? value;
}

export const TAB_CONFIG: Record<
  LibraryTab,
  { label: string; filters: FilterConfig[] }
> = {
  moves: {
    label: "动作",
    filters: [
      { key: "scene", label: "场景", options: sceneOptions },
      { key: "equipment", label: "器械", options: equipmentOptions },
      { key: "targetArea", label: "目标部位", options: targetAreaOptions },
      { key: "difficulty", label: "难度", options: difficultyOptions },
      {
        key: "supportsAi",
        label: "AI 支持",
        options: [
          { value: "Yes", label: "支持" },
          { value: "No", label: "不支持" },
        ],
      },
    ],
  },
  aiMoves: {
    label: "AI 动作",
    filters: [
      { key: "scene", label: "场景", options: sceneOptions },
      { key: "equipment", label: "器械", options: equipmentOptions },
      { key: "targetArea", label: "目标部位", options: targetAreaOptions },
      { key: "difficulty", label: "难度", options: difficultyOptions },
    ],
  },
  plans: {
    label: "计划",
    filters: [
      {
        key: "planType",
        label: "计划类型",
        options: [
          { value: "Recommended", label: "推荐" },
          { value: "Personalized", label: "个性化" },
        ],
      },
      { key: "scene", label: "场景", options: sceneOptions },
      {
        key: "cycleWeeks",
        label: "周期",
        options: [
          { value: "2 Weeks", label: "2 周" },
          { value: "3 Weeks", label: "3 周" },
          { value: "4 Weeks", label: "4 周" },
        ],
      },
      {
        key: "sessionsPerWeek",
        label: "每周频次",
        options: [
          { value: "3 Sessions", label: "每周 3 次" },
          { value: "4 Sessions", label: "每周 4 次" },
          { value: "5 Sessions", label: "每周 5 次" },
        ],
      },
      { key: "targetArea", label: "目标部位", options: targetAreaOptions },
      { key: "difficulty", label: "难度", options: difficultyOptions },
    ],
  },
};

export function getItemsForTab(tab: LibraryTab): LibraryItem[] {
  if (tab === "moves") return moves;
  if (tab === "aiMoves") return aiMoves;
  return plans;
}

export function getItemById(type: LibraryTab, id: string): LibraryItem | undefined {
  return getItemsForTab(type).find((item) => item.id === id);
}

export function tabToRouteType(tab: LibraryTab): LibraryTab {
  return tab;
}

export function getFilterValue(item: LibraryItem, key: string): string | undefined {
  if (key === "supportsAi" && item.kind === "move") {
    return item.supportsAi ? "Yes" : "No";
  }
  if (key === "planType" && item.kind === "plan") {
    return item.isPersonalized ? "Personalized" : "Recommended";
  }
  if (key in item) {
    return String((item as Record<string, unknown>)[key]);
  }
  return undefined;
}

export function getMetaTags(item: LibraryItem, tab: LibraryTab): string[] {
  const tags: string[] = [
    formatLibraryValue(item.difficulty),
    formatLibraryValue(item.scene),
    formatLibraryValue(item.targetArea),
  ];
  if (item.kind === "move") {
    tags.push(formatLibraryValue(item.equipment));
    if (item.supportsAi) tags.push("AI");
  }
  if (item.kind === "aiMove") {
    tags.push(formatLibraryValue(item.equipment), "AI");
  }
  if (item.kind === "plan") {
    tags.push(formatLibraryValue(item.cycleWeeks), formatLibraryValue(item.sessionsPerWeek));
    if (tab === "plans" && item.isPersonalized) tags.push(formatLibraryValue("Personalized"));
  }
  return tags;
}
