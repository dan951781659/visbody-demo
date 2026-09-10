import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { DigitText } from "@/components/DigitText";
import { useTheme } from "@/context/ThemeContext";
import { formatDuration } from "@/data/trainingMock";
import { AccuracyDistribution, ReportPlanMove, TrainingReport } from "@/types/training";
import { ColorPalette, numericType, radius, spacing, typography } from "@/theme";
import { normalizeAccuracyDistribution } from "@/utils/trainingReport";

type ReportActionAnalysisProps = {
  report: TrainingReport;
};

export function ReportActionAnalysis({ report }: ReportActionAnalysisProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const hasScore = Number.isFinite(Number(report.finalAiScore));
  const accuracy = normalizeAccuracyDistribution(report.accuracyDistribution);

  if (!hasScore && !accuracy) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.title}>AI评估与训练效果</Text>

      {hasScore ? (
        <View style={styles.scoreRow}>
          <View style={styles.scoreItem}>
            <DigitText style={styles.scoreValue}>{Math.round(Number(report.finalAiScore))}</DigitText>
            <Text style={styles.scoreLabel}>综合得分</Text>
          </View>
          <View style={styles.scoreItem}>
            <DigitText style={styles.scoreValue}>{report.consistency}%</DigitText>
            <Text style={styles.scoreLabel}>稳定性</Text>
          </View>
        </View>
      ) : null}

      {accuracy ? (
        <View style={styles.performanceRow}>
          <PerformanceItem styles={styles} label="完美" value={accuracy.perfect} />
          <PerformanceItem styles={styles} label="优秀" value={accuracy.good} />
          <PerformanceItem styles={styles} label="良好" value={accuracy.better} />
        </View>
      ) : null}

      {accuracy ? <AccuracyBar accuracy={accuracy} styles={styles} /> : null}
    </View>
  );
}

function PerformanceItem({
  label,
  value,
  styles,
}: {
  label: string;
  value: number;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <View style={styles.performanceItem}>
      <DigitText style={styles.performanceValue}>{value}</DigitText>
      <Text style={styles.performanceLabel}>{label}</Text>
    </View>
  );
}

function AccuracyBar({
  accuracy,
  styles,
}: {
  accuracy: AccuracyDistribution;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <View style={styles.accuracy}>
      <View style={styles.accuracyTrack}>
        <View style={[styles.segBetter, { flexGrow: Math.max(accuracy.better, 1), flexBasis: 0 }]} />
        <View style={[styles.segGood, { flexGrow: Math.max(accuracy.good, 1), flexBasis: 0 }]} />
        <View style={[styles.segPerfect, { flexGrow: Math.max(accuracy.perfect, 1), flexBasis: 0 }]} />
      </View>
      <View style={styles.accuracyLegend}>
        <Text style={styles.accuracyLegendText}>良好 {accuracy.better}%</Text>
        <Text style={styles.accuracyLegendText}>优秀 {accuracy.good}%</Text>
        <Text style={styles.accuracyLegendText}>完美 {accuracy.perfect}%</Text>
      </View>
    </View>
  );
}

type ReportActionCompletionProps = {
  moves?: ReportPlanMove[];
};

