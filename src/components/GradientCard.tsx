import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, typography } from "@/theme";

type GradientCardProps = {
  title: string;
  subtitle?: string;
  meta?: string;
  badge?: string;
  gradient: [string, string];
  width?: number;
  height?: number;
  onPress?: () => void;
};

export function GradientCard({
  title,
  subtitle,
  meta,
  badge,
  gradient,
  width = 280,
  height = 180,
  onPress,
}: GradientCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [{ width, opacity: pressed ? 0.88 : 1 }]}
    >
      <LinearGradient colors={gradient} style={[styles.card, { height }]}>
        {badge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        ) : null}
        <LinearGradient colors={["transparent", colors.overlay]} style={styles.overlay}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={2}>
              {subtitle}
            </Text>
          ) : null}
          {meta ? <Text style={styles.meta}>{meta}</Text> : null}
        </LinearGradient>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    overflow: "hidden",
    justifyContent: "flex-end",
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  badge: {
    position: "absolute",
    top: spacing.md,
    left: spacing.md,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  badgeText: {
    ...typography.label,
    color: colors.textPrimary,
  },
  overlay: {
    padding: spacing.lg,
    paddingTop: spacing.xxxl,
  },
  title: {
    ...typography.subtitle,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  meta: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
