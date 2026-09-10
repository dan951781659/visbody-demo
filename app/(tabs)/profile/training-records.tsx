import { useMemo, useState } from "react";
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { GlassIconButton } from "@/components/GlassIconButton";
import { TrainingRecordMonthFilterSheet } from "@/components/profile/TrainingRecordMonthFilterSheet";
import { TrainingRecordPeriodSummary } from "@/components/profile/TrainingRecordPeriodSummary";
import { TrainingRecordRangeHeader } from "@/components/profile/TrainingRecordRangeHeader";
import { TrainingRecordRow } from "@/components/profile/TrainingRecordRow";
import { TrainingRecordStatsCharts } from "@/components/profile/TrainingRecordStatsCharts";
import { useTheme } from "@/context/ThemeContext";
import {
  groupTrainingRecordsByDate,
  GroupedTrainingRecords,
  recordModeOptions,
  recordSourceOptions,
  trainingRecords,
} from "@/data/userMock";
import { ColorPalette, layout, radius, spacing, typography } from "@/theme";
import type { ListFilterState, TrainingRecordsRange } from "@/types/trainingRecord";
import {
  buildPeriodStats,
  describeListFilters,
  filterRecordsByPeriod,
  filterTrainingRecordsList,
  formatMonthLabel,
  getActivePeriod,
  getPreviousPeriod,
  getStatPeriodLabel,
  hasActiveListFilters,
  resolveStatsAnchorDate,
} from "@/utils/trainingRecordStats";

type ListItem =
  | { type: "header"; title: string }
  | { type: "record"; record: GroupedTrainingRecords["records"][number] };

