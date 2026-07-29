import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/context/ThemeContext";
import { getMetaTags } from "@/data/exploreLibrary";
import type { LibraryItem, LibraryTab } from "@/types/content";
import { ColorPalette, radius, spacing, typography } from "@/theme";

type ContentListItemProps = {
  item: LibraryItem;
  tab: LibraryTab;
  onPress: () => void;
};

export function ContentListItem({ item, tab, onPress }: ContentListItemProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const tags = getMetaTags(item, tab);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <LinearGradient colors={item.gradient} style={styles.thumbnail} />
      <View style={styles.content}>
        <View style={styles.top}>
          <Text style={styles.title} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.summary}>{item.summary}</Text>
        </View>
        <View style={styles.metaRow}>
          {tags.slice(0, 3).map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
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
    thumbnail: {
      width: "100%",
      aspectRatio: 4 / 3,
      borderRadius: 0,
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
      backgroundColor: colors.accentGlass,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    tagText: {
      ...typography.label,
      fontSize: 11,
      color: colors.textPrimary,
    },
  });
}
