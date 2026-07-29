import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing, typography } from "@/theme";

type MultiSelectFieldProps = {
  label: string;
  placeholder: string;
  value: string[];
  onChange: (value: string[]) => void;
  /** Placeholder-only mode: tap toggles a fake selected state without showing option lists. */
  mode?: "multi" | "single";
};

/**
 * Placeholder multi/single select.
 * Options content is intentionally not shown — tapping toggles a selected placeholder chip.
 */
export function MultiSelectField({
  label,
  placeholder,
  value,
  onChange,
  mode = "multi",
}: MultiSelectFieldProps) {
  const [open, setOpen] = useState(false);
  const hasSelection = value.length > 0;

  const handleTogglePlaceholder = () => {
    if (hasSelection) {
      onChange([]);
      setOpen(false);
      return;
    }
    // Keep placeholder-only UX: store a sentinel so "selected" state is visible.
    onChange(mode === "single" ? ["selected"] : ["option-a", "option-b"]);
    setOpen(false);
  };

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={() => setOpen((prev) => !prev)}
        style={({ pressed }) => [styles.trigger, pressed && styles.pressed]}
      >
        <Text style={[styles.triggerText, hasSelection && styles.triggerTextSelected]} numberOfLines={1}>
          {hasSelection ? `已选择 ${value.length} 项` : placeholder}
        </Text>
        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={18}
          color={colors.textMuted}
        />
      </Pressable>

      {open ? (
        <View style={styles.dropdown}>
          <Pressable
            accessibilityRole="button"
            onPress={handleTogglePlaceholder}
            style={({ pressed }) => [styles.option, pressed && styles.pressed]}
          >
            <Text style={styles.optionText}>
              {hasSelection ? "清除选择" : "选择占位选项（内容稍后补充）"}
            </Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: spacing.sm,
  },
  label: {
    ...typography.label,
    color: colors.textSecondary,
  },
  trigger: {
    minHeight: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  triggerText: {
    ...typography.body,
    color: "rgba(255,255,255,0.35)",
    flex: 1,
  },
  triggerTextSelected: {
    color: colors.textPrimary,
  },
  dropdown: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: colors.surface,
    overflow: "hidden",
  },
  option: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  optionText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  pressed: {
    opacity: 0.88,
  },
});
