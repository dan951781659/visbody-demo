import { useEffect, useMemo, useRef } from "react";
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { BlurView } from "expo-blur";
import Svg, { Circle, Defs, RadialGradient, Stop } from "react-native-svg";
import { DigitText } from "@/components/DigitText";
import { GlassSurface } from "@/components/GlassSurface";
import { useTheme } from "@/context/ThemeContext";
import { GoalProgressMetric, WeekDayStat } from "@/utils/dailyStats";
import { ColorPalette, glass, numericType, radius, spacing, typography } from "@/theme";

type WeekStatsCardProps = {
  weekDays: WeekDayStat[];
  metrics: GoalProgressMetric[];
  onSelectDay: (isoDate: string) => void;
};

const RING_SIZE = 112;
const BLOOM_PAD = 18;
const STAGE_SIZE = RING_SIZE + BLOOM_PAD * 2;
const RING_STROKES = [10, 8, 6] as const;
const RING_GAPS = [0, 14, 26] as const;
const TRACK_COLOR = "rgba(148, 163, 184, 0.35)";
const CENTER_SIZE = 44;

function withAlpha(hex: string, alpha: number): string {
  const normalized = hex.replace("#", "");
  const value = normalized.length === 3
    ? normalized.split("").map((char) => char + char).join("")
    : normalized;
  const r = Number.parseInt(value.slice(0, 2), 16);
  const g = Number.parseInt(value.slice(2, 4), 16);
  const b = Number.parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function ProgressRings({ metrics }: { metrics: GoalProgressMetric[] }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const center = RING_SIZE / 2;
  const bloom = useRef(new Animated.Value(0)).current;
  const breath = useRef(new Animated.Value(0)).current;
  const outerColor = metrics[0]?.color ?? "#007AFF";

  useEffect(() => {
    let bloomLoop: Animated.CompositeAnimation | null = null;
    let breathLoop: Animated.CompositeAnimation | null = null;
    let cancelled = false;

    AccessibilityInfo.isReduceMotionEnabled().then((reduceMotion) => {
      if (cancelled || reduceMotion) return;

      bloomLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(bloom, {
            toValue: 1,
            duration: 1750,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(bloom, {
            toValue: 0,
            duration: 1250,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      );
      breathLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(breath, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(breath, {
            toValue: 0,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      );
      bloomLoop.start();
      breathLoop.start();
    });

    return () => {
      cancelled = true;
      bloomLoop?.stop();
      breathLoop?.stop();
    };
  }, [bloom, breath]);

  const bloomOpacity = bloom.interpolate({
    inputRange: [0, 1],
    outputRange: [0.42, 0.85],
  });
  const bloomScale = bloom.interpolate({
    inputRange: [0, 1],
    outputRange: [0.96, 1.08],
  });
  const breathOpacity = breath.interpolate({
    inputRange: [0, 1],
    outputRange: [0.55, 0.95],
  });

  return (
    <View style={styles.ringsStage}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.bloomHalo,
          {
            backgroundColor: withAlpha(outerColor, 0.28),
            opacity: bloomOpacity,
            transform: [{ scale: bloomScale }],
            ...(Platform.OS === "web"
              ? {
                  boxShadow: `0 0 22px ${withAlpha(outerColor, 0.45)}, 0 -8px 18px ${withAlpha(outerColor, 0.35)}`,
                }
              : {
                  shadowColor: outerColor,
                  shadowOpacity: 0.55,
                  shadowRadius: 16,
                  shadowOffset: { width: 0, height: -4 },
                }),
          },
        ]}
      />

      <Animated.View style={[styles.ringsWrap, { opacity: breathOpacity }]}>
        <Svg width={RING_SIZE} height={RING_SIZE}>
          <Defs>
            <RadialGradient id="dialBloom" cx="50%" cy="28%" rx="50%" ry="50%">
              <Stop offset="0%" stopColor={outerColor} stopOpacity="0.55" />
              <Stop offset="55%" stopColor={outerColor} stopOpacity="0.18" />
              <Stop offset="100%" stopColor={outerColor} stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="dialGlass" cx="50%" cy="40%" rx="50%" ry="50%">
              <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.14" />
              <Stop offset="45%" stopColor="#0A111D" stopOpacity="0.35" />
              <Stop offset="100%" stopColor="#060B16" stopOpacity="0.72" />
            </RadialGradient>
          </Defs>

          <Circle cx={center} cy={center} r={RING_SIZE / 2 - 2} fill="url(#dialBloom)" />
          <Circle cx={center} cy={center} r={RING_SIZE / 2 - 8} fill="url(#dialGlass)" />

          {metrics.map((metric, index) => {
            const stroke = RING_STROKES[index] ?? 6;
            const inset = RING_GAPS[index] ?? 0;
            const ringRadius = (RING_SIZE - stroke) / 2 - inset;
            return (
              <Circle
                key={`${metric.key}-track`}
                cx={center}
                cy={center}
                r={ringRadius}
                stroke={TRACK_COLOR}
                strokeWidth={stroke}
                fill="none"
              />
            );
          })}

          {metrics.map((metric, index) => {
            const stroke = RING_STROKES[index] ?? 6;
            const inset = RING_GAPS[index] ?? 0;
            const ringRadius = (RING_SIZE - stroke) / 2 - inset;
            const circumference = 2 * Math.PI * ringRadius;
            const dashOffset = circumference * (1 - metric.progress);
            return (
              <Circle
                key={`${metric.key}-glow`}
                cx={center}
                cy={center}
                r={ringRadius}
                stroke={withAlpha(metric.color, 0.35)}
                strokeWidth={stroke + 5}
                fill="none"
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                rotation={-90}
                origin={`${center}, ${center}`}
              />
            );
          })}

          {metrics.map((metric, index) => {
            const stroke = RING_STROKES[index] ?? 6;
            const inset = RING_GAPS[index] ?? 0;
            const ringRadius = (RING_SIZE - stroke) / 2 - inset;
            const circumference = 2 * Math.PI * ringRadius;
            const dashOffset = circumference * (1 - metric.progress);
            return (
              <Circle
                key={`${metric.key}-progress`}
                cx={center}
                cy={center}
                r={ringRadius}
                stroke={withAlpha(metric.color, 0.88)}
                strokeWidth={stroke}
                fill="none"
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                rotation={-90}
                origin={`${center}, ${center}`}
              />
            );
          })}
        </Svg>

        <View style={styles.ringsCenter} pointerEvents="none">
          {Platform.OS === "web" ? (
            <View style={styles.glassCenterWeb}>
              <Text style={styles.ringsCenterLabel}>完成度</Text>
            </View>
          ) : (
            <View style={styles.glassCenter}>
              <BlurView intensity={glass.blurIntensity - 12} tint="dark" style={StyleSheet.absoluteFillObject} />
              <View style={styles.glassCenterTint} />
              <View style={styles.glassCenterHighlight} />
              <Text style={styles.ringsCenterLabel}>完成度</Text>
            </View>
          )}
        </View>
      </Animated.View>
    </View>
  );
}

export function WeekStatsCard({ weekDays, metrics, onSelectDay }: WeekStatsCardProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <GlassSurface contentStyle={styles.card}>
      <View style={styles.weekStrip}>
        {weekDays.map((day) => (
          <Pressable
            key={day.isoDate}
            accessibilityRole="button"
            accessibilityLabel={`${day.label} ${day.date}日`}
            accessibilityState={{ selected: Boolean(day.active) }}
            onPress={() => onSelectDay(day.isoDate)}
            style={({ pressed }) => [
              styles.dayChip,
              day.active && styles.dayChipActive,
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.dayLabel, day.active && styles.dayLabelActive]}>{day.label}</Text>
            <DigitText style={[styles.dayDate, day.active && styles.dayDateActive]}>
              {day.date}
            </DigitText>
          </Pressable>
        ))}
      </View>

      <View style={styles.body}>
        <ProgressRings metrics={metrics} />

        <View style={styles.metrics}>
          {metrics.map((metric) => (
            <View key={metric.key} style={styles.metric}>
              <Text style={styles.metricLabel}>{metric.label}</Text>
              <Text style={styles.metricValueRow}>
                <DigitText style={[styles.metricValue, { color: metric.color }]}>
                  {metric.value}
                </DigitText>
                <Text style={styles.metricUnit}>{metric.unit}</Text>
              </Text>
              <Text style={styles.metricHint}>{metric.hint}</Text>
            </View>
          ))}
        </View>
      </View>
    </GlassSurface>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
  card: {
    padding: spacing.lg,
  },
  weekStrip: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  dayChip: {
    alignItems: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: radius.md,
    minWidth: 40,
  },
  dayChipActive: {
    backgroundColor: colors.glassHighlight,
  },
  dayLabel: {
    ...typography.label,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  dayLabelActive: {
    color: colors.accent,
  },
  dayDate: {
    ...typography.subtitle,
    ...numericType,
    color: colors.textSecondary,
  },
  dayDateActive: {
    color: colors.textPrimary,
  },
  body: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  ringsStage: {
    width: STAGE_SIZE,
    height: STAGE_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  bloomHalo: {
    position: "absolute",
    width: RING_SIZE + 10,
    height: RING_SIZE + 10,
    borderRadius: (RING_SIZE + 10) / 2,
  },
  ringsWrap: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  ringsCenter: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  glassCenter: {
    width: CENTER_SIZE,
    height: CENTER_SIZE,
    borderRadius: CENTER_SIZE / 2,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.28)",
    alignItems: "center",
    justifyContent: "center",
  },
  glassCenterTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(6, 11, 22, 0.72)",
  },
  glassCenterHighlight: {
    position: "absolute",
    top: 0,
    left: 8,
    right: 8,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.18)",
  },
  glassCenterWeb: {
    width: CENTER_SIZE,
    height: CENTER_SIZE,
    borderRadius: CENTER_SIZE / 2,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.28)",
    backgroundColor: "rgba(6, 11, 22, 0.78)",
    // @ts-expect-error web-only backdrop filter
    backdropFilter: "blur(6px)",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), 0 0 12px rgba(0,122,255,0.18)",
  },
  ringsCenterLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.3,
    color: colors.textPrimary,
    zIndex: 1,
  },
  metrics: {
    flex: 1,
    gap: spacing.md,
  },
  metric: {},
  metricLabel: {
    ...typography.label,
    color: colors.textMuted,
    marginBottom: 2,
  },
  metricValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  metricValue: {
    fontSize: 24,
    ...numericType,
  },
  metricUnit: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.textSecondary,
    marginLeft: 4,
  },
  metricHint: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  pressed: {
    opacity: 0.88,
  },
  });
}