export default function TrainingRecordsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [range, setRange] = useState<TrainingRecordsRange>("week");
  const [weekOffset, setWeekOffset] = useState(0);
  const [monthOffset, setMonthOffset] = useState(0);
  const [filters, setFilters] = useState<ListFilterState>({
    source: "all",
    mode: "all",
  });
  const [monthModalVisible, setMonthModalVisible] = useState(false);

  const anchorIso = useMemo(() => resolveStatsAnchorDate(trainingRecords), []);
  const period = useMemo(
    () => (range === "all" ? null : getActivePeriod(range, anchorIso, weekOffset, monthOffset)),
    [range, anchorIso, weekOffset, monthOffset],
  );
  const previousPeriod = useMemo(
    () =>
      range === "all" ? null : getPreviousPeriod(range, anchorIso, weekOffset, monthOffset),
    [range, anchorIso, weekOffset, monthOffset],
  );
  const periodLabel = period && range !== "all" ? getStatPeriodLabel(range, period) : undefined;
  const canGoNext = range === "week" ? weekOffset < 0 : range === "month" ? monthOffset < 0 : false;

  const stats = useMemo(() => {
    if (!period || range === "all") return null;
    return buildPeriodStats(trainingRecords, range, period, previousPeriod ?? undefined);
  }, [period, previousPeriod, range]);

  const periodRecords = useMemo(() => {
    if (!period || range === "all") return [];
    return filterRecordsByPeriod(trainingRecords, period);
  }, [period, range]);

  const listRecords = useMemo(
    () => filterTrainingRecordsList(trainingRecords, filters),
    [filters],
  );

  const listItems = useMemo<ListItem[]>(() => {
    const result: ListItem[] = [];
    groupTrainingRecordsByDate(listRecords).forEach((group) => {
      result.push({ type: "header", title: group.title });
      group.records.forEach((record) => result.push({ type: "record", record }));
    });
    return result;
  }, [listRecords]);

  const monthSummary =
    filters.startMonth || filters.endMonth
      ? `${filters.startMonth ? formatMonthLabel(filters.startMonth) : "不限"} - ${
          filters.endMonth ? formatMonthLabel(filters.endMonth) : "不限"
        }`
      : null;

  const changeRange = (next: TrainingRecordsRange) => {
    setRange(next);
  };

  const shiftPeriod = (delta: number) => {
    if (range === "week") {
      setWeekOffset((value) => Math.min(0, value + delta));
      return;
    }
    if (range === "month") {
      setMonthOffset((value) => Math.min(0, value + delta));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <GlassIconButton accessibilityLabel="返回" onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </GlassIconButton>
        <Text style={styles.title}>训练记录</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.rangeWrap}>
        <TrainingRecordRangeHeader
          range={range}
          periodLabel={periodLabel}
          canGoNext={canGoNext}
          onChangeRange={changeRange}
          onPrevPeriod={() => shiftPeriod(-1)}
          onNextPeriod={() => shiftPeriod(1)}
        />
      </View>

      {range === "all" ? (
        <>
          <View style={styles.filters}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
              {recordSourceOptions.map((option) => {
                const selected = filters.source === option.id;
                return (
                  <Pressable
                    key={option.id}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    accessibilityLabel={option.label}
                    onPress={() => setFilters((current) => ({ ...current, source: option.id }))}
                    style={[styles.chip, selected && styles.chipSelected]}
                  >
                    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{option.label}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
              {recordModeOptions.map((option) => {
                const selected = filters.mode === option.id;
                return (
                  <Pressable
                    key={option.id}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    accessibilityLabel={option.label}
                    onPress={() => setFilters((current) => ({ ...current, mode: option.id }))}
                    style={[styles.chip, selected && styles.chipSelected]}
                  >
                    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{option.label}</Text>
                  </Pressable>
                );
              })}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={monthSummary ? "修改月份筛选" : "按月份筛选"}
                accessibilityState={{ selected: Boolean(monthSummary) }}
                onPress={() => setMonthModalVisible(true)}
                style={[styles.calendarButton, monthSummary && styles.calendarButtonSelected]}
              >
                <Ionicons
                  name="calendar-outline"
                  size={19}
                  color={monthSummary ? colors.accentText : colors.textPrimary}
                />
              </Pressable>
            </ScrollView>
            {hasActiveListFilters(filters) ? (
              <View style={styles.filterHintRow}>
                <Text style={styles.filterHint} numberOfLines={2}>
                  {describeListFilters(filters)}
                </Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="清除筛选"
                  onPress={() => setFilters({ source: "all", mode: "all" })}
                >
                  <Text style={styles.clearHint}>清除</Text>
                </Pressable>
              </View>
            ) : null}
            {monthSummary ? <Text style={styles.dateSummary}>{monthSummary}</Text> : null}
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
                <Text style={styles.emptyTitle}>当前筛选下暂无记录</Text>
                <Text style={styles.emptyHint}>尝试调整类型、场景或月份筛选</Text>
              </View>
            }
            renderItem={({ item }) =>
              item.type === "header" ? (
                <Text style={styles.groupTitle}>{item.title}</Text>
              ) : (
                <TrainingRecordRow
                  record={item.record}
                  onPress={() => router.push(`/profile/training-record/${item.record.id}`)}
                />
              )
            }
          />
        </>
      ) : (
        <ScrollView contentContainerStyle={styles.chartsContent} showsVerticalScrollIndicator={false}>
          {stats ? (
            <>
              <TrainingRecordPeriodSummary summary={stats.summary} />
              <TrainingRecordStatsCharts
                stats={stats}
                periodRecords={periodRecords}
                onSelectRecord={(record) => router.push(`/profile/training-record/${record.id}`)}
              />
            </>
          ) : null}
        </ScrollView>
      )}

      <TrainingRecordMonthFilterSheet
        visible={monthModalVisible}
        startMonth={filters.startMonth}
        endMonth={filters.endMonth}
        onClose={() => setMonthModalVisible(false)}
        onApply={(startMonth, endMonth) => {
          setFilters((current) => ({ ...current, startMonth, endMonth }));
          setMonthModalVisible(false);
        }}
        onClear={() => {
          setFilters((current) => ({
            ...current,
            startMonth: undefined,
            endMonth: undefined,
          }));
          setMonthModalVisible(false);
        }}
      />
    </SafeAreaView>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: layout.screenPadding,
      paddingTop: spacing.sm,
      paddingBottom: spacing.md,
    },
    title: { ...typography.sectionTitle, color: colors.textPrimary },
    headerSpacer: { width: 44 },
    rangeWrap: {
      paddingHorizontal: layout.screenPadding,
      marginBottom: spacing.md,
    },
    filters: {
      paddingHorizontal: layout.screenPadding,
      marginBottom: spacing.sm,
      gap: spacing.sm,
    },
    chipScroll: {
      gap: spacing.xs,
      paddingRight: spacing.md,
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
    chipText: { ...typography.label, color: colors.textSecondary },
    chipTextSelected: { color: colors.accentText },
    calendarButton: {
      width: 38,
      height: 36,
      borderRadius: radius.pill,
      borderWidth: 1,
      borderColor: colors.glassBorder,
      backgroundColor: colors.glassHighlight,
      alignItems: "center",
      justifyContent: "center",
    },
    calendarButtonSelected: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    filterHintRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },
    filterHint: {
      ...typography.caption,
      color: colors.textSecondary,
      flex: 1,
    },
    clearHint: {
      ...typography.label,
      color: colors.accent,
    },
    dateSummary: {
      ...typography.caption,
      color: colors.accent,
    },
    listContent: {
      paddingHorizontal: layout.screenPadding,
      paddingBottom: layout.tabScreenBottomInset + spacing.xxxl,
    },
    chartsContent: {
      paddingHorizontal: layout.screenPadding,
      paddingBottom: layout.tabScreenBottomInset + spacing.xxxl,
      gap: spacing.md,
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
    emptyTitle: { ...typography.subtitle, color: colors.textPrimary },
    emptyHint: { ...typography.caption, color: colors.textSecondary },
  });
}
