export type TrainingGoals = {
  /** 每日锻炼时长（分钟） */
  dailyDurationMinutes: number;
  /** 每日运动卡路里（千卡） */
  dailyCaloriesKcal: number;
  /** 每周运动频次（次） */
  weeklyFrequency: number;
};

export const GOAL_BOUNDS = {
  duration: { min: 5, max: 90, step: 5, default: 30 },
  calories: { min: 10, max: 9990, step: 10, default: 300 },
  frequency: { min: 1, max: 99, step: 1, default: 5 },
} as const;

export const DEFAULT_TRAINING_GOALS: TrainingGoals = {
  dailyDurationMinutes: GOAL_BOUNDS.duration.default,
  dailyCaloriesKcal: GOAL_BOUNDS.calories.default,
  weeklyFrequency: GOAL_BOUNDS.frequency.default,
};

export function clampGoalValue(value: number, min: number, max: number, step: number): number {
  const clamped = Math.min(max, Math.max(min, value));
  const steps = Math.round((clamped - min) / step);
  return Math.min(max, Math.max(min, min + steps * step));
}

export function normalizeTrainingGoals(input: Partial<TrainingGoals> | null | undefined): TrainingGoals {
  return {
    dailyDurationMinutes: clampGoalValue(
      input?.dailyDurationMinutes ?? DEFAULT_TRAINING_GOALS.dailyDurationMinutes,
      GOAL_BOUNDS.duration.min,
      GOAL_BOUNDS.duration.max,
      GOAL_BOUNDS.duration.step,
    ),
    dailyCaloriesKcal: clampGoalValue(
      input?.dailyCaloriesKcal ?? DEFAULT_TRAINING_GOALS.dailyCaloriesKcal,
      GOAL_BOUNDS.calories.min,
      GOAL_BOUNDS.calories.max,
      GOAL_BOUNDS.calories.step,
    ),
    weeklyFrequency: clampGoalValue(
      input?.weeklyFrequency ?? DEFAULT_TRAINING_GOALS.weeklyFrequency,
      GOAL_BOUNDS.frequency.min,
      GOAL_BOUNDS.frequency.max,
      GOAL_BOUNDS.frequency.step,
    ),
  };
}
