import { StyleSheet, Text, View } from "react-native";
import { radius, spacing, typography } from "@/theme";
import { getMetaChipPalette, type MetaChipStyle } from "@/theme/metaChip";

type ContentTagRowProps = {
  tags: { label?: string; value: string; style: MetaChipStyle }[];
};

export function ContentTagRow({ tags }: ContentTagRowProps) {
  return (
    <View style={styles.wrap}>
      {tags.map(({ label, value, style }, index) => {
        const palette = getMetaChipPalette(style);
        return (
          <View
            key={`${label ?? style}-${value}-${index}`}
            style={[
              styles.tag,
              {
                backgroundColor: palette.background,
                borderColor: palette.border,
              },
            ]}
          >
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
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderWidth: 1,
  },
  tagValue: {
    ...typography.label,
    fontSize: 12,
  },
});
