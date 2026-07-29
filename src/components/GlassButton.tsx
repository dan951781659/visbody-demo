import { BlurView } from "expo-blur";
import { ReactNode, useMemo } from "react";
import { Platform, Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { ColorPalette, glass, radius } from "@/theme";

type GlassButtonProps = {
  children: ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  variant?: "primary" | "surface";
};

export function GlassButton({ children, onPress, style, variant = "primary" }: GlassButtonProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const isPrimary = variant === "primary";

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed, style]}
    >
      {Platform.OS === "web" ? (
        <View style={[styles.shell, isPrimary ? styles.primaryWeb : styles.surfaceWeb]}>{children}</View>
      ) : (
        <View style={styles.shell}>
          <BlurView
            intensity={isPrimary ? glass.buttonBlurIntensity + 12 : glass.buttonBlurIntensity}
            tint={isPrimary ? "light" : "dark"}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={[styles.tint, isPrimary ? styles.primaryTint : styles.surfaceTint]} />
          <View style={styles.highlight} />
          <View style={styles.content}>{children}</View>
        </View>
      )}
    </Pressable>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    pressable: {
      borderRadius: radius.pill,
      overflow: "hidden",
    },
    pressed: {
      opacity: 0.88,
      transform: [{ scale: 0.99 }],
    },
    shell: {
      borderRadius: radius.pill,
      borderWidth: 1,
      borderColor: colors.glassBorder,
      overflow: "hidden",
    },
    primaryWeb: {
      backgroundColor: colors.accentButtonFillStrong,
    },
    surfaceWeb: {
      backgroundColor: colors.glass,
    },
    tint: {
      ...StyleSheet.absoluteFillObject,
    },
    primaryTint: {
      backgroundColor: colors.accentButtonFill,
    },
    surfaceTint: {
      backgroundColor: colors.glassStrong,
    },
    highlight: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 1,
      backgroundColor: "rgba(255,255,255,0.22)",
    },
    content: {
      position: "relative",
    },
  });
}
