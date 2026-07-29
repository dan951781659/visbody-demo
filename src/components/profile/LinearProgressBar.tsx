import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { DigitText } from "@/components/DigitText";
import { useTheme } from "@/context/ThemeContext";
import { ColorPalette, numericType, radius, spacing, typography } from "@/theme";

type LinearProgressBarProps = {
  progress: number;
  label?: string;
  showPercent?: boolean;
};

export function LinearProgressBar({ progress, label, showPercent = true }: LinearProgressBarProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const clamped = Math.max(0, Math.min(1, progress));

  return (
    <View style={styles.container}>
      {(label || showPercent) && (
        <View style={styles.header}>
          {label ? <Text style={styles.label}>{label}</Text> : <View />}
          {showPercent ? (
            <DigitText style={styles.percent}>{`${Math.round(clamped * 100)}%`}</DigitText>
          ) : null}
        </View>
      )}
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${clamped * 100}%` }]} />
      </View>
    </View>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    container: {
      gap: spacing.sm,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    label: {
      ...typography.caption,
      color: colors.textSecondary,
    },
    percent: {
      ...typography.label,
      ...numericType,
      color: colors.accent,
    },
    track: {
      height: 8,
      borderRadius: radius.pill,
      backgroundColor: colors.surfaceMuted,
      overflow: "hidden",
    },
    fill: {
      height: "100%",
      borderRadius: radius.pill,
      backgroundColor: colors.accent,
    },
  });
}
