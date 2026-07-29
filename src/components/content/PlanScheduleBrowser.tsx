import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import type { PlanScheduleWeek } from "@/types/content";
import { ColorPalette, radius, spacing, typography } from "@/theme";

type PlanScheduleBrowserProps = {
  schedule: PlanScheduleWeek[];
};

export function PlanScheduleBrowser({ schedule }: PlanScheduleBrowserProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [weekIndex, setWeekIndex] = useState(0);
  const activeWeek = schedule[Math.min(weekIndex, schedule.length - 1)];
  const [dayIndex, setDayIndex] = useState(0);

  const days = activeWeek?.days ?? [];
  const activeDay = days[Math.min(dayIndex, Math.max(days.length - 1, 0))];

  const weekTabs = useMemo(
    () => schedule.map((week, index) => ({ key: week.week, label: `第 ${week.week} 周`, index })),
    [schedule],
  );

  const selectWeek = (index: number) => {
    setWeekIndex(index);
    setDayIndex(0);
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
          return (
            <Pressable
              key={`${activeWeek.week}-${day.day}`}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              onPress={() => setDayIndex(index)}
              style={[styles.tab, styles.dayTab, selected && styles.tabSelected]}
            >
              <Text style={[styles.tabText, selected && styles.tabTextSelected]}>
                第 {day.day} 天
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.sectionTitle}>动作列表</Text>
      {!activeDay?.moves.length ? (
        <Text style={styles.empty}>该训练日还未配置动作。</Text>
      ) : (
        <View style={styles.moveList}>
          {activeDay.moves.map((move) => (
            <View key={`${move.name}-${move.sets}`} style={styles.moveCard}>
              <Text style={styles.moveName}>{move.name}</Text>
              <Text style={styles.moveMeta}>
                {move.sets} 组 · {move.repsOrDuration}
                {move.restSeconds != null ? ` · 休息 ${move.restSeconds} 秒` : ""}
                {move.weightKg != null ? ` · ${move.weightKg} kg` : ""}
              </Text>
            </View>
          ))}
        </View>
      )}
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
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    gap: spacing.xs,
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
  empty: {
    ...typography.caption,
    color: colors.textMuted,
  },
  });
}
