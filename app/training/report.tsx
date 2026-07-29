import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { TrainingReportView } from "@/components/training/TrainingReportView";
import { useTraining } from "@/context/TrainingContext";
import { colors, layout, spacing } from "@/theme";
import { useEffect } from "react";

export default function TrainingReportScreen() {
  const router = useRouter();
  const { lastReport, clearSession } = useTraining();

  useEffect(() => {
    if (!lastReport) {
      router.replace("/(tabs)");
    }
  }, [lastReport, router]);

  const handleGoHome = () => {
    clearSession();
    router.replace("/(tabs)");
  };

  if (!lastReport) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <TrainingReportView report={lastReport} onGoHome={handleGoHome} />
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
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
});
