import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { RadarScan } from "@/components/training/RadarScan";
import { SwipeableDisconnectRow } from "@/components/training/SwipeableDisconnectRow";
import { useToast } from "@/components/ToastProvider";
import { useTheme } from "@/context/ThemeContext";
import { useTraining } from "@/context/TrainingContext";
import { Device, NearbyDevice } from "@/types/training";
import { ColorPalette, radius, spacing, typography } from "@/theme";

const SCAN_DURATION_MS = 2500;
const LAN_HINT = "APP与设备应在同一局域网内";

export function DevicePickerScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const {
    devices,
    selectedDevice,
    lastUsedDeviceId,
    selectDevice,
    reconnectDevice,
    disconnectDevice,
    nearbyDevices,
    addDevice,
  } = useTraining();
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [scanCollapsed, setScanCollapsed] = useState(false);
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

  const myDeviceNames = useMemo(
    () => new Set(devices.map((device) => device.name)),
    [devices],
  );

  const otherDevices = useMemo(
    () => nearbyDevices.filter((device) => !myDeviceNames.has(device.name)),
    [nearbyDevices, myDeviceNames],
  );

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const stopScan = useCallback(() => {
    clearTimer();
    setIsScanning(false);
  }, [clearTimer]);

  const startScan = useCallback(() => {
    clearTimer();
    setFailedDeviceId(null);
    setIsScanning(true);
    setHasScanned(false);
    setScanCollapsed(false);
    timerRef.current = setTimeout(() => {
      setIsScanning(false);
      setHasScanned(true);
      setScanCollapsed(true);
      timerRef.current = null;
    }, SCAN_DURATION_MS);
  }, [clearTimer]);

  useEffect(() => {
    startScan();
    return () => {
      stopScan();
      setHasScanned(false);
      setScanCollapsed(false);
      setFailedDeviceId(null);
    };
  }, [startScan, stopScan]);

  const handleClose = () => {
    stopScan();
    setHasScanned(false);
    setScanCollapsed(false);
    setFailedDeviceId(null);
    router.back();
  };

  const openHelp = (path: "/help" | "/help/motionstation" = "/help") => {
    handleClose();
    router.push(path);
  };

  const handleScanAddDevice = () => {
    handleClose();
    router.push("/connect/scan");
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

  const renderLastUsedTag = (deviceId: string) => {
    if (deviceId !== lastUsedDeviceId) return null;
    return (
      <View style={styles.lastUsedPill}>
        <Text style={styles.lastUsedText}>上次使用</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.page}>
          <View style={styles.header}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="返回"
              onPress={handleClose}
              style={({ pressed }) => [styles.headerBack, pressed && styles.pressed]}
            >
              <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
            </Pressable>
            <Text style={styles.title}>我的设备</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="帮助"
              onPress={() => openHelp("/help")}
              style={({ pressed }) => [styles.headerHelp, pressed && styles.pressed]}
            >
              <Ionicons name="help-circle-outline" size={22} color={colors.textSecondary} />
            </Pressable>
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            onScroll={(event) => {
              if (event.nativeEvent.contentOffset.y > 8) {
                setScanCollapsed(true);
              }
            }}
            scrollEventThrottle={16}
          >
            <View style={styles.scanStatus}>
              {isScanning && !scanCollapsed ? (
                <>
                  <View style={styles.radarWrap}>
                    <RadarScan size={120} />
                  </View>
                  <View style={styles.scanStatusText}>
                    <ActivityIndicator color={colors.accent} size="small" />
                    <Text style={styles.scanHint}>正在扫描附近设备…</Text>
                  </View>
                </>
              ) : (
                <View style={styles.scanStatusText}>
                  <Ionicons
                    name={
                      isScanning
                        ? "radio-outline"
                        : hasScanned
                          ? "checkmark-circle-outline"
                          : "radio-outline"
                    }
                    size={18}
                    color={hasScanned ? colors.green : colors.textMuted}
                  />
                  <Text style={styles.scanHint}>
                    {isScanning ? "正在扫描附近设备…" : hasScanned ? "扫描完成" : "准备扫描"}
                  </Text>
                </View>
              )}
              <Text style={styles.lanHint}>{LAN_HINT}</Text>
            </View>

            <Text style={styles.sectionLabel}>我的设备</Text>
            {connectedDevices.map((device) => {
              const selected = device.id === selectedDevice?.id;
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
                    </View>
                    <View style={styles.optionRight}>
                      <View style={[styles.statusPill, styles.statusOnline]}>
                        <Text style={[styles.statusText, styles.statusTextOnline]}>已连接</Text>
                      </View>
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
                      <View style={styles.nameRow}>
                        <Text style={styles.optionName}>{device.name}</Text>
                        {renderLastUsedTag(device.id)}
                      </View>
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
              <Text style={styles.emptyHint}>暂无设备，请添加设备</Text>
            ) : null}

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>其他设备</Text>
              {hasScanned && !isScanning ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="重新扫描"
                  onPress={startScan}
                  style={({ pressed }) => [styles.rescanLink, pressed && styles.pressed]}
                >
                  <Ionicons name="refresh" size={16} color={colors.accent} />
                  <Text style={styles.rescanLinkText}>重新扫描</Text>
                </Pressable>
              ) : null}
            </View>

            {isScanning ? (
              <Text style={styles.emptyHint}>正在查找设备…</Text>
            ) : null}

            {!isScanning && hasScanned && otherDevices.length > 0
              ? otherDevices.map((device) => {
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
                          {busy
                            ? "当前正在被使用"
                            : device.loggedIn
                              ? "已登录当前账号"
                              : "需扫码登录"}
                        </Text>
                      </View>
                      <View
                        style={[styles.statusPill, busy ? styles.statusBusy : styles.statusIdle]}
                      >
                        <Text
                          style={[
                            styles.statusText,
                            busy ? styles.statusTextBusy : styles.statusTextIdle,
                          ]}
                        >
                          {busy ? "忙碌" : "空闲"}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })
              : null}

            {!isScanning && hasScanned && otherDevices.length === 0 ? (
              <View style={styles.otherEmpty}>
                <Text style={styles.emptyHint}>未发现其他设备</Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="重新扫描"
                  onPress={startScan}
                  style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressed]}
                >
                  <Text style={styles.primaryBtnText}>重新扫描</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="扫码添加设备"
                  onPress={handleScanAddDevice}
                  style={({ pressed }) => [styles.outlineBtn, pressed && styles.pressed]}
                >
                  <Ionicons name="scan-outline" size={18} color={colors.textSecondary} />
                  <Text style={styles.outlineBtnText}>扫码添加设备</Text>
                </Pressable>
              </View>
            ) : null}

            {!isScanning && hasScanned && otherDevices.length > 0 ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="扫码添加设备"
                onPress={handleScanAddDevice}
                style={({ pressed }) => [styles.outlineBtn, pressed && styles.pressed]}
              >
                <Ionicons name="scan-outline" size={18} color={colors.textSecondary} />
                <Text style={styles.outlineBtnText}>扫码添加设备</Text>
              </Pressable>
            ) : null}
          </ScrollView>
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
    page: {
      flex: 1,
      backgroundColor: colors.surface,
      paddingTop: spacing.lg,
      paddingBottom: spacing.lg,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.sm,
    },
    headerBack: {
      width: 36,
      height: 36,
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      ...typography.subtitle,
      color: colors.textPrimary,
    },
    headerHelp: {
      width: 36,
      height: 36,
      alignItems: "center",
      justifyContent: "center",
    },
    scroll: {
      flexGrow: 0,
    },
    scrollContent: {
      paddingHorizontal: spacing.lg,
      gap: spacing.sm,
      paddingBottom: spacing.md,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: spacing.md,
    },
    sectionLabel: {
      ...typography.label,
      color: colors.textMuted,
      marginTop: spacing.sm,
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
    nameRow: {
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
      gap: spacing.sm,
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
    lastUsedPill: {
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: radius.pill,
      backgroundColor: colors.glass,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    lastUsedText: {
      ...typography.label,
      fontSize: 11,
      color: colors.textMuted,
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
    scanStatus: {
      alignItems: "center",
      gap: spacing.sm,
      marginTop: spacing.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.glassBorder,
      backgroundColor: colors.glass,
    },
    radarWrap: {
      alignItems: "center",
      justifyContent: "center",
    },
    scanStatusText: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },
    scanHint: {
      ...typography.caption,
      color: colors.textSecondary,
      textAlign: "center",
    },
    lanHint: {
      ...typography.caption,
      fontSize: 13,
      lineHeight: 18,
      color: colors.textMuted,
      textAlign: "center",
    },
    rescanLink: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
      marginTop: spacing.sm,
    },
    rescanLinkText: {
      ...typography.label,
      fontSize: 13,
      color: colors.accent,
    },
    otherEmpty: {
      gap: spacing.sm,
      paddingTop: spacing.xs,
    },
    primaryBtn: {
      alignSelf: "stretch",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: spacing.md,
      borderRadius: radius.md,
      backgroundColor: colors.accent,
      minHeight: 48,
    },
    primaryBtnText: {
      ...typography.subtitle,
      color: colors.accentText,
    },
    outlineBtn: {
      alignSelf: "stretch",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.sm,
      paddingVertical: spacing.md,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.glassBorder,
      backgroundColor: colors.glass,
      minHeight: 48,
      marginTop: spacing.xs,
    },
    outlineBtnText: {
      ...typography.label,
      color: colors.textSecondary,
    },
    pressed: {
      opacity: 0.85,
    },
  });
}
