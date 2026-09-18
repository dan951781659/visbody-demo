import { useRouter } from "expo-router";
import { useCopy } from "@/components/onboarding/DemoUI";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlassSurface } from "@/components/GlassSurface";
import { colors, spacing, typography } from "@/theme";

type DeviceAddMenuProps = {
  visible: boolean;
  onClose: () => void;
  onScanAdd: () => void;
  onManualAdd: () => void;
};

export function DeviceAddMenu({
  visible,
  onClose,
  onScanAdd,
  onManualAdd,
}: DeviceAddMenuProps) {
  const router = useRouter(); const t = useCopy();
  const handleScanAdd = () => {
    onClose();
    onScanAdd();
  };

  const handleManualAdd = () => {
    onClose();
    onManualAdd();
  };

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={styles.menuWrap}>
          <GlassSurface contentStyle={styles.menu}>
            <MenuItem icon="wifi-outline" label={t("发现局域网设备", "Discover LAN devices")} onPress={() => { onClose(); router.push("/connect/discover"); }} />
            <MenuItem icon="scan-outline" label="扫码添加" onPress={handleScanAdd} />
            <MenuItem icon="create-outline" label="手动添加" onPress={handleManualAdd} />
          </GlassSurface>
        </View>
      </Pressable>
    </Modal>
  );
}

function MenuItem({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]}
    >
      <Ionicons name={icon} size={20} color={colors.textPrimary} />
      <Text style={styles.menuText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 96,
    paddingRight: spacing.lg,
  },
  menuWrap: {
    minWidth: 220,
  },
  menu: {
    paddingVertical: spacing.sm,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  menuText: {
    ...typography.body,
    fontSize: 17,
    color: colors.textPrimary,
  },
  pressed: {
    opacity: 0.88,
  },
});
