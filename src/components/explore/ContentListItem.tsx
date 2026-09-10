import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/context/ThemeContext";
import { getMetaTags } from "@/data/exploreLibrary";
import type { LibraryItem, LibraryTab } from "@/types/content";
import { ColorPalette, radius, spacing, typography } from "@/theme";
import { getMetaChipPalette } from "@/theme/metaChip";

type ContentListItemProps = {
  item: LibraryItem;
  tab: LibraryTab;
  onPress: () => void;
  /** When true, show unavailable overlay and block detail navigation. */
  showUnavailableOverlay?: boolean;
};

export function isLibraryItemUnavailable(item: LibraryItem): boolean {
  return item.available === false;
}

export function ContentListItem({
  item,
  tab,
  onPress,
  showUnavailableOverlay = false,
}: ContentListItemProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const tags = getMetaTags(item, tab);
  const unavailable = showUnavailableOverlay && isLibraryItemUnavailable(item);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: unavailable }}
      accessibilityLabel={unavailable ? `${item.name}，该动作已下架` : item.name}
      disabled={unavailable}
      onPress={unavailable ? undefined : onPress}
      style={({ pressed }) => [styles.card, pressed && !unavailable && styles.pressed]}
    >
      <View style={styles.thumbnailWrap}>
        <LinearGradient colors={item.gradient} style={styles.thumbnail} />
        {unavailable ? (
          <View style={styles.unavailableOverlay} pointerEvents="none">
            <Text style={styles.unavailableText}>该动作已下架</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.content}>
        <View style={styles.top}>
          <Text style={styles.title} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.summary}>{item.summary}</Text>
        </View>
        <View style={styles.metaRow}>
          {tags.slice(0, 3).map((tag) => {
            const palette = getMetaChipPalette(tag.style);
            return (
              <View
                key={`${tag.style}-${tag.text}`}
                style={[
                  styles.tag,
                  {
                    backgroundColor: palette.background,
                    borderColor: palette.border,
                  },
                ]}
              >
                <Text style={[styles.tagText, { color: palette.text }]}>{tag.text}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </Pressable>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    card: {
      borderRadius: radius.lg,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.glassBorder,
      overflow: "hidden",
      flexDirection: "column",
      alignSelf: "stretch",
    },
    pressed: {
      opacity: 0.9,
    },
    thumbnailWrap: {
      width: "100%",
      aspectRatio: 4 / 3,
      position: "relative",
    },
    thumbnail: {
      width: "100%",
      height: "100%",
      borderRadius: 0,
    },
    unavailableOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(28,28,30,0.72)",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: spacing.md,
    },
    unavailableText: {
      ...typography.label,
      color: "#FFFFFF",
      textAlign: "center",
    },
    content: {
      minWidth: 0,
      gap: spacing.sm,
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.md,
      paddingTop: spacing.sm,
    },
    top: {
      gap: spacing.xs,
    },
    title: {
      ...typography.subtitle,
      fontSize: 17,
      color: colors.textPrimary,
    },
    summary: {
      ...typography.caption,
      fontSize: 13,
      lineHeight: 18,
      color: colors.textSecondary,
    },
    metaRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.xs,
    },
    tag: {
      borderRadius: radius.pill,
      paddingHorizontal: spacing.sm,
      paddingVertical: 3,
      borderWidth: 1,
    },
    tagText: {
      ...typography.label,
      fontSize: 11,
    },
  });
}
