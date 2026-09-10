import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import { resolvePlanMoveDetails } from "@/data/exploreLibrary";
import type { PlanScheduleMove, PlanScheduleWeek } from "@/types/content";
import { planDayKey } from "@/types/plan";
import { ColorPalette, radius, spacing, typography } from "@/theme";

type PlanScheduleBrowserProps = {
  schedule: PlanScheduleWeek[];
  dayStatusMap?: Record<string, "finished" | "skipped">;
  rescheduleMap?: Record<string, string>;
  onSelectionChange?: (week: number, day: number) => void;
};

function moveKey(move: PlanScheduleMove, index: number) {
  return `${move.name}-${move.sets}-${index}`;
}

export function PlanScheduleBrowser({
  schedule,
  dayStatusMap = {},
  rescheduleMap = {},
  onSelectionChange,
}: PlanScheduleBrowserProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [weekIndex, setWeekIndex] = useState(0);
  const activeWeek = schedule[Math.min(weekIndex, Math.max(schedule.length - 1, 0))];
  const [dayIndex, setDayIndex] = useState(0);
  /** null = 使用默认：仅展开第一个动作 */
  const [expandedIds, setExpandedIds] = useState<Set<string> | null>(null);

  const days = activeWeek?.days ?? [];
  const activeDay = days[Math.min(dayIndex, Math.max(days.length - 1, 0))];
  const moves = activeDay?.moves ?? [];

  useEffect(() => {
    if (!activeWeek || !activeDay) return;
    onSelectionChange?.(activeWeek.week, activeDay.day);
    // Only announce when selection indices change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeWeek?.week, activeDay?.day]);

  const weekTabs = useMemo(
    () => schedule.map((week, index) => ({ key: week.week, label: `第 ${week.week} 周`, index })),
    [schedule],
  );

  const resolvedExpanded = useMemo(() => {
    if (expandedIds) return expandedIds;
    if (!moves.length) return new Set<string>();
    return new Set([moveKey(moves[0], 0)]);
  }, [expandedIds, moves]);

  const selectWeek = (index: number) => {
    setWeekIndex(index);
    setDayIndex(0);
    setExpandedIds(null);
  };

  const selectDay = (index: number) => {
    setDayIndex(index);
    setExpandedIds(null);
  };

  const toggleMove = (id: string) => {
    setExpandedIds((prev) => {
      const base =
        prev ?? (moves[0] ? new Set([moveKey(moves[0], 0)]) : new Set<string>());
      const next = new Set(base);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (!schedule.length) {
    return <Text style={styles.empty}>暂无计划安排</Text>;
  }

  return (
    <View style={styles.wrap}>
      <Text style={styles.sectionTitle}>每周安排</Text>

      <View style={styles.tabRow}>
        {weekTabs.map((tab) => {
          const selected = tab.index === weekIndex;
          return (
            <Pressable
              key={tab.key}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              onPress={() => selectWeek(tab.index)}
              style={[styles.tab, selected && styles.tabSelected]}
            >
              <Text style={[styles.tabText, selected && styles.tabTextSelected]}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.tabRow}>
        {days.map((day, index) => {
          const selected = index === dayIndex;
          const key = planDayKey(activeWeek.week, day.day);
          const status = dayStatusMap[key];
          const rescheduled = rescheduleMap[key];
          const label =
            status === "finished"
              ? "已完成"
              : status === "skipped"
                ? "已跳过"
                : `第 ${day.day} 天`;
          return (
            <Pressable
              key={`${activeWeek.week}-${day.day}`}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              onPress={() => selectDay(index)}
              style={[
                styles.tab,
                styles.dayTab,
                selected && styles.tabSelected,
                status === "finished" && styles.dayFinished,
                status === "skipped" && styles.daySkipped,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  selected && styles.tabTextSelected,
                  status === "finished" && styles.dayFinishedText,
                  status === "skipped" && styles.daySkippedText,
                ]}
              >
                {label}
              </Text>
              {rescheduled && !status ? (
                <Text style={styles.rescheduleHint}>{rescheduled.slice(5)}</Text>
              ) : null}
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.sectionTitle}>动作列表</Text>
      {!moves.length ? (
        <Text style={styles.empty}>该训练日还未配置动作。</Text>
      ) : (
        <View style={styles.moveList}>
          {moves.map((move, index) => {
            const id = moveKey(move, index);
            const open = resolvedExpanded.has(id);
            const details = resolvePlanMoveDetails(move);

            return (
              <View key={id} style={styles.moveCard}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ expanded: open }}
                  accessibilityLabel={`${move.name}${open ? "，已展开" : "，已收起"}`}
                  onPress={() => toggleMove(id)}
                  style={({ pressed }) => [styles.moveHeader, pressed && styles.pressed]}
                >
                  <View style={styles.moveHeaderText}>
                    <Text style={styles.moveName}>{move.name}</Text>
                    <Text style={styles.moveMeta}>
                      {move.sets} 组 · {move.repsOrDuration}
                      {move.restSeconds != null ? ` · 休息 ${move.restSeconds} 秒` : ""}
                      {move.weightKg != null ? ` · ${move.weightKg} kg` : ""}
                    </Text>
                  </View>
                  <Ionicons
                    name={open ? "chevron-up" : "chevron-down"}
                    size={18}
                    color={colors.textSecondary}
                  />
                </Pressable>

                {open ? (
                  <View style={styles.moveDetail}>
                    <DetailBlock styles={styles} title="动作介绍">
                      <Text style={styles.detailBody}>{details.description}</Text>
                    </DetailBlock>
                    <DetailBlock styles={styles} title="动作要点">
                      {details.keyPoints.map((point) => (
                        <Text key={point} style={styles.detailBody}>
                          • {point}
                        </Text>
                      ))}
                    </DetailBlock>
                    <DetailBlock styles={styles} title="呼吸建议">
                      <Text style={styles.detailBody}>{details.breathing}</Text>
                    </DetailBlock>
                    <DetailBlock styles={styles} title="错误要点">
                      {details.commonMistakes.map((mistake) => (
                        <Text key={mistake} style={styles.detailBody}>
                          • {mistake}
                        </Text>
                      ))}
                    </DetailBlock>
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

function DetailBlock({
  title,
  children,
  styles,
}: {
  title: string;
  children: ReactNode;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <View style={styles.detailBlock}>
      <Text style={styles.detailTitle}>{title}</Text>
      <View style={styles.detailContent}>{children}</View>
    </View>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    wrap: {
      gap: spacing.md,
    },
    sectionTitle: {
      ...typography.subtitle,
      color: colors.textPrimary,
    },
    tabRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.sm,
    },
    tab: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radius.pill,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    dayTab: {
      minWidth: 72,
      alignItems: "center",
      gap: 2,
    },
    dayFinished: {
      borderColor: colors.green,
      backgroundColor: "rgba(34,197,94,0.12)",
    },
    daySkipped: {
      borderColor: colors.orange,
      backgroundColor: "rgba(249,115,22,0.12)",
    },
    dayFinishedText: {
      color: colors.green,
    },
    daySkippedText: {
      color: colors.orange,
    },
    rescheduleHint: {
      ...typography.label,
      fontSize: 10,
      color: colors.textMuted,
    },
    tabSelected: {
      backgroundColor: colors.accentGlass,
      borderColor: colors.accent,
    },
    tabText: {
      ...typography.label,
      color: colors.textSecondary,
    },
    tabTextSelected: {
      color: colors.accent,
    },
    moveList: {
      gap: spacing.sm,
    },
    moveCard: {
      borderRadius: radius.lg,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.glassBorder,
      overflow: "hidden",
    },
    moveHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      padding: spacing.lg,
    },
    moveHeaderText: {
      flex: 1,
      gap: spacing.xs,
      minWidth: 0,
    },
    moveName: {
      ...typography.subtitle,
      fontSize: 17,
      color: colors.textPrimary,
    },
    moveMeta: {
      ...typography.caption,
      color: colors.textSecondary,
    },
    moveDetail: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.glassBorder,
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.lg,
      paddingTop: spacing.md,
      gap: spacing.md,
    },
    detailBlock: {
      gap: spacing.xs,
    },
    detailTitle: {
      ...typography.label,
      fontSize: 13,
      color: colors.textMuted,
    },
    detailContent: {
      gap: spacing.xs,
    },
    detailBody: {
      ...typography.caption,
      fontSize: 13,
      lineHeight: 20,
      color: colors.textSecondary,
    },
    pressed: {
      opacity: 0.88,
    },
    empty: {
      ...typography.caption,
      color: colors.textMuted,
    },
  });
}