export function ReportActionCompletion({ moves }: ReportActionCompletionProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [expanded, setExpanded] = useState(false);
  const list = moves ?? [];

  if (!list.length) return null;

  const visible = expanded ? list : list.slice(0, 2);
  const hiddenCount = Math.max(0, list.length - 2);

  return (
    <View style={styles.section}>
      <Text style={styles.title}>动作完成情况</Text>

      {visible.map((move, idx) => (
        <View key={`${move.name}-${idx}`} style={styles.moveRow}>
          <View style={styles.moveTop}>
            <Text style={styles.moveName}>{move.name}</Text>
            <DigitText style={styles.moveTime}>{formatDuration(move.durationSeconds)}</DigitText>
          </View>
          <Text style={styles.moveMeta}>
            {move.actualSets}/{move.targetSets} 组 · {move.actualReps}/{move.targetReps} 次
          </Text>
          {move.aiSupported && move.aiQuality ? (
            <View style={styles.quality}>
              <View style={styles.qualityHead}>
                <Text style={styles.qualityLabel}>完美比例</Text>
                <DigitText style={styles.qualityValue}>{move.aiQuality.perfectRate}%</DigitText>
              </View>
              <View style={styles.qualityBar}>
                <View
                  style={[
                    styles.qualityFill,
                    { width: `${Math.max(0, Math.min(100, move.aiQuality.perfectRate))}%` },
                  ]}
                />
              </View>
            </View>
          ) : null}
        </View>
      ))}

      {hiddenCount > 0 ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={expanded ? "收起动作列表" : "展开全部动作"}
          onPress={() => setExpanded((value) => !value)}
          style={styles.expandButton}
        >
          <Text style={styles.expandText}>{expanded ? "收起" : `展开剩余 ${hiddenCount} 个动作`}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    section: {
      gap: spacing.md,
      paddingVertical: spacing.lg,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    title: {
      ...typography.subtitle,
      color: colors.textPrimary,
    },
    scoreRow: {
      flexDirection: "row",
      gap: spacing.xl,
    },
    scoreItem: {
      flex: 1,
      gap: spacing.xs,
    },
    scoreValue: {
      fontSize: 32,
      ...numericType,
      color: colors.textPrimary,
    },
    scoreLabel: {
      ...typography.caption,
      fontSize: 13,
      color: colors.textMuted,
    },
    performanceRow: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    performanceItem: {
      flex: 1,
      gap: 4,
    },
    performanceValue: {
      fontSize: 28,
      ...numericType,
      color: colors.textPrimary,
    },
    performanceLabel: {
      ...typography.caption,
      fontSize: 13,
      color: colors.textMuted,
    },
    accuracy: {
      gap: spacing.sm,
    },
    accuracyTrack: {
      height: 8,
      borderRadius: radius.pill,
      overflow: "hidden",
      flexDirection: "row",
      backgroundColor: colors.surfaceElevated,
    },
    segBetter: {
      backgroundColor: "#F97316",
    },
    segGood: {
      backgroundColor: "#22D3EE",
    },
    segPerfect: {
      backgroundColor: "#3B82F6",
    },
    accuracyLegend: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    accuracyLegendText: {
      ...typography.caption,
      fontSize: 12,
      color: colors.textSecondary,
    },
    moveRow: {
      gap: spacing.xs,
      paddingVertical: spacing.sm,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
    },
    moveTop: {
      flexDirection: "row",
      alignItems: "baseline",
      justifyContent: "space-between",
      gap: spacing.sm,
    },
    moveName: {
      ...typography.body,
      fontWeight: "600",
      color: colors.textPrimary,
      flexShrink: 1,
    },
    moveTime: {
      ...typography.caption,
      ...numericType,
      color: colors.textMuted,
    },
    moveMeta: {
      ...typography.caption,
      fontSize: 13,
      color: colors.textSecondary,
    },
    quality: {
      marginTop: spacing.xs,
      gap: spacing.xs,
    },
    qualityHead: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    qualityLabel: {
      ...typography.caption,
      fontSize: 12,
      color: colors.textMuted,
    },
    qualityValue: {
      ...typography.caption,
      ...numericType,
      fontSize: 13,
      color: colors.textPrimary,
    },
    qualityBar: {
      height: 6,
      borderRadius: radius.pill,
      backgroundColor: colors.surfaceElevated,
      overflow: "hidden",
    },
    qualityFill: {
      height: "100%" as const,
      borderRadius: radius.pill,
      backgroundColor: colors.cyan,
    },
    expandButton: {
      minHeight: 44,
      alignItems: "center",
      justifyContent: "center",
    },
    expandText: {
      ...typography.label,
      color: colors.accent,
    },
  });
}
