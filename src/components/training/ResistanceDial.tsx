import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { DigitText } from "@/components/DigitText";
import { useTheme } from "@/context/ThemeContext";
import { formatResistance } from "@/data/trainingMock";
import { ColorPalette, numericType, spacing, typography } from "@/theme";

type ResistanceDialProps = {
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onIncrease: () => void;
  onDecrease: () => void;
  disabled?: boolean;
};

const SIZE = 168;
const STROKE = 10;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ResistanceDial({
  value,
  min,
  max,
  step,
  unit = "kg",
  onIncrease,
  onDecrease,
  disabled = false,
}: ResistanceDialProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const progress = max > min ? (value - min) / (max - min) : 0;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  return (
    <View style={styles.wrapper}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="减少阻力"
        disabled={disabled || value <= min}
        onPress={onDecrease}
        style={({ pressed }) => [
          styles.controlButton,
          (disabled || value <= min) && styles.controlDisabled,
          pressed && !disabled && styles.pressed,
        ]}
      >
        <Ionicons name="remove" size={22} color={colors.textPrimary} />
      </Pressable>

      <View style={styles.dialWrap}>
        <Svg width={SIZE} height={SIZE}>
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke={colors.surfaceMuted}
            strokeWidth={STROKE}
            fill="none"
          />
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke={colors.accent}
            strokeWidth={STROKE}
            fill="none"
            strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            rotation={-90}
            origin={`${SIZE / 2}, ${SIZE / 2}`}
          />
        </Svg>
        <View style={styles.center}>
          <DigitText style={styles.value}>{formatResistance(value, step)}</DigitText>
          <Text style={styles.unit}>{unit}</Text>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="增加阻力"
        disabled={disabled || value >= max}
        onPress={onIncrease}
        style={({ pressed }) => [
          styles.controlButton,
          (disabled || value >= max) && styles.controlDisabled,
          pressed && !disabled && styles.pressed,
        ]}
      >
        <Ionicons name="add" size={22} color={colors.textPrimary} />
      </Pressable>
    </View>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.lg,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  controlDisabled: {
    opacity: 0.4,
  },
  dialWrap: {
    width: SIZE,
    height: SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    position: "absolute",
    alignItems: "center",
  },
  value: {
    fontSize: 36,
    ...numericType,
    color: colors.textPrimary,
  },
  unit: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  pressed: {
    opacity: 0.85,
  },
  });
}
