import { useEffect, useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { ExploreTabs } from "@/components/explore/ExploreTabs";
import { ExploreWaterfall } from "@/components/explore/ExploreWaterfall";
import { GlassSurface } from "@/components/GlassSurface";
import { useTheme } from "@/context/ThemeContext";
import { TAB_CONFIG } from "@/data/exploreLibrary";
import { useExploreFilters } from "@/hooks/useExploreFilters";
import type { LibraryItem, LibraryTab } from "@/types/content";
import { ColorPalette, layout, radius, spacing, typography } from "@/theme";

function resolveTabParam(value: string | string[] | undefined): LibraryTab | null {
  const tab = Array.isArray(value) ? value[0] : value;
  if (tab === "moves" || tab === "aiMoves" || tab === "plans") return tab;
  return null;
}

export default function ExploreScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const params = useLocalSearchParams<{ tab?: string | string[] }>();
  const tabFromParams = resolveTabParam(params.tab);
  const {
    activeTab,
    keyword,
    filtersOpen,
    activeFilters,
    filteredItems,
    setKeyword,
    setFiltersOpen,
    changeTab,
    toggleFilter,
    clearFilterGroup,
  } = useExploreFilters(tabFromParams ?? "moves");

  useEffect(() => {
    if (tabFromParams) {
      changeTab(tabFromParams);
    }
    // 仅响应路由 tab 参数变化（如首页「查看全部」进入计划列表）
    // eslint-disable-next-line react-hooks/exhaustive-deps -- changeTab 非稳定引用
  }, [tabFromParams]);

  const openDetail = (item: LibraryItem) => {
    router.push({
      pathname: "/content/[type]/[id]",
      params: { type: activeTab, id: item.id },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.kicker}>训练库</Text>
          <Text style={styles.title}>全部训练</Text>
        </View>

        <View style={styles.tabsWrap}>
          <ExploreTabs activeTab={activeTab} onChange={changeTab} />
        </View>

        <GlassSurface style={styles.tools} contentStyle={styles.toolsContent}>
          <View style={styles.toolsRow}>
            <View style={styles.searchWrap}>
              <Ionicons name="search-outline" size={18} color={colors.textMuted} />
              <TextInput
                value={keyword}
                onChangeText={setKeyword}
                placeholder="按名称搜索"
                placeholderTextColor={colors.textMuted}
                style={styles.searchInput}
                autoCorrect={false}
                clearButtonMode="while-editing"
              />
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={filtersOpen ? "收起筛选" : "展开筛选"}
              onPress={() => setFiltersOpen(!filtersOpen)}
              style={({ pressed }) => [
                styles.filterToggle,
                filtersOpen && styles.filterToggleOpen,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons
                name={filtersOpen ? "chevron-up" : "chevron-down"}
                size={18}
                color={colors.textPrimary}
              />
            </Pressable>
          </View>

          {filtersOpen ? (
            <ScrollView
              style={styles.filterPanel}
              contentContainerStyle={styles.filterPanelContent}
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
            >
              {TAB_CONFIG[activeTab].filters.map(({ key, label, options }) => {
                const selected = activeFilters[key] ?? new Set<string>();
                return (
                  <View key={key} style={styles.filterGroup}>
                    <Text style={styles.filterGroupTitle}>{label}</Text>
                    <View style={styles.filterOptions}>
                      <FilterChip
                        label="全部"
                        active={selected.size === 0}
                        onPress={() => clearFilterGroup(key)}
                        styles={styles}
                      />
                      {options.map((option) => (
                        <FilterChip
                          key={option.value}
                          label={option.label}
                          active={selected.has(option.value)}
                          onPress={() => toggleFilter(key, option.value)}
                          styles={styles}
                        />
                      ))}
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          ) : null}
        </GlassSurface>

        <View style={styles.resultsHead}>
          <Text style={styles.resultsTitle}>{TAB_CONFIG[activeTab].label}</Text>
          <Text style={styles.resultsCount}>
            {filteredItems.length} 项
          </Text>
        </View>

        <ExploreWaterfall
          items={filteredItems}
          tab={activeTab}
          onPressItem={openDetail}
          colors={colors}
          emptyText="没有符合当前筛选条件的内容。"
        />
      </View>
    </SafeAreaView>
  );
}

function FilterChip({
  label,
  active,
  onPress,
  styles,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.chip, active && styles.chipActive, pressed && styles.pressed]}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
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
    marginBottom: spacing.lg,
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
  tools: {
    marginBottom: spacing.md,
  },
  toolsContent: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  toolsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  searchWrap: {
    flex: 1,
    minHeight: 42,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    fontSize: 16,
    color: colors.textPrimary,
    paddingVertical: spacing.sm,
  },
  filterToggle: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  filterToggleOpen: {
    backgroundColor: colors.accentGlass,
    borderColor: colors.accent,
  },
  filterPanel: {
    maxHeight: 220,
  },
  filterPanelContent: {
    gap: spacing.md,
    paddingTop: spacing.xs,
  },
  filterGroup: {
    gap: spacing.sm,
  },
  filterGroupTitle: {
    ...typography.label,
    color: colors.textMuted,
    textTransform: "uppercase",
  },
  filterOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  chip: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  chipActive: {
    backgroundColor: colors.accentGlass,
    borderColor: colors.accent,
  },
  chipText: {
    ...typography.label,
    fontSize: 12,
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.accent,
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
  pressed: {
    opacity: 0.88,
  },
  });
}
