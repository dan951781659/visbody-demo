import { useEffect, useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { GlassIconButton } from "@/components/GlassIconButton";
import { PlanTrainingSessionControls } from "@/components/training/PlanTrainingSessionControls";
import { useToast } from "@/components/ToastProvider";
import { usePlan } from "@/context/PlanContext";
import { useTheme } from "@/context/ThemeContext";
import { useTraining } from "@/context/TrainingContext";
import { useUser } from "@/context/UserContext";
import { buildTrainingReport, createDefaultPreset } from "@/data/trainingMock";
import { confirmAction } from "@/utils/confirmAction";
import { ColorPalette, layout, spacing, typography } from "@/theme";

export default function PlanTrainingSessionScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { showToast } = useToast();
  const { user } = useUser();
  const { publishReport } = useTraining();
  const { planSession, endPlanSession, markPlanDayFinished } = usePlan();

  useEffect(() => {
    if (!planSession) {
      router.replace("/(tabs)/explore");
    }
  }, [planSession, router]);

  const handleEndPress = () => {
    confirmAction({
      title: "结束训练",
      message: "确定要结束本次计划训练并查看报告吗？",
      confirmLabel: "结束训练",
      cancelLabel: "取消",
      destructive: true,
      onConfirm: () => {
        const ended = endPlanSession();
        if (!ended) return;

        markPlanDayFinished(ended.planId, ended.week, ended.day);

        const report = buildTrainingReport({
          preset: createDefaultPreset("strength"),
          durationSeconds: Math.max(ended.elapsedSeconds, 60),
          userName: user?.nickname ?? "运动达人",
          userAvatar: user?.avatarInitials ?? "运",
          source: "plan_follow",
          scene: "plan-training",
          sceneLabel: "计划训练",
          title: ended.planName,
          planName: ended.planName,
          planDayName: `第 ${ended.week} 周 · 第 ${ended.day} 天`,
          finalAiScore: 90,
          accuracyDistribution: { better: 16, good: 32, perfect: 52 },
          planMoves: ended.moves.map((move, index) => {
            const completed = index <= ended.moveIndex;
            const targetSets = move.sets;
            const targetReps = Number.parseInt(String(move.repsOrDuration).replace(/\D/g, ""), 10) || 12;
            return {
              name: move.name,
              targetSets,
              targetReps,
              actualSets: completed ? targetSets : Math.max(1, Math.floor(targetSets * 0.6)),
              actualReps: completed ? targetSets * targetReps : Math.max(targetReps, Math.floor(targetSets * targetReps * 0.6)),
              durationSeconds: Math.max(45, Math.round((ended.elapsedSeconds || 60) / Math.max(ended.moves.length, 1))),
              aiSupported: index % 2 === 0,
              aiQuality:
                index % 2 === 0
                  ? {
                      perfectRate: 76 + (index % 4) * 4,
                      summary: `${move.name} 完成度良好，注意保持稳定节奏。`,
                      topErrors: [
                        { label: "节奏偏快", percent: 10 },
                        { label: "幅度不足", percent: 7 },
                      ],
                    }
                  : undefined,
            };
          }),
        });

        publishReport(report);
        showToast("训练已结束");
        router.replace({
          pathname: "/training/report",
          params: {
            returnTo: `/content/plans/${ended.planId}`,
          },
        });
      },
    });
  };

  if (!planSession) return null;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <GlassIconButton accessibilityLabel="返回" onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </GlassIconButton>
        <View style={styles.headerText}>
          <Text style={styles.title}>计划训练控制</Text>
          <Text style={styles.subtitle}>{planSession.planName} · MotionStation</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <PlanTrainingSessionControls onEndPress={handleEndPress} />
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      paddingHorizontal: layout.screenPadding,
      paddingBottom: spacing.md,
    },
    headerText: {
      flex: 1,
      gap: spacing.xs,
    },
    title: {
      ...typography.subtitle,
      color: colors.textPrimary,
    },
    subtitle: {
      ...typography.caption,
      color: colors.textMuted,
    },
    content: {
      paddingHorizontal: layout.screenPadding,
      paddingBottom: spacing.xxxl,
    },
  });
}
