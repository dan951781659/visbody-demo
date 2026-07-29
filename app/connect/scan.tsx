import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { GlassIconButton } from "@/components/GlassIconButton";
import { useAuthStyles } from "@/components/auth/authStyles";
import { useToast } from "@/components/ToastProvider";
import { useTheme } from "@/context/ThemeContext";
import { useTraining } from "@/context/TrainingContext";
import { useUser } from "@/context/UserContext";
import { authCopy } from "@/data/authCopy";
import { ColorPalette, spacing, typography } from "@/theme";

const QR_SIZE = 180;
const AUTO_SCAN_DELAY_MS = 2200;

export default function ConnectScanScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const { colors } = useTheme();
  const authStyles = useAuthStyles();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { isLoggedIn } = useUser();
  const {
    ensureDeviceLoginSession,
    scanDeviceQr,
    setPendingDeviceLogin,
  } = useTraining();
  const completedRef = useRef(false);
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const [busy, setBusy] = useState(false);

  const routeAfterScan = useCallback(
    (sessionId: string, deviceId: string, deviceName: string, expiresAt: number) => {
      if (!isLoggedIn) {
        setPendingDeviceLogin({ sessionId, deviceId, deviceName, expiresAt });
        showToast(authCopy.scan.loginRequired);
        router.replace("/login");
        return;
      }
      router.replace(`/connect/confirm?sessionId=${encodeURIComponent(sessionId)}`);
    },
    [isLoggedIn, router, setPendingDeviceLogin, showToast],
  );

  const completeScan = useCallback(() => {
    if (completedRef.current || busy) return;
    completedRef.current = true;
    setBusy(true);

    ensureDeviceLoginSession();
    const result = scanDeviceQr();
    if (!result.ok) {
      completedRef.current = false;
      setBusy(false);
      router.replace(`/connect/expired?reason=${result.reason}`);
      return;
    }

    showToast(authCopy.scan.validating);
    routeAfterScan(
      result.session.id,
      result.session.deviceId,
      result.session.deviceName,
      result.session.expiresAt,
    );
  }, [busy, ensureDeviceLoginSession, routeAfterScan, router, scanDeviceQr, showToast]);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();

    const timer = setTimeout(() => {
      completeScan();
    }, AUTO_SCAN_DELAY_MS);

    return () => {
      animation.stop();
      clearTimeout(timer);
    };
  }, [completeScan, scanLineAnim]);

  const scanLineTranslateY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [12, QR_SIZE - 14],
  });

  return (
    <SafeAreaView style={authStyles.screen} edges={["top", "bottom"]}>
      <View style={authStyles.headerBar}>
        <GlassIconButton accessibilityLabel="返回" onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </GlassIconButton>
      </View>

      <View style={authStyles.scanBody}>
        <Text style={styles.pageTitle}>{authCopy.scan.title}</Text>
        <Text style={authStyles.scanHint}>{authCopy.scan.hint}</Text>

        <View style={authStyles.scanFrame} accessibilityLabel="扫码取景框">
          <View style={[authStyles.scanFrameCorner, authStyles.scanFrameCornerTL]} />
          <View style={[authStyles.scanFrameCorner, authStyles.scanFrameCornerTR]} />
          <View style={[authStyles.scanFrameCorner, authStyles.scanFrameCornerBL]} />
          <View style={[authStyles.scanFrameCorner, authStyles.scanFrameCornerBR]} />

          <View style={authStyles.scanQrPlaceholder}>
            <Ionicons name="qr-code-outline" size={96} color={colors.textMuted} />
            <Animated.View
              style={[
                authStyles.scanLine,
                { transform: [{ translateY: scanLineTranslateY }] },
              ]}
            />
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={authCopy.scan.mockButton}
          disabled={busy}
          onPress={completeScan}
          style={({ pressed }) => [
            authStyles.primaryButton,
            styles.mockButton,
            (pressed || busy) && { opacity: 0.9 },
          ]}
        >
          <Text style={authStyles.primaryButtonText}>
            {busy ? authCopy.scan.validating : authCopy.scan.mockButton}
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={authCopy.deviceQr.demoEntry}
          onPress={() => router.push("/connect/device-qr")}
          style={({ pressed }) => [styles.demoLink, pressed && { opacity: 0.85 }]}
        >
          <Ionicons name="desktop-outline" size={18} color={colors.accent} />
          <Text style={styles.demoLinkText}>{authCopy.deviceQr.demoEntry}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    pageTitle: {
      ...typography.title,
      color: colors.textPrimary,
      textAlign: "center",
    },
    mockButton: {
      alignSelf: "stretch",
      marginHorizontal: spacing.xl,
      marginTop: spacing.md,
    },
    demoLink: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.xs,
      marginTop: spacing.sm,
      paddingVertical: spacing.sm,
    },
    demoLinkText: {
      ...typography.caption,
      color: colors.accent,
    },
  });
}
