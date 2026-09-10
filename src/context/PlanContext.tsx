import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { emitPlanDeviceSync } from "@/data/planDeviceSyncMock";
import { getItemById } from "@/data/exploreLibrary";
import { myTrainingPlans } from "@/data/planMock";
import type { PlanScheduleMove } from "@/types/content";
import {
  enumeratePlanSessions,
  formatLocalDate,
  parseCycleWeeks,
  PlanActiveSession,
  PlanDayStatus,
  PlanEnrollment,
  PendingPlanStart,
  planDayKey,
} from "@/types/plan";

const STORAGE_KEY = "motionstation.plan.enrollments";
const SEEDED_KEY = "motionstation.plan.seeded";

function buildSeedEnrollments(): Record<string, PlanEnrollment> {
  const now = new Date();
  const seed: Record<string, PlanEnrollment> = {};
  myTrainingPlans.ongoing.forEach((plan, planIndex) => {
    const trainingDays: string[] = [];
    for (let i = 0; i < 3; i += 1) {
      const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + planIndex + i * 2);
      trainingDays.push(formatLocalDate(date));
    }
    seed[plan.id] = {
      planId: plan.id,
      joinedAt: Date.now() - planIndex * 86400000,
      trainingDays,
      dayStatus: {},
      rescheduleMap: {},
    };
  });
  return seed;
}

type PlanContextValue = {
  enrollments: Record<string, PlanEnrollment>;
  isJoined: (planId: string) => boolean;
  getEnrollment: (planId: string) => PlanEnrollment | undefined;
  joinPlan: (planId: string, trainingDays: string[]) => void;
  quitPlan: (planId: string) => void;
  skipPlanDay: (planId: string, week: number, day: number) => void;
  reschedulePlanDay: (planId: string, week: number, day: number, dateKey: string) => void;
  markPlanDayFinished: (planId: string, week: number, day: number) => void;
  getDayStatus: (planId: string, week: number, day: number) => PlanDayStatus | undefined;
  getRescheduledDate: (planId: string, week: number, day: number) => string | undefined;
  getOccupiedTrainingDates: (excludePlanId?: string) => Set<string>;
  getPlansOnDate: (dateKey: string) => { planId: string; name: string }[];
  pendingPlanStart: PendingPlanStart | null;
  setPendingPlanStart: (pending: PendingPlanStart | null) => void;
  clearPendingPlanStart: () => void;
  planSession: PlanActiveSession | null;
  startPlanSession: (input: {
    planId: string;
    planName: string;
    week: number;
    day: number;
    moves: PlanScheduleMove[];
  }) => void;
  beginPlanTraining: () => void;
  pausePlanSession: () => void;
  resumePlanSession: () => void;
  previousPlanMove: () => void;
  nextPlanMove: () => void;
  skipPlanRest: () => void;
  endPlanSession: () => PlanActiveSession | null;
  clearPlanSession: () => void;
};

const PlanContext = createContext<PlanContextValue | null>(null);

function persistEnrollments(enrollments: Record<string, PlanEnrollment>) {
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(enrollments)).catch(() => undefined);
}

function resolvePlanCycleWeeks(planId: string): number {
  const item = getItemById("plans", planId);
  if (item?.kind === "plan") return parseCycleWeeks(item.cycleWeeks);
  return 2;
}

