import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { DigitText } from "@/components/DigitText";
import { GlassButton } from "@/components/GlassButton";
import { GlassIconButton } from "@/components/GlassIconButton";
import { GlassSurface } from "@/components/GlassSurface";
import { useToast } from "@/components/ToastProvider";
import { useTheme } from "@/context/ThemeContext";
import { useTraining } from "@/context/TrainingContext";
import { ColorPalette, layout, radius, spacing, typography } from "@/theme";

export default function ConnectQrScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { addDevice } = useTraining();
  const { device } = useLocalSearchParams<{ device?: string }>();
  const deviceName = typeof device === "string" && device.length > 0 ? device : "MS-5502";

  const handleMockLoginSuccess = () => {
    addDevice(deviceName);
    showToast("已添加并连接成功");
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <GlassIconButton accessibilityLabel="返回" onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </GlassIconButton>
        <Text style={styles.title}>扫码登录</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <DigitText style={styles.deviceName}>{deviceName}</DigitText>
        <Text style={styles.hint}>请在设备屏幕扫描二维码完成登录</Text>

        <GlassSurface contentStyle={styles.qrCard}>
          <View style={styles.qrPlaceholder}>
            <Ionicons name="qr-code-outline" size={120} color={colors.textPrimary} />
          </View>
          <Text style={styles.qrCaption}>设备端二维码占位（演示）</Text>
        </GlassSurface>

        <Text style={styles.note}>
          原型演示：点击下方按钮模拟扫码登录成功，设备将加入「我的设备」并设为已连接。
        </Text>

        <GlassButton onPress={handleMockLoginSuccess}>
          <Text style={styles.ctaText}>模拟登录成功</Text>
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
    ...typography.sectionTitle,
    color: colors.textPrimary,
  },
  headerSpacer: {
    width: 44,
  },
  content: {
    flex: 1,
    paddingHorizontal: layout.screenPadding,
    paddingBottom: spacing.xxxl,
    gap: spacing.lg,
  },
  deviceName: {
    ...typography.title,
    color: colors.textPrimary,
    textAlign: "center",
  },
  hint: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: -spacing.sm,
  },
  qrCard: {
    alignItems: "center",
    padding: spacing.xxl,
    gap: spacing.lg,
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
  qrCaption: {
    ...typography.caption,
    color: colors.textMuted,
  },
  note: {
    ...typography.caption,
    color: colors.textMuted,
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
  });
}
