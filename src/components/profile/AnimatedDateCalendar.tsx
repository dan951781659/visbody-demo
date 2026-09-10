import { Ionicons } from "@expo/vector-icons";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { ColorPalette, radius, spacing, typography } from "@/theme";

type CalendarView = "day" | "month";

type AnimatedDateCalendarProps = {
  month: string;
  startDate?: string;
  endDate?: string;
  /** Inclusive earliest selectable date (YYYY-MM-DD). Enables cross-year nav when set with maxDate. */
  minDate?: string;
  /** Inclusive latest selectable date (YYYY-MM-DD). */
  maxDate?: string;
  /** Single-day selection highlight (e.g. reschedule picker). */
  selectedDate?: string;
  /** Dates that already have training — show accent dots under the day number. */
  markedDates?: ReadonlySet<string> | string[];
  replayKey?: number;
  onMonthChange: (month: string) => void;
  onSelectDate: (date: string) => void;
};

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];
const WEEKDAYS_FULL = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
const MONTH_LABELS = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
const YEAR_LOOKBACK = 10;
/** Lottie cubic-bezier(0.33, 0, 0.15, 1), 15 frames at 30fps. */
const POP_EASE = Easing.bezier(0.33, 0, 0.15, 1);
const SCALE_MS = 500;
const FADE_MS = 370;

export function getCalendarYearBounds(now = new Date()) {
  const max = now.getFullYear();
  return { min: max - YEAR_LOOKBACK, max };
}

export function getDefaultCalendarMonth(startDate?: string, now = new Date()) {
  const { min, max } = getCalendarYearBounds(now);
  const fallback = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  return clampMonthByYear(startDate?.slice(0, 7) ?? fallback, min, max);
}

function clampMonthByYear(month: string, minYear: number, maxYear: number) {
  const year = Number(month.slice(0, 4));
  if (!Number.isFinite(year)) return `${maxYear}-01`;
  if (year > maxYear) return `${maxYear}${month.slice(4)}`;
  if (year < minYear) return `${minYear}${month.slice(4)}`;
  return month;
}

function clampMonthToRange(month: string, minMonth?: string, maxMonth?: string) {
  if (minMonth && month < minMonth) return minMonth;
  if (maxMonth && month > maxMonth) return maxMonth;
  return month;
}

function isDateOutOfRange(date: string, minDate?: string, maxDate?: string) {
  if (minDate && date < minDate) return true;
  if (maxDate && date > maxDate) return true;
  return false;
}

