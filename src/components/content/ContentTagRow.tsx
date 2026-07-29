import { StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, typography } from "@/theme";

type ContentTagRowProps = {
  tags: { label: string; value: string }[];
};

export function ContentTagRow({ tags }: ContentTagRowProps) {
  return (
    <View style={styles.wrap}>
      {tags.map(({ label, value }) => (
        <View key={`${label}-${value}`} style={styles.tag}>
          <Text style={styles.tagLabel}>{label}</Text>
          <Text style={styles.tagValue}>{value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  tagLabel: {
    ...typography.label,
    fontSize: 11,
    color: colors.textMuted,
  },
  tagValue: {
    ...typography.label,
    fontSize: 12,
    color: colors.textPrimary,
  },
});
