export type LibraryTab = "moves" | "aiMoves" | "plans";

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export type Scene =
  | "Strength Training"
  | "Pilates"
  | "Cardio Fat Burn"
  | "Stretch Recovery";

export type Equipment = "Dual Cable" | "Bodyweight" | "Barbell" | "Handle";

export type TargetArea =
  | "Full Body"
  | "Upper Limbs"
  | "Shoulders"
  | "Back"
  | "Glutes"
  | "Legs";

export type PlanType = "Recommended" | "Personalized";

export type BaseLibraryItem = {
  id: string;
  name: string;
  summary: string;
  scene: Scene;
  targetArea: TargetArea;
  difficulty: Difficulty;
  gradient: [string, string];
  mediaUri?: string;
  thumbnailUri?: string;
};

export type MoveItem = BaseLibraryItem & {
  kind: "move";
  equipment: Equipment;
  supportsAi: boolean;
  description: string;
  keyPoints: string[];
  breathing: string;
  commonMistakes: string[];
  durationMinutes?: number;
};

export type AiMoveItem = BaseLibraryItem & {
  kind: "aiMove";
  equipment: Equipment;
  description: string;
  keyPoints: string[];
  breathing: string;
  commonMistakes: string[];
  durationMinutes?: number;
};

export type PlanScheduleMove = {
  name: string;
  sets: number;
  repsOrDuration: string;
  restSeconds?: number;
  weightKg?: number;
};

export type PlanScheduleDay = {
  day: number;
  moves: PlanScheduleMove[];
};

export type PlanScheduleWeek = {
  week: number;
  days: PlanScheduleDay[];
};

export type PlanItem = BaseLibraryItem & {
  kind: "plan";
  cycleWeeks: string;
  sessionsPerWeek: string;
  isPersonalized?: boolean;
  intro: string;
  schedule: PlanScheduleWeek[];
};

export type LibraryItem = MoveItem | AiMoveItem | PlanItem;

export type FilterOption = {
  value: string;
  label: string;
};

export type FilterConfig = {
  key: string;
  label: string;
  options: FilterOption[];
};

export type ContentDetailParams = {
  type: LibraryTab;
  id: string;
};
