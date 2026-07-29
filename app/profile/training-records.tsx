import { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { GlassIconButton } from "@/components/GlassIconButton";
import { TrainingRecordRow } from "@/components/profile/TrainingRecordRow";
import { useTheme } from "@/context/ThemeContext";
import {
  filterTrainingRecords,
  groupTrainingRecordsByDate,
  GroupedTrainingRecords,
  recordRangeOptions,
  recordSourceOptions,
  RecordRangeFilter,
  RecordSourceFilter,
  trainingRecords,
} from "@/data/userMock";
import { ColorPalette, layout, radius, spacing, typography } from "@/theme";

type ListItem =
  | { type: "header"; title: string }
  | { type: "record"; record: GroupedTrainingRecords["records"][number] };

export default function TrainingRecordsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [range, setRange] = useState<RecordRangeFilter>("30d");
  const [source, setSource] = useState<RecordSourceFilter>("all");

  const filteredRecords = useMemo(
    () => filterTrainingRecords(trainingRecords, range, source),
    [range, source],
  );

  const listItems = useMemo(() => {
    const grouped = groupTrainingRecordsByDate(filteredRecords);
    const items: ListItem[] = [];

    grouped.forEach((group) => {
      items.push({ type: "header", title: group.title });
      group.records.forEach((record) => {
        items.push({ type: "record", record });
      });
    });

    return items;
  }, [filteredRecords]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <GlassIconButton accessibilityLabel="返回" onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </GlassIconButton>
        <Text style={styles.title}>训练记录</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.filters}>
        <View style={styles.filterRow}>
          {recordRangeOptions.map((option) => {
            const selected = range === option.id;
            return (
              <Pressable
                key={option.id}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={option.label}
                onPress={() => setRange(option.id)}
                style={({ pressed }) => [
                  styles.chip,
                  selected && styles.chipSelected,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{option.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.filterRow}>
          {recordSourceOptions.map((option) => {
            const selected = source === option.id;
            return (
              <Pressable
                key={option.id}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={option.label}
                onPress={() => setSource(option.id)}
                style={({ pressed }) => [
                  styles.chip,
                  selected && styles.chipSelected,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{option.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <FlatList
        data={listItems}
        keyExtractor={(item, index) =>
          item.type === "header" ? `header-${item.title}-${index}` : item.record.id
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>暂无训练记录</Text>
            <Text style={styles.emptyHint}>尝试调整筛选条件查看更多记录</Text>
          </View>
        }
        renderItem={({ item }) => {
          if (item.type === "header") {
            return <Text style={styles.groupTitle}>{item.title}</Text>;
          }

          return (
            <TrainingRecordRow
              record={item.record}
              onPress={() => router.push(`/profile/training-record/${item.record.id}`)}
            />
          );
        }}
      />
    </SafeAreaView>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.sectionTitle,
    color: colors.textPrimary,
  },
  headerSpacer: {
    width: 44,
  },
  filters: {
    paddingHorizontal: layout.screenPadding,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  chip: {
    minHeight: 36,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: colors.glassHighlight,
    alignItems: "center",
    justifyContent: "center",
  },
  chipSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  chipText: {
    ...typography.label,
    color: colors.textSecondary,
  },
  chipTextSelected: {
    color: colors.accentText,
  },
  listContent: {
    paddingHorizontal: layout.screenPadding,
    paddingBottom: spacing.xxxl,
  },
  groupTitle: {
    ...typography.subtitle,
    color: colors.textPrimary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: spacing.xxxl,
    gap: spacing.sm,
  },
  emptyTitle: {
    ...typography.subtitle,
    color: colors.textPrimary,
  },
  emptyHint: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  pressed: {
    opacity: 0.88,
  },
  });
}
