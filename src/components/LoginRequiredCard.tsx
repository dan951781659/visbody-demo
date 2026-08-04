import { Ionicons } from "@expo/vector-icons";
import { ReactNode, useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { ColorPalette, radius, spacing, typography } from "@/theme";

type LoginRequiredCardProps = {
  children: ReactNode;
  onPress: () => void;
};

export function LoginRequiredCard({ children, onPress }: LoginRequiredCardProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="登录后查看更多内容"
      accessibilityHint="点击前往登录页面"
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <View pointerEvents="none">{children}</View>
      <View pointerEvents="none" style={styles.overlay}>
        <View style={styles.message}>
          <Ionicons name="lock-closed-outline" size={18} color={colors.textPrimary} />
          <Text style={styles.messageText}>登录后查看更多内容</Text>
        </View>
      </View>
    </Pressable>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    container: {
      position: "relative",
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(0, 0, 0, 0.58)",
      borderRadius: radius.lg,
    },
    message: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radius.pill,
      backgroundColor: "rgba(28, 28, 30, 0.92)",
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    messageText: {
      ...typography.label,
      color: colors.textPrimary,
    },
    pressed: {
      opacity: 0.86,
    },
  });
}
