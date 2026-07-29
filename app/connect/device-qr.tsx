import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { DigitText } from "@/components/DigitText";
import { GlassIconButton } from "@/components/GlassIconButton";
import { GlassSurface } from "@/components/GlassSurface";
import { UserAvatar } from "@/components/profile/UserAvatar";
import { useToast } from "@/components/ToastProvider";
import { useTheme } from "@/context/ThemeContext";
import { useTraining } from "@/context/TrainingContext";
import { formatCountdown } from "@/data/deviceLoginMock";
import { authCopy } from "@/data/authCopy";
import { ColorPalette, layout, radius, spacing, typography } from "@/theme";

export default function DeviceQrScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const {
    deviceLoginSession,
    ensureDeviceLoginSession,
    refreshDeviceQrSession,
    syncDeviceLoginSession,
  } = useTraining();
  const [countdown, setCountdown] = useState("05:00");

  useEffect(() => {
    ensureDeviceLoginSession();
  }, [ensureDeviceLoginSession]);

  useEffect(() => {
    const timer = setInterval(() => {
      const session = syncDeviceLoginSession();
      if (!session) {
        const refreshed = refreshDeviceQrSession();
        setCountdown(formatCountdown(refreshed.expiresAt));
        showToast(authCopy.deviceQr.refreshHint);
        return;
      }

      if (session.status === "expired" || session.status === "cancelled") {
        const refreshed = refreshDeviceQrSession();
        setCountdown(formatCountdown(refreshed.expiresAt));
        showToast(authCopy.deviceQr.refreshHint);
        return;
      }

      if (session.status === "active" || session.status === "scanned") {
        if (Date.now() >= session.expiresAt) {
          const refreshed = refreshDeviceQrSession();
          setCountdown(formatCountdown(refreshed.expiresAt));
          showToast(authCopy.deviceQr.refreshHint);
          return;
        }
        setCountdown(formatCountdown(session.expiresAt));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [refreshDeviceQrSession, showToast, syncDeviceLoginSession]);

  const session = deviceLoginSession;
  const status = session?.status ?? "active";

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <GlassIconButton accessibilityLabel="返回" onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </GlassIconButton>
        <Text style={styles.title}>{authCopy.deviceQr.title}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <DigitText style={styles.deviceName}>{session?.deviceName ?? "MS-5502"}</DigitText>
        <Text style={styles.subtitle}>{authCopy.deviceQr.subtitle}</Text>

        {status === "confirmed" ? (
          <GlassSurface contentStyle={styles.successCard}>
            <UserAvatar
              initials={(session?.userNickname ?? "用").slice(0, 1)}
              backgroundColor={colors.green}
              size={72}
            />
            <Text style={styles.successTitle}>{authCopy.deviceQr.confirmed}</Text>
            <Text style={styles.successUser}>{session?.userNickname ?? "当前用户"}</Text>
          </GlassSurface>
        ) : null}

        {status === "scanned" ? (
          <GlassSurface contentStyle={styles.statusCard}>
            <Ionicons name="phone-portrait-outline" size={40} color={colors.accent} />
            <Text style={styles.statusTitle}>{authCopy.deviceQr.scanned}</Text>
            <Text style={styles.statusHint}>请勿关闭本页，等待手机确认</Text>
          </GlassSurface>
        ) : null}

        {status === "active" || status === "expired" || status === "cancelled" ? (
          <GlassSurface contentStyle={styles.qrCard}>
            <View style={styles.qrPlaceholder}>
              <Ionicons name="qr-code-outline" size={120} color={colors.textPrimary} />
            </View>
            <Text style={styles.countdownLabel}>{authCopy.deviceQr.countdownLabel}</Text>
            <DigitText style={styles.countdown}>{countdown}</DigitText>
            <Text style={styles.sessionId}>会话 {session?.id.slice(-8) ?? "--------"}</Text>
          </GlassSurface>
        ) : null}
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
  deviceName: {
    ...typography.title,
    color: colors.textPrimary,
    textAlign: "center",
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: -spacing.sm,
  },
  qrCard: {
    alignItems: "center",
    padding: spacing.xxl,
    gap: spacing.md,
  },
  qrPlaceholder: {
    width: 200,
    height: 200,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  countdownLabel: {
    ...typography.label,
    color: colors.textMuted,
  },
  countdown: {
    fontSize: 36,
    color: colors.accent,
  },
  sessionId: {
    ...typography.caption,
    color: colors.textMuted,
  },
  statusCard: {
    alignItems: "center",
    padding: spacing.xxl,
    gap: spacing.md,
  },
  statusTitle: {
    ...typography.subtitle,
    color: colors.textPrimary,
    textAlign: "center",
  },
  statusHint: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: "center",
  },
  successCard: {
    alignItems: "center",
    padding: spacing.xxl,
    gap: spacing.md,
  },
  successTitle: {
    ...typography.title,
    color: colors.green,
  },
  successUser: {
    ...typography.subtitle,
    color: colors.textPrimary,
  },
  });
}
