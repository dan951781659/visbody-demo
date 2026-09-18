import { Platform } from "react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { GlassIconButton } from "@/components/GlassIconButton";
import { ReportActionIcons } from "@/components/training/ReportActionIcons";
import { TrainingReportView } from "@/components/training/TrainingReportView";
import { useToast } from "@/components/ToastProvider";
import { useTheme } from "@/context/ThemeContext";
import { getTrainingRecordById } from "@/data/userMock";
import { ColorPalette, spacing, typography } from "@/theme";
import { saveTrainingReportLongImage } from "@/utils/saveTrainingReportImage";

export default function TrainingRecordDetailScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { showToast } = useToast();
  const { id } = useLocalSearchParams<{ id: string }>();
  const record = id ? getTrainingRecordById(id) : undefined;
  const captureRef = useRef<View>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!record) {
      router.replace("/profile/training-records");
    }
  }, [record, router]);

  const handleSave = useCallback(async () => {
    if (Platform.OS === "web") { router.push("/media-demo?mode=report"); return; }
    if (saving) return;
    setSaving(true);
    const result = await saveTrainingReportLongImage(captureRef);
    setSaving(false);
    if (result.ok) {
      showToast("长图已保存到相册");
      return;
    }
    showToast(result.message);
  }, [saving, showToast, router]);

  if (!record?.report) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <View style={styles.headerSide}>
          <GlassIconButton accessibilityLabel="返回" onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
          </GlassIconButton>
        </View>
        <Text style={styles.title}>训练报告</Text>
        <View style={[styles.headerSide, styles.headerSideEnd]}>
          <ReportActionIcons saving={saving} onSaveLongImage={handleSave} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <TrainingReportView
          report={record.report}
          captureRef={captureRef}
          mode="history"
        />
      </ScrollView>
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
      paddingHorizontal: 20,
      paddingTop: spacing.xs,
      paddingBottom: spacing.sm,
      gap: spacing.sm,
    },
    headerSide: {
      width: 100,
      flexDirection: "row",
      alignItems: "center",
    },
    headerSideEnd: {
      justifyContent: "flex-end",
    },
    title: {
      ...typography.subtitle,
      color: colors.textPrimary,
      flex: 1,
      textAlign: "center",
    },
    content: {
      paddingHorizontal: 20,
      paddingBottom: spacing.xxxl,
    },
  });
}
