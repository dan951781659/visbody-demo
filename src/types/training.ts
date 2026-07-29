import { ProductOption } from "@/data/mockData";

export type ProductId = "motionstation" | "visbody";

export type ProductLineId = "wellnesshub" | "vapro6" | "motionstation";

export type ProductLineOption = {
  id: ProductLineId;
  name: string;
  subtitle: string;
};

export type DeviceConnection = "connected" | "offline";

export type Device = {
  id: string;
  productId: ProductId;
  name: string;
  subtitle: string;
  connection: DeviceConnection;
  lastUsedLabel?: string;
};

export type NearbyDeviceStatus = "idle" | "busy";

export type NearbyDevice = {
  id: string;
  name: string;
  status: NearbyDeviceStatus;
  loggedIn?: boolean;
};

export type FreeTrainingType = "strength" | "pilates" | "resistance_cardio";

export type ResistanceMode = "standard" | "spring" | "eccentric" | "isokinetic";

export type EquipmentType = "barbell" | "nonbarbell";

export type MotorSide = "left" | "right";

export type ConnectionStatus = "disconnected" | "searching" | "connected" | "failed";

export type SessionStatus = "idle" | "running" | "paused" | "ended";

export type TrainingPreset = {
  trainingType: FreeTrainingType;
  mode: ResistanceMode;
  equipment: EquipmentType;
  resistanceBarbell: number;
  resistanceLeft: number;
  resistanceRight: number;
  activeSide: MotorSide;
};

export type TrainingReport = {
  trainingType: FreeTrainingType;
  trainingTypeLabel: string;
  durationSeconds: number;
  capacityKg: number;
  energyKj: number;
  caloriesKcal: number;
  mode: ResistanceMode;
  modeLabel: string;
  equipment: EquipmentType;
  equipmentLabel: string;
  finishedAt: number;
};

export type ActiveSession = {
  preset: TrainingPreset;
  status: SessionStatus;
  elapsedSeconds: number;
  startedAt: number | null;
};

export type ResistanceBounds = {
  min: number;
  max: number;
  step: number;
};

export type FreeTrainingOption = {
  id: FreeTrainingType;
  title: string;
  subtitle: string;
  icon: "barbell-outline" | "body-outline" | "heart-outline";
  gradient: [string, string];
};

export type DeviceSearchResult = {
  found: boolean;
  deviceName: string;
};

export type DeviceLoginSessionStatus =
  | "active"
  | "scanned"
  | "confirmed"
  | "expired"
  | "cancelled";

export type DeviceLoginSession = {
  id: string;
  deviceId: string;
  deviceName: string;
  issuedAt: number;
  expiresAt: number;
  status: DeviceLoginSessionStatus;
  userId?: string;
  userNickname?: string;
};

export type PendingDeviceLogin = {
  sessionId: string;
  deviceId: string;
  deviceName: string;
  expiresAt: number;
};

export type DeviceLoginValidateResult =
  | { ok: true; session: DeviceLoginSession }
  | { ok: false; reason: "expired" | "used" | "cancelled" | "invalid" | "offline" };

export type DeviceLoginConfirmResult =
  | { ok: true; session: DeviceLoginSession }
  | { ok: false; reason: "expired" | "used" | "cancelled" | "invalid" | "busy" };

export { ProductOption };
