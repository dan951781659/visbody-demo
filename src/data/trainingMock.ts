import {
  Device,
  DeviceSearchResult,
  EquipmentType,
  FreeTrainingOption,
  FreeTrainingType,
  ResistanceBounds,
  ResistanceMode,
  ReportPlanMove,
  TrainingPreset,
  TrainingReport,
  TrainingReportScene,
  TrainingReportSource,
} from "@/types/training";
import {
  buildIntensityDistribution,
  buildPowerSeries,
  calcConsistency,
  getCoachNote,
} from "@/utils/trainingReport";

export const FREE_TRAINING_OPTIONS: FreeTrainingOption[] = [
  {
    id: "strength",
    title: "力量训练",
    subtitle: "增肌与力量提升",
    icon: "barbell-outline",
    gradient: ["#1a1a2e", "#e94560"],
  },
  {
    id: "pilates",
    title: "普拉提",
    subtitle: "核心控制与呼吸",
    icon: "body-outline",
    gradient: ["#0f2027", "#2c5364"],
  },
  {
    id: "resistance_cardio",
    title: "阻力有氧",
    subtitle: "心肺与耐力训练",
    icon: "heart-outline",
    gradient: ["#200122", "#6f0000"],
  },
];

export const TRAINING_TYPE_LABELS: Record<FreeTrainingType, string> = {
  strength: "力量训练",
  pilates: "普拉提",
  resistance_cardio: "阻力有氧",
};

export const MODE_LABELS: Record<ResistanceMode, string> = {
  standard: "标准",
  spring: "弹簧",
  eccentric: "离心",
  isokinetic: "等速",
};

export const EQUIPMENT_LABELS: Record<EquipmentType, string> = {
  barbell: "杠铃",
  nonbarbell: "非杠铃",
};

export const SOURCE_LABELS: Record<TrainingReportSource, string> = {
  plan_follow: "计划跟练",
  free_training: "自由训练",
  movement_follow: "动作跟练",
};

export function getAvailableModes(trainingType: FreeTrainingType): ResistanceMode[] {
  if (trainingType === "pilates") {
    return ["standard", "spring", "eccentric"];
  }
  return ["standard", "spring", "eccentric", "isokinetic"];
}

export function getResistanceBounds(
  trainingType: FreeTrainingType,
  equipment: EquipmentType,
): ResistanceBounds {
  if (trainingType === "pilates") {
    return { min: 5, max: 45, step: 1 };
  }
  if (equipment === "barbell") {
    return { min: 1, max: 100, step: 1 };
  }
  return { min: 0.5, max: 50, step: 0.5 };
}

export function createDefaultPreset(trainingType: FreeTrainingType): TrainingPreset {
  const isPilates = trainingType === "pilates";
  return {
    trainingType,
    mode: "standard",
    equipment: isPilates ? "nonbarbell" : "barbell",
    resistanceBarbell: isPilates ? 10 : 10,
    resistanceLeft: isPilates ? 10 : 5,
    resistanceRight: isPilates ? 10 : 5,
    activeSide: "left",
  };
}

export function clampResistance(value: number, bounds: ResistanceBounds): number {
  const clamped = Math.min(bounds.max, Math.max(bounds.min, value));
  const steps = Math.round((clamped - bounds.min) / bounds.step);
  return Number((bounds.min + steps * bounds.step).toFixed(bounds.step < 1 ? 1 : 0));
}

export function getTotalResistance(preset: TrainingPreset): number {
  if (preset.trainingType === "pilates") {
    return preset.resistanceLeft;
  }
  if (preset.equipment === "barbell") {
    return preset.resistanceBarbell;
  }
  return preset.resistanceLeft + preset.resistanceRight;
}

export function formatResistance(value: number, step: number): string {
  if (step < 1) {
    return value.toFixed(1);
  }
  return String(Math.round(value));
}

export function resolveSessionCaloriesKcal(capacityKg: number, trainingType: FreeTrainingType): number {
  if (trainingType === "resistance_cardio") {
    return Math.round(capacityKg * 0.38 * 0.28);
  }
  return Math.round(capacityKg * 0.38 * 0.24);
}

