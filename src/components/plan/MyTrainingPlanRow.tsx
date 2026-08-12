import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DigitText } from "@/components/DigitText";
import { GlassSurface } from "@/components/GlassSurface";
import { LinearProgressBar } from "@/components/profile/LinearProgressBar";
import { useTheme } from "@/context/ThemeContext";
import { MyTrainingPlan, MyTrainingPlansTab } from "@/data/planMock";
import { ColorPalette, radius, spacing, typography } from "@/theme";
import { getMetaChipPalette } from "@/theme/metaChip";

type MyTrainingPlanRowProps = {
  plan: MyTrainingPlan;
  tab: MyTrainingPlansTab;
  onPress?: () => void;
};

function statusBadgeStyle(status: MyTrainingPlan["status"], colors: ColorPalette) {
  if (status === "completed") {
    return { backgroundColor: "rgba(34,197,94,0.16)", color: colors.green };
  }
  if (status === "quit") {
    return { backgroundColor: "rgba(239,68,68,0.14)", color: colors.red };
  }
  if (status === "ended") {
    return { backgroundColor: colors.surfaceMuted, color: colors.textMuted };
  }
  return { backgroundColor: colors.accentGlass, color: colors.accent };
}

export function MyTrainingPlanRow({ plan, tab, onPress }: MyTrainingPlanRowProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const badge = statusBadgeStyle(plan.status, colors);
  const personalizedPalette = getMetaChipPalette("Personalized");
  const showHistoryBadge = tab === "history";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={plan.title}
      onPress={onPress}
      style={({ pressed }) => [pressed && styles.pressed]}
    >
      <GlassSurface contentStyle={styles.card}>
        <View style={styles.main}>
          <View style={styles.header}>
            <View style={styles.titleWrap}>
              <Text style={styles.title}>{plan.title}</Text>
              {plan.isPersonalized ? (
                <View
                  style={[
                    styles.personalizedTag,
                    {
                      backgroundColor: personalizedPalette.background,
                      borderColor: personalizedPalette.border,
                    },
                  ]}
                >
                  <Text style={[styles.personalizedText, { color: personalizedPalette.text }]}>
                    个性化
                  </Text>
                </View>
              ) : null}
            </View>
            {showHistoryBadge ? (
              <View style={[styles.badge, { backgroundColor: badge.backgroundColor }]}>
                <Text style={[styles.badgeText, { color: badge.color }]}>{plan.statusLabel}</Text>
              </View>
            ) : null}
          </View>

          <Text style={styles.duration}>{plan.durationLabel}</Text>

          {tab === "ongoing" ? (
            <LinearProgressBar
              progress={plan.progress / 100}
              label={`第 ${plan.currentDay} / ${plan.totalDays} 天`}
            />
          ) : (
            <DigitText style={styles.dateLabel}>{plan.dateLabel ?? ""}</DigitText>
          )}
        </View>

        <View style={styles.chevron}>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </View>
      </GlassSurface>
    </Pressable>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
    gap: spacing.md,
  },
  main: {
    flex: 1,
    gap: spacing.sm,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  titleWrap: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: spacing.xs,
  },
  title: {
    ...typography.subtitle,
    color: colors.textPrimary,
  },
  personalizedTag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  personalizedText: {
    ...typography.label,
    fontSize: 11,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  badgeText: {
    ...typography.label,
    fontSize: 12,
  },
  duration: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  dateLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  chevron: {
    paddingLeft: spacing.xs,
  },
  pressed: {
    opacity: 0.88,
  },
  });
}
