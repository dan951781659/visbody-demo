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
  "Set a stable starting posture and brace your core first.",
  "Drive through the target muscles without using momentum.",
  "Return with control and keep the movement path consistent.",
];

const defaultBreathing =
  "Exhale on the effort phase and inhale on the return. Keep steady breathing without holding your breath.";

const defaultMistakes = [
  "Shrugging shoulders and compensating with the neck.",
  "Moving too fast with poor control.",
  "Losing joint alignment at the end range.",
];

export const moves: MoveItem[] = [
  {
    id: "move-kettlebell-squat",
    kind: "move",
    name: "Kettlebell Squat",
    summary: "Lower-body strength and support control.",
    scene: "Strength Training",
    equipment: "Handle",
    targetArea: "Legs",
    difficulty: "Intermediate",
    supportsAi: true,
    gradient: gradientFor(0),
    durationMinutes: 12,
    description:
      "This lower-body pattern builds squat depth, bracing, and controlled tempo through repeated reps.",
    keyPoints: defaultKeyPoints,
    breathing: defaultBreathing,
    commonMistakes: defaultMistakes,
  },
  {
    id: "move-power-row",
    kind: "move",
    name: "Power Row",
    summary: "Back-chain drive with core stability.",
    scene: "Strength Training",
    equipment: "Dual Cable",
    targetArea: "Back",
    difficulty: "Beginner",
    supportsAi: true,
    gradient: gradientFor(1),
    durationMinutes: 18,
    description:
      "A pulling pattern focused on scapular control, lat engagement, and a stable trunk throughout each rep.",
    keyPoints: defaultKeyPoints,
    breathing: defaultBreathing,
    commonMistakes: defaultMistakes,
  },
  {
    id: "move-shoulder-press",
    kind: "move",
    name: "Shoulder Press",
    summary: "Overhead pressing for upper-body strength.",
    scene: "Strength Training",
    equipment: "Barbell",
    targetArea: "Shoulders",
    difficulty: "Advanced",
    supportsAi: false,
    gradient: gradientFor(2),
    durationMinutes: 15,
    description:
      "Builds overhead pressing strength while reinforcing shoulder stability and stacked posture.",
    keyPoints: defaultKeyPoints,
    breathing: defaultBreathing,
    commonMistakes: defaultMistakes,
  },
  {
    id: "move-pilates-core-flow",
    kind: "move",
    name: "Pilates Core Flow",
    summary: "Breath-led deep core activation flow.",
    scene: "Pilates",
    equipment: "Bodyweight",
    targetArea: "Full Body",
    difficulty: "Beginner",
    supportsAi: true,
    gradient: gradientFor(3),
    durationMinutes: 10,
    description:
      "A controlled core sequence that links breathing, trunk stability, and smooth transitions.",
    keyPoints: defaultKeyPoints,
    breathing: defaultBreathing,
    commonMistakes: defaultMistakes,
  },
  {
    id: "move-battle-rope-burn",
    kind: "move",
    name: "Battle Rope Burn",
    summary: "Fast intervals for cardio endurance.",
    scene: "Cardio Fat Burn",
    equipment: "Dual Cable",
    targetArea: "Upper Limbs",
    difficulty: "Advanced",
    supportsAi: false,
    gradient: gradientFor(4),
    durationMinutes: 14,
    description:
      "High-tempo intervals that challenge upper-body endurance and heart-rate response.",
    keyPoints: defaultKeyPoints,
    breathing: defaultBreathing,
    commonMistakes: defaultMistakes,
  },
  {
    id: "move-deadlift-basics",
    kind: "move",
    name: "Deadlift Basics",
    summary: "Posterior-chain mechanics and tempo control.",
    scene: "Strength Training",
    equipment: "Barbell",
    targetArea: "Back",
    difficulty: "Intermediate",
    supportsAi: true,
    gradient: gradientFor(5),
    durationMinutes: 16,
    description:
      "Introduces hip hinge mechanics, bracing, and controlled bar path for posterior-chain training.",
    keyPoints: defaultKeyPoints,
    breathing: defaultBreathing,
    commonMistakes: defaultMistakes,
  },
  {
    id: "move-glute-bridge",
    kind: "move",
    name: "Glute Bridge",
    summary: "Hip extension and glute activation.",
    scene: "Stretch Recovery",
    equipment: "Bodyweight",
    targetArea: "Glutes",
    difficulty: "Beginner",
    supportsAi: false,
    gradient: gradientFor(6),
    durationMinutes: 9,
    description:
      "A foundational glute activation drill for hip extension, pelvic control, and trunk stability.",
    keyPoints: defaultKeyPoints,
    breathing: defaultBreathing,
    commonMistakes: defaultMistakes,
  },
  {
    id: "move-side-plank-lift",
    kind: "move",
    name: "Side Plank Lift",
    summary: "Side-chain stability for shoulders and core.",
    scene: "Pilates",
    equipment: "Bodyweight",
    targetArea: "Shoulders",
    difficulty: "Intermediate",
    supportsAi: true,
    gradient: gradientFor(7),
    durationMinutes: 11,
    description:
      "Challenges lateral trunk stability while reinforcing shoulder stacking and controlled breathing.",
    keyPoints: defaultKeyPoints,
    breathing: defaultBreathing,
    commonMistakes: defaultMistakes,
  },
  {
    id: "move-goblet-lunge",
    kind: "move",
    name: "Goblet Lunge",
    summary: "Single-leg control and posture training.",
    scene: "Strength Training",
    equipment: "Handle",
    targetArea: "Legs",
    difficulty: "Intermediate",
    supportsAi: true,
    gradient: gradientFor(0),
    durationMinutes: 12,
    description:
      "Builds single-leg strength, balance, and knee tracking with a supported loading pattern.",
    keyPoints: defaultKeyPoints,
    breathing: defaultBreathing,
    commonMistakes: defaultMistakes,
  },
  {
    id: "move-breath-reset",
    kind: "move",
    name: "Breath Reset",
    summary: "Gentle breathing sequence for recovery.",
    scene: "Stretch Recovery",
    equipment: "Bodyweight",
    targetArea: "Full Body",
    difficulty: "Beginner",
    supportsAi: false,
    gradient: gradientFor(1),
    durationMinutes: 6,
    description:
      "A low-intensity breathing and mobility reset to downshift after harder training blocks.",
    keyPoints: defaultKeyPoints,
    breathing: defaultBreathing,
    commonMistakes: defaultMistakes,
  },
];

