import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DigitText } from "@/components/DigitText";
import { GlassSurface } from "@/components/GlassSurface";
import { useTheme } from "@/context/ThemeContext";
import { getRecordModeIcon, TrainingRecord } from "@/data/userMock";
import { ColorPalette, numericType, radius, spacing, typography } from "@/theme";

type TrainingRecordRowProps = {
  record: TrainingRecord;
  onPress?: () => void;
};

export function TrainingRecordRow({ record, onPress }: TrainingRecordRowProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const iconName = getRecordModeIcon(record.mode);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${record.title}，${record.timeLabel}，${record.durationLabel}`}
      onPress={onPress}
      style={({ pressed }) => [styles.wrapper, pressed && styles.pressed]}
    >
      <GlassSurface contentStyle={styles.card}>
        <View style={styles.iconWrap}>
          <Ionicons name={iconName} size={22} color={colors.accent} />
        </View>
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>
            {record.title}
          </Text>
          <DigitText style={styles.meta}>
            {`${record.timeLabel} · ${record.durationLabel}`}
          </DigitText>
          <Text style={styles.source}>{record.sourceLabel}</Text>
        </View>
        <View style={styles.right}>
          <DigitText style={styles.metric}>{record.metricLabel}</DigitText>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </View>
      </GlassSurface>
    </Pressable>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
  wrapper: {
    marginBottom: spacing.sm,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    gap: spacing.md,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.accentGlass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    ...typography.subtitle,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  meta: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  source: {
    ...typography.label,
    color: colors.textMuted,
    marginTop: 2,
  },
  right: {
    alignItems: "flex-end",
    gap: spacing.xs,
  },
  metric: {
    ...typography.caption,
    ...numericType,
    color: colors.accent,
  },
  pressed: {
    opacity: 0.88,
  },
  });
}
