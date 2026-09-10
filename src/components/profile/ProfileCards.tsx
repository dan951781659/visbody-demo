import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DigitText } from "@/components/DigitText";
import { GlassSurface } from "@/components/GlassSurface";
import { LinearProgressBar } from "@/components/profile/LinearProgressBar";
import { useTheme } from "@/context/ThemeContext";
import { ActiveTrainingPlan, SettingsMenuIcon } from "@/data/userMock";
import { ColorPalette, radius, spacing, typography } from "@/theme";

type ActivePlanCardProps = {
  plan: ActiveTrainingPlan;
};

export function ActivePlanCard({ plan }: ActivePlanCardProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <GlassSurface contentStyle={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <Ionicons name="calendar-outline" size={22} color={colors.accent} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.status}>{plan.statusLabel}</Text>
          <Text style={styles.title}>{plan.name}</Text>
        </View>
      </View>

      <DigitText style={styles.dayLabel}>
        {`第 ${plan.currentDay} / ${plan.totalDays} 天`}
      </DigitText>
      <LinearProgressBar progress={plan.progress} label={plan.nextSessionLabel} />
    </GlassSurface>
  );
}

type SettingsMenuRowProps = {
  title: string;
  subtitle?: string;
  icon: SettingsMenuIcon;
  destructive?: boolean;
  onPress?: () => void;
};

export function SettingsMenuRow({
  title,
  subtitle,
  icon,
  destructive = false,
  onPress,
}: SettingsMenuRowProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={({ pressed }) => [styles.rowWrapper, pressed && styles.pressed]}
    >
      <GlassSurface contentStyle={styles.row}>
        <View style={[styles.iconWrap, destructive && styles.iconWrapDestructive]}>
          <Ionicons name={icon} size={20} color={destructive ? colors.red : colors.textPrimary} />
        </View>
        <View style={styles.rowContent}>
          <Text style={[styles.rowTitle, !subtitle && styles.rowTitleSolo, destructive && styles.destructiveText]}>
            {title}
          </Text>
          {subtitle ? <Text style={styles.rowSubtitle}>{subtitle}</Text> : null}
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
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
  header: {
    flexDirection: "row",
    alignItems: "center",
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
  headerText: {
    flex: 1,
  },
  status: {
    ...typography.label,
    color: colors.accent,
    marginBottom: 2,
  },
  title: {
    ...typography.subtitle,
    color: colors.textPrimary,
  },
  dayLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  rowWrapper: {
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    gap: spacing.md,
  },
  iconWrapDestructive: {
    backgroundColor: "rgba(239,68,68,0.12)",
  },
  rowContent: {
    flex: 1,
  },
  rowTitle: {
    ...typography.subtitle,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  rowTitleSolo: {
    marginBottom: 0,
  },
  rowSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  destructiveText: {
    color: colors.red,
  },
  pressed: {
    opacity: 0.88,
  },
  });
}
