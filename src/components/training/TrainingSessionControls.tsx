import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { DigitText } from "@/components/DigitText";
import { GlassSurface } from "@/components/GlassSurface";
import { TrainingAdjustmentControls } from "@/components/training/TrainingAdjustmentControls";
import {
  formatDuration,
  getTotalResistance,
  TRAINING_TYPE_LABELS,
} from "@/data/trainingMock";
import { useTheme } from "@/context/ThemeContext";
import { useTraining } from "@/context/TrainingContext";
import { ColorPalette, layout, numericType, radius, spacing, typography } from "@/theme";
import { Ionicons } from "@expo/vector-icons";

type TrainingSessionControlsProps = {
  onEndPress: () => void;
};

export function TrainingSessionControls({ onEndPress }: TrainingSessionControlsProps) {
  const {
    activeSession,
    preset,
    updatePreset,
    pauseSession,
    resumeSession,
  } = useTraining();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  if (!activeSession || !preset) return null;

  const isRunning = activeSession.status === "running";
  const isPaused = activeSession.status === "paused";

  return (
    <View style={styles.container}>
      <GlassSurface contentStyle={styles.metricsCard}>
        <View style={styles.metricsRow}>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>时长</Text>
            <DigitText style={styles.metricValue}>{formatDuration(activeSession.elapsedSeconds)}</DigitText>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>总阻力</Text>
            <DigitText style={styles.metricValue}>{`${getTotalResistance(preset)} kg`}</DigitText>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>模式</Text>
            <Text style={styles.metricValueSmall}>
              {TRAINING_TYPE_LABELS[preset.trainingType]}
            </Text>
          </View>
        </View>
      </GlassSurface>

      <GlassSurface contentStyle={styles.controlCard}>
        <TrainingAdjustmentControls preset={preset} onChange={updatePreset} />
      </GlassSurface>

      <View style={styles.actionRow}>
        <Pressable
          accessibilityRole="button"
          onPress={isRunning ? pauseSession : resumeSession}
          style={({ pressed }) => [styles.actionButton, styles.pauseButton, pressed && styles.pressed]}
        >
          <Ionicons name={isRunning ? "pause" : "play"} size={20} color={colors.textPrimary} />
          <Text style={styles.actionText}>{isRunning ? "暂停" : "继续"}</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={onEndPress}
          style={({ pressed }) => [styles.actionButton, styles.endButton, pressed && styles.pressed]}
        >
          <Ionicons name="stop" size={20} color={colors.textPrimary} />
          <Text style={styles.actionText}>结束训练</Text>
        </Pressable>
      </View>

      {isPaused ? (
        <Text style={styles.pausedHint}>训练已暂停，点击继续恢复计时</Text>
      ) : null}
    </View>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    container: {
      gap: spacing.lg,
      paddingBottom: layout.bottomNavHeight,
    },
    metricsCard: {
      padding: spacing.lg,
    },
    metricsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: spacing.md,
    },
    metric: {
      flex: 1,
      gap: spacing.xs,
    },
    metricLabel: {
      ...typography.caption,
      color: colors.textMuted,
    },
    metricValue: {
      ...typography.subtitle,
      ...numericType,
      color: colors.accent,
    },
    metricValueSmall: {
      ...typography.caption,
      color: colors.textPrimary,
      fontWeight: "600",
    },
    controlCard: {
      padding: spacing.lg,
      gap: spacing.md,
    },
    actionRow: {
      flexDirection: "row",
      gap: spacing.md,
    },
    actionButton: {
      flex: 1,
      minHeight: 52,
      borderRadius: radius.pill,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.sm,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    pauseButton: {
      backgroundColor: colors.surfaceElevated,
    },
    endButton: {
      backgroundColor: colors.red,
    },
    actionText: {
      ...typography.subtitle,
      color: colors.textPrimary,
    },
    pausedHint: {
      ...typography.caption,
      color: colors.orange,
      textAlign: "center",
    },
    pressed: {
      opacity: 0.88,
    },
  });
}
