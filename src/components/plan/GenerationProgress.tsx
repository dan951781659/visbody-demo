import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { DigitText } from "@/components/DigitText";
import { GlassSurface } from "@/components/GlassSurface";
import { LinearProgressBar } from "@/components/profile/LinearProgressBar";
import { useTheme } from "@/context/ThemeContext";
import { generationSteps } from "@/data/planMock";
import { ColorPalette, numericType, spacing, typography } from "@/theme";

const RING_SIZE = 88;
const RING_STROKE = 4;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

type StepStatus = "done" | "active" | "pending";

function getStepStatus(index: number, activeIndex: number, progress: number): StepStatus {
  if (progress >= 1) return "done";
  if (index < activeIndex) return "done";
  if (index === activeIndex) return "active";
  return "pending";
}

export function GenerationProgress() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [progress, setProgress] = useState(0.08);
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1400,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [spin]);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 1) return 1;
        const next = prev + 0.015 + Math.random() * 0.02;
        return Math.min(1, next);
      });
    }, 320);
    return () => clearInterval(timer);
  }, []);

  const activeIndex = useMemo(() => {
    if (progress >= 1) return generationSteps.length - 1;
    return Math.min(
      generationSteps.length - 1,
      Math.floor(progress * generationSteps.length),
    );
  }, [progress]);

  const activeLabel = generationSteps[activeIndex]?.label ?? generationSteps[0].label;
  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <GlassSurface contentStyle={styles.card}>
      <View style={styles.hero}>
        <View style={styles.ringWrap}>
          <Svg width={RING_SIZE} height={RING_SIZE}>
            <Circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RING_RADIUS}
              stroke={colors.surfaceMuted}
              strokeWidth={RING_STROKE}
              fill="none"
            />
          </Svg>
          <Animated.View style={[styles.ringSpin, { transform: [{ rotate }] }]}>
            <Svg width={RING_SIZE} height={RING_SIZE}>
              <Circle
                cx={RING_SIZE / 2}
                cy={RING_SIZE / 2}
                r={RING_RADIUS}
                stroke={colors.accent}
                strokeWidth={RING_STROKE}
                fill="none"
                strokeDasharray={`${RING_CIRCUMFERENCE * 0.28} ${RING_CIRCUMFERENCE}`}
                strokeLinecap="round"
              />
            </Svg>
          </Animated.View>
          <View style={styles.ringCore}>
            <View style={styles.ringCoreInner} />
          </View>
        </View>

        <Text style={styles.title}>正在生成训练大纲</Text>
        <Text style={styles.subtitle}>
          我们正在整合体测数据、训练目标和营养建议，请稍候。
        </Text>
      </View>

      <LinearProgressBar progress={progress} label={activeLabel} showPercent />

      <View style={styles.stepGrid}>
        {generationSteps.map((step, index) => {
          const status = getStepStatus(index, activeIndex, progress);
          return (
            <View key={step.id} style={styles.stepItem}>
              <View
                style={[
                  styles.stepIcon,
                  status === "done" && styles.stepIconDone,
                  status === "active" && styles.stepIconActive,
                ]}
              >
                {status === "done" ? (
                  <Ionicons name="checkmark" size={12} color={colors.accentText} />
                ) : status === "active" ? (
                  <View style={styles.activeDot} />
                ) : null}
              </View>
              <Text
                style={[
                  styles.stepLabel,
                  status === "done" && styles.stepLabelDone,
                  status === "active" && styles.stepLabelActive,
                  status === "pending" && styles.stepLabelPending,
                ]}
                numberOfLines={2}
              >
                {step.label}
              </Text>
            </View>
          );
        })}
      </View>

      {progress >= 1 ? (
        <Text style={styles.doneHint}>训练大纲已生成完成，结果页即将开放</Text>
      ) : (
        <DigitText style={styles.progressHint}>{`${Math.round(progress * 100)}%`}</DigitText>
      )}
    </GlassSurface>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
  card: {
    padding: spacing.xl,
    gap: spacing.xl,
  },
  hero: {
    alignItems: "center",
    gap: spacing.md,
  },
  ringWrap: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  ringSpin: {
    ...StyleSheet.absoluteFillObject,
  },
  ringCore: {
    position: "absolute",
    width: 52,
    height: 52,
    borderRadius: 999,
    backgroundColor: colors.accentGlass,
    alignItems: "center",
    justifyContent: "center",
  },
  ringCoreInner: {
    width: 28,
    height: 28,
    borderRadius: 999,
    backgroundColor: colors.accent,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
    textAlign: "center",
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  stepGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  stepItem: {
    width: "47%",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  stepIcon: {
    width: 20,
    height: 20,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  stepIconDone: {
    backgroundColor: colors.green,
    borderColor: colors.green,
  },
  stepIconActive: {
    borderColor: colors.blue,
    backgroundColor: "rgba(59,130,246,0.18)",
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.blue,
  },
  stepLabel: {
    ...typography.caption,
    flex: 1,
  },
  stepLabelDone: {
    color: colors.textPrimary,
  },
  stepLabelActive: {
    color: colors.blue,
    fontWeight: "600",
  },
  stepLabelPending: {
    color: colors.textMuted,
  },
  progressHint: {
    ...typography.label,
    ...numericType,
    color: colors.textMuted,
    textAlign: "center",
  },
  doneHint: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: "center",
  },
  });
}
