import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import type { LibraryTab } from "@/types/content";
import { ColorPalette, radius, spacing, typography } from "@/theme";

const TABS: { key: LibraryTab; label: string }[] = [
  { key: "moves", label: "动作" },
  { key: "aiMoves", label: "AI 动作" },
  { key: "plans", label: "计划" },
];

type ExploreTabsProps = {
  activeTab: LibraryTab;
  onChange: (tab: LibraryTab) => void;
};

export function ExploreTabs({ activeTab, onChange }: ExploreTabsProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.wrap}>
      {TABS.map((tab) => {
        const active = tab.key === activeTab;
        return (
          <Pressable
            key={tab.key}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(tab.key)}
            style={({ pressed }) => [styles.tab, active && styles.tabActive, pressed && styles.pressed]}
          >
            <Text style={[styles.tabText, active && styles.tabTextActive]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
  wrap: {
    flexDirection: "row",
    gap: spacing.sm,
    padding: spacing.xs,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  tab: {
    flex: 1,
    minHeight: 40,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  tabActive: {
    backgroundColor: colors.accentGlass,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  tabText: {
    ...typography.label,
    color: colors.textMuted,
  },
  tabTextActive: {
    color: colors.accent,
  },
  pressed: {
    opacity: 0.88,
  },
  });
}
