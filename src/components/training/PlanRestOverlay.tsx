import { useMemo } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { DigitText } from "@/components/DigitText";
import { useTheme } from "@/context/ThemeContext";
import type { PlanRestState } from "@/types/plan";
import { ColorPalette, numericType, radius, spacing, typography } from "@/theme";

type PlanRestOverlayProps = {
  visible: boolean;
  rest: PlanRestState | null;
  nextMoveName?: string;
  onSkip: () => void;
};

/** Full-screen rest wait layer aligned with device PlanTrainingWait. */
export function PlanRestOverlay({
  visible,
  rest,
  nextMoveName,
  onSkip,
}: PlanRestOverlayProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  if (!visible || !rest) return null;

  const title = rest.phase === "between_set" ? "组间休息" : "休息";
  const showNext = rest.phase === "inter_action" && Boolean(nextMoveName);

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onSkip}>
      <View style={styles.backdrop} accessibilityRole="summary">
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <DigitText style={styles.countdown}>{`${rest.remainingSeconds}s`}</DigitText>
          {showNext ? (
            <Text style={styles.nextLabel}>下一项：{nextMoveName}</Text>
          ) : null}
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="跳过休息"
          onPress={onSkip}
          style={({ pressed }) => [styles.skipButton, pressed && styles.pressed]}
        >
          <Text style={styles.skipText}>跳过休息</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: "rgba(2, 6, 23, 0.86)",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: spacing.xl,
      paddingBottom: spacing.xxxl,
    },
    content: {
      alignItems: "center",
      gap: spacing.md,
      marginBottom: spacing.xxxl,
    },
    title: {
      ...typography.subtitle,
      fontSize: 28,
      color: colors.textPrimary,
      textAlign: "center",
    },
    countdown: {
      ...numericType,
      fontSize: 76,
      lineHeight: 84,
      color: colors.accent,
      textAlign: "center",
    },
    nextLabel: {
      ...typography.body,
      fontSize: 20,
      color: colors.textSecondary,
      textAlign: "center",
      marginTop: spacing.sm,
    },
    skipButton: {
      minHeight: 48,
      minWidth: 160,
      paddingHorizontal: spacing.xl,
      borderRadius: radius.pill,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.35)",
      backgroundColor: "rgba(15, 23, 42, 0.45)",
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      bottom: spacing.xxxl + 24,
    },
    skipText: {
      ...typography.subtitle,
      fontSize: 16,
      color: colors.textPrimary,
    },
    pressed: {
      opacity: 0.88,
    },
  });
}
