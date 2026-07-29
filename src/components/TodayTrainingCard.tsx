import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { GlassButton } from "@/components/GlassButton";
import { GlassSurface } from "@/components/GlassSurface";
import { useTheme } from "@/context/ThemeContext";
import { getTodayPlanReminder } from "@/data/mockData";
import { ColorPalette, spacing, typography } from "@/theme";

type TodayTrainingCardProps = {
  /** YYYY-MM-DD，与今日摘要选中日联动 */
  date: string;
  onViewPlan?: (planId: string) => void;
  onFreeTrainingPress?: () => void;
};

export function TodayTrainingCard({
  date,
  onViewPlan,
  onFreeTrainingPress,
}: TodayTrainingCardProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const reminder = useMemo(() => getTodayPlanReminder(date), [date]);
  const isTraining = reminder.kind === "training";
  const showSessions = isTraining && reminder.sessions.length > 0;
  const showFreeTrainingCta = reminder.kind === "free" || reminder.kind === "rest";

  return (
    <GlassSurface contentStyle={styles.card}>
      <View
        style={[
          styles.copy,
          !showSessions && !showFreeTrainingCta && styles.copyRest,
        ]}
      >
        <Text style={styles.label}>{reminder.label}</Text>
        <Text style={styles.title}>{reminder.title}</Text>
        <Text style={styles.subtitle}>{reminder.subtitle}</Text>
      </View>

      {showSessions ? (
        <View style={styles.sessionList}>
          {reminder.sessions.map((session) => (
            <View key={session.planId} style={styles.sessionRow}>
              <Text style={styles.sessionName} numberOfLines={2}>
                {session.name} {session.weekDayLabel}
              </Text>
              <GlassButton
                style={styles.viewButton}
                onPress={() => onViewPlan?.(session.planId)}
              >
                <Text style={styles.ctaText}>查看</Text>
              </GlassButton>
            </View>
          ))}
        </View>
      ) : null}

      {showFreeTrainingCta ? (
        <GlassButton onPress={onFreeTrainingPress}>
          <Text style={styles.freeCtaText}>自由训练</Text>
        </GlassButton>
      ) : null}
    </GlassSurface>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    card: {
      padding: spacing.lg,
    },
    copy: {
      gap: spacing.xs,
      marginBottom: spacing.lg,
    },
    copyRest: {
      marginBottom: 0,
    },
    label: {
      ...typography.label,
      color: colors.accent,
    },
    title: {
      ...typography.subtitle,
      color: colors.textPrimary,
    },
    subtitle: {
      ...typography.caption,
      color: colors.textSecondary,
    },
    sessionList: {
      gap: spacing.sm,
    },
    sessionRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      backgroundColor: colors.glassHighlight,
      borderWidth: 1,
      borderColor: colors.glassBorder,
      borderRadius: 12,
      paddingVertical: spacing.sm,
      paddingLeft: spacing.md,
      paddingRight: spacing.sm,
    },
    sessionName: {
      ...typography.caption,
      color: colors.textPrimary,
      flex: 1,
      minWidth: 0,
    },
    viewButton: {
      flexShrink: 0,
    },
    ctaText: {
      ...typography.label,
      color: colors.accentText,
      textAlign: "center",
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
    },
    freeCtaText: {
      ...typography.subtitle,
      color: colors.accentText,
      textAlign: "center",
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
    },
  });
}