export function PlanProvider({ children }: { children: ReactNode }) {
  const [enrollments, setEnrollments] = useState<Record<string, PlanEnrollment>>({});
  const [pendingPlanStart, setPendingPlanStartState] = useState<PendingPlanStart | null>(null);
  const [planSession, setPlanSession] = useState<PlanActiveSession | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const planSessionRef = useRef<PlanActiveSession | null>(null);
  planSessionRef.current = planSession;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (cancelled) return;
        if (raw) {
          const parsed = JSON.parse(raw) as Record<string, PlanEnrollment>;
          if (parsed && typeof parsed === "object" && Object.keys(parsed).length > 0) {
            setEnrollments(parsed);
            return;
          }
        }
        const seed = buildSeedEnrollments();
        setEnrollments(seed);
        persistEnrollments(seed);
        await AsyncStorage.setItem(SEEDED_KEY, "1");
      } catch {
        // ignore hydrate errors
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const updateEnrollments = useCallback(
    (updater: (prev: Record<string, PlanEnrollment>) => Record<string, PlanEnrollment>) => {
      setEnrollments((prev) => {
        const next = updater(prev);
        persistEnrollments(next);
        return next;
      });
    },
    [],
  );

  const isJoined = useCallback(
    (planId: string) => Boolean(enrollments[planId]),
    [enrollments],
  );

  const getEnrollment = useCallback(
    (planId: string) => enrollments[planId],
    [enrollments],
  );

  const joinPlan = useCallback(
    (planId: string, trainingDays: string[]) => {
      const sorted = [...trainingDays].sort();
      updateEnrollments((prev) => ({
        ...prev,
        [planId]: {
          planId,
          joinedAt: Date.now(),
          trainingDays: sorted,
          dayStatus: {},
          rescheduleMap: {},
        },
      }));
      emitPlanDeviceSync("join", planId);
    },
    [updateEnrollments],
  );

  const quitPlan = useCallback(
    (planId: string) => {
      updateEnrollments((prev) => {
        const next = { ...prev };
        delete next[planId];
        return next;
      });
      emitPlanDeviceSync("quit", planId);
      setPendingPlanStartState((current) => (current?.planId === planId ? null : current));
      setPlanSession((current) => (current?.planId === planId ? null : current));
    },
    [updateEnrollments],
  );

  const skipPlanDay = useCallback(
    (planId: string, week: number, day: number) => {
      const key = planDayKey(week, day);
      updateEnrollments((prev) => {
        const enrollment = prev[planId];
        if (!enrollment) return prev;
        return {
          ...prev,
          [planId]: {
            ...enrollment,
            dayStatus: { ...enrollment.dayStatus, [key]: "skipped" },
          },
        };
      });
      emitPlanDeviceSync("skip", planId, { week, day });
    },
    [updateEnrollments],
  );

  const reschedulePlanDay = useCallback(
    (planId: string, week: number, day: number, dateKey: string) => {
      const key = planDayKey(week, day);
      updateEnrollments((prev) => {
        const enrollment = prev[planId];
        if (!enrollment) return prev;
        return {
          ...prev,
          [planId]: {
            ...enrollment,
            rescheduleMap: { ...enrollment.rescheduleMap, [key]: dateKey },
          },
        };
      });
      emitPlanDeviceSync("reschedule", planId, { week, day, dateKey });
    },
    [updateEnrollments],
  );

  const markPlanDayFinished = useCallback(
    (planId: string, week: number, day: number) => {
      const key = planDayKey(week, day);
      updateEnrollments((prev) => {
        const enrollment = prev[planId];
        if (!enrollment) return prev;
        return {
          ...prev,
          [planId]: {
            ...enrollment,
            dayStatus: { ...enrollment.dayStatus, [key]: "finished" },
          },
        };
      });
    },
    [updateEnrollments],
  );

  const getDayStatus = useCallback(
    (planId: string, week: number, day: number) =>
      enrollments[planId]?.dayStatus[planDayKey(week, day)],
    [enrollments],
  );

  const getRescheduledDate = useCallback(
    (planId: string, week: number, day: number) =>
      enrollments[planId]?.rescheduleMap[planDayKey(week, day)],
    [enrollments],
  );

  const getOccupiedTrainingDates = useCallback(
    (excludePlanId?: string) => {
      const occupied = new Set<string>();
      Object.values(enrollments).forEach((enrollment) => {
        if (excludePlanId && enrollment.planId === excludePlanId) return;
        const totalWeeks = resolvePlanCycleWeeks(enrollment.planId);
        enumeratePlanSessions(enrollment, totalWeeks).forEach((session) => {
          occupied.add(session.dateKey);
        });
      });
      return occupied;
    },
    [enrollments],
  );

  const getPlansOnDate = useCallback(
    (dateKey: string) => {
      const results: { planId: string; name: string }[] = [];

      Object.values(enrollments).forEach((enrollment) => {
        const title =
          myTrainingPlans.ongoing.find((item) => item.id === enrollment.planId)?.title ??
          myTrainingPlans.history.find((item) => item.id === enrollment.planId)?.title ??
          (getItemById("plans", enrollment.planId)?.name || enrollment.planId);

        const totalWeeks = resolvePlanCycleWeeks(enrollment.planId);
        enumeratePlanSessions(enrollment, totalWeeks).forEach((session) => {
          if (session.dateKey !== dateKey) return;
          results.push({
            planId: enrollment.planId,
            name: `${title} (第${session.week}周/第${session.absoluteDay}天)`,
          });
        });
      });

      return results;
    },
    [enrollments],
  );

  const setPendingPlanStart = useCallback((pending: PendingPlanStart | null) => {
    setPendingPlanStartState(pending);
  }, []);

  const clearPendingPlanStart = useCallback(() => {
    setPendingPlanStartState(null);
  }, []);

  const startPlanSession = useCallback(
    (input: {
      planId: string;
      planName: string;
      week: number;
      day: number;
      moves: PlanScheduleMove[];
    }) => {
      clearTimer();
      setPlanSession({
        planId: input.planId,
        planName: input.planName,
        week: input.week,
        day: input.day,
        moves: input.moves,
        moveIndex: 0,
        status: "ready",
        elapsedSeconds: 0,
        startedAt: null,
        rest: null,
      });
    },
    [clearTimer],
  );

  const beginPlanTraining = useCallback(() => {
    setPlanSession((current) => {
      if (!current || current.status === "running" || current.status === "resting") return current;
      return {
        ...current,
        status: "running",
        startedAt: current.startedAt ?? Date.now(),
        rest: null,
      };
    });
  }, []);

  const pausePlanSession = useCallback(() => {
    setPlanSession((current) => {
      if (!current || current.status !== "running") return current;
      emitPlanDeviceSync("pause", current.planId, {
        week: current.week,
        day: current.day,
        moveIndex: current.moveIndex,
      });
      return { ...current, status: "paused" };
    });
  }, []);

  const resumePlanSession = useCallback(() => {
    setPlanSession((current) => {
      if (!current || current.status !== "paused") return current;
      emitPlanDeviceSync("resume", current.planId, {
        week: current.week,
        day: current.day,
        moveIndex: current.moveIndex,
      });
      return { ...current, status: "running" };
    });
  }, []);

  const finishRestAndAdvance = useCallback(
    (current: PlanActiveSession, emitSkip: boolean): PlanActiveSession => {
      const nextIndex = current.rest?.nextMoveIndex ?? Math.min(current.moveIndex + 1, current.moves.length - 1);
      if (emitSkip) {
        emitPlanDeviceSync("skip_rest", current.planId, {
          week: current.week,
          day: current.day,
          moveIndex: nextIndex,
        });
      } else {
        emitPlanDeviceSync("next", current.planId, {
          week: current.week,
          day: current.day,
          moveIndex: nextIndex,
        });
      }
      return {
        ...current,
        moveIndex: nextIndex,
        status: "running",
        rest: null,
        startedAt: current.startedAt ?? Date.now(),
      };
    },
    [],
  );

  const previousPlanMove = useCallback(() => {
    setPlanSession((current) => {
      if (!current || current.status === "resting") return current;
      if (current.moveIndex <= 0) return current;
      const moveIndex = current.moveIndex - 1;
      emitPlanDeviceSync("previous", current.planId, {
        week: current.week,
        day: current.day,
        moveIndex,
      });
      return { ...current, moveIndex, rest: null };
    });
  }, []);

  const nextPlanMove = useCallback(() => {
    setPlanSession((current) => {
      if (!current || current.status === "resting") return current;
      if (current.moveIndex >= current.moves.length - 1) return current;

      const currentMove = current.moves[current.moveIndex];
      const restSeconds =
        currentMove?.restSeconds != null && currentMove.restSeconds > 0
          ? currentMove.restSeconds
          : 60;
      const nextMoveIndex = current.moveIndex + 1;

      // Enter inter-action rest before advancing, matching device plan training.
      return {
        ...current,
        status: "resting",
        rest: {
          phase: "inter_action",
          remainingSeconds: restSeconds,
          totalSeconds: restSeconds,
          nextMoveIndex,
        },
      };
    });
  }, []);

  const skipPlanRest = useCallback(() => {
    setPlanSession((current) => {
      if (!current || current.status !== "resting" || !current.rest) return current;
      return finishRestAndAdvance(current, true);
    });
  }, [finishRestAndAdvance]);

  const endPlanSession = useCallback((): PlanActiveSession | null => {
    clearTimer();
    const current = planSessionRef.current;
    if (!current) return null;
    emitPlanDeviceSync("end", current.planId, {
      week: current.week,
      day: current.day,
      moveIndex: current.moveIndex,
    });
    setPlanSession(null);
    return { ...current, status: "ended", rest: null };
  }, [clearTimer]);

  const clearPlanSession = useCallback(() => {
    clearTimer();
    setPlanSession(null);
  }, [clearTimer]);

  useEffect(() => {
    if (!planSession) {
      clearTimer();
      return;
    }

    if (planSession.status === "running") {
      timerRef.current = setInterval(() => {
        setPlanSession((current) => {
          if (!current || current.status !== "running") return current;
          return { ...current, elapsedSeconds: current.elapsedSeconds + 1 };
        });
      }, 1000);
      return clearTimer;
    }

    if (planSession.status === "resting") {
      timerRef.current = setInterval(() => {
        setPlanSession((current) => {
          if (!current || current.status !== "resting" || !current.rest) return current;
          const nextRemaining = current.rest.remainingSeconds - 1;
          if (nextRemaining <= 0) {
            return finishRestAndAdvance(current, false);
          }
          return {
            ...current,
            rest: { ...current.rest, remainingSeconds: nextRemaining },
          };
        });
      }, 1000);
      return clearTimer;
    }

    clearTimer();
  }, [planSession?.status, clearTimer, finishRestAndAdvance]);

  useEffect(() => () => clearTimer(), [clearTimer]);

  const value = useMemo<PlanContextValue>(
    () => ({
      enrollments,
      isJoined,
      getEnrollment,
      joinPlan,
      quitPlan,
      skipPlanDay,
      reschedulePlanDay,
      markPlanDayFinished,
      getDayStatus,
      getRescheduledDate,
      getOccupiedTrainingDates,
      getPlansOnDate,
      pendingPlanStart,
      setPendingPlanStart,
      clearPendingPlanStart,
      planSession,
      startPlanSession,
      beginPlanTraining,
      pausePlanSession,
      resumePlanSession,
      previousPlanMove,
      nextPlanMove,
      skipPlanRest,
      endPlanSession,
      clearPlanSession,
    }),
    [
      enrollments,
      isJoined,
      getEnrollment,
      joinPlan,
      quitPlan,
      skipPlanDay,
      reschedulePlanDay,
      markPlanDayFinished,
      getDayStatus,
      getRescheduledDate,
      getOccupiedTrainingDates,
      getPlansOnDate,
      pendingPlanStart,
      setPendingPlanStart,
      clearPendingPlanStart,
      planSession,
      startPlanSession,
      beginPlanTraining,
      pausePlanSession,
      resumePlanSession,
      previousPlanMove,
      nextPlanMove,
      skipPlanRest,
      endPlanSession,
      clearPlanSession,
    ],
  );

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}

export function usePlan() {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error("usePlan must be used within PlanProvider");
  }
  return context;
}
