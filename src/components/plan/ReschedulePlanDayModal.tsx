import { useEffect, useMemo, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { AnimatedDateCalendar } from "@/components/profile/AnimatedDateCalendar";
import { useTheme } from "@/context/ThemeContext";
import {
  formatRescheduleRangeLabel,
  getRescheduleWindow,
  type PlanEnrollment,
} from "@/types/plan";
import { ColorPalette, radius, spacing, typography } from "@/theme";

type PlanOnDate = { planId: string; name: string };

type ReschedulePlanDayModalProps = {
  visible: boolean;
  enrollment: PlanEnrollment;
  week: number;
  day: number;
  occupiedDates: Set<string>;
  getPlansOnDate: (dateKey: string) => PlanOnDate[];
  onClose: () => void;
  onConfirm: (dateKey: string) => void;
};

export function ReschedulePlanDayModal({
  visible,
  enrollment,
  week,
  day,
  occupiedDates,
  getPlansOnDate,
  onClose,
  onConfirm,
}: ReschedulePlanDayModalProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [replayKey, setReplayKey] = useState(0);

  const window = useMemo(
    () => (visible ? getRescheduleWindow(enrollment, week, day) : null),
    [visible, enrollment, week, day],
  );

  useEffect(() => {
    if (!visible || !window) return;
    setSelectedDate(window.originalDate);
    setMonth(window.originalDate.slice(0, 7));
    setReplayKey((value) => value + 1);
  }, [visible, window]);

  const rangeLabel = window
    ? formatRescheduleRangeLabel(window.minDate, window.maxDate)
    : null;
  const plansOnSelected = selectedDate ? getPlansOnDate(selectedDate) : [];
  const hasExistingPlans = plansOnSelected.length > 0;
  const canConfirm = Boolean(
    selectedDate &&
      window &&
      selectedDate >= window.minDate &&
      selectedDate <= window.maxDate,
  );

  const handleClose = () => {
    setSelectedDate(null);
    onClose();
  };

  const handleConfirm = () => {
    if (!selectedDate || !canConfirm) return;
    onConfirm(selectedDate);
    setSelectedDate(null);
  };

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={handleClose}>
      <View style={styles.backdrop}>
        <View style={styles.panel}>
          <View style={styles.head}>
            <Text style={styles.title}>改期训练日</Text>
            <Pressable accessibilityRole="button" accessibilityLabel="关闭" onPress={handleClose}>
              <Text style={styles.close}>关闭</Text>
            </Pressable>
          </View>
          <Text style={styles.desc}>为该训练日选择新的日期。</Text>
          {rangeLabel ? <Text style={styles.range}>{rangeLabel}</Text> : null}

          {window ? (
            <AnimatedDateCalendar
              month={month}
              minDate={window.minDate}
              maxDate={window.maxDate}
              selectedDate={selectedDate ?? undefined}
              markedDates={occupiedDates}
              replayKey={replayKey}
              onMonthChange={setMonth}
              onSelectDate={(date) => setSelectedDate(date)}
            />
          ) : null}

          {selectedDate ? (
            <View style={styles.selectionBlock}>
              {hasExistingPlans ? (
                <>
                  <Text style={styles.hintConflict}>该日期已安排训练计划。</Text>
                  {plansOnSelected.map((plan) => (
                    <Text key={`${plan.planId}-${plan.name}`} style={styles.planName}>
                      {plan.name}
                    </Text>
                  ))}
                </>
              ) : (
                <Text style={styles.hint}>已选择 {selectedDate}</Text>
              )}
            </View>
          ) : (
            <Text style={styles.hint}>请选择一个日期</Text>
          )}

          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              onPress={handleClose}
              style={({ pressed }) => [styles.cancelButton, pressed && styles.pressed]}
            >
              <Text style={styles.cancelText}>取消</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: !canConfirm }}
              disabled={!canConfirm}
              onPress={handleConfirm}
              style={({ pressed }) => [
                styles.okButton,
                !canConfirm && styles.okDisabled,
                pressed && canConfirm && styles.pressed,
              ]}
            >
              <Text style={[styles.okText, !canConfirm && styles.okTextDisabled]}>确定</Text>
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
      paddingHorizontal: spacing.lg,
    },
    panel: {
      borderRadius: radius.xl,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.glassBorder,
      padding: spacing.lg,
      gap: spacing.md,
      maxHeight: "90%",
    },
    head: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    title: {
      ...typography.subtitle,
      color: colors.textPrimary,
    },
    close: {
      ...typography.label,
      color: colors.accent,
    },
    desc: {
      ...typography.caption,
      color: colors.textSecondary,
    },
    range: {
      ...typography.caption,
      color: colors.accent,
    },
    selectionBlock: {
      gap: spacing.xs,
    },
    hint: {
      ...typography.caption,
      color: colors.textMuted,
    },
    hintConflict: {
      ...typography.caption,
      color: colors.orange,
    },
    planName: {
      ...typography.body,
      fontSize: 16,
      color: colors.textPrimary,
    },
    actions: {
      flexDirection: "row",
      gap: spacing.md,
      marginTop: spacing.sm,
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
    okButton: {
      flex: 1,
      minHeight: 48,
      borderRadius: radius.pill,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.accent,
    },
    okDisabled: {
      backgroundColor: colors.surfaceMuted,
    },
    okText: {
      ...typography.subtitle,
      fontSize: 16,
      color: colors.accentText,
    },
    okTextDisabled: {
      color: colors.textMuted,
    },
    pressed: {
      opacity: 0.88,
    },
  });
}
