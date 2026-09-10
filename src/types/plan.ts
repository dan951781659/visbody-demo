import type { PlanScheduleMove } from "@/types/content";

export type PlanDayStatus = "finished" | "skipped";

/** dayKey format: `${week}-${day}` e.g. "1-2" */
export type PlanEnrollment = {
  planId: string;
  joinedAt: number;
  /** ISO local dates YYYY-MM-DD selected at join */
  trainingDays: string[];
  dayStatus: Record<string, PlanDayStatus>;
  /** dayKey -> YYYY-MM-DD */
  rescheduleMap: Record<string, string>;
};

export type PendingPlanStart = {
  planId: string;
  week: number;
  day: number;
  requestedAt: number;
};

export type PlanSessionStatus = "ready" | "running" | "paused" | "resting" | "ended";

export type PlanRestPhase = "inter_action" | "between_set";

export type PlanRestState = {
  phase: PlanRestPhase;
  remainingSeconds: number;
  totalSeconds: number;
  /** Target move index after rest completes. */
  nextMoveIndex: number;
};

export type PlanActiveSession = {
  planId: string;
  planName: string;
  week: number;
  day: number;
  moves: PlanScheduleMove[];
  moveIndex: number;
  status: PlanSessionStatus;
  elapsedSeconds: number;
  startedAt: number | null;
  rest: PlanRestState | null;
};

export type PlanDeviceSyncCommand =
  | "join"
  | "skip"
  | "reschedule"
  | "quit"
  | "start"
  | "pause"
  | "resume"
  | "previous"
  | "next"
  | "skip_rest"
  | "end";

export type PlanDeviceSyncPayload = {
  command: PlanDeviceSyncCommand;
  planId: string;
  week?: number;
  day?: number;
  dateKey?: string;
  moveIndex?: number;
  at: number;
};

export function planDayKey(week: number, day: number): string {
  return `${week}-${day}`;
}

export function parseSessionsPerWeek(value: string): number {
  const match = value.match(/(\d+)/);
  const parsed = match ? Number.parseInt(match[1], 10) : 3;
  if (!Number.isFinite(parsed)) return 3;
  return Math.min(7, Math.max(1, parsed));
}

export function formatLocalDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDaysToDateKey(dateKey: string, days: number): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  return formatLocalDate(new Date(year, month - 1, day + days));
}

export function compareDateKeys(a: string, b: string): number {
  if (a === b) return 0;
  return a < b ? -1 : 1;
}

export function maxDateKey(a: string, b: string): string {
  return compareDateKeys(a, b) >= 0 ? a : b;
}

export function minDateKey(a: string, b: string): string {
  return compareDateKeys(a, b) <= 0 ? a : b;
}

export function parseCycleWeeks(value: string): number {
  const match = value.match(/(\d+)/);
  const parsed = match ? Number.parseInt(match[1], 10) : 2;
  if (!Number.isFinite(parsed)) return 2;
  return Math.max(1, parsed);
}

/** Resolve the currently scheduled date for a plan slot (reschedule override or base projection). */
export function resolvePlanDayDate(
  enrollment: PlanEnrollment,
  week: number,
  day: number,
): string | null {
  const key = planDayKey(week, day);
  const rescheduled = enrollment.rescheduleMap[key];
  if (rescheduled) return rescheduled;

  const sorted = [...enrollment.trainingDays].sort();
  const index = day - 1;
  if (index < 0 || index >= sorted.length) return null;
  return addDaysToDateKey(sorted[index], (week - 1) * 7);
}

export type RescheduleWindow = {
  originalDate: string;
  minDate: string;
  maxDate: string;
};

/**
 * Rolling window around the scheduled training day:
 * minDate = max(today, originalDate - 7 days)
 * maxDate = originalDate + 28 days
 */
export function getRescheduleWindow(
  enrollment: PlanEnrollment,
  week: number,
  day: number,
  today = formatLocalDate(new Date()),
): RescheduleWindow | null {
  const originalDate = resolvePlanDayDate(enrollment, week, day);
  if (!originalDate) return null;

  const earliest = addDaysToDateKey(originalDate, -7);
  let minDate = maxDateKey(today, earliest);
  let maxDate = addDaysToDateKey(originalDate, 28);

  if (compareDateKeys(minDate, maxDate) > 0) {
    minDate = today;
    maxDate = addDaysToDateKey(today, 28);
  }

  return { originalDate, minDate, maxDate };
}

export function formatChineseDateShort(dateKey: string): string {
  const [, month, day] = dateKey.split("-").map(Number);
  return `${month}月${day}日`;
}

export function formatRescheduleRangeLabel(minDate: string, maxDate: string): string {
  return `可调整至 ${formatChineseDateShort(minDate)}—${formatChineseDateShort(maxDate)}`;
}

export type PlanSessionOnDate = {
  week: number;
  day: number;
  absoluteDay: number;
  dateKey: string;
};

/** Project all training dates for a plan within its cycle weeks. */
export function enumeratePlanSessions(
  enrollment: PlanEnrollment,
  totalWeeks: number,
): PlanSessionOnDate[] {
  const sorted = [...enrollment.trainingDays].sort();
  if (!sorted.length || totalWeeks < 1) return [];

  const sessionsPerWeek = sorted.length;
  const sessions: PlanSessionOnDate[] = [];

  for (let week = 1; week <= totalWeeks; week += 1) {
    for (let index = 0; index < sessionsPerWeek; index += 1) {
      const day = index + 1;
      const key = planDayKey(week, day);
      const baseDate = addDaysToDateKey(sorted[index], (week - 1) * 7);
      const dateKey = enrollment.rescheduleMap[key] ?? baseDate;
      sessions.push({
        week,
        day,
        absoluteDay: (week - 1) * sessionsPerWeek + day,
        dateKey,
      });
    }
  }

  return sessions;
}

const WEEKDAY_LABELS = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

export type JoinDayOption = {
  dateKey: string;
  weekday: number;
  weekdayLabel: string;
  dayOfMonth: number;
  monthLabel: string;
};

export function getNextSevenDays(from = new Date()): JoinDayOption[] {
  const options: JoinDayOption[] = [];
  for (let i = 0; i < 7; i += 1) {
    const date = new Date(from.getFullYear(), from.getMonth(), from.getDate() + i);
    options.push({
      dateKey: formatLocalDate(date),
      weekday: date.getDay(),
      weekdayLabel: WEEKDAY_LABELS[date.getDay()],
      dayOfMonth: date.getDate(),
      monthLabel: `${date.getMonth() + 1}月`,
    });
  }
  return options;
}