export function AnimatedDateCalendar({
  month,
  startDate,
  endDate,
  minDate,
  maxDate,
  selectedDate,
  markedDates,
  replayKey = 0,
  onMonthChange,
  onSelectDate,
}: AnimatedDateCalendarProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [view, setView] = useState<CalendarView>("day");
  const [reduceMotion, setReduceMotion] = useState(false);
  const [year, monthNumber] = month.split("-").map(Number);
  const { minMonth, maxMonth, effectiveMinDate, effectiveMaxDate } = useMemo(() => {
    const defaults = getCalendarYearBounds();
    if (!minDate && !maxDate) {
      return {
        minMonth: `${defaults.min}-01`,
        maxMonth: `${defaults.max}-12`,
        effectiveMinDate: `${defaults.min}-01-01`,
        effectiveMaxDate: `${defaults.max}-12-31`,
      };
    }
    const minY = minDate ? Number(minDate.slice(0, 4)) : defaults.min;
    const maxY = maxDate ? Number(maxDate.slice(0, 4)) : Math.max(defaults.max, minY);
    return {
      minMonth: (minDate ?? `${minY}-01-01`).slice(0, 7),
      maxMonth: (maxDate ?? `${maxY}-12-31`).slice(0, 7),
      effectiveMinDate: minDate ?? `${minY}-01-01`,
      effectiveMaxDate: maxDate ?? `${maxY}-12-31`,
    };
  }, [minDate, maxDate]);
  const atMinMonth = month <= minMonth;
  const atMaxMonth = month >= maxMonth;
  const focusDate = selectedDate ?? endDate ?? startDate ?? `${month}-01`;
  const markedSet = useMemo(() => {
    if (!markedDates) return null;
    return markedDates instanceof Set ? markedDates : new Set(markedDates);
  }, [markedDates]);

  useEffect(() => {
    const sub = AccessibilityInfo.addEventListener("reduceMotionChanged", setReduceMotion);
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    return () => sub.remove();
  }, []);

  useEffect(() => {
    setView("day");
  }, [replayKey]);

  const days = useMemo(() => getMonthGrid(month), [month]);

  const changeMonth = (next: string) => {
    onMonthChange(clampMonthToRange(next, minMonth, maxMonth));
  };

  return (
    <View>
      <View style={styles.header}>
        <View style={styles.yearButton} accessibilityLabel={`${year}年`}>
          <Text style={styles.yearText}>{year}</Text>
        </View>
        {view === "day" ? (
          <View style={styles.monthNav}>
            <Pressable
              accessibilityLabel="上个月"
              accessibilityState={{ disabled: atMinMonth }}
              disabled={atMinMonth}
              onPress={() => changeMonth(addMonth(month, -1))}
              style={[styles.monthChevron, atMinMonth && styles.pressed]}
            >
              <Ionicons name="chevron-back" size={18} color={atMinMonth ? colors.textMuted : colors.textPrimary} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="选择月份"
              onPress={() => setView("month")}
              style={({ pressed }) => [styles.subtitleButton, pressed && styles.pressed]}
            >
              <Text style={styles.subtitle}>{formatFocusLabel(focusDate, month)}</Text>
            </Pressable>
            <Pressable
              accessibilityLabel="下个月"
              accessibilityState={{ disabled: atMaxMonth }}
              disabled={atMaxMonth}
              onPress={() => changeMonth(addMonth(month, 1))}
              style={[styles.monthChevron, atMaxMonth && styles.pressed]}
            >
              <Ionicons name="chevron-forward" size={18} color={atMaxMonth ? colors.textMuted : colors.textPrimary} />
            </Pressable>
          </View>
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="返回日历"
            onPress={() => setView("day")}
            style={({ pressed }) => [styles.subtitleButton, pressed && styles.pressed]}
          >
            <Text style={styles.subtitle}>{`${year}年`}</Text>
          </Pressable>
        )}
      </View>

      <ViewStage mode={view} reduceMotion={reduceMotion} styles={styles}>
        {view === "month" ? (
          <View style={styles.monthGrid}>
            {MONTH_LABELS.map((label, index) => {
              const selected = index + 1 === monthNumber;
              const candidate = `${year}-${String(index + 1).padStart(2, "0")}`;
              const monthDisabled = candidate < minMonth || candidate > maxMonth;
              return (
                <PopIn
                  key={`${replayKey}-m-${index}`}
                  delayMs={index * 45}
                  disabled={reduceMotion}
                  style={styles.monthCellWrap}
                >
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={label}
                    accessibilityState={{ selected, disabled: monthDisabled }}
                    disabled={monthDisabled}
                    onPress={() => {
                      changeMonth(candidate);
                      setView("day");
                    }}
                    style={({ pressed }) => [
                      styles.monthCell,
                      selected ? styles.cellSelected : styles.cellIdle,
                      monthDisabled && styles.cellMuted,
                      pressed && !monthDisabled && styles.pressed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.monthLabel,
                        selected && styles.cellSelectedText,
                        monthDisabled && styles.dayTextMuted,
                      ]}
                    >
                      {label}
                    </Text>
                  </Pressable>
                </PopIn>
              );
            })}
          </View>
        ) : null}

        {view === "day" ? (
          <View>
            <View style={styles.weekRow}>
              {WEEKDAYS.map((day) => (
                <Text key={day} style={styles.weekDay}>{day}</Text>
              ))}
            </View>
            <View style={styles.dayGrid}>
              {days.map((item, index) => {
                const selected =
                  item.date === selectedDate ||
                  item.date === startDate ||
                  item.date === endDate;
                const inRange = Boolean(startDate && endDate && item.date > startDate && item.date < endDate);
                const marked = Boolean(markedSet?.has(item.date));
                const outOfRange = isDateOutOfRange(item.date, effectiveMinDate, effectiveMaxDate);
                const disabled = outOfRange;
                const row = Math.floor(index / 7);
                return (
                  <PopIn
                    key={`${replayKey}-${item.date}`}
                    delayMs={row * 50 + (index % 7) * 12}
                    disabled={reduceMotion}
                    style={styles.dayCellWrap}
                  >
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`${formatDate(item.date)}${item.inMonth ? "" : "，邻月"}${marked ? "，已有训练" : ""}${disabled ? "，不可选" : ""}`}
                      accessibilityState={{ selected, disabled }}
                      disabled={disabled}
                      onPress={() => {
                        if (!item.inMonth) changeMonth(item.date.slice(0, 7));
                        onSelectDate(item.date);
                      }}
                      style={({ pressed }) => [
                        styles.dayCell,
                        item.inMonth ? styles.cellIdle : styles.cellMuted,
                        inRange && styles.dayInRange,
                        selected && styles.cellSelected,
                        disabled && styles.dayDisabled,
                        pressed && !disabled && styles.pressed,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          (!item.inMonth || disabled) && styles.dayTextMuted,
                          selected && styles.cellSelectedText,
                        ]}
                      >
                        {item.day}
                      </Text>
                      {marked && !disabled ? (
                        <View
                          style={[styles.dayDot, selected && styles.dayDotOnSelected]}
                          accessibilityElementsHidden
                          importantForAccessibility="no"
                        />
                      ) : (
                        <View style={styles.dayDotSpacer} />
                      )}
                    </Pressable>
                  </PopIn>
                );
              })}
            </View>
          </View>
        ) : null}
      </ViewStage>
    </View>
  );
}

