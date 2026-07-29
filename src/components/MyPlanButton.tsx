import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlassSurface } from "@/components/GlassSurface";
import { useTheme } from "@/context/ThemeContext";
import { ColorPalette, radius, spacing, typography } from "@/theme";

type MyPlanButtonProps = {
  onPress?: () => void;
};

export function MyPlanButton({ onPress }: MyPlanButtonProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [pressed && styles.pressed]}
    >
      <GlassSurface contentStyle={styles.card}>
        <View style={styles.left}>
          <View style={styles.iconWrap}>
            <Ionicons name="calendar-outline" size={24} color={colors.textPrimary} />
          </View>
          <View>
            <Text style={styles.title}>我的训练计划</Text>
            <Text style={styles.subtitle}>查看与管理训练大纲</Text>
          </View>
        </View>
        <Ionicons name="arrow-forward-circle" size={30} color={colors.accent} />
      </GlassSurface>
    </Pressable>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.lg,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    flex: 1,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.glassHighlight,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    ...typography.subtitle,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  pressed: {
    opacity: 0.88,
  },
  });
}
