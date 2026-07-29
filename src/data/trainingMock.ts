import {
  Device,
  DeviceSearchResult,
  EquipmentType,
  FreeTrainingOption,
  FreeTrainingType,
  ResistanceBounds,
  ResistanceMode,
  TrainingPreset,
  TrainingReport,
} from "@/types/training";

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

export function buildTrainingReport(preset: TrainingPreset, durationSeconds: number): TrainingReport {
  const capacityKg = getTotalResistance(preset) * Math.max(1, durationSeconds / 60);
  const energyKj = Math.round(capacityKg * 0.38 * 10) / 10;
  const caloriesKcal = resolveSessionCaloriesKcal(capacityKg, preset.trainingType);

  return {
    trainingType: preset.trainingType,
    trainingTypeLabel: TRAINING_TYPE_LABELS[preset.trainingType],
    durationSeconds,
    capacityKg: Math.round(capacityKg * 10) / 10,
    energyKj,
    caloriesKcal,
    mode: preset.mode,
    modeLabel: MODE_LABELS[preset.mode],
    equipment: preset.equipment,
    equipmentLabel:
      preset.trainingType === "pilates" ? "手柄" : EQUIPMENT_LABELS[preset.equipment],
    finishedAt: Date.now(),
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
