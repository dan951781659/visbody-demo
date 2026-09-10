import { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { ExploreTabs } from "@/components/explore/ExploreTabs";
import { ExploreWaterfall } from "@/components/explore/ExploreWaterfall";
import { GlassIconButton } from "@/components/GlassIconButton";
import { useFavorites } from "@/context/FavoriteContext";
import { useTheme } from "@/context/ThemeContext";
import { TAB_CONFIG } from "@/data/exploreLibrary";
import type { LibraryItem, LibraryTab } from "@/types/content";
import { ColorPalette, layout, spacing, typography } from "@/theme";

const EMPTY_TEXT: Record<LibraryTab, string> = {
  moves: "暂无收藏的动作",
  aiMoves: "暂无收藏的 AI 动作",
  plans: "暂无收藏的计划",
};

export default function FavoritesScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { getFavoritesForTab } = useFavorites();
  const [activeTab, setActiveTab] = useState<LibraryTab>("moves");

  const items = useMemo(() => getFavoritesForTab(activeTab), [activeTab, getFavoritesForTab]);

  const openDetail = (item: LibraryItem) => {
    if (item.available === false) return;
    router.push({
      pathname: "/content/[type]/[id]",
      params: { type: activeTab, id: item.id },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <GlassIconButton accessibilityLabel="返回" onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
          </GlassIconButton>
          <View style={styles.headerText}>
            <Text style={styles.kicker}>训练库</Text>
            <Text style={styles.title}>我的收藏</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.tabsWrap}>
          <ExploreTabs activeTab={activeTab} onChange={setActiveTab} />
        </View>

        <View style={styles.resultsHead}>
          <Text style={styles.resultsTitle}>{TAB_CONFIG[activeTab].label}</Text>
          <Text style={styles.resultsCount}>{items.length} 项</Text>
        </View>

        <ExploreWaterfall
          items={items}
          tab={activeTab}
          onPressItem={openDetail}
          colors={colors}
          emptyText={EMPTY_TEXT[activeTab]}
          showUnavailableOverlay
        />
      </View>
    </SafeAreaView>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
      paddingHorizontal: layout.screenPadding,
      paddingTop: spacing.md,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      marginBottom: spacing.lg,
    },
    headerText: {
      flex: 1,
    },
    headerSpacer: {
      width: 44,
    },
    kicker: {
      ...typography.label,
      color: colors.textMuted,
      textTransform: "uppercase",
    },
    title: {
      ...typography.title,
      color: colors.textPrimary,
      marginTop: spacing.xs,
    },
    tabsWrap: {
      marginBottom: spacing.md,
    },
    resultsHead: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "baseline",
      marginBottom: spacing.sm,
    },
    resultsTitle: {
      ...typography.subtitle,
      fontSize: 18,
      color: colors.textPrimary,
    },
    resultsCount: {
      ...typography.caption,
      color: colors.textMuted,
    },
  });
}
