import { StyleSheet, Text, View } from "react-native";
import { radius, spacing, typography } from "@/theme";
import { getMetaChipPalette, type MetaChipStyle } from "@/theme/metaChip";

type ContentTagRowProps = {
  tags: { label: string; value: string; style: MetaChipStyle }[];
};

export function ContentTagRow({ tags }: ContentTagRowProps) {
  return (
    <View style={styles.wrap}>
      {tags.map(({ label, value, style }) => {
        const palette = getMetaChipPalette(style);
        return (
          <View
            key={`${label}-${value}`}
            style={[
              styles.tag,
              {
                backgroundColor: palette.background,
                borderColor: palette.border,
              },
            ]}
          >
            <Text style={[styles.tagLabel, { color: palette.text, opacity: 0.72 }]}>{label}</Text>
            <Text style={[styles.tagValue, { color: palette.text }]}>{value}</Text>
          </View>
        );
      })}
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
    borderWidth: 1,
  },
  tagLabel: {
    ...typography.label,
    fontSize: 11,
  },
  tagValue: {
    ...typography.label,
    fontSize: 12,
  },
});
