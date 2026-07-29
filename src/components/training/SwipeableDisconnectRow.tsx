import { ReactNode, useRef } from "react";
import { Animated, PanResponder, Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { radius, spacing, typography } from "@/theme";

const ACTION_WIDTH = 88;
const OPEN_THRESHOLD = 40;

type SwipeableDisconnectRowProps = {
  children: ReactNode;
  onDisconnect: () => void;
};

export function SwipeableDisconnectRow({ children, onDisconnect }: SwipeableDisconnectRowProps) {
  const { colors } = useTheme();
  const translateX = useRef(new Animated.Value(0)).current;
  const offsetRef = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dx) > 8 && Math.abs(gesture.dx) > Math.abs(gesture.dy),
      onPanResponderGrant: () => {
        translateX.stopAnimation((value) => {
          offsetRef.current = value;
        });
      },
      onPanResponderMove: (_, gesture) => {
        const next = Math.min(0, Math.max(-ACTION_WIDTH, offsetRef.current + gesture.dx));
        translateX.setValue(next);
      },
      onPanResponderRelease: (_, gesture) => {
        const current = offsetRef.current + gesture.dx;
        const shouldOpen = current < -OPEN_THRESHOLD || gesture.vx < -0.3;
        const toValue = shouldOpen ? -ACTION_WIDTH : 0;
        offsetRef.current = toValue;
        Animated.spring(translateX, {
          toValue,
          useNativeDriver: true,
          bounciness: 0,
          speed: 20,
        }).start();
      },
      onPanResponderTerminate: () => {
        offsetRef.current = 0;
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 0,
          speed: 20,
        }).start();
      },
    }),
  ).current;

  const handleDisconnect = () => {
    offsetRef.current = 0;
    Animated.timing(translateX, {
      toValue: 0,
      duration: 120,
      useNativeDriver: true,
    }).start(() => onDisconnect());
  };

  return (
    <View style={styles.wrap}>
      <View style={[styles.actionLayer, { backgroundColor: colors.red }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="断开连接"
          onPress={handleDisconnect}
          style={({ pressed }) => [styles.disconnectBtn, pressed && styles.pressed]}
        >
          <Text style={styles.disconnectText}>断开</Text>
        </Pressable>
      </View>
      <Animated.View
        style={[
          styles.foreground,
          { backgroundColor: colors.surface, transform: [{ translateX }] },
        ]}
        {...panResponder.panHandlers}
      >
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radius.md,
    overflow: "hidden",
  },
  actionLayer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  disconnectBtn: {
    width: ACTION_WIDTH,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.sm,
  },
  disconnectText: {
    ...typography.label,
    color: "#FFFFFF",
  },
  foreground: {},
  pressed: {
    opacity: 0.85,
  },
});
