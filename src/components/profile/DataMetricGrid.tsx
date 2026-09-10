import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DigitText } from "@/components/DigitText";
import { DataMetric } from "@/data/userMock";
import { useTheme } from "@/context/ThemeContext";
import { ColorPalette, numericType, spacing, typography } from "@/theme";

type DataMetricGridProps = {
  metrics: DataMetric[];
};

const FLAT_YELLOW = "#EAB308";

export function DataMetricGrid({ metrics }: DataMetricGridProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.grid}>
      {metrics.map((metric) => (
        <View key={metric.label} style={styles.item}>
          <Text style={styles.label}>{metric.label}</Text>
          <Text style={styles.value}>
            <DigitText>{metric.value}</DigitText>
            {metric.unit ? <Text style={styles.unit}> {metric.unit}</Text> : null}
          </Text>
          <TrendHint metric={metric} colors={colors} styles={styles} />
        </View>
      ))}
    </View>
  );
}

function TrendHint({
  metric,
  colors,
  styles,
}: {
  metric: DataMetric;
  colors: ColorPalette;
  styles: ReturnType<typeof createStyles>;
}) {
  if (metric.trend && metric.trend !== "empty") {
    const isUp = metric.trend === "up" || metric.trend === "new";
    const isDown = metric.trend === "down";
    const isFlat = metric.trend === "flat";
    const tint = isUp ? colors.green : isDown ? colors.red : FLAT_YELLOW;
    const iconName = isUp ? "arrow-up" : isDown ? "arrow-down" : "remove";
    const copy =
      isFlat || metric.changeLabel === "持平"
        ? "持平"
        : metric.changeLabel ??
          (metric.changeValue != null ? String(Math.abs(metric.changeValue)) : "-");

    return (
      <View style={styles.trendRow}>
        <Ionicons name={iconName} size={12} color={tint} />
        <Text style={[styles.trendText, { color: tint }]}>{copy}</Text>
      </View>
    );
  }

  if (metric.delta) {
    return <Text style={styles.legacyDelta}>{metric.delta}</Text>;
  }

  return null;
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.md,
    },
    item: {
      width: "47%",
    },
    label: {
      ...typography.label,
      color: colors.textMuted,
      marginBottom: spacing.xs,
    },
    value: {
      fontSize: 24,
      ...numericType,
      color: colors.textPrimary,
    },
    unit: {
      fontSize: 15,
      fontWeight: "500",
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
    legacyDelta: {
      ...typography.caption,
      color: colors.textMuted,
      marginTop: 2,
    },
  });
}
