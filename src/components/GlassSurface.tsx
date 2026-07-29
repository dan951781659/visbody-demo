import { BlurView } from "expo-blur";
import { ReactNode } from "react";
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { colors, glass, radius } from "@/theme";

type GlassSurfaceProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  intensity?: number;
  borderRadius?: number;
};

export function GlassSurface({
  children,
  style,
  contentStyle,
  intensity = glass.blurIntensity,
  borderRadius = radius.lg,
}: GlassSurfaceProps) {
  const shellStyle = {
    borderRadius,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    overflow: "hidden" as const,
  };

  if (Platform.OS === "web") {
    return (
      <View style={[styles.webFallback, shellStyle, style]}>
        <View style={[styles.content, contentStyle]}>{children}</View>
      </View>
    );
  }

  return (
    <View style={[shellStyle, style]}>
      <BlurView intensity={intensity} tint="dark" style={StyleSheet.absoluteFillObject} />
      <View style={styles.tint} />
      <View style={styles.highlight} />
      <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  webFallback: {
    backgroundColor: colors.glass,
  },
  tint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.glass,
  },
  highlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.glassHighlight,
  },
  content: {
    position: "relative",
  },
});
