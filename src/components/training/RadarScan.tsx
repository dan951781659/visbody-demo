import { useEffect, useMemo, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import Svg, { Circle, Defs, Line, Path, Stop, LinearGradient as SvgLinearGradient } from "react-native-svg";
import { useTheme } from "@/context/ThemeContext";
import { ColorPalette } from "@/theme";

const SIZE = 220;
const CENTER = SIZE / 2;
const OUTER = 92;
const RINGS = [36, 64, OUTER];

type RadarScanProps = {
  size?: number;
};

export function RadarScan({ size = SIZE }: RadarScanProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const rotate = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spin = Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration: 2400,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    const breathe = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    spin.start();
    breathe.start();
    return () => {
      spin.stop();
      breathe.stop();
    };
  }, [pulse, rotate]);

  const spinDeg = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  const pulseScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.4],
  });
  const pulseOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.85, 0.2],
  });

  const sweepPath = `
    M ${CENTER} ${CENTER}
    L ${CENTER} ${CENTER - OUTER}
    A ${OUTER} ${OUTER} 0 0 1 ${CENTER + OUTER * 0.75} ${CENTER - OUTER * 0.66}
    Z
  `;

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox={`0 0 ${SIZE} ${SIZE}`} style={StyleSheet.absoluteFill}>
        {RINGS.map((r) => (
          <Circle
            key={r}
            cx={CENTER}
            cy={CENTER}
            r={r}
            stroke={colors.glassBorder}
            strokeWidth={1}
            fill="none"
          />
        ))}
        <Line
          x1={CENTER}
          y1={CENTER - OUTER}
          x2={CENTER}
          y2={CENTER + OUTER}
          stroke={colors.border}
          strokeWidth={1}
        />
        <Line
          x1={CENTER - OUTER}
          y1={CENTER}
          x2={CENTER + OUTER}
          y2={CENTER}
          stroke={colors.border}
          strokeWidth={1}
        />
      </Svg>

      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { transform: [{ rotate: spinDeg }] },
        ]}
      >
        <Svg width={size} height={size} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          <Defs>
            <SvgLinearGradient id="sweepGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor={colors.accent} stopOpacity="0" />
              <Stop offset="100%" stopColor={colors.accent} stopOpacity="0.5" />
            </SvgLinearGradient>
          </Defs>
          <Path d={sweepPath} fill="url(#sweepGrad)" />
          <Line
            x1={CENTER}
            y1={CENTER}
            x2={CENTER}
            y2={CENTER - OUTER}
            stroke={colors.accent}
            strokeWidth={2}
            strokeLinecap="round"
          />
        </Svg>
      </Animated.View>

      <Animated.View
        pointerEvents="none"
        style={[
          styles.pulseRing,
          {
            opacity: pulseOpacity,
            transform: [{ scale: pulseScale }],
          },
        ]}
      />
      <View style={styles.centerDot} />
    </View>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    wrap: {
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "center",
    },
    pulseRing: {
      position: "absolute",
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: colors.accentGlass,
      borderWidth: 1,
      borderColor: colors.accent,
    },
    centerDot: {
      position: "absolute",
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.accent,
    },
  });
}
