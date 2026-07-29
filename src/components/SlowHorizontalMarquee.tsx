import { ReactNode, useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import { spacing } from "@/theme";

type SlowHorizontalMarqueeProps = {
  children: ReactNode;
  /** 像素/秒，数值越小越慢 */
  speed?: number;
  gap?: number;
};

/**
 * 横向慢速无缝滚动。将同一组内容复制两份，滚完一组宽度后循环。
 */
export function SlowHorizontalMarquee({
  children,
  speed = 28,
  gap = spacing.md,
}: SlowHorizontalMarqueeProps) {
  const offset = useRef(new Animated.Value(0)).current;
  const [cycleWidth, setCycleWidth] = useState(0);

  useEffect(() => {
    if (cycleWidth <= 0) return;

    offset.setValue(0);
    const duration = Math.max(4000, (cycleWidth / speed) * 1000);
    const animation = Animated.loop(
      Animated.timing(offset, {
        toValue: -cycleWidth,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    animation.start();
    return () => {
      animation.stop();
      offset.stopAnimation();
    };
  }, [cycleWidth, offset, speed]);

  return (
    <View style={styles.clip} collapsable={false}>
      <Animated.View
        style={[styles.track, { transform: [{ translateX: offset }] }]}
        collapsable={false}
      >
        <View
          style={[styles.set, { marginRight: gap }]}
          onLayout={(event) => {
            const width = event.nativeEvent.layout.width;
            if (width > 0 && width !== cycleWidth) {
              setCycleWidth(width + gap);
            }
          }}
        >
          {children}
        </View>
        <View style={styles.set} pointerEvents="none">
          {children}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  clip: {
    overflow: "hidden",
  },
  track: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  set: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: spacing.md,
  },
});
