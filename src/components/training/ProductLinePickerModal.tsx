import { useMemo } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import { ProductLineId, ProductLineOption } from "@/types/training";
import { ColorPalette, radius, spacing, typography } from "@/theme";

type ProductLinePickerModalProps = {
  visible: boolean;
  productLines: ProductLineOption[];
  selectedId: ProductLineId;
  onSelect: (id: ProductLineId) => void;
  onClose: () => void;
};

export function ProductLinePickerModal({
  visible,
  productLines,
  selectedId,
  onSelect,
  onClose,
}: ProductLinePickerModalProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(event) => event.stopPropagation()}>
          <Text style={styles.title}>切换产品型号</Text>
          {productLines.map((line) => {
            const selected = line.id === selectedId;
            return (
              <Pressable
                key={line.id}
                accessibilityRole="button"
                onPress={() => {
                  onSelect(line.id);
                  onClose();
                }}
                style={({ pressed }) => [
                  styles.option,
                  selected && styles.optionSelected,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.optionText}>
                  <Text style={styles.optionName}>{line.name}</Text>
                  <Text style={styles.optionSubtitle}>{line.subtitle}</Text>
                </View>
                {selected ? (
                  <Ionicons name="checkmark-circle" size={22} color={colors.accent} />
                ) : null}
              </Pressable>
            );
          })}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
    gap: spacing.sm,
  },
  title: {
    ...typography.subtitle,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 56,
    gap: spacing.sm,
  },
  optionSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accentGlass,
  },
  optionText: {
    flex: 1,
    gap: spacing.xs,
  },
  optionName: {
    ...typography.subtitle,
    color: colors.textPrimary,
  },
  optionSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  pressed: {
    opacity: 0.85,
  },
  });
}
