import { useEffect, useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { GlassIconButton } from "@/components/GlassIconButton";
import { MoveTrainingSessionControls } from "@/components/training/MoveTrainingSessionControls";
import { useToast } from "@/components/ToastProvider";
import { useTheme } from "@/context/ThemeContext";
import { useTraining } from "@/context/TrainingContext";
import { useUser } from "@/context/UserContext";
import { buildTrainingReport } from "@/data/trainingMock";
import { confirmAction } from "@/utils/confirmAction";
import { ColorPalette, layout, spacing, typography } from "@/theme";

export default function MoveTrainingSessionScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { showToast } = useToast();
  const { user } = useUser();
  const { moveFollowSession, endMoveSession, publishReport } = useTraining();

  useEffect(() => {
    if (!moveFollowSession) {
      router.replace("/(tabs)/explore");
    }
  }, [moveFollowSession, router]);

  const handleEndPress = () => {
    confirmAction({
      title: "结束训练",
      message: "确定要结束本次动作跟练并查看报告吗？",
      confirmLabel: "结束训练",
      cancelLabel: "取消",
      destructive: true,
      onConfirm: () => {
        const ended = endMoveSession();
        if (!ended) return;

        const report = buildTrainingReport({
          preset: ended.preset,
          durationSeconds: Math.max(ended.elapsedSeconds, 60),
          userName: user?.nickname ?? "运动达人",
          userAvatar: user?.avatarInitials ?? "运",
          source: "movement_follow",
          scene: "movement",
          sceneLabel: "动作跟练",
          title: ended.moveName,
          finalAiScore: 88,
          accuracyDistribution: { better: 14, good: 36, perfect: 50 },
          planMoves: [
            {
              name: ended.moveName,
              targetSets: 3,
              targetReps: 12,
              actualSets: 3,
              actualReps: 36,
              durationSeconds: Math.max(ended.elapsedSeconds, 60),
              aiSupported: false,
            },
          ],
        });

        publishReport(report);
        showToast("训练已结束");
        router.replace({
          pathname: "/training/report",
          params: {
            returnTo: `/content/moves/${ended.moveId}`,
          },
        });
      },
    });
  };

  if (!moveFollowSession) return null;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <GlassIconButton accessibilityLabel="返回" onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </GlassIconButton>
        <View style={styles.headerText}>
          <Text style={styles.title}>动作训练控制</Text>
          <Text style={styles.subtitle}>{moveFollowSession.moveName} · MotionStation</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <MoveTrainingSessionControls onEndPress={handleEndPress} />
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
