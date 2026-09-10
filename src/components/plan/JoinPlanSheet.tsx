import { useEffect, useMemo, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { getNextSevenDays, parseSessionsPerWeek } from "@/types/plan";
import { ColorPalette, radius, spacing, typography } from "@/theme";

type JoinPlanSheetProps = {
  visible: boolean;
  sessionsPerWeek: string;
  onClose: () => void;
  onConfirm: (trainingDays: string[]) => void;
};

export function JoinPlanSheet({
  visible,
  sessionsPerWeek,
  onClose,
  onConfirm,
}: JoinPlanSheetProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const maxDays = parseSessionsPerWeek(sessionsPerWeek);
  const dayOptions = useMemo(() => getNextSevenDays(), [visible]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (visible) setSelected(new Set());
  }, [visible]);

  const canConfirm = selected.size === maxDays;

  const toggleDay = (dateKey: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(dateKey)) {
        next.delete(dateKey);
        return next;
      }
      if (next.size >= maxDays) return prev;
      next.add(dateKey);
      return next;
    });
  };

  const handleClose = () => {
    setSelected(new Set());
    onClose();
  };

  const handleConfirm = () => {
    if (!canConfirm) return;
    onConfirm(Array.from(selected).sort());
    setSelected(new Set());
  };

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={handleClose}>
      <Pressable style={styles.backdrop} onPress={handleClose}>
        <Pressable style={styles.sheet} onPress={(event) => event.stopPropagation()}>
          <View style={styles.handle} />
          <Text style={styles.title}>选择训练日</Text>
          <Text style={styles.desc}>
            为你的训练选择 <Text style={styles.descStrong}>{maxDays}</Text> 天。
          </Text>
          <Text style={styles.hint}>后续每周都将沿用本周的训练安排。</Text>

          <View style={styles.dayGrid}>
            {dayOptions.map((option) => {
              const isSelected = selected.has(option.dateKey);
              const disabled = !isSelected && selected.size >= maxDays;
              return (
                <Pressable
                  key={option.dateKey}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected, disabled }}
                  accessibilityLabel={`${option.monthLabel}${option.dayOfMonth}日 ${option.weekdayLabel}`}
                  disabled={disabled}
                  onPress={() => toggleDay(option.dateKey)}
                  style={({ pressed }) => [
                    styles.dayItem,
                    isSelected && styles.dayItemSelected,
                    disabled && styles.dayItemDisabled,
                    pressed && !disabled && styles.pressed,
                  ]}
                >
                  <Text style={[styles.dayWeekday, isSelected && styles.dayTextSelected]}>
                    {option.weekdayLabel}
                  </Text>
                  <Text style={[styles.dayNumber, isSelected && styles.dayTextSelected]}>
                    {option.dayOfMonth}
                  </Text>
                  <Text style={[styles.dayMonth, isSelected && styles.dayTextSelected]}>
                    {option.monthLabel}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="确认加入计划"
            accessibilityState={{ disabled: !canConfirm }}
            disabled={!canConfirm}
            onPress={handleConfirm}
            style={({ pressed }) => [
              styles.confirmButton,
              !canConfirm && styles.confirmDisabled,
              pressed && canConfirm && styles.pressed,
            ]}
          >
            <Text style={[styles.confirmText, !canConfirm && styles.confirmTextDisabled]}>
              加入计划
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    backdrop: {
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
      gap: spacing.md,
    },
    handle: {
      alignSelf: "center",
      width: 40,
      height: 4,
      borderRadius: radius.pill,
      backgroundColor: colors.surfaceMuted,
      marginBottom: spacing.sm,
    },
    title: {
      ...typography.subtitle,
      color: colors.textPrimary,
    },
    desc: {
      ...typography.body,
      fontSize: 16,
      color: colors.textSecondary,
    },
    descStrong: {
      color: colors.accent,
      fontWeight: "700",
    },
    hint: {
      ...typography.caption,
      color: colors.textMuted,
    },
    dayGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.sm,
    },
    dayItem: {
      width: "22%",
      minWidth: 72,
      flexGrow: 1,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.glassBorder,
      backgroundColor: colors.surfaceElevated,
      paddingVertical: spacing.md,
      alignItems: "center",
      gap: 2,
    },
    dayItemSelected: {
      backgroundColor: colors.accentGlass,
      borderColor: colors.accent,
    },
    dayItemDisabled: {
      opacity: 0.4,
    },
    dayWeekday: {
      ...typography.label,
      fontSize: 12,
      color: colors.textMuted,
    },
    dayNumber: {
      ...typography.subtitle,
      color: colors.textPrimary,
    },
    dayMonth: {
      ...typography.label,
      fontSize: 11,
      color: colors.textSecondary,
    },
    dayTextSelected: {
      color: colors.accent,
    },
    confirmButton: {
      minHeight: 52,
      borderRadius: radius.pill,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.accent,
      marginTop: spacing.sm,
    },
    confirmDisabled: {
      backgroundColor: colors.surfaceMuted,
    },
    confirmText: {
      ...typography.subtitle,
      color: colors.accentText,
    },
    confirmTextDisabled: {
      color: colors.textMuted,
    },
    pressed: {
      opacity: 0.88,
    },
  });
}
