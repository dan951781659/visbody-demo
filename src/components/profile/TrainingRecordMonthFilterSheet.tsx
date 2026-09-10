import { useEffect, useMemo, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlassSurface } from "@/components/GlassSurface";
import { useTheme } from "@/context/ThemeContext";
import { ColorPalette, radius, spacing, typography } from "@/theme";
import { formatMonthLabel } from "@/utils/trainingRecordStats";

type Field = "start" | "end";

type TrainingRecordMonthFilterSheetProps = {
  visible: boolean;
  startMonth?: string;
  endMonth?: string;
  minYear?: number;
  maxYear?: number;
  onClose: () => void;
  onApply: (startMonth?: string, endMonth?: string) => void;
  onClear: () => void;
};

const MONTH_LABELS = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];

export function TrainingRecordMonthFilterSheet({
  visible,
  startMonth,
  endMonth,
  minYear = 2024,
  maxYear = 2028,
  onClose,
  onApply,
  onClear,
}: TrainingRecordMonthFilterSheetProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [draftStart, setDraftStart] = useState(startMonth);
  const [draftEnd, setDraftEnd] = useState(endMonth);
  const [activeField, setActiveField] = useState<Field>("start");
  const [cursorYear, setCursorYear] = useState(Number((startMonth ?? endMonth ?? `${maxYear}-01`).slice(0, 4)));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!visible) return;
    setDraftStart(startMonth);
    setDraftEnd(endMonth);
    setActiveField("start");
    setCursorYear(Number((startMonth ?? endMonth ?? `${maxYear}-01`).slice(0, 4)));
    setError("");
  }, [visible, startMonth, endMonth, maxYear]);

  const activeValue = activeField === "start" ? draftStart : draftEnd;

  const selectMonth = (monthIndex: number) => {
    const ym = `${cursorYear}-${String(monthIndex + 1).padStart(2, "0")}`;
    setError("");
    if (activeField === "start") {
      setDraftStart(ym);
      if (draftEnd && ym > draftEnd) setDraftEnd(undefined);
      setActiveField("end");
      return;
    }
    if (draftStart && ym < draftStart) {
      setDraftStart(ym);
      setDraftEnd(undefined);
      return;
    }
    setDraftEnd(ym);
  };

  const apply = () => {
    if (draftStart && draftEnd && draftStart > draftEnd) {
      setError("开始月份不能晚于结束月份");
      return;
    }
    onApply(draftStart, draftEnd);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="关闭月份筛选" />
        <GlassSurface contentStyle={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>月份筛选</Text>
            <Pressable accessibilityLabel="关闭" onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </Pressable>
          </View>
          <Text style={styles.hint}>可只选开始或结束月份，按整月包含边界</Text>

          <View style={styles.fields}>
            <Pressable
              onPress={() => setActiveField("start")}
              style={[styles.field, activeField === "start" && styles.fieldActive]}
            >
              <Text style={styles.fieldLabel}>开始月份</Text>
              <Text style={styles.fieldValue}>{draftStart ? formatMonthLabel(draftStart) : "不限"}</Text>
            </Pressable>
            <Ionicons name="arrow-forward" size={16} color={colors.textMuted} />
            <Pressable
              onPress={() => setActiveField("end")}
              style={[styles.field, activeField === "end" && styles.fieldActive]}
            >
              <Text style={styles.fieldLabel}>结束月份</Text>
              <Text style={styles.fieldValue}>{draftEnd ? formatMonthLabel(draftEnd) : "不限"}</Text>
            </Pressable>
          </View>

          <View style={styles.yearNav}>
            <Pressable
              accessibilityLabel="上一年"
              disabled={cursorYear <= minYear}
              onPress={() => setCursorYear((year) => Math.max(minYear, year - 1))}
              style={styles.yearButton}
            >
              <Ionicons
                name="chevron-back"
                size={18}
                color={cursorYear <= minYear ? colors.textMuted : colors.textPrimary}
              />
            </Pressable>
            <Text style={styles.yearText}>{cursorYear}年</Text>
            <Pressable
              accessibilityLabel="下一年"
              disabled={cursorYear >= maxYear}
              onPress={() => setCursorYear((year) => Math.min(maxYear, year + 1))}
              style={styles.yearButton}
            >
              <Ionicons
                name="chevron-forward"
                size={18}
                color={cursorYear >= maxYear ? colors.textMuted : colors.textPrimary}
              />
            </Pressable>
          </View>

          <View style={styles.monthGrid}>
            {MONTH_LABELS.map((label, index) => {
              const ym = `${cursorYear}-${String(index + 1).padStart(2, "0")}`;
              const selected = activeValue === ym;
              const inRange = Boolean(draftStart && draftEnd && ym > draftStart && ym < draftEnd);
              return (
                <View key={label} style={styles.monthCellWrap}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`${cursorYear}年${label}`}
                    accessibilityState={{ selected }}
                    onPress={() => selectMonth(index)}
                    style={[
                      styles.monthCell,
                      inRange && styles.monthInRange,
                      selected && styles.monthSelected,
                    ]}
                  >
                    <Text style={[styles.monthLabel, selected && styles.monthLabelSelected]}>{label}</Text>
                  </Pressable>
                </View>
              );
            })}
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="清除月份筛选"
              onPress={() => {
                setDraftStart(undefined);
                setDraftEnd(undefined);
                onClear();
              }}
              style={styles.clearButton}
            >
              <Text style={styles.clearText}>清除</Text>
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="应用月份筛选" onPress={apply} style={styles.applyButton}>
              <Text style={styles.applyText}>应用</Text>
            </Pressable>
          </View>
        </GlassSurface>
      </View>
    </Modal>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: colors.overlay,
    },
    sheet: {
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      padding: spacing.xl,
      backgroundColor: colors.surfaceElevated,
      gap: spacing.sm,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    title: {
      ...typography.subtitle,
      color: colors.textPrimary,
    },
    closeButton: {
      padding: spacing.xs,
    },
    hint: {
      ...typography.caption,
      color: colors.textMuted,
    },
    fields: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      marginTop: spacing.md,
    },
    field: {
      flex: 1,
      padding: spacing.md,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.glassBorder,
      backgroundColor: colors.glassHighlight,
    },
    fieldActive: {
      borderColor: colors.accent,
    },
    fieldLabel: {
      ...typography.label,
      color: colors.textMuted,
    },
    fieldValue: {
      ...typography.caption,
      color: colors.textPrimary,
      marginTop: spacing.xs,
    },
    yearNav: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: spacing.md,
    },
    yearButton: {
      width: 36,
      height: 36,
      alignItems: "center",
      justifyContent: "center",
    },
    yearText: {
      ...typography.subtitle,
      color: colors.textPrimary,
    },
    monthGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginHorizontal: -4,
      marginTop: spacing.sm,
    },
    monthCellWrap: {
      width: "25%",
      padding: 4,
    },
    monthCell: {
      minHeight: 48,
      borderRadius: radius.md,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
    },
    monthInRange: {
      backgroundColor: colors.accentGlass,
      borderColor: colors.accentGlass,
    },
    monthSelected: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    monthLabel: {
      ...typography.label,
      color: colors.textPrimary,
    },
    monthLabelSelected: {
      color: colors.accentText,
    },
    error: {
      ...typography.caption,
      color: colors.red,
      marginTop: spacing.xs,
    },
    actions: {
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
      gap: spacing.md,
      marginTop: spacing.md,
    },
    clearButton: {
      padding: spacing.md,
    },
    clearText: {
      ...typography.label,
      color: colors.textSecondary,
    },
    applyButton: {
      minWidth: 88,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xl,
      borderRadius: radius.pill,
      backgroundColor: colors.accent,
      alignItems: "center",
    },
    applyText: {
      ...typography.label,
      color: colors.accentText,
    },
  });
}
