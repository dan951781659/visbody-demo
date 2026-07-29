import {
  DeviceLoginConfirmResult,
  DeviceLoginSession,
  DeviceLoginValidateResult,
} from "@/types/training";

export const DEVICE_LOGIN_TTL_MS = 5 * 60 * 1000;

const DEFAULT_DEVICE = {
  deviceId: "ms-5502",
  deviceName: "MS-5502",
};

let activeSession: DeviceLoginSession | null = null;
let sessionSeq = 1;

function now() {
  return Date.now();
}

function createSessionId() {
  const id = `dls-${sessionSeq}-${now()}`;
  sessionSeq += 1;
  return id;
}

function expireIfNeeded(session: DeviceLoginSession, at = now()): DeviceLoginSession {
  if (
    (session.status === "active" || session.status === "scanned") &&
    at >= session.expiresAt
  ) {
    const expired: DeviceLoginSession = { ...session, status: "expired" };
    if (activeSession?.id === session.id) {
      activeSession = expired;
    }
    return expired;
  }
  return session;
}

export function createDeviceLoginSession(
  device: { deviceId: string; deviceName: string } = DEFAULT_DEVICE,
): DeviceLoginSession {
  const issuedAt = now();
  const session: DeviceLoginSession = {
    id: createSessionId(),
    deviceId: device.deviceId,
    deviceName: device.deviceName,
    issuedAt,
    expiresAt: issuedAt + DEVICE_LOGIN_TTL_MS,
    status: "active",
  };
  activeSession = session;
  return session;
}

export function getActiveDeviceLoginSession(): DeviceLoginSession | null {
  if (!activeSession) return null;
  return expireIfNeeded(activeSession);
}

export function refreshDeviceLoginSession(
  device: { deviceId: string; deviceName: string } = DEFAULT_DEVICE,
): DeviceLoginSession {
  if (activeSession && (activeSession.status === "active" || activeSession.status === "scanned")) {
    activeSession = { ...activeSession, status: "expired" };
  }
  return createDeviceLoginSession(device);
}

export function getDeviceLoginSessionById(sessionId: string): DeviceLoginSession | null {
  if (!activeSession || activeSession.id !== sessionId) {
    return null;
  }
  return expireIfNeeded(activeSession);
}

export function validateDeviceLoginSession(sessionId: string): DeviceLoginValidateResult {
  const session = getDeviceLoginSessionById(sessionId);
  if (!session) {
    return { ok: false, reason: "invalid" };
  }
  if (session.status === "expired") {
    return { ok: false, reason: "expired" };
  }
  if (session.status === "confirmed" || session.status === "cancelled") {
    return { ok: false, reason: session.status === "cancelled" ? "cancelled" : "used" };
  }
  if (session.status !== "active" && session.status !== "scanned") {
    return { ok: false, reason: "invalid" };
  }
  return { ok: true, session };
}

export function markDeviceLoginScanned(sessionId: string): DeviceLoginValidateResult {
  const result = validateDeviceLoginSession(sessionId);
  if (!result.ok) return result;
  const next: DeviceLoginSession = { ...result.session, status: "scanned" };
  activeSession = next;
  return { ok: true, session: next };
}

export function confirmDeviceLoginSession(
  sessionId: string,
  user: { userId: string; userNickname: string },
): DeviceLoginConfirmResult {
  const result = validateDeviceLoginSession(sessionId);
  if (!result.ok) {
    return {
      ok: false,
      reason: result.reason === "offline" ? "invalid" : result.reason,
    };
  }
  if (result.session.status !== "active" && result.session.status !== "scanned") {
    return { ok: false, reason: "used" };
  }
  const next: DeviceLoginSession = {
    ...result.session,
    status: "confirmed",
    userId: user.userId,
    userNickname: user.userNickname,
  };
  activeSession = next;
  return { ok: true, session: next };
}

export function cancelDeviceLoginSession(sessionId: string): DeviceLoginValidateResult {
  const session = getDeviceLoginSessionById(sessionId);
  if (!session) {
    return { ok: false, reason: "invalid" };
  }
  if (session.status === "confirmed") {
    return { ok: false, reason: "used" };
  }
  if (session.status === "expired") {
    return { ok: false, reason: "expired" };
  }
  const next: DeviceLoginSession = { ...session, status: "cancelled" };
  activeSession = next;
  return { ok: true, session: next };
}

export function formatCountdown(expiresAt: number, at = now()): string {
  const remainMs = Math.max(0, expiresAt - at);
  const totalSec = Math.ceil(remainMs / 1000);
  const minutes = Math.floor(totalSec / 60);
  const seconds = totalSec % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

/** Demo helper: force-expire current session for verification. */
export function forceExpireActiveDeviceLoginSession() {
  if (!activeSession) return null;
  activeSession = { ...activeSession, status: "expired", expiresAt: now() - 1 };
  return activeSession;
}
