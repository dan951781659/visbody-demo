import type { MoveDeviceSyncCommand, MoveDeviceSyncPayload } from "@/types/training";

/** In-memory mock command log — represents sync to device movement follow. */
const commandLog: MoveDeviceSyncPayload[] = [];

export function emitMoveDeviceSync(
  command: MoveDeviceSyncCommand,
  moveId: string,
): MoveDeviceSyncPayload {
  const payload: MoveDeviceSyncPayload = {
    command,
    moveId,
    at: Date.now(),
  };
  commandLog.push(payload);
  if (commandLog.length > 100) {
    commandLog.splice(0, commandLog.length - 100);
  }
  return payload;
}

export function getMoveDeviceSyncLog(): readonly MoveDeviceSyncPayload[] {
  return commandLog;
}

export function clearMoveDeviceSyncLog() {
  commandLog.length = 0;
}
