import { useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import { useToast } from "@/components/ToastProvider";
import { useTraining } from "@/context/TrainingContext";
import { emitMoveDeviceSync } from "@/data/moveDeviceSyncMock";

const LAUNCH_DELAY_MS = 3000;

/**
 * Watches pending move start + device connection.
 * When connected, shows toast, emits device start mock, waits 3s, then opens move session.
 */
export function MoveStartCoordinator() {
  const router = useRouter();
  const { showToast } = useToast();
  const {
    selectedDevice,
    pendingMoveStart,
    clearPendingMoveStart,
    startMoveSession,
  } = useTraining();

  const routerRef = useRef(router);
  const showToastRef = useRef(showToast);
  const clearPendingRef = useRef(clearPendingMoveStart);
  const startSessionRef = useRef(startMoveSession);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handledKeyRef = useRef<string | null>(null);

  routerRef.current = router;
  showToastRef.current = showToast;
  clearPendingRef.current = clearPendingMoveStart;
  startSessionRef.current = startMoveSession;

  useEffect(() => {
    if (!pendingMoveStart) {
      handledKeyRef.current = null;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    if (selectedDevice?.connection !== "connected") return;

    const key = `${pendingMoveStart.moveId}:${pendingMoveStart.requestedAt}`;
    if (handledKeyRef.current === key || timerRef.current) return;
    handledKeyRef.current = key;

    const { moveId, moveName } = pendingMoveStart;

    showToastRef.current("设备已连接，即将进入训练");
    emitMoveDeviceSync("start", moveId);

    timerRef.current = setTimeout(() => {
      startSessionRef.current({ moveId, moveName });
      clearPendingRef.current();
      routerRef.current.push("/training/move-session");
      timerRef.current = null;
    }, LAUNCH_DELAY_MS);
  }, [
    pendingMoveStart?.moveId,
    pendingMoveStart?.requestedAt,
    selectedDevice?.connection,
  ]);

  useEffect(
    () => () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    },
    [],
  );

  return null;
}