function ViewStage({
  mode,
  reduceMotion,
  styles,
  children,
}: {
  mode: CalendarView;
  reduceMotion: boolean;
  styles: ReturnType<typeof createStyles>;
  children: ReactNode;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const previous = useRef(mode);
  const skipMount = useRef(true);

  if (previous.current !== mode) {
    previous.current = mode;
    if (reduceMotion) {
      scale.setValue(1);
      opacity.setValue(1);
    } else {
      scale.setValue(0.5);
      opacity.setValue(0);
    }
  }

  useEffect(() => {
    if (skipMount.current) {
      skipMount.current = false;
      return;
    }
    if (reduceMotion) {
      scale.setValue(1);
      opacity.setValue(1);
      return;
    }
    Animated.parallel([
      Animated.timing(scale, { toValue: 1, duration: SCALE_MS, easing: POP_EASE, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: FADE_MS, easing: POP_EASE, useNativeDriver: true }),
    ]).start();
  }, [mode, opacity, reduceMotion, scale]);

  return (
    <Animated.View style={[styles.stage, { opacity, transform: [{ scale }] }]}>
      {children}
    </Animated.View>
  );
}

function PopIn({
  delayMs,
  disabled,
  style,
  children,
}: {
  delayMs: number;
  disabled: boolean;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}) {
  const scale = useRef(new Animated.Value(disabled ? 1 : 0.5)).current;
  const opacity = useRef(new Animated.Value(disabled ? 1 : 0)).current;

  useEffect(() => {
    if (disabled) {
      scale.setValue(1);
      opacity.setValue(1);
      return;
    }
    const animation = Animated.parallel([
      Animated.timing(scale, { toValue: 1, duration: SCALE_MS, delay: delayMs, easing: POP_EASE, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: FADE_MS, delay: delayMs + 80, easing: POP_EASE, useNativeDriver: true }),
    ]);
    animation.start();
    return () => animation.stop();
  }, [delayMs, disabled, opacity, scale]);

  return (
    <Animated.View style={[style, { opacity, transform: [{ scale }] }]}>
      {children}
    </Animated.View>
  );
}

function getMonthGrid(month: string) {
  const [year, monthNumber] = month.split("-").map(Number);
  const first = new Date(year, monthNumber - 1, 1);
  const gridStart = new Date(year, monthNumber - 1, 1 - first.getDay());
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    return {
      date: toIso(date),
      day: date.getDate(),
      inMonth: date.getMonth() === monthNumber - 1,
    };
  });
}

