import { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { ContentListItem } from "@/components/explore/ContentListItem";
import type { LibraryItem, LibraryTab } from "@/types/content";
import { layout, spacing, typography, type ColorPalette } from "@/theme";

type ExploreWaterfallProps = {
  items: LibraryItem[];
  tab: LibraryTab;
  onPressItem: (item: LibraryItem) => void;
  colors: ColorPalette;
  emptyText: string;
  /** Favorites list shows unavailable overlay for taken-down moves. */
  showUnavailableOverlay?: boolean;
};

/** Rough relative height so shorter column receives the next card. */
function estimateCardHeight(item: LibraryItem): number {
  const image = 160;
  const titleLines = Math.min(2, Math.max(1, Math.ceil(item.name.length / 12)));
  const summaryLines = Math.max(1, Math.ceil(item.summary.length / 16));
  const title = titleLines * 22;
  const summary = summaryLines * 18;
  const tags = 28;
  const padding = 28;
  return image + title + summary + tags + padding;
}

function splitIntoColumns(items: LibraryItem[]): [LibraryItem[], LibraryItem[]] {
  const left: LibraryItem[] = [];
  const right: LibraryItem[] = [];
  let leftHeight = 0;
  let rightHeight = 0;

  for (const item of items) {
    const height = estimateCardHeight(item);
    if (leftHeight <= rightHeight) {
      left.push(item);
      leftHeight += height;
    } else {
      right.push(item);
      rightHeight += height;
    }
  }

  return [left, right];
}

export function ExploreWaterfall({
  items,
  tab,
  onPressItem,
  colors,
  emptyText,
  showUnavailableOverlay = false,
}: ExploreWaterfallProps) {
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [leftItems, rightItems] = useMemo(() => splitIntoColumns(items), [items]);

  if (items.length === 0) {
    return <Text style={styles.emptyText}>{emptyText}</Text>;
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.columns}>
        <View style={styles.column}>
          {leftItems.map((item) => (
            <ContentListItem
              key={item.id}
              item={item}
              tab={tab}
              showUnavailableOverlay={showUnavailableOverlay}
              onPress={() => onPressItem(item)}
            />
          ))}
        </View>
        <View style={styles.column}>
          {rightItems.map((item) => (
            <ContentListItem
              key={item.id}
              item={item}
              tab={tab}
              showUnavailableOverlay={showUnavailableOverlay}
              onPress={() => onPressItem(item)}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    scrollContent: {
      paddingBottom: layout.tabScreenBottomInset + spacing.xl,
    },
    columns: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: spacing.md,
    },
    column: {
      flex: 1,
      gap: spacing.md,
    },
    emptyText: {
      ...typography.caption,
      color: colors.textMuted,
      textAlign: "center",
      paddingVertical: spacing.xxl,
    },
  });
}
