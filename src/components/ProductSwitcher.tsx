import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DeviceConnection, ProductLineOption } from "@/types/training";
import { colors, radius, spacing, typography } from "@/theme";

const deviceLogo = require("../../assets/device-logo.png");

type ProductSwitcherProps = {
  productLine: ProductLineOption;
  connection?: DeviceConnection;
  onPressName?: () => void;
  onPressLogo?: () => void;
  onPressScan?: () => void;
};

export function ProductSwitcher({
  productLine,
  connection,
  onPressName,
  onPressLogo,
  onPressScan,
}: ProductSwitcherProps) {
  const online = connection === "connected";

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>欢迎回来</Text>
      <View style={styles.row}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="切换产品型号"
          onPress={onPressName}
          style={({ pressed }) => [styles.nameBlock, pressed && styles.pressed]}
        >
          <Text style={styles.productName}>{productLine.name}</Text>
          <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
        </Pressable>

        <View style={styles.rightActions}>
          {onPressScan ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="扫一扫"
              onPress={onPressScan}
              style={({ pressed }) => [styles.scanButton, pressed && styles.pressed]}
            >
              <Ionicons name="scan-outline" size={22} color={colors.textPrimary} />
            </Pressable>
          ) : null}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="我的设备"
            onPress={onPressLogo}
            style={({ pressed }) => [styles.logoPressable, pressed && styles.pressed]}
          >
            <View style={[styles.logoWrap, !online && styles.logoWrapOffline]}>
              <Image
                source={deviceLogo}
                style={[styles.logoImage, !online && styles.logoImageOffline]}
                resizeMode="cover"
              />
            </View>
            <View style={[styles.statusDot, online ? styles.dotOnline : styles.dotOffline]} />
          </Pressable>
        </View>
      </View>
      <Text style={styles.subtitle}>{productLine.subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
  },
  greeting: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  nameBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    flexShrink: 1,
  },
  productName: {
    ...typography.hero,
    color: colors.textPrimary,
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    flexShrink: 0,
  },
  scanButton: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: colors.surfaceElevated,
    alignItems: "center",
    justifyContent: "center",
  },
  logoPressable: {
    flexShrink: 0,
    position: "relative",
  },
  logoWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: colors.green,
    overflow: "hidden",
    backgroundColor: colors.surfaceElevated,
  },
  logoWrapOffline: {
    borderColor: colors.glassBorder,
    opacity: 0.72,
  },
  logoImage: {
    width: "100%",
    height: "100%",
  },
  logoImageOffline: {
    opacity: 0.75,
  },
  statusDot: {
    position: "absolute",
    right: -1,
    bottom: -1,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.background,
  },
  dotOnline: {
    backgroundColor: colors.green,
  },
  dotOffline: {
    backgroundColor: colors.textMuted,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  pressed: {
    opacity: 0.75,
  },
});
