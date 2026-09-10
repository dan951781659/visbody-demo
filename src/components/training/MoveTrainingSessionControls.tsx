import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DigitText } from "@/components/DigitText";
import { GlassSurface } from "@/components/GlassSurface";
import { TrainingAdjustmentControls } from "@/components/training/TrainingAdjustmentControls";
import { useTheme } from "@/context/ThemeContext";
import { useTraining } from "@/context/TrainingContext";
import { formatDuration } from "@/data/trainingMock";
import { ColorPalette, layout, numericType, radius, spacing, typography } from "@/theme";

type MoveTrainingSessionControlsProps = {
  onEndPress: () => void;
};

export function MoveTrainingSessionControls({ onEndPress }: MoveTrainingSessionControlsProps) {
  const {
    moveFollowSession,
    beginMoveTraining,
    pauseMoveSession,
    resumeMoveSession,
    updateMovePreset,
    selectedDevice,
  } = useTraining();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  if (!moveFollowSession) return null;

  const isReady = moveFollowSession.status === "ready";
  const isRunning = moveFollowSession.status === "running";
  const isPaused = moveFollowSession.status === "paused";
  const deviceLabel = selectedDevice?.name ?? "MotionStation";

  const handlePrimary = () => {
    if (isReady) beginMoveTraining();
    else if (isRunning) pauseMoveSession();
    else if (isPaused) resumeMoveSession();
  };

  const primaryLabel = isReady ? "开始训练" : isRunning ? "暂停" : "继续";
  const primaryIcon = isReady || isPaused ? "play" : "pause";

  return (
    <View style={styles.container}>
      <GlassSurface contentStyle={styles.metricsCard}>
        <View style={styles.metricsRow}>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>时长</Text>
            <DigitText style={styles.metricValue}>
              {formatDuration(moveFollowSession.elapsedSeconds)}
            </DigitText>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>模式</Text>
            <Text style={styles.metricValueSmall}>动作跟练</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>设备</Text>
            <Text style={styles.metricValueSmall}>{deviceLabel}</Text>
          </View>
        </View>
      </GlassSurface>

      <GlassSurface contentStyle={styles.controlCard}>
        <Text style={styles.sectionLabel}>当前动作</Text>
        <Text style={styles.moveName}>{moveFollowSession.moveName}</Text>
        <Text style={styles.moveMeta}>设备端正在进行动作跟练，手机端用于启停与阻力控制</Text>

        <View style={styles.divider} />

        <TrainingAdjustmentControls
          preset={moveFollowSession.preset}
          onChange={updateMovePreset}
        />
      </GlassSurface>

      <View style={styles.actionRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={primaryLabel}
          onPress={handlePrimary}
          style={({ pressed }) => [styles.actionButton, styles.pauseButton, pressed && styles.pressed]}
        >
          <Ionicons name={primaryIcon} size={20} color={colors.textPrimary} />
          <Text style={styles.actionText}>{primaryLabel}</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="结束训练"
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
      {isReady ? (
        <Text style={styles.readyHint}>设备端已进入跟练，点击开始训练启动手机端控制</Text>
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
    sectionLabel: {
      ...typography.label,
      color: colors.textSecondary,
    },
    moveName: {
      ...typography.subtitle,
      color: colors.textPrimary,
    },
    moveMeta: {
      ...typography.caption,
      color: colors.textSecondary,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: spacing.xs,
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
    readyHint: {
      ...typography.caption,
      color: colors.textMuted,
      textAlign: "center",
    },
    pressed: {
      opacity: 0.88,
    },
  });
}
