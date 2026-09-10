import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DigitText } from "@/components/DigitText";
import { GlassSurface } from "@/components/GlassSurface";
import { PlanRestOverlay } from "@/components/training/PlanRestOverlay";
import { TrainingAdjustmentControls } from "@/components/training/TrainingAdjustmentControls";
import { useTheme } from "@/context/ThemeContext";
import { usePlan } from "@/context/PlanContext";
import { useTraining } from "@/context/TrainingContext";
import { createDefaultPreset, formatDuration } from "@/data/trainingMock";
import { TrainingPreset } from "@/types/training";
import { ColorPalette, layout, numericType, radius, spacing, typography } from "@/theme";

type PlanTrainingSessionControlsProps = {
  onEndPress: () => void;
};

export function PlanTrainingSessionControls({ onEndPress }: PlanTrainingSessionControlsProps) {
  const {
    planSession,
    beginPlanTraining,
    pausePlanSession,
    resumePlanSession,
    previousPlanMove,
    nextPlanMove,
    skipPlanRest,
  } = usePlan();
  const { selectedDevice } = useTraining();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [preset, setPreset] = useState<TrainingPreset>(() => createDefaultPreset("strength"));

  if (!planSession) return null;

  const isReady = planSession.status === "ready";
  const isRunning = planSession.status === "running";
  const isPaused = planSession.status === "paused";
  const isResting = planSession.status === "resting";
  const currentMove = planSession.moves[planSession.moveIndex];
  const nextMove = planSession.moves[planSession.moveIndex + 1];
  const restNextMove =
    planSession.rest != null ? planSession.moves[planSession.rest.nextMoveIndex] : nextMove;
  const atFirst = planSession.moveIndex <= 0;
  const atLast = planSession.moveIndex >= planSession.moves.length - 1;
  const progressLabel = `${planSession.moveIndex + 1} / ${Math.max(planSession.moves.length, 1)}`;
  const deviceLabel = selectedDevice?.name ?? "MotionStation";
  const navDisabled = isResting;

  const handlePrimary = () => {
    if (isResting) return;
    if (isReady) beginPlanTraining();
    else if (isRunning) pausePlanSession();
    else if (isPaused) resumePlanSession();
  };

  const primaryLabel = isResting
    ? "休息中"
    : isReady
      ? "开始训练"
      : isRunning
        ? "暂停"
        : "继续";
  const primaryIcon = isReady || isPaused || isResting ? "play" : "pause";

  return (
    <View style={styles.container}>
      <GlassSurface contentStyle={styles.metricsCard}>
        <View style={styles.metricsRow}>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>时长</Text>
            <DigitText style={styles.metricValue}>
              {formatDuration(planSession.elapsedSeconds)}
            </DigitText>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>模式</Text>
            <Text style={styles.metricValueSmall}>计划跟练</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>设备</Text>
            <Text style={styles.metricValueSmall}>{deviceLabel}</Text>
          </View>
        </View>
      </GlassSurface>

      <GlassSurface contentStyle={styles.controlCard}>
        <Text style={styles.sectionLabel}>当前动作</Text>
        <Text style={styles.moveName}>{currentMove?.name ?? "暂无动作"}</Text>
        <Text style={styles.moveMeta}>
          {currentMove
            ? `${currentMove.sets} 组 · ${currentMove.repsOrDuration}${
                currentMove.weightKg != null ? ` · ${currentMove.weightKg} kg` : ""
              } · 进度 ${progressLabel}`
            : "设备端正在进行计划跟练，手机端用于启停与阻力控制"}
        </Text>

        <View style={styles.divider} />

        <TrainingAdjustmentControls
          preset={preset}
          onChange={(patch) => setPreset((current) => ({ ...current, ...patch }))}
        />

        <View style={styles.navRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="上一个动作"
            accessibilityState={{ disabled: atFirst || navDisabled }}
            disabled={atFirst || navDisabled}
            onPress={previousPlanMove}
            style={({ pressed }) => [
              styles.navIconButton,
              (atFirst || navDisabled) && styles.navDisabled,
              pressed && !(atFirst || navDisabled) && styles.pressed,
            ]}
          >
            <Ionicons
              name="play-skip-back"
              size={22}
              color={atFirst || navDisabled ? colors.textMuted : colors.textPrimary}
            />
          </Pressable>

          <Text style={styles.navHint} numberOfLines={1}>
            {nextMove?.name ? `下一个：${nextMove.name}` : atLast ? "已是最后一个动作" : ""}
          </Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="下一个动作"
            accessibilityState={{ disabled: atLast || navDisabled }}
            disabled={atLast || navDisabled}
            onPress={nextPlanMove}
            style={({ pressed }) => [
              styles.navIconButton,
              (atLast || navDisabled) && styles.navDisabled,
              pressed && !(atLast || navDisabled) && styles.pressed,
            ]}
          >
            <Ionicons
              name="play-skip-forward"
              size={22}
              color={atLast || navDisabled ? colors.textMuted : colors.textPrimary}
            />
          </Pressable>
        </View>
      </GlassSurface>

      <View style={styles.actionRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={primaryLabel}
          accessibilityState={{ disabled: isResting }}
          disabled={isResting}
          onPress={handlePrimary}
          style={({ pressed }) => [
            styles.actionButton,
            styles.pauseButton,
            isResting && styles.navDisabled,
            pressed && !isResting && styles.pressed,
          ]}
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

      <PlanRestOverlay
        visible={isResting}
        rest={planSession.rest}
        nextMoveName={restNextMove?.name}
        onSkip={skipPlanRest}
      />
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
    navRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      marginTop: spacing.sm,
    },
    navIconButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.surfaceElevated,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    navHint: {
      ...typography.caption,
      color: colors.textSecondary,
      flex: 1,
      textAlign: "center",
    },
    navDisabled: {
      opacity: 0.45,
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
