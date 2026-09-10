import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { GlassIconButton } from "@/components/GlassIconButton";
import { GlassSurface } from "@/components/GlassSurface";
import { useToast } from "@/components/ToastProvider";
import { useTheme } from "@/context/ThemeContext";
import { useTraining } from "@/context/TrainingContext";
import { ColorPalette, layout, radius, spacing, typography } from "@/theme";

export default function DeviceDetailScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { id } = useLocalSearchParams<{ id: string }>();
  const { devices, reconnectDevice, disconnectDevice } = useTraining();

  const deviceId =
    typeof id === "string"
      ? decodeURIComponent(id)
      : Array.isArray(id)
        ? decodeURIComponent(id[0])
        : "";
  const device = devices.find((item) => item.id === deviceId);
  const online = device?.connection === "connected";

  const handleConnect = () => {
    if (!device) return;
    const result = reconnectDevice(device.id);
    if (result === "connected") {
      showToast(`${device.name} 连接成功`);
      return;
    }
    showToast("连接失败，请重试");
  };

  const handleDisconnect = () => {
    if (!device) return;
    disconnectDevice(device.id);
    showToast(`${device.name} 已断开`);
  };

  if (!device) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={styles.header}>
          <GlassIconButton accessibilityLabel="返回" onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
          </GlassIconButton>
          <Text style={styles.title}>设备详情</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>设备不存在</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="返回"
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          >
            <Text style={styles.backButtonText}>返回</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <GlassIconButton accessibilityLabel="返回" onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </GlassIconButton>
        <Text style={styles.title} numberOfLines={1}>
          {device.name}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <GlassSurface contentStyle={styles.card}>
          <InfoRow label="设备 SN" value={device.serialNumber} styles={styles} />
          <View style={styles.divider} />
          <InfoRow
            label="连接状态"
            value={online ? "已连接" : "已离线"}
            valueColor={online ? colors.green : colors.textMuted}
            styles={styles}
          />
          <View style={styles.divider} />
          <InfoRow label="当前版本" value={device.currentVersion} styles={styles} />
        </GlassSurface>

        {online ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="断开连接"
            onPress={handleDisconnect}
            style={({ pressed }) => [styles.actionBtn, styles.disconnectBtn, pressed && styles.pressed]}
          >
            <Text style={styles.disconnectBtnText}>断开连接</Text>
          </Pressable>
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="连接设备"
            onPress={handleConnect}
            style={({ pressed }) => [styles.actionBtn, styles.connectBtn, pressed && styles.pressed]}
          >
            <Text style={styles.connectBtnText}>连接设备</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

function InfoRow({
  label,
  value,
  valueColor,
  styles,
}: {
  label: string;
  value: string;
  valueColor?: string;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, valueColor ? { color: valueColor } : null]}>{value}</Text>
    </View>
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
      paddingHorizontal: layout.screenPadding,
      paddingBottom: spacing.md,
      gap: spacing.sm,
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
      paddingHorizontal: layout.screenPadding,
      paddingTop: spacing.sm,
      gap: spacing.lg,
    },
    card: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      borderRadius: radius.lg,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing.md,
      minHeight: 56,
      paddingVertical: spacing.md,
    },
    label: {
      ...typography.body,
      color: colors.textSecondary,
    },
    value: {
      ...typography.subtitle,
      color: colors.textPrimary,
      flexShrink: 1,
      textAlign: "right",
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.glassBorder,
    },
    actionBtn: {
      alignItems: "center",
      justifyContent: "center",
      minHeight: 48,
      borderRadius: radius.md,
      borderWidth: 1,
      paddingVertical: spacing.md,
    },
    connectBtn: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    connectBtnText: {
      ...typography.subtitle,
      color: colors.accentText,
    },
    disconnectBtn: {
      backgroundColor: colors.glass,
      borderColor: colors.glassBorder,
    },
    disconnectBtnText: {
      ...typography.subtitle,
      color: colors.textSecondary,
    },
    emptyWrap: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.lg,
      paddingHorizontal: layout.screenPadding,
    },
    emptyText: {
      ...typography.body,
      color: colors.textMuted,
    },
    backButton: {
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.md,
      borderRadius: radius.md,
      backgroundColor: colors.accent,
    },
    backButtonText: {
      ...typography.subtitle,
      color: colors.accentText,
    },
    pressed: {
      opacity: 0.85,
    },
  });
}
