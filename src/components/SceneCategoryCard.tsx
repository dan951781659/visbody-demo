import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { SceneCategory } from "@/data/mockData";
import { colors, layout, radius, spacing, typography } from "@/theme";

type SceneCategoryCardProps = {
  category: SceneCategory;
  onPress?: () => void;
};

export function SceneCategoryCard({ category, onPress }: SceneCategoryCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [{ opacity: pressed ? 0.88 : 1 }]}
    >
      <LinearGradient
        colors={category.gradient}
        style={[styles.card, { width: layout.sceneCardSize, height: layout.sceneCardSize }]}
      >
        <View style={styles.footer}>
          {Platform.OS !== "web" ? (
            <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFillObject} />
          ) : null}
          <View style={styles.footerTint} />
          <View style={styles.footerContent}>
            <Text style={styles.title}>{category.title}</Text>
            <Text style={styles.subtitle}>{category.subtitle}</Text>
            <Text style={styles.meta}>{category.moveCount} 个动作</Text>
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    overflow: "hidden",
    justifyContent: "flex-end",
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  footer: {
    overflow: "hidden",
    borderTopWidth: 1,
    borderTopColor: colors.glassBorder,
  },
  footerTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.18)",
  },
  footerContent: {
    position: "relative",
    padding: spacing.md,
  },
  title: {
    ...typography.subtitle,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  meta: {
    ...typography.label,
    color: colors.textMuted,
  },
});