function addMonth(month: string, delta: number) {
  const date = new Date(`${month}-01T00:00:00`);
  date.setMonth(date.getMonth() + delta);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function toIso(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatDate(date: string) {
  const [, month, day] = date.split("-");
  return `${Number(month)}月${Number(day)}日`;
}

function formatFocusLabel(focusDate: string, month: string) {
  const [year, monthNumber, day] = focusDate.split("-").map(Number);
  const weekday = WEEKDAYS_FULL[new Date(year, monthNumber - 1, day).getDay()];
  if (focusDate.startsWith(month) && day) return `${monthNumber}月${day}日 ${weekday}`;
  const [, cursorMonth] = month.split("-");
  return `${Number(cursorMonth)}月`;
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    header: {
      marginTop: spacing.xl,
      gap: spacing.sm,
    },
    yearButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },
    yearText: {
      ...typography.sectionTitle,
      color: colors.textPrimary,
    },
    monthNav: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    monthChevron: {
      width: 36,
      height: 36,
      alignItems: "center",
      justifyContent: "center",
    },
    subtitleButton: {
      flex: 1,
      alignItems: "center",
      paddingVertical: spacing.xs,
    },
    subtitle: {
      ...typography.caption,
      color: colors.textSecondary,
    },
    stage: {
      minHeight: 312,
      marginTop: spacing.md,
    },
    weekRow: {
      flexDirection: "row",
    },
    weekDay: {
      flex: 1,
      textAlign: "center",
      ...typography.caption,
      color: colors.textMuted,
    },
    dayGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: spacing.xs,
    },
    dayCellWrap: {
      width: "14.285%",
      padding: 2,
    },
    dayCell: {
      height: 48,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: radius.md,
      gap: 2,
    },
    cellIdle: {
      backgroundColor: colors.background,
    },
    cellMuted: {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: colors.border,
    },
    cellSelected: {
      backgroundColor: colors.accent,
      borderWidth: 0,
    },
    dayInRange: {
      backgroundColor: colors.accentGlass,
      borderRadius: radius.sm,
    },
    dayText: {
      ...typography.caption,
      color: colors.textPrimary,
    },
    dayTextMuted: {
      color: colors.textMuted,
      opacity: 0.45,
    },
    dayDisabled: {
      opacity: 0.4,
    },
    cellSelectedText: {
      color: colors.accentText,
    },
    dayDot: {
      width: 5,
      height: 5,
      borderRadius: 3,
      backgroundColor: colors.accent,
    },
    dayDotOnSelected: {
      backgroundColor: colors.accentText,
    },
    dayDotSpacer: {
      width: 5,
      height: 5,
    },
    monthGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginHorizontal: -4,
    },
    monthCellWrap: {
      width: "25%",
      padding: 4,
    },
    monthCell: {
      minHeight: 72,
      borderRadius: radius.md,
      alignItems: "center",
      justifyContent: "center",
    },
    monthLabel: {
      ...typography.label,
      color: colors.textPrimary,
    },
    pressed: {
      opacity: 0.88,
    },
  });
}
