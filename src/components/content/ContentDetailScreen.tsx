import { ScrollView, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { ContentDetailActions } from "@/components/content/ContentDetailActions";
import { ContentTagRow } from "@/components/content/ContentTagRow";
import { DetailAccordion } from "@/components/content/DetailAccordion";
import { PlanScheduleBrowser } from "@/components/content/PlanScheduleBrowser";
import { GlassIconButton } from "@/components/GlassIconButton";
import { JoinPlanSheet } from "@/components/plan/JoinPlanSheet";
import { PlanDetailActions } from "@/components/plan/PlanDetailActions";
import { QuitPlanConfirmModal } from "@/components/plan/QuitPlanConfirmModal";
import { ReschedulePlanDayModal } from "@/components/plan/ReschedulePlanDayModal";
import { useToast } from "@/components/ToastProvider";
import { useFavorites } from "@/context/FavoriteContext";
import { usePlan } from "@/context/PlanContext";
import { useTheme } from "@/context/ThemeContext";
import { useTraining } from "@/context/TrainingContext";
import { formatLibraryValue, getItemById } from "@/data/exploreLibrary";
import type { LibraryTab, PlanItem } from "@/types/content";
import { planDayKey } from "@/types/plan";
import { confirmAction } from "@/utils/confirmAction";
import { ColorPalette, layout, spacing, typography } from "@/theme";
import type { MetaChipStyle } from "@/theme/metaChip";

type ContentDetailScreenProps = {
  type: LibraryTab;
  id: string;
};

type DetailTag = { value: string; style: MetaChipStyle };

export function ContentDetailScreen({ type, id }: ContentDetailScreenProps) {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { showToast } = useToast();
  const { selectedDevice, setPendingMoveStart } = useTraining();
  const { isFavorite, toggleFavorite } = useFavorites();
  const {
    isJoined,
    getEnrollment,
    joinPlan,
    quitPlan,
    skipPlanDay,
    reschedulePlanDay,
    getOccupiedTrainingDates,
    getPlansOnDate,
    setPendingPlanStart,
  } = usePlan();

  const [expanded, setExpanded] = useState(false);
  const [joinVisible, setJoinVisible] = useState(false);
  const [quitConfirmVisible, setQuitConfirmVisible] = useState(false);
  const [rescheduleVisible, setRescheduleVisible] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedDay, setSelectedDay] = useState(1);

  const item = useMemo(() => getItemById(type, id), [type, id]);
  const favorited = isFavorite(type, id);

  if (!item) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>未找到内容</Text>
          <Pressable accessibilityRole="button" onPress={() => router.back()}>
            <Text style={styles.emptyAction}>返回</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const isPlan = item.kind === "plan";
  const planItem = isPlan ? (item as PlanItem) : null;
  const joined = isPlan ? isJoined(item.id) : false;
  const enrollment = isPlan ? getEnrollment(item.id) : undefined;
  const currentDayStatus =
    isPlan && enrollment
      ? enrollment.dayStatus[planDayKey(selectedWeek, selectedDay)]
      : undefined;
  /** 已加入即展示「更多」（跳过/改期）；已完成日仍可改期，跳过保持禁用 */
  const dayActionsVisible = joined;
  const skipDisabled = currentDayStatus === "skipped" || currentDayStatus === "finished";

  const description = isPlan ? item.intro : item.description;
  const previewText =
    expanded || description.length <= 120
      ? description
      : `${description.slice(0, 120).trim()}...`;

  const tags: DetailTag[] =
    item.kind === "plan"
      ? [
          { value: formatLibraryValue(item.scene), style: "Scene" },
          { value: formatLibraryValue(item.cycleWeeks), style: "Cycle" },
          { value: formatLibraryValue(item.sessionsPerWeek), style: "Count" },
          { value: formatLibraryValue(item.difficulty), style: "Difficulty" },
          { value: formatLibraryValue(item.targetArea), style: "Muscles" },
        ]
      : [
          { value: formatLibraryValue(item.scene), style: "Scene" },
          { value: formatLibraryValue(item.difficulty), style: "Difficulty" },
          { value: formatLibraryValue(item.equipment), style: "Equipment" },
          { value: formatLibraryValue(item.targetArea), style: "Muscles" },
          ...(item.kind === "move" && item.supportsAi
            ? [{ value: "AI", style: "AI" as const }]
            : item.kind === "aiMove"
              ? [{ value: "AI", style: "AI" as const }]
              : []),
        ];

  const openPreview = () => {
    router.push({
      pathname: "/preview/[id]",
      params: { id: item.id, type, title: item.name },
    });
  };

  const handleJoinConfirm = (trainingDays: string[]) => {
    joinPlan(item.id, trainingDays);
    setJoinVisible(false);
    showToast("已加入计划");
  };

  const handleQuitPlan = () => {
    setQuitConfirmVisible(true);
  };

  const handleQuitConfirm = () => {
    quitPlan(item.id);
    setQuitConfirmVisible(false);
    showToast("已退出计划");
  };

  const handleQuitCancel = () => {
    setQuitConfirmVisible(false);
  };

  const handleSkip = () => {
    if (skipDisabled) return;
    confirmAction({
      title: "跳过训练日",
      message: "确定跳过本次训练日？不会影响其他训练日的安排。",
      confirmLabel: "跳过",
      cancelLabel: "取消",
      onConfirm: () => {
        skipPlanDay(item.id, selectedWeek, selectedDay);
        showToast("已跳过该训练日");
      },
    });
  };

  const handleRescheduleConfirm = (dateKey: string) => {
    reschedulePlanDay(item.id, selectedWeek, selectedDay, dateKey);
    setRescheduleVisible(false);
    showToast(`已改期至 ${dateKey}`);
  };

  const handleStartTraining = () => {
    if (!planItem) return;
    setPendingPlanStart({
      planId: planItem.id,
      week: selectedWeek,
      day: selectedDay,
      requestedAt: Date.now(),
    });

    if (selectedDevice?.connection === "connected") {
      // PlanStartCoordinator handles toast + delay + navigation
      return;
    }

    showToast("请先连接设备");
    router.push("/devices");
  };

  const handleMoveStartTraining = () => {
    if (item.kind !== "move") return;
    setPendingMoveStart({
      moveId: item.id,
      moveName: item.name,
      requestedAt: Date.now(),
    });

    if (selectedDevice?.connection === "connected") {
      // MoveStartCoordinator handles toast + delay + navigation
      return;
    }

    showToast("请先连接设备");
    router.push("/devices");
  };

  const handleToggleFavorite = () => {
    const nextFavorited = toggleFavorite(type, id);
    showToast(nextFavorited ? "已收藏" : "已取消收藏");
  };

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroWrap}>
          <LinearGradient colors={item.gradient} style={styles.hero} />
          <SafeAreaView edges={["top"]} style={styles.heroOverlay}>
            <View style={styles.heroControls}>
              <GlassIconButton accessibilityLabel="返回" onPress={() => router.back()}>
                <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
              </GlassIconButton>
              <GlassIconButton
                accessibilityLabel={favorited ? "取消收藏" : "收藏"}
                onPress={handleToggleFavorite}
              >
                <Ionicons
                  name={favorited ? "heart" : "heart-outline"}
                  size={20}
                  color={favorited ? colors.red : colors.textPrimary}
                />
              </GlassIconButton>
            </View>
          </SafeAreaView>
        </View>

        <View style={styles.body}>
          <Text style={styles.name}>{item.name}</Text>
          {item.kind !== "plan" ? (
            <Text style={styles.instructor}>
              {item.kind === "aiMove" ? "AI 指导训练" : "动作库"}
            </Text>
          ) : null}

          <Text style={styles.metaLine}>
            {isPlan
              ? `${formatLibraryValue(item.cycleWeeks)} · ${formatLibraryValue(item.sessionsPerWeek)} · ${formatLibraryValue(item.scene)}`
              : `${item.durationMinutes ?? 10} 分钟 · ${formatLibraryValue(item.scene)} · ${formatLibraryValue(item.difficulty)}`}
          </Text>

          <ContentTagRow tags={tags} />

          {!isPlan ? (
            <ContentDetailActions
              onPreview={openPreview}
              onStartTraining={handleMoveStartTraining}
              startTrainingDisabled={item.kind !== "move"}
              primaryNotice={
                item.kind === "aiMove"
                  ? "AI 动作需要借助设备相机进行动作识别"
                  : undefined
              }
            />
          ) : null}

          <Text style={styles.description}>{previewText}</Text>
          {description.length > 120 ? (
            <Pressable accessibilityRole="button" onPress={() => setExpanded((value) => !value)}>
              <Text style={styles.moreLink}>{expanded ? "收起" : "更多"}</Text>
            </Pressable>
          ) : null}

          {item.kind === "plan" ? (
            <View style={styles.section}>
              <PlanScheduleBrowser
                schedule={item.schedule}
                dayStatusMap={enrollment?.dayStatus}
                rescheduleMap={enrollment?.rescheduleMap}
                onSelectionChange={(week, day) => {
                  setSelectedWeek(week);
                  setSelectedDay(day);
                }}
              />
            </View>
          ) : (
            <View style={styles.section}>
              <DetailAccordion
                items={[
                  {
                    id: "keypoints",
                    title: "执行要点",
                    defaultOpen: true,
                    content: item.keyPoints.map((point) => (
                      <Text key={point} style={styles.bullet}>
                        • {point}
                      </Text>
                    )),
                  },
                  {
                    id: "breathing",
                    title: "呼吸",
                    content: <Text style={styles.bullet}>{item.breathing}</Text>,
                  },
                  {
                    id: "mistakes",
                    title: "常见错误",
                    content: item.commonMistakes.map((mistake) => (
                      <Text key={mistake} style={styles.bullet}>
                        • {mistake}
                      </Text>
                    )),
                  },
                  {
                    id: "installation",
                    title: "安装示意",
                    content: <Text style={styles.bullet}>暂无安装示意</Text>,
                  },
                ]}
              />
            </View>
          )}
        </View>
      </ScrollView>

      {isPlan && planItem ? (
        <PlanDetailActions
          joined={joined}
          onJoin={() => setJoinVisible(true)}
          onStartTraining={handleStartTraining}
          onSkip={handleSkip}
          onReschedule={() => setRescheduleVisible(true)}
          onQuitPlan={handleQuitPlan}
          skipDisabled={skipDisabled}
          dayActionsVisible={dayActionsVisible}
        />
      ) : null}

      {planItem ? (
        <>
          <JoinPlanSheet
            visible={joinVisible}
            sessionsPerWeek={planItem.sessionsPerWeek}
            onClose={() => setJoinVisible(false)}
            onConfirm={handleJoinConfirm}
          />
          <QuitPlanConfirmModal
            visible={quitConfirmVisible}
            onCancel={handleQuitCancel}
            onConfirm={handleQuitConfirm}
          />
          {enrollment ? (
            <ReschedulePlanDayModal
              visible={rescheduleVisible}
              enrollment={enrollment}
              week={selectedWeek}
              day={selectedDay}
              occupiedDates={getOccupiedTrainingDates()}
              getPlansOnDate={getPlansOnDate}
              onClose={() => setRescheduleVisible(false)}
              onConfirm={handleRescheduleConfirm}
            />
          ) : null}
        </>
      ) : null}
    </View>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      paddingBottom: spacing.xxxl,
    },
    heroWrap: {
      height: 320,
      backgroundColor: colors.surface,
    },
    hero: {
      ...StyleSheet.absoluteFillObject,
    },
    heroOverlay: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: "flex-start",
    },
    heroControls: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.sm,
    },
    body: {
      paddingHorizontal: layout.screenPadding,
      paddingTop: spacing.xl,
      gap: spacing.md,
    },
    name: {
      ...typography.title,
      color: colors.textPrimary,
    },
    instructor: {
      ...typography.subtitle,
      fontSize: 18,
      color: colors.accent,
    },
    metaLine: {
      ...typography.caption,
      color: colors.textSecondary,
    },
    description: {
      ...typography.body,
      color: colors.textSecondary,
    },
    moreLink: {
      ...typography.label,
      color: colors.textPrimary,
    },
    section: {
      marginTop: spacing.lg,
      gap: spacing.sm,
    },
    bullet: {
      ...typography.caption,
      color: colors.textSecondary,
      lineHeight: 22,
    },
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    emptyWrap: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.md,
    },
    emptyTitle: {
      ...typography.subtitle,
      color: colors.textPrimary,
    },
    emptyAction: {
      ...typography.body,
      color: colors.accent,
    },
  });
}
