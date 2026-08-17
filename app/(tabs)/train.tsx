import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { TrainingModeCard } from "@/components/training/TrainingModeCard";
import { useTraining } from "@/context/TrainingContext";
import { FREE_TRAINING_OPTIONS } from "@/data/trainingMock";
import { colors, layout, spacing, typography } from "@/theme";

export default function TrainScreen() {
  const router = useRouter();
  const { selectTrainingType } = useTraining();

  const handleSelectTraining = (type: (typeof FREE_TRAINING_OPTIONS)[number]["id"]) => {
    selectTrainingType(type);
    router.push("/training/preset");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>自由训练</Text>
        <Text style={styles.hint}>选择训练模式后进入设备预设页面</Text>
        <View style={styles.modeList}>
          {FREE_TRAINING_OPTIONS.map((option) => (
            <TrainingModeCard
              key={option.id}
              option={option}
              onPress={() => handleSelectTraining(option.id)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.md,
    paddingBottom: layout.tabScreenBottomInset + spacing.xl,
  },
  pageTitle: {
    ...typography.sectionTitle,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  hint: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  modeList: {
    gap: spacing.md,
  },
});
