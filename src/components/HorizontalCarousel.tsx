import { ReactNode } from "react";
import { ScrollView, StyleSheet, View, ViewStyle } from "react-native";
import { spacing } from "@/theme";

type HorizontalCarouselProps = {
  children: ReactNode;
  contentStyle?: ViewStyle;
};

export function HorizontalCarousel({ children, contentStyle }: HorizontalCarouselProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.content, contentStyle]}
      decelerationRate="fast"
    >
      {children}
    </ScrollView>
  );
}

export function CarouselItem({ children }: { children: ReactNode }) {
  return <View style={styles.item}>{children}</View>;
}

const styles = StyleSheet.create({
  content: {
    paddingRight: spacing.lg,
    gap: spacing.md,
  },
  item: {
    marginRight: 0,
  },
});
