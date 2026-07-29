import { useEffect, useMemo, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import { GradientCard } from "@/components/GradientCard";
import { layout, spacing } from "@/theme";

const DEFAULT_CARD_WIDTH = layout.cardWidth;
const GAP = spacing.md;
/** 横向慢速滚动：约 24px/s */
const PIXELS_PER_SECOND = 24;

export type MarqueeCardItem = {
  id: string;
  title: string;
  subtitle?: string;
  meta?: string;
  badge?: string;
  gradient: [string, string];
};

type AutoScrollCardsMarqueeProps = {
  items: MarqueeCardItem[];
  onPressItem: (item: MarqueeCardItem) => void;
  cardWidth?: number;
  cardHeight?: number;
};

export function AutoScrollCardsMarquee({
  items,
  onPressItem,
  cardWidth = DEFAULT_CARD_WIDTH,
  cardHeight,
}: AutoScrollCardsMarqueeProps) {
  const translateX = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  const loopItems = useMemo(() => [...items, ...items], [items]);
  const loopWidth = items.length * (cardWidth + GAP);

  useEffect(() => {
    if (items.length === 0 || loopWidth <= 0) return;

    translateX.setValue(0);
    animationRef.current?.stop();

    const duration = Math.round((loopWidth / PIXELS_PER_SECOND) * 1000);
    animationRef.current = Animated.loop(
      Animated.timing(translateX, {
        toValue: -loopWidth,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    animationRef.current.start();

    return () => {
      animationRef.current?.stop();
    };
  }, [cardWidth, items.length, loopWidth, translateX]);

  if (items.length === 0) return null;

  return (
    <View style={styles.viewport}>
      <Animated.View
        style={[styles.track, { transform: [{ translateX }] }]}
        pointerEvents="box-none"
      >
        {loopItems.map((item, index) => (
          <View key={`${item.id}-${index}`} style={[styles.item, { width: cardWidth }]}>
            <GradientCard
              title={item.title}
              subtitle={item.subtitle}
              meta={item.meta}
              badge={item.badge}
              gradient={item.gradient}
              width={cardWidth}
              height={cardHeight}
              onPress={() => onPressItem(item)}
            />
          </View>
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  viewport: {
    overflow: "hidden",
  },
  track: {
    flexDirection: "row",
  },
  item: {
    marginRight: GAP,
  },
});
