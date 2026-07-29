import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlassSurface } from "@/components/GlassSurface";
import { useToast } from "@/components/ToastProvider";
import { colors, spacing, typography } from "@/theme";

type ContentMoreMenuProps = {
  visible: boolean;
  onClose: () => void;
  onFavorite?: () => void;
  onTrainLater?: () => void;
};

export function ContentMoreMenu({
  visible,
  onClose,
  onFavorite,
  onTrainLater,
}: ContentMoreMenuProps) {
  const { showToast } = useToast();

  const handleFavorite = () => {
    onFavorite?.();
    showToast("已收藏");
    onClose();
  };

  const handleTrainLater = () => {
    onTrainLater?.();
    showToast("已添加至稍后训练列表");
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={styles.menuWrap}>
          <GlassSurface contentStyle={styles.menu}>
            <MenuItem icon="heart-outline" label="收藏" onPress={handleFavorite} />
            <MenuItem icon="time-outline" label="稍后训练" onPress={handleTrainLater} />
            <MenuItem icon="share-outline" label="分享" disabled />
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
  disabled = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.menuItem,
        disabled && styles.menuItemDisabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Ionicons
        name={icon}
        size={20}
        color={disabled ? colors.textMuted : colors.textPrimary}
      />
      <Text style={[styles.menuText, disabled && styles.menuTextDisabled]}>{label}</Text>
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
  menuItemDisabled: {
    opacity: 0.45,
  },
  menuText: {
    ...typography.body,
    fontSize: 17,
    color: colors.textPrimary,
  },
  menuTextDisabled: {
    color: colors.textMuted,
  },
  pressed: {
    opacity: 0.88,
  },
});
