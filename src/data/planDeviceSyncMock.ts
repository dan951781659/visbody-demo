import type { PlanDeviceSyncCommand, PlanDeviceSyncPayload } from "@/types/plan";

/** In-memory mock command log — represents sync to device plan training. */
const commandLog: PlanDeviceSyncPayload[] = [];

export function emitPlanDeviceSync(
  command: PlanDeviceSyncCommand,
  planId: string,
  extras?: Omit<Partial<PlanDeviceSyncPayload>, "command" | "planId" | "at">,
): PlanDeviceSyncPayload {
  const payload: PlanDeviceSyncPayload = {
    command,
    planId,
    at: Date.now(),
    ...extras,
  };
  commandLog.push(payload);
  if (commandLog.length > 100) {
    commandLog.splice(0, commandLog.length - 100);
  }
  return payload;
}

export function getPlanDeviceSyncLog(): readonly PlanDeviceSyncPayload[] {
  return commandLog;
}

export function clearPlanDeviceSyncLog() {
  commandLog.length = 0;
}
