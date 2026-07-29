import { BlurView } from "expo-blur";
import { ReactNode } from "react";
import { Platform, Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { colors, glass, radius } from "@/theme";

type GlassIconButtonProps = {
  onPress?: () => void;
  children: ReactNode;
  style?: ViewStyle;
  accessibilityLabel: string;
  disabled?: boolean;
};

export function GlassIconButton({
  onPress,
  children,
  style,
  accessibilityLabel,
  disabled = false,
}: GlassIconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.pressable,
        style,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      {Platform.OS === "web" ? (
        <View style={styles.webShell}>{children}</View>
      ) : (
        <View style={styles.shell}>
          <BlurView intensity={glass.buttonBlurIntensity} tint="dark" style={StyleSheet.absoluteFillObject} />
          <View style={styles.tint} />
          <View style={styles.highlight} />
          <View style={styles.content}>{children}</View>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    borderRadius: radius.pill,
    overflow: "hidden",
  },
  shell: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  webShell: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: colors.glassStrong,
    alignItems: "center",
    justifyContent: "center",
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
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.88,
  },
  disabled: {
    opacity: 0.45,
  },
});
