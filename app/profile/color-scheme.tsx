import { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { GlassSurface } from "@/components/GlassSurface";
import { useTheme } from "@/context/ThemeContext";
import {
  ColorPalette,
  ColorSchemeId,
  colorSchemes,
  layout,
  radius,
  spacing,
  typography,
} from "@/theme";

const SCHEME_ORDER: ColorSchemeId[] = ["classic", "deviceBlue"];

export default function ColorSchemeScreen() {
  const router = useRouter();
  const { colors, schemeId, setColorScheme } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="返回"
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
        >
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <View style={styles.headerText}>
          <Text style={styles.title}>配色管理</Text>
          <Text style={styles.subtitle}>选择 App 强调色主题，立即全局生效</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {SCHEME_ORDER.map((id) => {
          const scheme = colorSchemes[id];
          const selected = schemeId === id;
          const preview = scheme.colors;

          return (
            <Pressable
              key={id}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={`${scheme.name}${selected ? "，已选中" : ""}`}
              onPress={() => setColorScheme(id)}
              style={({ pressed }) => [styles.cardPressable, pressed && styles.pressed]}
            >
              <GlassSurface
                contentStyle={[styles.card, selected && styles.cardSelected]}
              >
                <View style={styles.cardTop}>
                  <View style={styles.swatchRow}>
                    <View style={[styles.swatch, { backgroundColor: preview.accent }]} />
                    <View style={[styles.swatch, { backgroundColor: preview.accentDark }]} />
                    <View style={[styles.swatch, { backgroundColor: preview.accentGlass }]} />
                    <View
                      style={[
                        styles.swatchPreviewButton,
                        { backgroundColor: preview.accentButtonFillStrong },
                      ]}
                    >
                      <Text style={[styles.swatchPreviewText, { color: preview.accentText }]}>
                        Aa
                      </Text>
                    </View>
                  </View>
                  {selected ? (
                    <View style={styles.checkBadge}>
                      <Ionicons name="checkmark" size={16} color={colors.accentText} />
                    </View>
                  ) : (
                    <View style={styles.checkPlaceholder} />
                  )}
                </View>

                <Text style={styles.schemeName}>{scheme.name}</Text>
                <Text style={styles.schemeDesc}>{scheme.description}</Text>
                <Text style={styles.schemeMeta}>
                  {selected ? "当前使用" : "点击切换"}
                </Text>
              </GlassSurface>
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: spacing.sm,
      paddingHorizontal: layout.screenPadding,
      paddingTop: spacing.md,
      paddingBottom: spacing.md,
    },
    backButton: {
      width: 40,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 2,
    },
    headerText: {
      flex: 1,
      gap: spacing.xs,
    },
    title: {
      ...typography.title,
      color: colors.textPrimary,
    },
    subtitle: {
      ...typography.caption,
      color: colors.textSecondary,
    },
    scroll: {
      flex: 1,
    },
    content: {
      paddingHorizontal: layout.screenPadding,
      paddingBottom: spacing.xxxl,
      gap: spacing.md,
    },
    cardPressable: {
      borderRadius: radius.lg,
    },
    card: {
      padding: spacing.lg,
      gap: spacing.sm,
      borderWidth: 1,
      borderColor: "transparent",
    },
    cardSelected: {
      borderColor: colors.accent,
    },
    cardTop: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: spacing.xs,
    },
    swatchRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },
    swatch: {
      width: 28,
      height: 28,
      borderRadius: radius.sm,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    swatchPreviewButton: {
      minWidth: 44,
      height: 28,
      borderRadius: radius.pill,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: spacing.sm,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    swatchPreviewText: {
      ...typography.label,
      fontSize: 12,
    },
    checkBadge: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.accent,
      alignItems: "center",
      justifyContent: "center",
    },
    checkPlaceholder: {
      width: 28,
      height: 28,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    schemeName: {
      ...typography.subtitle,
      color: colors.textPrimary,
    },
    schemeDesc: {
      ...typography.caption,
      color: colors.textSecondary,
    },
    schemeMeta: {
      ...typography.label,
      color: colors.accent,
      marginTop: spacing.xs,
    },
    pressed: {
      opacity: 0.88,
    },
  });
}