function hashSeed(text: string): number {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/** Generate a demo resistance timeline when live capture is unavailable. */
export function buildDemoTimeline(
  durationSeconds: number,
  baseResistance: number,
  seedKey = "session",
): number[] {
  const length = Math.max(24, Math.min(180, Math.floor(Math.max(1, durationSeconds) / 4)));
  const seed = hashSeed(seedKey);
  const base = Math.max(5, baseResistance);
  const points: number[] = [];
  for (let i = 0; i < length; i += 1) {
    const wave = Math.sin(i * 0.35 + (seed % 7)) * 0.18;
    const pulse = Math.sin(i * 0.12 + 1.2) * 0.1;
    const stepBoost = i % 17 === 0 ? 0.22 : 0;
    const value = base * (0.82 + wave + pulse + stepBoost);
    points.push(Math.round(value * 10) / 10);
  }
  return points;
}

function downsampleSeries(series: number[], maxPoints = 64): number[] {
  if (series.length <= maxPoints) return series;
  const step = series.length / maxPoints;
  const result: number[] = [];
  for (let i = 0; i < maxPoints; i += 1) {
    result.push(series[Math.floor(i * step)]);
  }
  return result;
}

export type BuildTrainingReportInput = {
  preset: TrainingPreset;
  durationSeconds: number;
  userName?: string;
  userAvatar?: string;
  source?: TrainingReportSource;
  scene?: TrainingReportScene;
  sceneLabel?: string;
  title?: string;
  id?: string;
  timeline?: number[];
  planName?: string;
  planDayName?: string;
  planMoves?: ReportPlanMove[];
  finalAiScore?: number;
  accuracyDistribution?: TrainingReport["accuracyDistribution"];
  coachNote?: string;
  finishedAt?: number;
};

export function buildTrainingReport(input: BuildTrainingReportInput | TrainingPreset, durationSecondsArg?: number): TrainingReport {
  const normalized: BuildTrainingReportInput =
    durationSecondsArg != null && !("preset" in (input as BuildTrainingReportInput))
      ? { preset: input as TrainingPreset, durationSeconds: durationSecondsArg }
      : (input as BuildTrainingReportInput);

  const {
    preset,
    durationSeconds,
    userName = "运动达人",
    userAvatar = "运",
    source = "free_training",
    scene,
    sceneLabel,
    title,
    id,
    timeline: timelineInput,
    planName,
    planDayName,
    planMoves,
    finalAiScore,
    accuracyDistribution,
    coachNote,
    finishedAt = Date.now(),
  } = normalized;

  const resolvedScene: TrainingReportScene =
    scene ??
    (source === "plan_follow"
      ? "plan-training"
      : source === "movement_follow"
        ? "movement"
        : preset.trainingType === "pilates"
          ? "pilates"
          : "free");

  const resolvedSceneLabel =
    sceneLabel ??
    (resolvedScene === "plan-training"
      ? "计划训练"
      : resolvedScene === "movement"
        ? "动作跟练"
        : TRAINING_TYPE_LABELS[preset.trainingType]);

  const capacityKg = Math.round(getTotalResistance(preset) * Math.max(1, durationSeconds / 60) * 10) / 10;
  const caloriesKcal = resolveSessionCaloriesKcal(capacityKg, preset.trainingType);
  const energyKj = Math.round(caloriesKcal * 4.184);
  const baseResistance = getTotalResistance(preset);
  const timeline = downsampleSeries(
    timelineInput?.length
      ? timelineInput
      : buildDemoTimeline(durationSeconds, baseResistance, `${id ?? "live"}-${preset.trainingType}`),
  );
  const maxResistance = timeline.length ? Math.max(...timeline, baseResistance) : baseResistance;
  const intensity = buildIntensityDistribution(timeline);
  const consistency = calcConsistency(timeline, maxResistance);
  const peak = timeline.length ? Math.max(...timeline) : 0;
  const hideResistanceMetrics =
    resolvedScene === "pilates" || preset.trainingType === "pilates";

  const enrichedMoves = (planMoves ?? []).map((move, idx) => ({
    ...move,
    powerSeries:
      move.powerSeries ??
      buildPowerSeries(
        buildDemoTimeline(
          Math.max(30, move.durationSeconds || 60),
          Math.max(8, baseResistance * (0.7 + (idx % 3) * 0.1)),
          `${move.name}-${idx}`,
        ),
      ),
  }));

  return {
    id,
    title,
    userName,
    userAvatar: String(userAvatar || "运").slice(0, 1).toUpperCase(),
    source,
    sourceLabel: SOURCE_LABELS[source],
    scene: resolvedScene,
    sceneLabel: resolvedSceneLabel,
    trainingType: preset.trainingType,
    trainingTypeLabel: TRAINING_TYPE_LABELS[preset.trainingType],
    durationSeconds,
    capacityKg: hideResistanceMetrics ? 0 : capacityKg,
    energyKj,
    caloriesKcal,
    hideResistanceMetrics,
    isEstimatedBurn: false,
    mode: preset.mode,
    modeLabel: MODE_LABELS[preset.mode],
    equipment: preset.equipment,
    equipmentLabel:
      preset.trainingType === "pilates" ? "手柄" : EQUIPMENT_LABELS[preset.equipment],
    maxResistance: Math.round(maxResistance * 10) / 10,
    timeline,
    intensity,
    consistency,
    coachNote: coachNote ?? getCoachNote(consistency, peak, maxResistance),
    finalAiScore,
    accuracyDistribution,
    planName,
    planDayName,
    planMoves: enrichedMoves.length ? enrichedMoves : undefined,
    finishedAt,
  };
}

export async function searchMotionStationDevice(device: Device): Promise<DeviceSearchResult> {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  return {
    found: device.connection === "connected",
    deviceName: device.name,
  };
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}
