import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ReportActionIcons } from "@/components/training/ReportActionIcons";
import { TrainingReportView } from "@/components/training/TrainingReportView";
import { useToast } from "@/components/ToastProvider";
import { useTraining } from "@/context/TrainingContext";
import { useUser } from "@/context/UserContext";
import { useTheme } from "@/context/ThemeContext";
import { ColorPalette, spacing, typography } from "@/theme";
import { saveTrainingReportLongImage } from "@/utils/saveTrainingReportImage";

export default function TrainingReportScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { showToast } = useToast();
  const { user } = useUser();
  const { lastReport, clearSession, clearReport } = useTraining();
  const params = useLocalSearchParams<{ returnTo?: string }>();
  const captureRef = useRef<View>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!lastReport) {
      router.replace("/(tabs)");
    }
  }, [lastReport, router]);

  const enrichedReport = useMemo(() => {
    if (!lastReport) return null;
    if (!user) return lastReport;
    return {
      ...lastReport,
      userName: user.nickname,
      userAvatar: user.avatarInitials.slice(0, 1).toUpperCase(),
    };
  }, [lastReport, user]);

  const handleGoHome = useCallback(() => {
    clearSession();
    clearReport();
    const returnTo = typeof params.returnTo === "string" ? params.returnTo : undefined;
    if (returnTo) {
      router.replace(returnTo as never);
      return;
    }
    router.replace("/(tabs)");
  }, [clearReport, clearSession, params.returnTo, router]);

  const handleSave = useCallback(async () => {
    if (saving) return;
    setSaving(true);
    const result = await saveTrainingReportLongImage(captureRef);
    setSaving(false);
    if (result.ok) {
      showToast("长图已保存到相册");
      return;
    }
    showToast(result.message);
  }, [saving, showToast]);

  if (!enrichedReport) {
    return null;
  }

  const returnTo = typeof params.returnTo === "string" ? params.returnTo : "";
  const primaryLabel = returnTo.includes("/content/") ? "返回计划详情" : "返回首页";

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Text style={styles.title}>训练报告</Text>
        <ReportActionIcons saving={saving} onSaveLongImage={handleSave} />
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <TrainingReportView
          report={enrichedReport}
          captureRef={captureRef}
          mode="session"
          onPrimaryAction={handleGoHome}
          primaryActionLabel={primaryLabel}
        />
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
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingTop: spacing.xs,
      paddingBottom: spacing.sm,
    },
    title: {
      ...typography.subtitle,
      color: colors.textPrimary,
    },
    content: {
      paddingHorizontal: 20,
      paddingBottom: spacing.xxxl,
    },
  });
}
