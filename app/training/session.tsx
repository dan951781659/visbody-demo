import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { GlassIconButton } from "@/components/GlassIconButton";
import { TrainingSessionControls } from "@/components/training/TrainingSessionControls";
import { useTraining } from "@/context/TrainingContext";
import { TRAINING_TYPE_LABELS } from "@/data/trainingMock";
import { colors, layout, spacing, typography } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";

export default function TrainingSessionScreen() {
  const router = useRouter();
  const { activeSession, endSession } = useTraining();

  useEffect(() => {
    if (!activeSession) {
      router.replace("/(tabs)/train");
    }
  }, [activeSession, router]);

  const handleEndPress = () => {
    Alert.alert("结束训练", "确定要结束本次训练并查看报告吗？", [
      { text: "取消", style: "cancel" },
      {
        text: "结束训练",
        style: "destructive",
        onPress: () => {
          const report = endSession();
          if (report) {
            router.replace("/training/report");
          }
        },
      },
    ]);
  };

  if (!activeSession) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <GlassIconButton accessibilityLabel="返回" onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </GlassIconButton>
        <View style={styles.headerText}>
          <Text style={styles.title}>实时训练</Text>
          <Text style={styles.subtitle}>
            {TRAINING_TYPE_LABELS[activeSession.preset.trainingType]} · MotionStation
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <TrainingSessionControls onEndPress={handleEndPress} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
