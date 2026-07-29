import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { GlassButton } from "@/components/GlassButton";
import { GlassIconButton } from "@/components/GlassIconButton";
import { GlassSurface } from "@/components/GlassSurface";
import { useTheme } from "@/context/ThemeContext";
import { useTraining } from "@/context/TrainingContext";
import { authCopy } from "@/data/authCopy";
import { ColorPalette, layout, spacing, typography } from "@/theme";

type ExpiredReason = keyof typeof authCopy.expired.reasons;

function resolveReason(raw?: string): ExpiredReason {
  if (raw && raw in authCopy.expired.reasons) {
    return raw as ExpiredReason;
  }
  return "invalid";
}

export default function ConnectExpiredScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { clearPendingDeviceLogin } = useTraining();
  const { reason: reasonParam } = useLocalSearchParams<{ reason?: string }>();
  const reason = resolveReason(typeof reasonParam === "string" ? reasonParam : undefined);

  const handleRescan = () => {
    clearPendingDeviceLogin();
    router.replace("/connect/scan");
  };

  const handleHome = () => {
    clearPendingDeviceLogin();
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <GlassIconButton accessibilityLabel="返回" onPress={handleHome}>
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </GlassIconButton>
        <Text style={styles.title}>{authCopy.expired.title}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <GlassSurface contentStyle={styles.card}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.orange} />
          <Text style={styles.subtitle}>{authCopy.expired.subtitle}</Text>
          <Text style={styles.reason}>{authCopy.expired.reasons[reason]}</Text>
        </GlassSurface>

        <GlassButton onPress={handleRescan}>
          <Text style={styles.ctaText}>{authCopy.expired.rescan}</Text>
        </GlassButton>
        <GlassButton onPress={handleHome}>
          <Text style={styles.secondaryText}>{authCopy.expired.home}</Text>
        </GlassButton>
      </View>
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
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.subtitle,
    color: colors.textPrimary,
    flex: 1,
    textAlign: "center",
  },
  headerSpacer: {
    width: 44,
  },
  content: {
    flex: 1,
    paddingHorizontal: layout.screenPadding,
    gap: spacing.lg,
  },
  card: {
    alignItems: "center",
    padding: spacing.xxl,
    gap: spacing.md,
  },
  subtitle: {
    ...typography.subtitle,
    color: colors.textPrimary,
    textAlign: "center",
  },
  reason: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  ctaText: {
    ...typography.subtitle,
    color: colors.accentText,
    textAlign: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  secondaryText: {
    ...typography.subtitle,
    color: colors.textSecondary,
    textAlign: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  });
}
