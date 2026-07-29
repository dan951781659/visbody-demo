import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlassSurface } from "@/components/GlassSurface";
import { useTheme } from "@/context/ThemeContext";
import { ColorPalette, radius, spacing, typography } from "@/theme";

type PlaceholderCardProps = {
  title: string;
  status: string;
  hint: string;
  icon: keyof typeof Ionicons.glyphMap;
};

export function PlaceholderCard({ title, status, hint, icon }: PlaceholderCardProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <GlassSurface contentStyle={styles.card}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={22} color={colors.textSecondary} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.status}>{status}</Text>
        <Text style={styles.hint}>{hint}</Text>
      </View>
    </GlassSurface>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
  card: {
    flex: 1,
    padding: spacing.lg,
    minHeight: 120,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.glassHighlight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    ...typography.subtitle,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  status: {
    ...typography.caption,
    color: colors.accent,
    marginBottom: spacing.xs,
  },
  hint: {
    ...typography.caption,
    color: colors.textMuted,
  },
  });
}
