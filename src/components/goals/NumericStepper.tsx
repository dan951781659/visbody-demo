import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DigitText } from "@/components/DigitText";
import { colors, numericType, radius, spacing, typography } from "@/theme";

type NumericStepperProps = {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  step: number;
  hint?: string;
  onChange: (next: number) => void;
  decreaseAccessibilityLabel?: string;
  increaseAccessibilityLabel?: string;
};

export function NumericStepper({
  label,
  value,
  unit,
  min,
  max,
  step,
  hint,
  onChange,
  decreaseAccessibilityLabel,
  increaseAccessibilityLabel,
}: NumericStepperProps) {
  const atMin = value <= min;
  const atMax = value >= max;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      </View>

      <View style={styles.row}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={decreaseAccessibilityLabel ?? `减少${label}`}
          disabled={atMin}
          onPress={() => onChange(Math.max(min, value - step))}
          style={({ pressed }) => [
            styles.button,
            atMin && styles.buttonDisabled,
            pressed && !atMin && styles.pressed,
          ]}
        >
          <Ionicons name="remove" size={22} color={colors.textPrimary} />
        </Pressable>

        <View style={styles.valueWrap}>
          <DigitText style={styles.value}>{value}</DigitText>
          <Text style={styles.unit}>{unit}</Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={increaseAccessibilityLabel ?? `增加${label}`}
          disabled={atMax}
          onPress={() => onChange(Math.min(max, value + step))}
          style={({ pressed }) => [
            styles.button,
            atMax && styles.buttonDisabled,
            pressed && !atMax && styles.pressed,
          ]}
        >
          <Ionicons name="add" size={22} color={colors.textPrimary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  header: {
    gap: 2,
  },
  label: {
    ...typography.subtitle,
    color: colors.textPrimary,
  },
  hint: {
    ...typography.caption,
    color: colors.textMuted,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  button: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  valueWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56,
  },
  value: {
    fontSize: 36,
    ...numericType,
    color: colors.textPrimary,
  },
  unit: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  pressed: {
    opacity: 0.88,
  },
});
