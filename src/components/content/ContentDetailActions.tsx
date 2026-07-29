import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import { ColorPalette, radius, spacing, typography } from "@/theme";

type ContentDetailActionsProps = {
  onPreview: () => void;
  primaryNotice?: string;
  startTrainingDisabled?: boolean;
};

export function ContentDetailActions({
  onPreview,
  primaryNotice,
  startTrainingDisabled = true,
}: ContentDetailActionsProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.wrap}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: startTrainingDisabled }}
        disabled={startTrainingDisabled}
        style={[
          styles.button,
          styles.buttonPrimary,
          startTrainingDisabled && styles.buttonPrimaryDisabled,
        ]}
      >
        <Text
          style={[
            styles.primaryText,
            startTrainingDisabled && styles.primaryTextDisabled,
          ]}
        >
          开始训练
        </Text>
      </Pressable>
      {primaryNotice ? <Text style={styles.notice}>{primaryNotice}</Text> : null}
      <Pressable
        accessibilityRole="button"
        onPress={onPreview}
        style={({ pressed }) => [styles.button, styles.buttonSecondary, pressed && styles.pressed]}
      >
        <View style={styles.buttonContent}>
          <Ionicons name="play" size={16} color={colors.accent} />
          <Text style={styles.secondaryText}>预览</Text>
        </View>
      </Pressable>
    </View>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
  wrap: {
    gap: spacing.md,
  },
  button: {
    minHeight: 56,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  buttonPrimary: {
    backgroundColor: colors.accent,
  },
  buttonPrimaryDisabled: {
    backgroundColor: colors.surfaceMuted,
    opacity: 0.55,
  },
  buttonSecondary: {
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  primaryText: {
    ...typography.subtitle,
    fontSize: 17,
    color: colors.accentText,
  },
  primaryTextDisabled: {
    color: colors.textMuted,
  },
  notice: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: -spacing.xs,
  },
  secondaryText: {
    ...typography.subtitle,
    fontSize: 17,
    color: colors.textPrimary,
  },
  pressed: {
    opacity: 0.9,
  },
  });
}
