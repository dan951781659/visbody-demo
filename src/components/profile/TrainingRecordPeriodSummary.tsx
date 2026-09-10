import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DigitText } from "@/components/DigitText";
import { GlassSurface } from "@/components/GlassSurface";
import { useTheme } from "@/context/ThemeContext";
import { ColorPalette, spacing, typography } from "@/theme";
import type { PeriodMetricSummary, PeriodSummary } from "@/types/trainingRecord";
import {
  formatCapacitySummary,
  formatDurationDelta,
  formatDurationSummary,
} from "@/utils/trainingRecordStats";

type TrainingRecordPeriodSummaryProps = {
  summary: PeriodSummary;
};

type MetricCell = {
  id: string;
  label: string;
  displayValue: string;
  unit?: string;
  metric: PeriodMetricSummary;
  formatDelta: (delta: number) => string;
};

const FLAT_YELLOW = "#EAB308";

export function TrainingRecordPeriodSummary({ summary }: TrainingRecordPeriodSummaryProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const cells: MetricCell[] = [
    {
      id: "sessions",
      label: "训练次数",
      displayValue: String(summary.sessions.value),
      unit: "次",
      metric: summary.sessions,
      formatDelta: (delta) => `${Math.abs(Math.round(delta))}次`,
    },
    {
      id: "duration",
      label: "累计时长",
      displayValue: formatDurationSummary(summary.durationSeconds.value),
      metric: summary.durationSeconds,
      formatDelta: (delta) => formatDurationDelta(delta),
    },
    {
      id: "capacity",
      label: "训练容量",
      displayValue: formatCapacitySummary(summary.capacityKg.value),
      unit: "kg",
      metric: summary.capacityKg,
      formatDelta: (delta) => `${formatCapacitySummary(Math.abs(delta))}kg`,
    },
    {
      id: "calories",
      label: "消耗热量",
      displayValue: String(Math.round(summary.caloriesKcal.value)),
      unit: "kcal",
      metric: summary.caloriesKcal,
      formatDelta: (delta) => `${Math.abs(Math.round(delta))}kcal`,
    },
  ];

  return (
    <GlassSurface contentStyle={styles.card}>
      <View style={styles.grid}>
        {cells.map((cell) => (
          <View key={cell.id} style={styles.cell}>
            <Text style={styles.label}>{cell.label}</Text>
            <View style={styles.valueRow}>
              <DigitText style={styles.value}>{cell.displayValue}</DigitText>
              {cell.unit ? <Text style={styles.unit}>{cell.unit}</Text> : null}
            </View>
            <TrendLine
              metric={cell.metric}
              formatDelta={cell.formatDelta}
              colors={colors}
              styles={styles}
            />
          </View>
        ))}
      </View>
      <Text style={styles.footnote}>* 数据变化结果由上一周期对比得出</Text>
    </GlassSurface>
  );
}

function TrendLine({
  metric,
  formatDelta,
  colors,
  styles,
}: {
  metric: PeriodMetricSummary;
  formatDelta: (delta: number) => string;
  colors: ColorPalette;
  styles: ReturnType<typeof createStyles>;
}) {
  if (metric.trend === "empty" || metric.changeValue == null) {
    return <Text style={[styles.trendText, { color: colors.textMuted }]}>-</Text>;
  }

  const isUp = metric.trend === "up" || metric.trend === "new";
  const isDown = metric.trend === "down";
  const isFlat = metric.trend === "flat";
  const tint = isUp ? colors.green : isDown ? colors.red : FLAT_YELLOW;
  const iconName = isUp ? "arrow-up" : isDown ? "arrow-down" : "remove";
  const copy = isFlat ? "持平" : formatDelta(metric.changeValue);

  return (
    <View style={styles.trendRow}>
      <Ionicons name={iconName} size={12} color={tint} />
      <Text style={[styles.trendText, { color: tint }]}>{copy}</Text>
    </View>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    card: {
      padding: spacing.lg,
      gap: spacing.md,
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      rowGap: spacing.lg,
    },
    cell: {
      width: "50%",
      paddingRight: spacing.md,
      gap: 4,
    },
    label: {
      ...typography.caption,
      color: colors.textMuted,
    },
    valueRow: {
      flexDirection: "row",
      alignItems: "baseline",
      gap: 4,
    },
    value: {
      ...typography.title,
      fontSize: 24,
      lineHeight: 30,
      color: colors.textPrimary,
    },
    unit: {
      ...typography.caption,
      color: colors.textSecondary,
    },
    trendRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 2,
      marginTop: 2,
    },
    trendText: {
      ...typography.caption,
      fontSize: 12,
    },
    footnote: {
      ...typography.caption,
      fontSize: 12,
      color: colors.textMuted,
      marginTop: spacing.xs,
    },
  });
}
