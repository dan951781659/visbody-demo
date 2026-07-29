import { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { GlassIconButton } from "@/components/GlassIconButton";
import { MyTrainingPlanRow } from "@/components/plan/MyTrainingPlanRow";
import { useTheme } from "@/context/ThemeContext";
import { myTrainingPlans, MyTrainingPlansTab } from "@/data/planMock";
import { ColorPalette, layout, radius, spacing, typography } from "@/theme";

const TABS: { id: MyTrainingPlansTab; label: string }[] = [
  { id: "ongoing", label: "进行中" },
  { id: "history", label: "历史" },
];

export default function PlanListScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [activeTab, setActiveTab] = useState<MyTrainingPlansTab>("ongoing");
  const plans = myTrainingPlans[activeTab];

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <GlassIconButton accessibilityLabel="返回" onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </GlassIconButton>
        <Text style={styles.title}>我的训练计划</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.tabs} accessibilityRole="tablist">
        {TABS.map((tab) => {
          const selected = tab.id === activeTab;
          return (
            <Pressable
              key={tab.id}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              accessibilityLabel={tab.label}
              onPress={() => setActiveTab(tab.id)}
              style={[styles.tab, selected && styles.tabActive]}
            >
              <Text style={[styles.tabText, selected && styles.tabTextActive]}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <FlatList
        data={plans}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>
              {activeTab === "ongoing" ? "暂无进行中的计划" : "暂无历史计划"}
            </Text>
            <Text style={styles.emptyHint}>
              {activeTab === "ongoing"
                ? "点击下方按钮完善身体档案并生成计划"
                : "完成或退出的计划会显示在这里"}
            </Text>
          </View>
        }
        renderItem={({ item }) => <MyTrainingPlanRow plan={item} tab={activeTab} />}
      />

      <View style={styles.footer}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="重新生成计划"
          onPress={() => router.push("/plan/profile-setup")}
          style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
        >
          <Text style={styles.primaryButtonText}>重新生成计划</Text>
        </Pressable>
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
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: layout.screenPadding,
      paddingTop: spacing.sm,
      paddingBottom: spacing.md,
    },
    title: {
      ...typography.sectionTitle,
      color: colors.textPrimary,
    },
    headerSpacer: {
      width: 44,
    },
    tabs: {
      flexDirection: "row",
      marginHorizontal: layout.screenPadding,
      marginBottom: spacing.md,
      padding: 4,
      borderRadius: radius.pill,
      backgroundColor: colors.surfaceMuted,
      gap: 4,
    },
    tab: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: spacing.sm,
      borderRadius: radius.pill,
    },
    tabActive: {
      backgroundColor: colors.accent,
    },
    tabText: {
      ...typography.label,
      color: colors.textSecondary,
    },
    tabTextActive: {
      color: colors.accentText,
    },
    listContent: {
      paddingHorizontal: layout.screenPadding,
      paddingBottom: spacing.xxxl,
      flexGrow: 1,
    },
    separator: {
      height: spacing.md,
    },
    emptyState: {
      alignItems: "center",
      paddingVertical: spacing.xxxl,
      gap: spacing.sm,
    },
    emptyTitle: {
      ...typography.subtitle,
      color: colors.textPrimary,
    },
    emptyHint: {
      ...typography.caption,
      color: colors.textSecondary,
      textAlign: "center",
    },
    footer: {
      paddingHorizontal: layout.screenPadding,
      paddingTop: spacing.md,
      paddingBottom: spacing.lg,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.glassBorder,
    },
    primaryButton: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.accent,
      borderRadius: radius.pill,
      paddingVertical: spacing.lg,
      minHeight: 52,
    },
    primaryButtonText: {
      ...typography.subtitle,
      color: colors.accentText,
    },
    pressed: {
      opacity: 0.88,
    },
  });
}