export const aiMoves: AiMoveItem[] = [
  {
    id: "ai-smart-squat-coach",
    kind: "aiMove",
    name: "Smart Squat Coach",
    summary: "AI feedback on depth, hip shift, and tempo.",
    scene: "Strength Training",
    equipment: "Barbell",
    targetArea: "Legs",
    difficulty: "Intermediate",
    gradient: gradientFor(2),
    durationMinutes: 12,
    description:
      "Uses AI guidance to monitor squat depth, hip alignment, and rep tempo in real time.",
    keyPoints: defaultKeyPoints,
    breathing: defaultBreathing,
    commonMistakes: defaultMistakes,
  },
  {
    id: "ai-form-row-guide",
    kind: "aiMove",
    name: "Row Form Guide",
    summary: "AI coaching for pull path and shoulder alignment.",
    scene: "Strength Training",
    equipment: "Dual Cable",
    targetArea: "Back",
    difficulty: "Beginner",
    gradient: gradientFor(3),
    durationMinutes: 14,
    description:
      "Tracks pulling path, shoulder position, and trunk stability during rowing patterns.",
    keyPoints: defaultKeyPoints,
    breathing: defaultBreathing,
    commonMistakes: defaultMistakes,
  },
  {
    id: "ai-pilates-breath-sync",
    kind: "aiMove",
    name: "Pilates Breath Sync",
    summary: "Breath timing guidance with core cues.",
    scene: "Pilates",
    equipment: "Bodyweight",
    targetArea: "Full Body",
    difficulty: "Beginner",
    gradient: gradientFor(4),
    durationMinutes: 10,
    description:
      "Synchronizes breathing rhythm with core activation cues for smoother Pilates flow.",
    keyPoints: defaultKeyPoints,
    breathing: defaultBreathing,
    commonMistakes: defaultMistakes,
  },
  {
    id: "ai-lunge-balance-assist",
    kind: "aiMove",
    name: "Lunge Balance Assist",
    summary: "AI support for pelvic stability and knee tracking.",
    scene: "Strength Training",
    equipment: "Handle",
    targetArea: "Legs",
    difficulty: "Intermediate",
    gradient: gradientFor(5),
    durationMinutes: 13,
    description:
      "Helps maintain pelvic control and knee alignment during lunge-based patterns.",
    keyPoints: defaultKeyPoints,
    breathing: defaultBreathing,
    commonMistakes: defaultMistakes,
  },
  {
    id: "ai-cardio-pulse-trainer",
    kind: "aiMove",
    name: "Cardio Pulse Trainer",
    summary: "Pacing and intensity cues for fat-burn intervals.",
    scene: "Cardio Fat Burn",
    equipment: "Dual Cable",
    targetArea: "Full Body",
    difficulty: "Advanced",
    gradient: gradientFor(6),
    durationMinutes: 16,
    description:
      "Guides interval pacing and intensity targets for cardio-focused conditioning blocks.",
    keyPoints: defaultKeyPoints,
    breathing: defaultBreathing,
    commonMistakes: defaultMistakes,
  },
  {
    id: "ai-posture-reset",
    kind: "aiMove",
    name: "Posture Reset Coach",
    summary: "Real-time correction for neck and upper back.",
    scene: "Stretch Recovery",
    equipment: "Bodyweight",
    targetArea: "Upper Limbs",
    difficulty: "Beginner",
    gradient: gradientFor(7),
    durationMinutes: 8,
    description:
      "Provides posture feedback for neck, shoulder, and upper-back alignment during reset work.",
    keyPoints: defaultKeyPoints,
    breathing: defaultBreathing,
    commonMistakes: defaultMistakes,
  },
  {
    id: "ai-shoulder-control-lab",
    kind: "aiMove",
    name: "Shoulder Control Lab",
    summary: "Scapular timing analysis for safer pressing.",
    scene: "Strength Training",
    equipment: "Handle",
    targetArea: "Shoulders",
    difficulty: "Advanced",
    gradient: gradientFor(0),
    durationMinutes: 15,
    description:
      "Analyzes scapular timing and shoulder control to improve overhead pressing quality.",
    keyPoints: defaultKeyPoints,
    breathing: defaultBreathing,
    commonMistakes: defaultMistakes,
  },
  {
    id: "ai-glute-drive-monitor",
    kind: "aiMove",
    name: "Glute Drive Monitor",
    summary: "Hip-drive quality scoring for glute bridges.",
    scene: "Stretch Recovery",
    equipment: "Bodyweight",
    targetArea: "Glutes",
    difficulty: "Intermediate",
    gradient: gradientFor(1),
    durationMinutes: 9,
    description:
      "Scores hip-drive quality and pelvic control during bridge-based activation drills.",
    keyPoints: defaultKeyPoints,
    breathing: defaultBreathing,
    commonMistakes: defaultMistakes,
  },
];

