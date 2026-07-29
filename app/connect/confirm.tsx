import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { DigitText } from "@/components/DigitText";
import { GlassButton } from "@/components/GlassButton";
import { GlassIconButton } from "@/components/GlassIconButton";
import { GlassSurface } from "@/components/GlassSurface";
import { UserAvatar } from "@/components/profile/UserAvatar";
import { useToast } from "@/components/ToastProvider";
import { useTheme } from "@/context/ThemeContext";
import { useTraining } from "@/context/TrainingContext";
import { useUser } from "@/context/UserContext";
import { authCopy } from "@/data/authCopy";
import { DeviceLoginSession } from "@/types/training";
import { ColorPalette, layout, spacing, typography } from "@/theme";

export default function ConnectConfirmScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { isLoggedIn, user } = useUser();
  const {
    pendingDeviceLogin,
    validateDeviceLoginSession,
    confirmDeviceLogin,
    cancelDeviceLogin,
    clearPendingDeviceLogin,
  } = useTraining();
  const { sessionId: sessionIdParam } = useLocalSearchParams<{ sessionId?: string }>();
  const [submitting, setSubmitting] = useState(false);
  const [session, setSession] = useState<DeviceLoginSession | null>(null);
  const [ready, setReady] = useState(false);

  const sessionId = useMemo(() => {
    if (typeof sessionIdParam === "string" && sessionIdParam.length > 0) {
      return sessionIdParam;
    }
    return pendingDeviceLogin?.sessionId ?? "";
  }, [pendingDeviceLogin?.sessionId, sessionIdParam]);

  useEffect(() => {
    if (!isLoggedIn || !user) {
      setReady(true);
      return;
    }
    if (!sessionId) {
      router.replace("/connect/expired?reason=invalid");
      return;
    }
    const result = validateDeviceLoginSession(sessionId);
    if (!result.ok) {
      clearPendingDeviceLogin();
      router.replace(`/connect/expired?reason=${result.reason}`);
      return;
    }
    setSession(result.session);
    setReady(true);
  }, [
    clearPendingDeviceLogin,
    isLoggedIn,
    router,
    sessionId,
    user,
    validateDeviceLoginSession,
  ]);

  const handleConfirm = () => {
    if (submitting || !session || !user) return;
    setSubmitting(true);
    const result = confirmDeviceLogin(session.id, {
      userId: user.id,
      userNickname: user.nickname,
    });
    if (!result.ok) {
      setSubmitting(false);
      clearPendingDeviceLogin();
      router.replace(`/connect/expired?reason=${result.reason}`);
      return;
    }
    showToast(authCopy.scan.deviceLoginSuccess);
    setTimeout(() => {
      router.replace("/(tabs)");
    }, 700);
  };

  const handleCancel = () => {
    if (session) {
      cancelDeviceLogin(session.id);
    }
    clearPendingDeviceLogin();
    router.replace("/(tabs)");
  };

  if (!ready) {
    return <SafeAreaView style={styles.safeArea} edges={["top"]} />;
  }

  if (!isLoggedIn || !user) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.header}>
          <GlassIconButton accessibilityLabel="返回" onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
          </GlassIconButton>
          <Text style={styles.title}>{authCopy.confirmLogin.title}</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.content}>
          <Text style={styles.hint}>{authCopy.scan.loginRequired}</Text>
          <GlassButton onPress={() => router.replace("/login")}>
            <Text style={styles.ctaText}>去登录</Text>
          </GlassButton>
        </View>
      </SafeAreaView>
    );
  }

  if (!session) {
    return <SafeAreaView style={styles.safeArea} edges={["top"]} />;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <GlassIconButton accessibilityLabel="返回" onPress={handleCancel}>
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </GlassIconButton>
        <Text style={styles.title}>{authCopy.confirmLogin.title}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <Text style={styles.hint}>{authCopy.confirmLogin.hint}</Text>

        <GlassSurface contentStyle={styles.card}>
          <Text style={styles.label}>{authCopy.confirmLogin.deviceLabel}</Text>
          <DigitText style={styles.deviceName}>{session.deviceName}</DigitText>
        </GlassSurface>

        <GlassSurface contentStyle={styles.card}>
          <Text style={styles.label}>{authCopy.confirmLogin.accountLabel}</Text>
          <View style={styles.userRow}>
            <UserAvatar
              initials={user.avatarInitials}
              backgroundColor={user.avatarColor}
              size={48}
            />
            <View style={styles.userText}>
              <Text style={styles.userName}>{user.nickname}</Text>
              <Text style={styles.userMeta}>{user.accountSummary}</Text>
            </View>
          </View>
        </GlassSurface>

        <GlassButton onPress={handleConfirm}>
          <Text style={[styles.ctaText, submitting && styles.disabledText]}>
            {submitting ? authCopy.confirmLogin.confirming : authCopy.confirmLogin.confirm}
          </Text>
        </GlassButton>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={authCopy.confirmLogin.cancel}
          disabled={submitting}
          onPress={handleCancel}
          style={({ pressed }) => [styles.cancelButton, (pressed || submitting) && styles.disabledText]}
        >
          <Text style={styles.cancelText}>{authCopy.confirmLogin.cancel}</Text>
        </Pressable>
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
  hint: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: "center",
  },
  card: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  label: {
    ...typography.label,
    color: colors.textMuted,
  },
  deviceName: {
    ...typography.title,
    color: colors.textPrimary,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  userText: {
    flex: 1,
    gap: spacing.xs,
  },
  userName: {
    ...typography.subtitle,
    color: colors.textPrimary,
  },
  userMeta: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  ctaText: {
    ...typography.subtitle,
    color: colors.accentText,
    textAlign: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  cancelButton: {
    alignSelf: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  cancelText: {
    ...typography.subtitle,
    color: colors.textSecondary,
    textAlign: "center",
  },
  disabledText: {
    opacity: 0.6,
  },
  });
}
