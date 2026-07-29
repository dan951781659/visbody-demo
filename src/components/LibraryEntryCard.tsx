import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlassSurface } from "@/components/GlassSurface";
import { useTheme } from "@/context/ThemeContext";
import { ColorPalette, radius, spacing, typography } from "@/theme";

type LibraryEntryCardProps = {
  onPress?: () => void;
};

export function LibraryEntryCard({ onPress }: LibraryEntryCardProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.wrapper, pressed && styles.pressed]}
    >
      <GlassSurface contentStyle={styles.card}>
        <View style={styles.iconWrap}>
          <Ionicons name="library-outline" size={26} color={colors.accent} />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>动作库</Text>
          <Text style={styles.subtitle}>浏览全部训练动作与 AI 指导</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
      </GlassSurface>
    </Pressable>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
    gap: spacing.md,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.accentGlass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
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
