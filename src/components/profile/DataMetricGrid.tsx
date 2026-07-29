import { StyleSheet, Text, View } from "react-native";
import { DataMetric } from "@/data/userMock";
import { DigitText } from "@/components/DigitText";
import { colors, numericType, spacing, typography } from "@/theme";

type DataMetricGridProps = {
  metrics: DataMetric[];
};

export function DataMetricGrid({ metrics }: DataMetricGridProps) {
  return (
    <View style={styles.grid}>
      {metrics.map((metric) => (
        <View key={metric.label} style={styles.item}>
          <Text style={styles.label}>{metric.label}</Text>
          <Text style={styles.value}>
            <DigitText>{metric.value}</DigitText>
            {metric.unit ? <Text style={styles.unit}> {metric.unit}</Text> : null}
          </Text>
          {metric.delta ? <DigitText style={styles.delta}>{metric.delta}</DigitText> : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
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
  delta: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
});
