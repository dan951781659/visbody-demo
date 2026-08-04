import { useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { AutoScrollCardsMarquee } from "@/components/AutoScrollCardsMarquee";
import { HorizontalCarousel, CarouselItem } from "@/components/HorizontalCarousel";
import { LibraryEntryCard } from "@/components/LibraryEntryCard";
import { LoginRequiredCard } from "@/components/LoginRequiredCard";
import { MyPlanButton } from "@/components/MyPlanButton";
import { ProductLinePickerModal } from "@/components/training/ProductLinePickerModal";
import { ProductSwitcher } from "@/components/ProductSwitcher";
import { RecommendedPlansMarquee } from "@/components/RecommendedPlansMarquee";
import { SceneCategoryCard } from "@/components/SceneCategoryCard";
import { SectionHeader } from "@/components/SectionHeader";
import { TodayTrainingCard } from "@/components/TodayTrainingCard";
import { WeekStatsCard } from "@/components/WeekStatsCard";
import { useTraining } from "@/context/TrainingContext";
import { useUser } from "@/context/UserContext";
import { formatLibraryValue, moves, plans } from "@/data/exploreLibrary";
import { sceneCategories } from "@/data/mockData";
import { buildDailySummaryStats, DEMO_WEEK_ANCHOR } from "@/utils/dailyStats";
import { colors, layout, spacing, typography } from "@/theme";

const homeRecommendedPlans = plans.slice(0, 3);
const homeFeaturedMoves = moves.slice(0, 3);

export default function HomeScreen() {
  const {
    selectedProductLine,
    selectedDevice,
    devices,
    productLines,
    selectProductLine,
  } = useTraining();
  const { isLoggedIn, trainingGoals } = useUser();
  const [lineVisible, setLineVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(DEMO_WEEK_ANCHOR);
  const router = useRouter();

  const summaryStats = useMemo(
    () => buildDailySummaryStats(selectedDate, trainingGoals),
    [selectedDate, trainingGoals],
  );

  const showComingSoon = (feature: string) => {
    Alert.alert("即将上线", `${feature} 功能将在后续版本中提供。`);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ProductSwitcher
          productLine={selectedProductLine}
          connection={selectedDevice?.connection}
          hasDevice={devices.length > 0}
          isLoggedIn={isLoggedIn}
          onPressName={() => setLineVisible(true)}
          onPressLogo={isLoggedIn ? () => router.push("/devices") : undefined}
          onPressScan={() => router.push("/connect/scan")}
        />

        <SectionHeader title="今日摘要" />
        <View style={styles.sectionGap}>
          {isLoggedIn ? (
            <WeekStatsCard
              weekDays={summaryStats.weekDays}
              metrics={summaryStats.metrics}
              onSelectDay={setSelectedDate}
            />
          ) : (
            <LoginRequiredCard onPress={() => router.push("/login")}>
              <WeekStatsCard
                weekDays={summaryStats.weekDays}
                metrics={summaryStats.metrics}
                onSelectDay={setSelectedDate}
              />
            </LoginRequiredCard>
          )}
        </View>

        <View style={styles.section}>
          <SectionHeader title="今日训练" />
          {isLoggedIn ? (
            <TodayTrainingCard
              date={selectedDate}
              onViewPlan={(planId) =>
                router.push({
                  pathname: "/content/[type]/[id]",
                  params: { type: "plans", id: planId },
                })
              }
              onFreeTrainingPress={() => router.push("/(tabs)/train")}
            />
          ) : (
            <LoginRequiredCard onPress={() => router.push("/login")}>
              <TodayTrainingCard
                date={selectedDate}
                onViewPlan={() => undefined}
                onFreeTrainingPress={() => undefined}
              />
            </LoginRequiredCard>
          )}
        </View>

        <View style={styles.section}>
          <SectionHeader title="探索训练" />
          <LibraryEntryCard
            onPress={() =>
              router.push({ pathname: "/(tabs)/explore", params: { tab: "moves" } })
            }
          />
          <Text style={styles.subSectionLabel}>按运动场景</Text>
          <HorizontalCarousel>
            {sceneCategories.map((category) => (
              <CarouselItem key={category.id}>
                <SceneCategoryCard
                  category={category}
                  onPress={() => showComingSoon(`${category.title}动作列表`)}
                />
              </CarouselItem>
            ))}
          </HorizontalCarousel>
        </View>

        <View style={styles.section}>
          <SectionHeader
            title="推荐计划"
            actionLabel="查看全部"
            onActionPress={() =>
              router.push({ pathname: "/(tabs)/explore", params: { tab: "plans" } })
            }
          />
          <RecommendedPlansMarquee
            plans={homeRecommendedPlans}
            onPressPlan={(plan) =>
              router.push({
                pathname: "/content/[type]/[id]",
                params: { type: "plans", id: plan.id },
              })
            }
          />
        </View>

        <View style={styles.section}>
          <SectionHeader title="精选动作" />
          <AutoScrollCardsMarquee
            items={homeFeaturedMoves.map((move, index) => ({
              id: move.id,
              title: move.name,
              subtitle: move.summary,
              meta: `${formatLibraryValue(move.difficulty)} · ${move.durationMinutes ?? 0} 分钟`,
              badge: index === 0 ? "精选" : undefined,
              gradient: move.gradient,
            }))}
            cardWidth={240}
            cardHeight={160}
            onPressItem={(item) =>
              router.push({
                pathname: "/content/[type]/[id]",
                params: { type: "moves", id: item.id },
              })
            }
          />
        </View>

        <View style={[styles.section, styles.lastSection]}>
          <SectionHeader title="我的计划" />
          <MyPlanButton onPress={() => router.push("/plan")} />
        </View>
      </ScrollView>

      <ProductLinePickerModal
        visible={lineVisible}
        productLines={productLines}
        selectedId={selectedProductLine.id}
        onSelect={selectProductLine}
        onClose={() => setLineVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.md,
    paddingBottom: layout.tabScreenBottomInset + spacing.xl,
  },
  sectionGap: {
    marginBottom: spacing.xxl,
  },
  section: {
    marginBottom: spacing.xxl,
  },
  lastSection: {
    marginBottom: spacing.lg,
  },
  subSectionLabel: {
    ...typography.caption,
    fontWeight: "500",
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
});
