import { useMemo, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import { ColorPalette, layout, radius, spacing, typography } from "@/theme";

type PlanDetailActionsProps = {
  joined: boolean;
  onJoin: () => void;
  onStartTraining: () => void;
  onSkip: () => void;
  onReschedule: () => void;
  onQuitPlan: () => void;
  skipDisabled?: boolean;
  dayActionsVisible?: boolean;
};

export function PlanDetailActions({
  joined,
  onJoin,
  onStartTraining,
  onSkip,
  onReschedule,
  onQuitPlan,
  skipDisabled = false,
  dayActionsVisible = true,
}: PlanDetailActionsProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [moreVisible, setMoreVisible] = useState(false);

  const handleSkip = () => {
    setMoreVisible(false);
    onSkip();
  };

  const handleReschedule = () => {
    setMoreVisible(false);
    onReschedule();
  };

  const handleQuitPlan = () => {
    setMoreVisible(false);
    onQuitPlan();
  };

  if (!joined) {
    return (
      <SafeAreaView edges={["bottom"]} style={styles.footer}>
        <View style={styles.bar}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="加入计划"
            onPress={onJoin}
            style={({ pressed }) => [styles.primaryButton, styles.primaryFull, pressed && styles.pressed]}
          >
            <Text style={styles.primaryText}>加入计划</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
      <SafeAreaView edges={["bottom"]} style={styles.footer}>
        <View style={styles.bar}>
          {dayActionsVisible ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="更多"
              onPress={() => setMoreVisible(true)}
              style={({ pressed }) => [styles.moreButton, pressed && styles.pressed]}
            >
              <Text style={styles.moreText}>更多</Text>
            </Pressable>
          ) : null}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="开始训练"
            onPress={onStartTraining}
            style={({ pressed }) => [
              styles.primaryButton,
              dayActionsVisible ? styles.primaryFlex : styles.primaryFull,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.primaryText}>开始训练</Text>
          </Pressable>
        </View>
      </SafeAreaView>

      <Modal
        transparent
        visible={moreVisible}
        animationType="fade"
        onRequestClose={() => setMoreVisible(false)}
      >
        <Pressable style={styles.sheetBackdrop} onPress={() => setMoreVisible(false)}>
          <Pressable style={styles.sheet} onPress={(event) => event.stopPropagation()}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>更多操作</Text>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={skipDisabled ? "已跳过" : "跳过"}
              accessibilityState={{ disabled: skipDisabled }}
              disabled={skipDisabled}
              onPress={handleSkip}
              style={({ pressed }) => [
                styles.sheetItem,
                skipDisabled && styles.sheetItemDisabled,
                pressed && !skipDisabled && styles.pressed,
              ]}
            >
              <Ionicons
                name="play-skip-forward-outline"
                size={20}
                color={skipDisabled ? colors.textMuted : colors.textPrimary}
              />
              <Text style={[styles.sheetItemText, skipDisabled && styles.sheetItemTextDisabled]}>
                {skipDisabled ? "已跳过" : "跳过"}
              </Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="改期"
              onPress={handleReschedule}
              style={({ pressed }) => [styles.sheetItem, pressed && styles.pressed]}
            >
              <Ionicons name="calendar-outline" size={20} color={colors.textPrimary} />
              <Text style={styles.sheetItemText}>改期</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="退出计划"
              onPress={handleQuitPlan}
              style={({ pressed }) => [styles.sheetItem, pressed && styles.pressed]}
            >
              <Ionicons name="exit-outline" size={20} color={colors.red} />
              <Text style={[styles.sheetItemText, styles.sheetItemTextDestructive]}>退出计划</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="取消"
              onPress={() => setMoreVisible(false)}
              style={({ pressed }) => [styles.sheetCancel, pressed && styles.pressed]}
            >
              <Text style={styles.sheetCancelText}>取消</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    footer: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.glassBorder,
      backgroundColor: colors.background,
    },
    bar: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      paddingHorizontal: layout.screenPadding,
      paddingTop: spacing.md,
      paddingBottom: spacing.sm,
    },
    moreButton: {
      minHeight: 52,
      minWidth: 88,
      paddingHorizontal: spacing.lg,
      borderRadius: radius.pill,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.surfaceElevated,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    moreText: {
      ...typography.subtitle,
      fontSize: 16,
      color: colors.textPrimary,
    },
    primaryButton: {
      minHeight: 52,
      borderRadius: radius.pill,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.accent,
      paddingHorizontal: spacing.xl,
    },
    primaryFlex: {
      flex: 1,
    },
    primaryFull: {
      flex: 1,
    },
    primaryText: {
      ...typography.subtitle,
      fontSize: 17,
      color: colors.accentText,
    },
    sheetBackdrop: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: colors.overlay,
    },
    sheet: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: radius.xl,
      borderTopRightRadius: radius.xl,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
      paddingBottom: spacing.xxxl,
      gap: spacing.xs,
    },
    sheetHandle: {
      alignSelf: "center",
      width: 40,
      height: 4,
      borderRadius: radius.pill,
      backgroundColor: colors.surfaceMuted,
      marginBottom: spacing.sm,
    },
    sheetTitle: {
      ...typography.subtitle,
      color: colors.textPrimary,
      marginBottom: spacing.sm,
    },
    sheetItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      minHeight: 52,
      paddingHorizontal: spacing.sm,
      borderRadius: radius.md,
    },
    sheetItemDisabled: {
      opacity: 0.45,
    },
    sheetItemText: {
      ...typography.body,
      fontSize: 17,
      color: colors.textPrimary,
    },
    sheetItemTextDisabled: {
      color: colors.textMuted,
    },
    sheetItemTextDestructive: {
      color: colors.red,
    },
    sheetCancel: {
      marginTop: spacing.md,
      minHeight: 48,
      borderRadius: radius.pill,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.surfaceElevated,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    sheetCancelText: {
      ...typography.subtitle,
      fontSize: 16,
      color: colors.textSecondary,
    },
    pressed: {
      opacity: 0.88,
    },
  });
}
