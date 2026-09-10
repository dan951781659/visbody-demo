import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { IntensityZone } from "@/types/training";
import { ColorPalette, radius, spacing, typography } from "@/theme";
import { getIntensityColorBands, getIntensityRangeLabel } from "@/utils/trainingReport";
import type { IntensityDistribution } from "@/types/training";

const ZONE_COLORS: Record<IntensityZone["className"], string> = {
  z1: "#3B82F6",
  z2: "#22D3EE",
  z3: "#FBBF24",
  z4: "#F97316",
  z5: "#EF4444",
};

type ReportIntensitySectionProps = {
  intensity: IntensityDistribution;
};

export function ReportIntensitySection({ intensity }: ReportIntensitySectionProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const bands = useMemo(() => getIntensityColorBands(intensity), [intensity]);
  const hasZones = bands.length > 0;
  const dominant = intensity.zones.find((zone) => zone.dominant) ?? intensity.zones[0];

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>强度分布</Text>
        <Text style={styles.summary}>{getIntensityRangeLabel(intensity)}</Text>
      </View>

      {dominant ? (
        <Text style={styles.dominant}>
          主要阻力 {dominant.label} · 占比 {Math.round(dominant.ratio * 100)}%
        </Text>
      ) : null}

      <View style={styles.bar} accessibilityRole="image" accessibilityLabel="阻力强度分布">
        {hasZones ? (
          bands.map((band) => (
            <View
              key={band.className}
              style={[
                styles.segment,
                {
                  flexGrow: Math.max(band.ratio * 100, 1),
                  flexBasis: 0,
                  backgroundColor: ZONE_COLORS[band.className],
                },
              ]}
            />
          ))
        ) : (
          <Text style={styles.empty}>本次训练暂无阻力数据</Text>
        )}
      </View>

      {hasZones ? (
        <View style={styles.legend}>
          {bands.map((band) => (
            <View key={`legend-${band.className}`} style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: ZONE_COLORS[band.className] }]} />
              <Text style={styles.legendText}>
                {band.label} {Math.round(band.ratio * 100)}%
              </Text>
            </View>
          ))}
        </View>
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
    header: {
      flexDirection: "row",
      alignItems: "baseline",
      justifyContent: "space-between",
      gap: spacing.md,
    },
    title: {
      ...typography.subtitle,
      color: colors.textPrimary,
    },
    summary: {
      ...typography.caption,
      fontSize: 13,
      color: colors.textMuted,
      flexShrink: 1,
      textAlign: "right",
    },
    dominant: {
      ...typography.caption,
      color: colors.textSecondary,
    },
    bar: {
      height: 12,
      borderRadius: radius.pill,
      overflow: "hidden",
      flexDirection: "row",
      backgroundColor: colors.surfaceElevated,
    },
    segment: {
      height: "100%",
      minWidth: 0,
    },
    empty: {
      ...typography.caption,
      color: colors.textMuted,
      textAlign: "center",
      width: "100%",
      paddingVertical: spacing.sm,
    },
    legend: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.sm,
      justifyContent: "space-between",
    },
    legendItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: radius.pill,
    },
    legendText: {
      ...typography.caption,
      fontSize: 12,
      color: colors.textSecondary,
    },
  });
}
