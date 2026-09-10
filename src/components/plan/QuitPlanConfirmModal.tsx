import { useMemo } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { ColorPalette, radius, spacing, typography } from "@/theme";

/** Aligns with device `plan_detail_confirm_quit`. */
export const QUIT_PLAN_CONFIRM_MESSAGE = "确定退出该计划？退出后需重新加入才能训练。";

type QuitPlanConfirmModalProps = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function QuitPlanConfirmModal({
  visible,
  onCancel,
  onConfirm,
}: QuitPlanConfirmModalProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="关闭"
          style={StyleSheet.absoluteFill}
          onPress={onCancel}
        />
        <View style={styles.panel} accessibilityRole="alert">
          <Text style={styles.message}>{QUIT_PLAN_CONFIRM_MESSAGE}</Text>
          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="取消"
              onPress={onCancel}
              style={({ pressed }) => [styles.cancelButton, pressed && styles.pressed]}
            >
              <Text style={styles.cancelText}>取消</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="确定"
              onPress={onConfirm}
              style={({ pressed }) => [styles.confirmButton, pressed && styles.pressed]}
            >
              <Text style={styles.confirmText}>确定</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: colors.overlay,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: spacing.lg,
    },
    panel: {
      width: "100%",
      maxWidth: 320,
      borderRadius: radius.xl,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.glassBorder,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.xl,
      paddingBottom: spacing.md,
      gap: spacing.lg,
    },
    message: {
      ...typography.body,
      fontSize: 16,
      lineHeight: 24,
      color: colors.textSecondary,
      textAlign: "center",
    },
    actions: {
      flexDirection: "row",
      gap: spacing.md,
    },
    cancelButton: {
      flex: 1,
      minHeight: 48,
      borderRadius: radius.pill,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.surfaceElevated,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    cancelText: {
      ...typography.subtitle,
      fontSize: 16,
      color: colors.textPrimary,
    },
    confirmButton: {
      flex: 1,
      minHeight: 48,
      borderRadius: radius.pill,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.red,
    },
    confirmText: {
      ...typography.subtitle,
      fontSize: 16,
      color: "#FFFFFF",
    },
    pressed: {
      opacity: 0.88,
    },
  });
}
