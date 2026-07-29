import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { ColorPalette, spacing } from "@/theme";

type StepDotsProps = {
  total: number;
  current: number;
};

export function StepDots({ total, current }: StepDotsProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.row} accessibilityRole="progressbar">
      {Array.from({ length: total }, (_, index) => {
        const active = index === current;
        const completed = index < current;
        return (
          <View
            key={`dot-${index}`}
            style={[
              styles.dot,
              (active || completed) && styles.dotActive,
              active && styles.dotCurrent,
            ]}
          />
        );
      })}
    </View>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.sm,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 999,
      backgroundColor: colors.surfaceMuted,
    },
    dotActive: {
      backgroundColor: colors.accent,
    },
    dotCurrent: {
      width: 10,
      height: 10,
    },
  });
}
