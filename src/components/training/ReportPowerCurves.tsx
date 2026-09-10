import { useMemo } from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import Svg, { Line, Polygon, Polyline, Rect } from "react-native-svg";
import { useTheme } from "@/context/ThemeContext";
import { ColorPalette, radius, spacing, typography } from "@/theme";
import {
  AMPLITUDE_DISPLAY_CM,
  buildAmplitudeSeries,
  buildPowerSeries,
  summarizeCurve,
} from "@/utils/trainingReport";

const CURVE_HEIGHT = 148;
const BAR_HEIGHT = 148;

type ReportPowerCurvesProps = {
  timeline: number[];
};

function buildCurvePoints(series: number[], width: number, height: number): string {
  const points = Array.isArray(series) ? series : [];
  const padX = 8;
  const padY = 14;
  if (!points.length) return "";
  const maxValue = Math.max(1, ...points);
  const minValue = Math.min(...points);
  const range = Math.max(1, maxValue - minValue);
  return points
    .map((value, idx) => {
      const x = padX + (idx / Math.max(1, points.length - 1)) * (width - padX * 2);
      const normalized = (value - minValue) / range;
      const y = height - padY - normalized * (height - padY * 2);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

function PowerBarChart({
  series,
  width,
  colors,
}: {
  series: number[];
  width: number;
  colors: ColorPalette;
}) {
  const styles = useMemo(() => createStyles(colors), [colors]);
  const chartWidth = Math.max(280, width);
  const summary = summarizeCurve(series, "W");
  const padX = 10;
  const padY = 12;
  const plotW = chartWidth - padX * 2;
  const plotH = BAR_HEIGHT - padY * 2;
  const maxValue = Math.max(1, ...series);
  const count = Math.max(1, series.length);
  const gap = plotW / count;
  const barWidth = Math.max(2, Math.min(10, gap * 0.62));

  return (
    <View style={styles.chart}>
      <View style={styles.chartHead}>
        <Text style={styles.chartName}>功率</Text>
        <Text style={styles.chartFoot}>{summary.foot}</Text>
      </View>
      <View style={[styles.chartCanvas, { width: chartWidth }]}>
        {series.length ? (
          <Svg width={chartWidth} height={BAR_HEIGHT} accessibilityLabel="功率柱状图">
            {[0.25, 0.5, 0.75].map((ratio) => (
              <Line
                key={ratio}
                x1={padX}
                x2={chartWidth - padX}
                y1={padY + plotH * ratio}
                y2={padY + plotH * ratio}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={1}
              />
            ))}
            {series.map((value, index) => {
              const h = Math.max(1, (value / maxValue) * plotH);
              const x = padX + gap * index + gap / 2 - barWidth / 2;
              const y = padY + plotH - h;
              return (
                <Rect
                  key={`power-bar-${index}`}
                  x={x}
                  y={y}
                  width={barWidth}
                  height={h}
                  rx={2}
                  fill={colors.orange}
                  opacity={0.92}
                />
              );
            })}
          </Svg>
        ) : (
          <View style={styles.emptyCurve}>
            <Text style={styles.emptyCurveText}>暂无功率数据</Text>
          </View>
        )}
      </View>
    </View>
  );
}

function AmplitudeCurveChart({
  series,
  width,
  colors,
}: {
  series: number[];
  width: number;
  colors: ColorPalette;
}) {
  const styles = useMemo(() => createStyles(colors), [colors]);
  const chartWidth = Math.max(280, width);
  const linePoints = buildCurvePoints(series, chartWidth, CURVE_HEIGHT);
  const summary = summarizeCurve(series, "cm", AMPLITUDE_DISPLAY_CM);
  const areaPoints = linePoints
    ? `8,${CURVE_HEIGHT} ${linePoints} ${(chartWidth - 8).toFixed(2)},${CURVE_HEIGHT}`
    : "";

  return (
    <View style={styles.chart}>
      <View style={styles.chartHead}>
        <Text style={styles.chartName}>动作幅度</Text>
        <Text style={styles.chartFoot}>{summary.foot}</Text>
      </View>
      <View style={[styles.chartCanvas, { width: chartWidth }]}>
        {linePoints ? (
          <Svg width={chartWidth} height={CURVE_HEIGHT}>
            {[0.25, 0.5, 0.75].map((ratio) => (
              <Line
                key={ratio}
                x1={8}
                x2={chartWidth - 8}
                y1={CURVE_HEIGHT * ratio}
                y2={CURVE_HEIGHT * ratio}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={1}
              />
            ))}
            <Polygon points={areaPoints} fill="rgba(34,211,238,0.14)" stroke="none" />
            <Polyline
              points={linePoints}
              fill="none"
              stroke={colors.cyan}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        ) : (
          <View style={styles.emptyCurve}>
            <Text style={styles.emptyCurveText}>暂无曲线数据</Text>
          </View>
        )}
      </View>
    </View>
  );
}

export function ReportPowerCurves({ timeline }: ReportPowerCurvesProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { width: windowWidth } = useWindowDimensions();
  const chartWidth = Math.max(280, windowWidth - 40);
  const sessionPower = useMemo(() => buildPowerSeries(timeline), [timeline]);
  const amplitudePoints = useMemo(() => buildAmplitudeSeries(sessionPower), [sessionPower]);

  if (!sessionPower.length) {
    return null;
  }

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>训练趋势</Text>
        <Text style={styles.note}>整场训练</Text>
      </View>

      <PowerBarChart series={sessionPower} width={chartWidth} colors={colors} />
      <AmplitudeCurveChart series={amplitudePoints} width={chartWidth} colors={colors} />
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
    header: {
      flexDirection: "row",
      alignItems: "baseline",
      justifyContent: "space-between",
      gap: spacing.sm,
    },
    title: {
      ...typography.subtitle,
      color: colors.textPrimary,
    },
    note: {
      ...typography.caption,
      fontSize: 13,
      color: colors.textMuted,
    },
    chart: {
      gap: spacing.sm,
    },
    chartHead: {
      flexDirection: "row",
      alignItems: "baseline",
      justifyContent: "space-between",
      gap: spacing.sm,
    },
    chartName: {
      ...typography.label,
      color: colors.textPrimary,
    },
    chartFoot: {
      ...typography.caption,
      fontSize: 12,
      color: colors.textMuted,
    },
    chartCanvas: {
      borderRadius: radius.md,
      overflow: "hidden",
      backgroundColor: colors.surface,
    },
    emptyCurve: {
      height: CURVE_HEIGHT,
      alignItems: "center",
      justifyContent: "center",
    },
    emptyCurveText: {
      ...typography.caption,
      color: colors.textMuted,
    },
  });
}