export const plans: PlanItem[] = [
  {
    id: "plan-strength-2w-3x",
    kind: "plan",
    name: "Strength Starter 2 Weeks",
    summary: "Build a full-body strength foundation in two weeks.",
    scene: "Strength Training",
    cycleWeeks: "2 Weeks",
    sessionsPerWeek: "3 Sessions",
    targetArea: "Full Body",
    difficulty: "Beginner",
    gradient: gradientFor(2),
    intro:
      "A two-week entry plan focused on clean movement patterns and consistent weekly volume.",
    schedule: [
      {
        week: 1,
        days: [
          {
            day: 1,
            moves: [
              {
                name: "Kettlebell Squat",
                sets: 3,
                repsOrDuration: "12 reps",
                restSeconds: 45,
                weightKg: 16,
              },
              {
                name: "Power Row",
                sets: 3,
                repsOrDuration: "10 reps",
                restSeconds: 45,
                weightKg: 18,
              },
            ],
          },
          {
            day: 2,
            moves: [
              {
                name: "Goblet Lunge",
                sets: 3,
                repsOrDuration: "10/side",
                restSeconds: 50,
                weightKg: 14,
              },
              {
                name: "Shoulder Press",
                sets: 3,
                repsOrDuration: "8 reps",
                restSeconds: 60,
                weightKg: 12,
              },
            ],
          },
          {
            day: 3,
            moves: [
              {
                name: "Glute Bridge",
                sets: 3,
                repsOrDuration: "14 reps",
                restSeconds: 40,
              },
              {
                name: "Breath Reset",
                sets: 2,
                repsOrDuration: "40 sec",
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
                name: "Kettlebell Squat",
                sets: 4,
                repsOrDuration: "10 reps",
                restSeconds: 50,
                weightKg: 18,
              },
              {
                name: "Shoulder Press",
                sets: 3,
                repsOrDuration: "10 reps",
                restSeconds: 55,
                weightKg: 14,
              },
            ],
          },
          {
            day: 2,
            moves: [
              {
                name: "Power Row",
                sets: 4,
                repsOrDuration: "10 reps",
                restSeconds: 55,
                weightKg: 20,
              },
              {
                name: "Goblet Lunge",
                sets: 3,
                repsOrDuration: "12/side",
                restSeconds: 55,
                weightKg: 16,
              },
            ],
          },
          {
            day: 3,
            moves: [
              {
                name: "Side Plank Lift",
                sets: 3,
                repsOrDuration: "40 sec/side",
                restSeconds: 25,
              },
              {
                name: "Breath Reset",
                sets: 2,
                repsOrDuration: "50 sec",
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
    name: "Lean Lower Body",
    summary: "Lower-body focused progression with balance work.",
    scene: "Strength Training",
    cycleWeeks: "3 Weeks",
    sessionsPerWeek: "4 Sessions",
    targetArea: "Legs",
    difficulty: "Intermediate",
    isPersonalized: true,
    gradient: gradientFor(3),
    intro:
      "A lower-body block that blends strength sets with single-leg control and recovery work.",
    schedule: [
      {
        week: 1,
        days: [
          {
            day: 1,
            moves: [
              {
                name: "Kettlebell Squat",
                sets: 4,
                repsOrDuration: "10 reps",
                restSeconds: 60,
                weightKg: 20,
              },
              {
                name: "Goblet Lunge",
                sets: 3,
                repsOrDuration: "10/side",
                restSeconds: 55,
                weightKg: 16,
              },
            ],
          },
          {
            day: 2,
            moves: [
              {
                name: "Glute Bridge",
                sets: 4,
                repsOrDuration: "15 reps",
                restSeconds: 45,
              },
              {
                name: "Side Plank Lift",
                sets: 3,
                repsOrDuration: "35 sec/side",
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
    name: "Pilates Core Habit",
    summary: "Daily core stability and breath practice.",
    scene: "Pilates",
    cycleWeeks: "4 Weeks",
    sessionsPerWeek: "5 Sessions",
    targetArea: "Full Body",
    difficulty: "Beginner",
    gradient: gradientFor(4),
    intro:
      "High-frequency Pilates sessions focused on breath, trunk stability, and posture control.",
    schedule: [
      {
        week: 1,
        days: [
          {
            day: 1,
            moves: [
              {
                name: "Pilates Core Flow",
                sets: 3,
                repsOrDuration: "45 sec",
                restSeconds: 20,
              },
              {
                name: "Breath Reset",
                sets: 2,
                repsOrDuration: "50 sec",
                restSeconds: 20,
              },
            ],
          },
          {
            day: 2,
            moves: [
              {
                name: "Side Plank Lift",
                sets: 3,
                repsOrDuration: "30 sec/side",
                restSeconds: 25,
              },
              {
                name: "Glute Bridge",
                sets: 3,
                repsOrDuration: "14 reps",
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
    name: "Back Posture Reset",
    summary: "Restore upper-back posture and endurance.",
    scene: "Stretch Recovery",
    cycleWeeks: "2 Weeks",
    sessionsPerWeek: "4 Sessions",
    targetArea: "Back",
    difficulty: "Beginner",
    gradient: gradientFor(5),
    intro:
      "A short reset block for upper-back posture, breathing, and controlled pulling volume.",
    schedule: [
      {
        week: 1,
        days: [
          {
            day: 1,
            moves: [
              {
                name: "Power Row",
                sets: 3,
                repsOrDuration: "12 reps",
                restSeconds: 45,
                weightKg: 16,
              },
              {
                name: "Breath Reset",
                sets: 2,
                repsOrDuration: "45 sec",
                restSeconds: 20,
              },
            ],
          },
          {
            day: 2,
            moves: [
              {
                name: "Shoulder Press",
                sets: 3,
                repsOrDuration: "10 reps",
                restSeconds: 55,
                weightKg: 12,
              },
              {
                name: "Breath Reset",
                sets: 2,
                repsOrDuration: "40 sec",
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
    name: "Shoulder Power Block",
    summary: "Build overhead capacity and control.",
    scene: "Strength Training",
    cycleWeeks: "3 Weeks",
    sessionsPerWeek: "5 Sessions",
    targetArea: "Shoulders",
    difficulty: "Advanced",
    gradient: gradientFor(6),
    intro:
      "An overhead-focused block emphasizing shoulder stability, pressing volume, and recovery.",
    schedule: [
      {
        week: 1,
        days: [
          {
            day: 1,
            moves: [
              {
                name: "Shoulder Press",
                sets: 4,
                repsOrDuration: "8 reps",
                restSeconds: 70,
                weightKg: 16,
              },
              {
                name: "Side Plank Lift",
                sets: 3,
                repsOrDuration: "35 sec/side",
                restSeconds: 30,
              },
            ],
          },
          {
            day: 2,
            moves: [
              {
                name: "Power Row",
                sets: 4,
                repsOrDuration: "10 reps",
                restSeconds: 55,
                weightKg: 20,
              },
              {
                name: "Breath Reset",
                sets: 2,
                repsOrDuration: "45 sec",
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
    name: "Cardio Burn Builder",
    summary: "Progressive cardio sessions for fat-burn conditioning.",
    scene: "Cardio Fat Burn",
    cycleWeeks: "4 Weeks",
    sessionsPerWeek: "4 Sessions",
    targetArea: "Full Body",
    difficulty: "Intermediate",
    isPersonalized: true,
    gradient: gradientFor(7),
    intro:
      "A progressive cardio plan with interval pacing and full-body conditioning sessions.",
    schedule: [
      {
        week: 1,
        days: [
          {
            day: 1,
            moves: [
              {
                name: "Battle Rope Burn",
                sets: 4,
                repsOrDuration: "30 sec",
                restSeconds: 40,
              },
              {
                name: "Breath Reset",
                sets: 2,
                repsOrDuration: "40 sec",
                restSeconds: 20,
              },
            ],
          },
          {
            day: 2,
            moves: [
              {
                name: "Kettlebell Squat",
                sets: 3,
                repsOrDuration: "12 reps",
                restSeconds: 45,
                weightKg: 14,
              },
              {
                name: "Breath Reset",
                sets: 2,
                repsOrDuration: "45 sec",
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
    name: "Upper Control Basics",
    summary: "Upper-body patterns with posture rhythm.",
    scene: "Pilates",
    cycleWeeks: "2 Weeks",
    sessionsPerWeek: "3 Sessions",
    targetArea: "Upper Limbs",
    difficulty: "Beginner",
    isPersonalized: true,
    gradient: gradientFor(0),
    intro:
      "Introduces upper-body control, posture rhythm, and low-load stability work.",
    schedule: [
      {
        week: 1,
        days: [
          {
            day: 1,
            moves: [
              {
                name: "Power Row",
                sets: 3,
                repsOrDuration: "10 reps",
                restSeconds: 45,
                weightKg: 14,
              },
              {
                name: "Side Plank Lift",
                sets: 2,
                repsOrDuration: "30 sec/side",
                restSeconds: 25,
              },
            ],
          },
          {
            day: 2,
            moves: [
              {
                name: "Shoulder Press",
                sets: 3,
                repsOrDuration: "8 reps",
                restSeconds: 55,
                weightKg: 10,
              },
              {
                name: "Breath Reset",
                sets: 2,
                repsOrDuration: "40 sec",
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
    name: "Glute Activation Cycle",
    summary: "Hip stability and glute endurance focus.",
    scene: "Stretch Recovery",
    cycleWeeks: "3 Weeks",
    sessionsPerWeek: "3 Sessions",
    targetArea: "Glutes",
    difficulty: "Intermediate",
    gradient: gradientFor(1),
    intro:
      "A glute-focused cycle combining activation drills, hip stability, and recovery work.",
    schedule: [
      {
        week: 1,
        days: [
          {
            day: 1,
            moves: [
              {
                name: "Glute Bridge",
                sets: 4,
                repsOrDuration: "15 reps",
                restSeconds: 45,
              },
              {
                name: "Breath Reset",
                sets: 2,
                repsOrDuration: "45 sec",
                restSeconds: 20,
              },
            ],
          },
          {
            day: 2,
            moves: [
              {
                name: "Goblet Lunge",
                sets: 3,
                repsOrDuration: "10/side",
                restSeconds: 50,
                weightKg: 12,
              },
              {
                name: "Glute Bridge",
                sets: 3,
                repsOrDuration: "16 reps",
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
