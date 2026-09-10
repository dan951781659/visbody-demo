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
  serialNumber: string;
  currentVersion: string;
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

export type TrainingReportSource = "plan_follow" | "free_training" | "movement_follow";

export type TrainingReportScene = "free" | "plan-training" | "pilates" | "immersive" | "movement";

export type IntensityZone = {
  className: "z1" | "z2" | "z3" | "z4" | "z5";
  label: string;
  resistanceKg: number;
  ratio: number;
  seconds: number;
  durationLabel: string;
  dominant: boolean;
};

export type IntensityDistribution = {
  zones: IntensityZone[];
  ceiling: number;
  settingsCount: number;
  workingSeconds: number;
  sessionSpan: string;
};

export type AccuracyDistribution = {
  better: number;
  good: number;
  perfect: number;
};

export type ReportMoveQuality = {
  perfectRate: number;
  summary: string;
  topErrors: { label: string; percent: number }[];
};

export type ReportPlanMove = {
  name: string;
  targetSets: number;
  targetReps: number;
  actualSets: number;
  actualReps: number;
  durationSeconds: number;
  aiSupported?: boolean;
  aiQuality?: ReportMoveQuality;
  powerSeries?: number[];
};

export type TrainingReport = {
  id?: string;
  title?: string;
  userName: string;
  userAvatar: string;
  source: TrainingReportSource;
  sourceLabel: string;
  scene: TrainingReportScene;
  sceneLabel: string;
  trainingType: FreeTrainingType;
  trainingTypeLabel: string;
  durationSeconds: number;
  capacityKg: number;
  energyKj: number;
  caloriesKcal: number;
  hideResistanceMetrics: boolean;
  isEstimatedBurn: boolean;
  mode: ResistanceMode;
  modeLabel: string;
  equipment: EquipmentType;
  equipmentLabel: string;
  maxResistance: number;
  timeline: number[];
  intensity: IntensityDistribution;
  consistency: number;
  coachNote: string;
  finalAiScore?: number;
  accuracyDistribution?: AccuracyDistribution;
  planName?: string;
  planDayName?: string;
  planMoves?: ReportPlanMove[];
  finishedAt: number;
};

export type ActiveSession = {
  preset: TrainingPreset;
  status: SessionStatus;
  elapsedSeconds: number;
  startedAt: number | null;
};

export type PendingMoveStart = {
  moveId: string;
  moveName: string;
  requestedAt: number;
};

export type MoveFollowSessionStatus = "ready" | "running" | "paused" | "ended";

export type MoveFollowSession = {
  moveId: string;
  moveName: string;
  status: MoveFollowSessionStatus;
  elapsedSeconds: number;
  startedAt: number | null;
  /** Live device controls mirrored from free-training presets. */
  preset: TrainingPreset;
};

export type MoveDeviceSyncCommand = "start" | "pause" | "resume" | "end";

export type MoveDeviceSyncPayload = {
  command: MoveDeviceSyncCommand;
  moveId: string;
  at: number;
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
