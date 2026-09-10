import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SegmentedControl } from "@/components/profile/SegmentedControl";
import { useTheme } from "@/context/ThemeContext";
import { ColorPalette, spacing, typography } from "@/theme";
import type { TrainingRecordsRange } from "@/types/trainingRecord";

const RANGE_OPTIONS: { id: TrainingRecordsRange; label: string }[] = [
  { id: "week", label: "周" },
  { id: "month", label: "月" },
  { id: "all", label: "全部" },
];

type TrainingRecordRangeHeaderProps = {
  range: TrainingRecordsRange;
  periodLabel?: string;
  canGoNext?: boolean;
  onChangeRange: (range: TrainingRecordsRange) => void;
  onPrevPeriod?: () => void;
  onNextPeriod?: () => void;
};

export function TrainingRecordRangeHeader({
  range,
  periodLabel,
  canGoNext = false,
  onChangeRange,
  onPrevPeriod,
  onNextPeriod,
}: TrainingRecordRangeHeaderProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const showPeriodNav = range === "week" || range === "month";

  return (
    <View style={styles.container}>
      <SegmentedControl
        options={RANGE_OPTIONS}
        value={range}
        onChange={onChangeRange}
        accessibilityLabel="训练记录时间范围"
      />
      {showPeriodNav ? (
        <View style={styles.periodNav}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={range === "week" ? "上一周" : "上一月"}
            onPress={onPrevPeriod}
            style={({ pressed }) => [styles.navButton, pressed && styles.pressed]}
          >
            <Ionicons name="chevron-back" size={18} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.periodLabel} numberOfLines={2}>
            {periodLabel}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={range === "week" ? "下一周" : "下一月"}
            accessibilityState={{ disabled: !canGoNext }}
            disabled={!canGoNext}
            onPress={onNextPeriod}
            style={({ pressed }) => [
              styles.navButton,
              !canGoNext && styles.navDisabled,
              pressed && canGoNext && styles.pressed,
            ]}
          >
            <Ionicons
              name="chevron-forward"
              size={18}
              color={canGoNext ? colors.textPrimary : colors.textMuted}
            />
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    container: {
      gap: spacing.md,
    },
    periodNav: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },
    navButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: colors.glassBorder,
      backgroundColor: colors.glassHighlight,
    },
    navDisabled: {
      opacity: 0.45,
    },
    periodLabel: {
      ...typography.caption,
      color: colors.textSecondary,
      flex: 1,
      textAlign: "center",
    },
    pressed: {
      opacity: 0.88,
    },
  });
}
