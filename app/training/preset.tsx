import { useMemo, useState } from "react";
import { Alert, ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { GlassIconButton } from "@/components/GlassIconButton";
import { PresetForm } from "@/components/training/PresetForm";
import { useTheme } from "@/context/ThemeContext";
import { useTraining } from "@/context/TrainingContext";
import { searchMotionStationDevice } from "@/data/trainingMock";
import { ColorPalette, layout, spacing, typography } from "@/theme";
import { Ionicons } from "@expo/vector-icons";

export default function TrainingPresetScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { preset, selectedDevice, startSession } = useTraining();
  const [searching, setSearching] = useState(false);

  const handleStart = async () => {
    if (!preset || searching) return;

    setSearching(true);
    try {
      const result = await searchMotionStationDevice(selectedDevice);
      if (!result.found) {
        const isOffline = selectedDevice.connection !== "connected";
        Alert.alert(
          isOffline ? "设备未连接" : "未找到设备",
          isOffline
            ? "请先在「我的设备」中连接 MotionStation，然后重试。"
            : "请确认 MotionStation 已开机并在同一局域网内，然后重试。",
          [{ text: "知道了" }],
        );
        return;
      }
      startSession();
      router.push("/training/session");
    } finally {
      setSearching(false);
    }
  };

  if (!preset) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.fallback}>请先选择训练模式</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <GlassIconButton accessibilityLabel="返回" onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </GlassIconButton>
        <View style={styles.headerText}>
          <Text style={styles.title}>设备预设</Text>
          <Text style={styles.subtitle}>MotionStation · 自由训练</Text>
        </View>
      </View>

      {searching ? (
        <View style={styles.searchBanner}>
          <ActivityIndicator color={colors.accent} />
          <Text style={styles.searchText}>正在搜索 MotionStation…</Text>
        </View>
      ) : null}

      <View style={styles.form}>
        <PresetForm searching={searching} onStartPress={handleStart} />
      </View>
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
  searchBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    backgroundColor: colors.accentGlass,
    marginHorizontal: layout.screenPadding,
    borderRadius: 12,
    marginBottom: spacing.md,
  },
  searchText: {
    ...typography.caption,
    color: colors.accent,
  },
  form: {
    flex: 1,
    paddingHorizontal: layout.screenPadding,
  },
  fallback: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: spacing.xxxl,
  },
  });
}
