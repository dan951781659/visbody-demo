import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlassSurface } from "@/components/GlassSurface";
import { useTheme } from "@/context/ThemeContext";
import { GeneratedPlan } from "@/data/planMock";
import { ColorPalette, radius, spacing, typography } from "@/theme";

type PlanListRowProps = {
  plan: GeneratedPlan;
  onPress?: () => void;
};

export function PlanListRow({ plan, onPress }: PlanListRowProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={plan.name}
      onPress={onPress}
      style={({ pressed }) => [pressed && styles.pressed]}
    >
      <GlassSurface contentStyle={styles.card}>
        <View style={styles.top}>
          <View style={styles.iconWrap}>
            <Ionicons name="calendar-outline" size={20} color={colors.textPrimary} />
          </View>
          <View style={styles.meta}>
            <Text style={styles.name}>{plan.name}</Text>
            <Text style={styles.summary}>{plan.summary}</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{plan.statusLabel}</Text>
          </View>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>{plan.cycleLabel}</Text>
          <Text style={styles.footerText}>{plan.createdAtLabel}</Text>
        </View>
      </GlassSurface>
    </Pressable>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
  card: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  top: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.glassHighlight,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  meta: {
    flex: 1,
    gap: 2,
  },
  name: {
    ...typography.subtitle,
    color: colors.textPrimary,
  },
  summary: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.accentGlass,
  },
  badgeText: {
    ...typography.label,
    color: colors.accent,
    fontSize: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: spacing.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.glassBorder,
  },
  footerText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  pressed: {
    opacity: 0.88,
  },
  });
}
