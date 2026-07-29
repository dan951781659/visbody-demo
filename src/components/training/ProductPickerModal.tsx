import { useEffect, useMemo, useRef, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { RadarScan } from "@/components/training/RadarScan";
import { SwipeableDisconnectRow } from "@/components/training/SwipeableDisconnectRow";
import { useToast } from "@/components/ToastProvider";
import { useTheme } from "@/context/ThemeContext";
import { useTraining } from "@/context/TrainingContext";
import { Device, NearbyDevice } from "@/types/training";
import { ColorPalette, radius, spacing, typography } from "@/theme";

type PickerMode = "list" | "scanning" | "found";

type ProductPickerModalProps = {
  visible: boolean;
  onClose: () => void;
};

const SCAN_DURATION_MS = 2500;
const LAN_HINT = "手机与 Motion 设备需在同一局域网内";

export function ProductPickerModal({ visible, onClose }: ProductPickerModalProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const {
    devices,
    selectedDevice,
    selectDevice,
    reconnectDevice,
    disconnectDevice,
    nearbyDevices,
    addDevice,
  } = useTraining();
  const [mode, setMode] = useState<PickerMode>("list");
  const [failedDeviceId, setFailedDeviceId] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const connectedDevices = useMemo(
    () => devices.filter((device) => device.connection === "connected"),
    [devices],
  );
  const offlineDevices = useMemo(
    () => devices.filter((device) => device.connection === "offline"),
    [devices],
  );

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const reset = () => {
    clearTimer();
    setMode("list");
    setFailedDeviceId(null);
  };

  useEffect(() => {
    if (!visible) {
      clearTimer();
      setMode("list");
      setFailedDeviceId(null);
    }
    return clearTimer;
  }, [visible]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const openHelp = (path: "/help" | "/help/motionstation" = "/help") => {
    handleClose();
    router.push(path);
  };

  const handleAddDevice = () => {
    clearTimer();
    setFailedDeviceId(null);
    setMode("scanning");
    timerRef.current = setTimeout(() => {
      setMode("found");
      timerRef.current = null;
    }, SCAN_DURATION_MS);
  };

  const handleSelectConnected = (device: Device) => {
    selectDevice(device.id);
    handleClose();
  };

  const handleReconnect = (device: Device) => {
    const result = reconnectDevice(device.id);
    if (result === "connected") {
      showToast(`${device.name} 连接成功`);
      setFailedDeviceId(null);
      return;
    }
    showToast("连接失败，请重试");
    setFailedDeviceId(device.id);
  };

  const handleDisconnect = (device: Device) => {
    disconnectDevice(device.id);
    showToast(`${device.name} 已断开`);
    setFailedDeviceId(null);
  };

  const handleSelectNearby = (device: NearbyDevice) => {
    if (device.status === "busy") return;

    if (device.loggedIn) {
      addDevice(device.name);
      showToast(`${device.name} 连接成功`);
      handleClose();
      return;
    }

    handleClose();
    router.push(`/connect/qr?device=${encodeURIComponent(device.name)}`);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <Pressable style={styles.backdrop} onPress={handleClose}>
        <Pressable style={styles.sheet} onPress={(event) => event.stopPropagation()}>
          {mode === "list" ? (
            <>
              <Text style={styles.title}>我的设备</Text>

              {connectedDevices.map((device) => {
                const selected = device.id === selectedDevice.id;
                return (
                  <SwipeableDisconnectRow
                    key={device.id}
                    onDisconnect={() => handleDisconnect(device)}
                  >
                    <Pressable
                      accessibilityRole="button"
                      accessibilityHint="左滑可断开连接"
                      onPress={() => handleSelectConnected(device)}
                      style={({ pressed }) => [
                        styles.option,
                        selected && styles.optionSelected,
                        pressed && styles.pressed,
                      ]}
                    >
                      <View style={styles.optionText}>
                        <Text style={styles.optionName}>{device.name}</Text>
                        <Text style={styles.optionSubtitle}>{device.subtitle}</Text>
                      </View>
                      <View style={styles.optionRight}>
                        <View style={[styles.statusPill, styles.statusOnline]}>
                          <Text style={[styles.statusText, styles.statusTextOnline]}>已连接</Text>
                        </View>
                        {selected ? (
                          <Ionicons name="checkmark-circle" size={22} color={colors.accent} />
                        ) : null}
                      </View>
                    </Pressable>
                  </SwipeableDisconnectRow>
                );
              })}

              {offlineDevices.map((device) => {
                const showHelp = failedDeviceId === device.id;
                return (
                  <View key={device.id} style={styles.deviceBlock}>
                    <View style={[styles.option, styles.optionOffline]}>
                      <View style={styles.optionText}>
                        <Text style={styles.optionName}>{device.name}</Text>
                        <Text style={styles.optionSubtitle}>设备已离线，点击刷新重连</Text>
                      </View>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`刷新重连 ${device.name}`}
                        onPress={() => handleReconnect(device)}
                        style={({ pressed }) => [styles.refreshBtn, pressed && styles.pressed]}
                      >
                        <Ionicons name="refresh" size={20} color={colors.accent} />
                      </Pressable>
                    </View>
                    {showHelp ? (
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="查看连接帮助"
                        onPress={() => openHelp("/help/motionstation")}
                        style={({ pressed }) => [styles.helpLink, pressed && styles.pressed]}
                      >
                        <Ionicons name="help-circle-outline" size={18} color={colors.accent} />
                        <Text style={styles.helpLinkText}>查看连接帮助</Text>
                        <Ionicons name="chevron-forward" size={16} color={colors.accent} />
                      </Pressable>
                    ) : null}
                  </View>
                );
              })}

              {connectedDevices.length === 0 && offlineDevices.length === 0 ? (
                <Text style={styles.emptyHint}>暂无已连接设备，请添加设备</Text>
              ) : null}

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="添加设备"
                onPress={handleAddDevice}
                style={({ pressed }) => [styles.addOption, pressed && styles.pressed]}
              >
                <Ionicons name="add-circle-outline" size={22} color={colors.accent} />
                <Text style={styles.addOptionText}>添加设备</Text>
              </Pressable>
            </>
          ) : null}

          {mode === "scanning" ? (
            <View style={styles.scanPanel}>
              <View style={styles.scanHeader}>
                <Text style={[styles.title, styles.scanHeaderTitle]}>添加设备</Text>
                <View
                  accessibilityRole="text"
                  accessibilityLabel="配置 Wi‑Fi"
                  style={styles.wifiEntry}
                >
                  <Ionicons name="wifi-outline" size={18} color={colors.textSecondary} />
                  <Text style={styles.wifiEntryText}>配置 Wi‑Fi</Text>
                </View>
              </View>
              <RadarScan />
              <Text style={styles.scanHint}>正在扫描附近设备…</Text>
              <Text style={styles.lanHint}>{LAN_HINT}</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="帮助"
                onPress={() => openHelp("/help")}
                style={({ pressed }) => [styles.helpButton, pressed && styles.pressed]}
              >
                <Ionicons name="help-circle-outline" size={20} color={colors.textSecondary} />
                <Text style={styles.helpButtonText}>帮助</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={handleClose}
                style={({ pressed }) => [styles.secondaryBtn, pressed && styles.pressed]}
              >
                <Text style={styles.secondaryBtnText}>取消</Text>
              </Pressable>
            </View>
          ) : null}

          {mode === "found" ? (
            <View style={styles.scanPanel}>
              <Text style={styles.title}>发现附近设备</Text>
              <Text style={styles.scanHint}>空闲设备可点击连接</Text>
              <Text style={styles.lanHint}>{LAN_HINT}</Text>
              {nearbyDevices.map((device) => {
                const busy = device.status === "busy";
                return (
                  <Pressable
                    key={device.id}
                    accessibilityRole="button"
                    disabled={busy}
                    onPress={() => handleSelectNearby(device)}
                    style={({ pressed }) => [
                      styles.option,
                      busy && styles.optionDisabled,
                      !busy && pressed && styles.pressed,
                    ]}
                  >
                    <View style={styles.optionText}>
                      <Text style={[styles.optionName, busy && styles.optionNameDisabled]}>
                        {device.name}
                      </Text>
                      <Text style={styles.optionSubtitle}>
                        {busy ? "当前正在被使用" : device.loggedIn ? "已登录当前账号" : "需扫码登录"}
                      </Text>
                    </View>
                    <View style={[styles.statusPill, busy ? styles.statusBusy : styles.statusIdle]}>
                      <Text
                        style={[styles.statusText, busy ? styles.statusTextBusy : styles.statusTextIdle]}
                      >
                        {busy ? "忙碌" : "空闲"}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="帮助"
                onPress={() => openHelp("/help")}
                style={({ pressed }) => [styles.helpButton, pressed && styles.pressed]}
              >
                <Ionicons name="help-circle-outline" size={20} color={colors.textSecondary} />
                <Text style={styles.helpButtonText}>帮助</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={handleClose}
                style={({ pressed }) => [styles.secondaryBtn, pressed && styles.pressed]}
              >
                <Text style={styles.secondaryBtnText}>取消</Text>
              </Pressable>
            </View>
          ) : null}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: colors.overlay,
      justifyContent: "flex-end",
    },
    sheet: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: radius.xl,
      borderTopRightRadius: radius.xl,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      paddingBottom: spacing.xxxl,
      gap: spacing.sm,
    },
    title: {
      ...typography.subtitle,
      color: colors.textPrimary,
      marginBottom: spacing.sm,
    },
    scanHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing.sm,
      marginBottom: spacing.sm,
    },
    scanHeaderTitle: {
      marginBottom: 0,
      flexShrink: 1,
    },
    deviceBlock: {
      gap: spacing.xs,
    },
    option: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      minHeight: 56,
      gap: spacing.sm,
    },
    optionSelected: {
      borderColor: colors.accent,
      backgroundColor: colors.accentGlass,
    },
    optionOffline: {
      borderColor: colors.glassBorder,
      backgroundColor: colors.glass,
    },
    optionDisabled: {
      opacity: 0.55,
    },
    optionText: {
      flex: 1,
      gap: spacing.xs,
    },
    optionName: {
      ...typography.subtitle,
      color: colors.textPrimary,
    },
    optionNameDisabled: {
      color: colors.textMuted,
    },
    optionSubtitle: {
      ...typography.caption,
      color: colors.textSecondary,
    },
    optionRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },
    refreshBtn: {
      width: 40,
      height: 40,
      borderRadius: radius.pill,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: colors.glassBorder,
      backgroundColor: colors.accentGlass,
    },
    statusPill: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: radius.pill,
      borderWidth: 1,
    },
    statusOnline: {
      backgroundColor: "rgba(34,197,94,0.14)",
      borderColor: "rgba(34,197,94,0.35)",
    },
    statusIdle: {
      backgroundColor: "rgba(34,197,94,0.14)",
      borderColor: "rgba(34,197,94,0.35)",
    },
    statusBusy: {
      backgroundColor: colors.glass,
      borderColor: colors.glassBorder,
    },
    statusText: {
      ...typography.label,
      fontSize: 13,
    },
    statusTextOnline: {
      color: colors.green,
    },
    statusTextIdle: {
      color: colors.green,
    },
    statusTextBusy: {
      color: colors.textMuted,
    },
    helpLink: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    helpLinkText: {
      ...typography.caption,
      color: colors.accent,
      flex: 1,
    },
    emptyHint: {
      ...typography.caption,
      color: colors.textMuted,
      textAlign: "center",
      paddingVertical: spacing.sm,
    },
    addOption: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      marginTop: spacing.sm,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.glassBorder,
      borderStyle: "dashed",
      minHeight: 56,
    },
    addOptionText: {
      ...typography.subtitle,
      color: colors.accent,
    },
    scanPanel: {
      alignItems: "stretch",
      gap: spacing.md,
      paddingBottom: spacing.sm,
    },
    scanHint: {
      ...typography.caption,
      color: colors.textSecondary,
      textAlign: "center",
    },
    lanHint: {
      ...typography.caption,
      fontSize: 14,
      lineHeight: 20,
      color: colors.textMuted,
      textAlign: "center",
      paddingHorizontal: spacing.md,
    },
    wifiEntry: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.md,
      borderRadius: radius.pill,
      borderWidth: 1,
      borderColor: colors.glassBorder,
      backgroundColor: colors.glass,
    },
    wifiEntryText: {
      ...typography.label,
      fontSize: 13,
      color: colors.textSecondary,
    },
    helpButton: {
      alignSelf: "center",
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.lg,
      borderRadius: radius.pill,
      borderWidth: 1,
      borderColor: colors.glassBorder,
      backgroundColor: colors.glass,
    },
    helpButtonText: {
      ...typography.label,
      color: colors.textSecondary,
    },
    secondaryBtn: {
      alignSelf: "center",
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.xl,
      marginTop: spacing.xs,
    },
    secondaryBtnText: {
      ...typography.label,
      color: colors.textMuted,
    },
    pressed: {
      opacity: 0.85,
    },
  });
}
