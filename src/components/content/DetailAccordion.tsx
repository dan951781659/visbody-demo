import { useState, type ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing, typography } from "@/theme";

export type DetailAccordionItem = {
  id: string;
  title: string;
  content: ReactNode;
  defaultOpen?: boolean;
};

type DetailAccordionProps = {
  items: DetailAccordionItem[];
};

export function DetailAccordion({ items }: DetailAccordionProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(
    () => new Set(items.filter((item) => item.defaultOpen).map((item) => item.id)),
  );

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <View style={styles.group}>
      {items.map((item) => {
        const open = openIds.has(item.id);
        return (
          <View key={item.id} style={styles.card}>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ expanded: open }}
              onPress={() => toggle(item.id)}
              style={({ pressed }) => [styles.header, pressed && styles.pressed]}
            >
              <Text style={styles.title}>{item.title}</Text>
              <Ionicons
                name={open ? "chevron-up" : "chevron-down"}
                size={18}
                color={colors.textSecondary}
              />
            </Pressable>
            {open ? <View style={styles.content}>{item.content}</View> : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: spacing.sm,
  },
  card: {
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  title: {
    ...typography.subtitle,
    fontSize: 17,
    color: colors.textPrimary,
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.glassBorder,
    paddingTop: spacing.md,
  },
  pressed: {
    opacity: 0.88,
  },
});
