import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { DeviceAddMenu } from "@/components/training/DeviceAddMenu";
import { RadarScan } from "@/components/training/RadarScan";
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
  const [addMenuVisible, setAddMenuVisible] = useState(false);
  const [manualAddVisible, setManualAddVisible] = useState(false);
  const [manualDeviceName, setManualDeviceName] = useState("");
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
    };
  }, [startScan, stopScan]);

  const handleClose = () => {
    stopScan();
    setHasScanned(false);
    setScanCollapsed(false);
    router.back();
  };

  const handleScanAddDevice = () => {
    setAddMenuVisible(false);
    router.push("/connect/scan");
  };

  const handleOpenManualAdd = () => {
    setManualDeviceName("");
    setManualAddVisible(true);
  };

  const handleSubmitManualAdd = () => {
    const name = manualDeviceName.trim();
    if (!name) {
      showToast("请输入设备名称");
      return;
    }
    addDevice(name);
    showToast(`${name} 连接成功`);
    setManualAddVisible(false);
    setManualDeviceName("");
  };

  const handleOpenDeviceDetail = (device: Device) => {
    selectDevice(device.id);
    router.push(`/devices/${encodeURIComponent(device.id)}`);
  };

  const handleReconnect = (device: Device) => {
    const result = reconnectDevice(device.id);
    if (result === "connected") {
      showToast(`${device.name} 连接成功`);
      return;
    }
    showToast("连接失败，请重试");
  };

  const handleDisconnect = (device: Device) => {
    disconnectDevice(device.id);
    showToast(`${device.name} 已断开`);
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
          <View style={styles.headerCenter}>
            <Text style={styles.title}>我的设备</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="添加设备"
            onPress={() => setAddMenuVisible(true)}
            style={({ pressed }) => [styles.headerAdd, pressed && styles.pressed]}
          >
            <Ionicons name="add" size={26} color={colors.textPrimary} />
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
                <View
                  key={device.id}
                  style={[styles.option, selected && styles.optionSelected]}
                >
                  <Pressable
                    accessibilityRole="button"
                    accessibilityHint="点击查看设备详情"
                    onPress={() => handleOpenDeviceDetail(device)}
                    style={({ pressed }) => [styles.optionMain, pressed && styles.pressed]}
                  >
                    <View style={styles.nameRow}>
                      <Text style={styles.optionName}>{device.name}</Text>
                      <View style={[styles.statusPill, styles.statusOnline]}>
                        <Text style={[styles.statusText, styles.statusTextOnline]}>已连接</Text>
                      </View>
                    </View>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`断开 ${device.name}`}
                    onPress={() => handleDisconnect(device)}
                    style={({ pressed }) => [styles.actionBtn, styles.disconnectBtn, pressed && styles.pressed]}
                  >
                    <Text style={styles.disconnectBtnText}>断开</Text>
                  </Pressable>
                </View>
              );
            })}

            {offlineDevices.map((device) => {
              return (
                <View key={device.id} style={styles.deviceBlock}>
                  <View style={[styles.option, styles.optionOffline]}>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityHint="点击查看设备详情"
                      onPress={() => handleOpenDeviceDetail(device)}
                      style={({ pressed }) => [styles.optionMain, pressed && styles.pressed]}
                    >
                      <View style={styles.nameRow}>
                        <Text style={styles.optionName}>{device.name}</Text>
                        {renderLastUsedTag(device.id)}
                        <View style={[styles.statusPill, styles.statusBusy]}>
                          <Text style={[styles.statusText, styles.statusTextBusy]}>已离线</Text>
                        </View>
                      </View>
                    </Pressable>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`连接 ${device.name}`}
                      onPress={() => handleReconnect(device)}
                      style={({ pressed }) => [styles.actionBtn, styles.connectBtn, pressed && styles.pressed]}
                    >
                      <Text style={styles.connectBtnText}>连接</Text>
                    </Pressable>
                  </View>
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
              </View>
            ) : null}
          </ScrollView>
      </View>

      <DeviceAddMenu
        visible={addMenuVisible}
        onClose={() => setAddMenuVisible(false)}
        onScanAdd={handleScanAddDevice}
        onManualAdd={handleOpenManualAdd}
      />

      <Modal
        transparent
        visible={manualAddVisible}
        animationType="fade"
        onRequestClose={() => setManualAddVisible(false)}
      >
        <Pressable style={styles.manualBackdrop} onPress={() => setManualAddVisible(false)}>
          <Pressable style={styles.manualSheet} onPress={(event) => event.stopPropagation()}>
            <Text style={styles.manualTitle}>手动添加设备</Text>
            <Text style={styles.manualHint}>输入设备名称后即可添加并连接</Text>
            <TextInput
              value={manualDeviceName}
              onChangeText={setManualDeviceName}
              placeholder="请输入设备名称"
              placeholderTextColor={colors.textMuted}
              autoFocus
              accessibilityLabel="设备名称"
              style={styles.manualInput}
              returnKeyType="done"
              onSubmitEditing={handleSubmitManualAdd}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="添加设备"
              onPress={handleSubmitManualAdd}
              style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressed]}
            >
              <Text style={styles.primaryBtnText}>添加设备</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="取消"
              onPress={() => setManualAddVisible(false)}
              style={({ pressed }) => [styles.manualCancel, pressed && styles.pressed]}
            >
              <Text style={styles.manualCancelText}>取消</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
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
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.sm,
      gap: spacing.sm,
    },
    headerBack: {
      width: 36,
      height: 36,
      alignItems: "center",
      justifyContent: "center",
    },
    headerCenter: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
    },
    title: {
      ...typography.subtitle,
      color: colors.textPrimary,
    },
    headerAdd: {
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
    manualBackdrop: {
      flex: 1,
      backgroundColor: colors.overlay,
      justifyContent: "center",
      paddingHorizontal: spacing.lg,
    },
    manualSheet: {
      backgroundColor: colors.surface,
      borderRadius: radius.xl,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      paddingBottom: spacing.lg,
      gap: spacing.md,
    },
    manualTitle: {
      ...typography.subtitle,
      color: colors.textPrimary,
    },
    manualHint: {
      ...typography.caption,
      color: colors.textMuted,
      marginTop: -spacing.sm,
    },
    manualInput: {
      ...typography.body,
      color: colors.textPrimary,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      minHeight: 48,
      backgroundColor: colors.background,
    },
    manualCancel: {
      alignSelf: "center",
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.xl,
    },
    manualCancelText: {
      ...typography.label,
      color: colors.textMuted,
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
    optionMain: {
      flex: 1,
      gap: spacing.xs,
      alignItems: "flex-start",
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
    actionBtn: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radius.pill,
      borderWidth: 1,
      minHeight: 36,
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    connectBtn: {
      borderColor: colors.accent,
      backgroundColor: colors.accentGlass,
    },
    connectBtnText: {
      ...typography.label,
      color: colors.accent,
    },
    disconnectBtn: {
      borderColor: colors.glassBorder,
      backgroundColor: colors.glass,
    },
    disconnectBtnText: {
      ...typography.label,
      color: colors.textSecondary,
    },
    statusPill: {
      alignSelf: "flex-start",
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
    pressed: {
      opacity: 0.85,
    },
  });
}
