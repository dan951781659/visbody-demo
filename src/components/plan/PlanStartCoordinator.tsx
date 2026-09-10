import { useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import { useToast } from "@/components/ToastProvider";
import { usePlan } from "@/context/PlanContext";
import { useTraining } from "@/context/TrainingContext";
import { emitPlanDeviceSync } from "@/data/planDeviceSyncMock";
import { getItemById } from "@/data/exploreLibrary";

const LAUNCH_DELAY_MS = 3000;

/**
 * Watches pending plan start + device connection.
 * When connected, shows toast, emits device start mock, waits 3s, then opens plan session.
 */
export function PlanStartCoordinator() {
  const router = useRouter();
  const { showToast } = useToast();
  const { selectedDevice } = useTraining();
  const { pendingPlanStart, clearPendingPlanStart, startPlanSession } = usePlan();

  const routerRef = useRef(router);
  const showToastRef = useRef(showToast);
  const clearPendingRef = useRef(clearPendingPlanStart);
  const startSessionRef = useRef(startPlanSession);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handledKeyRef = useRef<string | null>(null);

  routerRef.current = router;
  showToastRef.current = showToast;
  clearPendingRef.current = clearPendingPlanStart;
  startSessionRef.current = startPlanSession;

  useEffect(() => {
    if (!pendingPlanStart) {
      handledKeyRef.current = null;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    if (selectedDevice?.connection !== "connected") return;

    const key = `${pendingPlanStart.planId}:${pendingPlanStart.week}:${pendingPlanStart.day}:${pendingPlanStart.requestedAt}`;
    if (handledKeyRef.current === key || timerRef.current) return;
    handledKeyRef.current = key;

    const { planId, week, day } = pendingPlanStart;
    const plan = getItemById("plans", planId);
    if (!plan || plan.kind !== "plan") {
      clearPendingRef.current();
      handledKeyRef.current = null;
      return;
    }

    const weekData = plan.schedule.find((item) => item.week === week) ?? plan.schedule[0];
    const dayData = weekData?.days.find((item) => item.day === day) ?? weekData?.days[0];
    const moves = dayData?.moves ?? [];

    showToastRef.current("设备已连接，即将进入训练");
    emitPlanDeviceSync("start", planId, { week, day, moveIndex: 0 });

    timerRef.current = setTimeout(() => {
      startSessionRef.current({
        planId,
        planName: plan.name,
        week: weekData?.week ?? week,
        day: dayData?.day ?? day,
        moves,
      });
      clearPendingRef.current();
      routerRef.current.push("/training/plan-session");
      timerRef.current = null;
    }, LAUNCH_DELAY_MS);
  }, [
    pendingPlanStart?.planId,
    pendingPlanStart?.week,
    pendingPlanStart?.day,
    pendingPlanStart?.requestedAt,
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
