import { useMemo, useRef, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { GlassIconButton } from "@/components/GlassIconButton";
import { GlassSurface } from "@/components/GlassSurface";
import { TrainingRecordRow } from "@/components/profile/TrainingRecordRow";
import { useTheme } from "@/context/ThemeContext";
import {
  filterTrainingRecords,
  groupTrainingRecordsByDate,
  GroupedTrainingRecords,
  recordSourceOptions,
  RecordSourceFilter,
  trainingRecords,
} from "@/data/userMock";
import { ColorPalette, layout, radius, spacing, typography } from "@/theme";

type ListItem =
  | { type: "header"; title: string }
  | { type: "record"; record: GroupedTrainingRecords["records"][number] };

const PAGE_IDS: RecordSourceFilter[] = ["all", "plan_follow", "free_training", "movement_follow"];

export default function TrainingRecordsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { width } = useWindowDimensions();
  const pagerRef = useRef<ScrollView>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();

  const handlePageChange = (index: number) => {
    setPageIndex(index);
    pagerRef.current?.scrollTo({ x: index * width, animated: true });
  };

  const handlePagerScroll = (event: { nativeEvent: { contentOffset: { x: number } } }) => {
    const nextIndex = Math.round(event.nativeEvent.contentOffset.x / Math.max(width, 1));
    if (nextIndex !== pageIndex && nextIndex >= 0 && nextIndex < PAGE_IDS.length) {
      setPageIndex(nextIndex);
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

      <View style={styles.filters}>
        <View style={styles.filterRow}>
          {recordSourceOptions.map((option) => {
              const selected = PAGE_IDS[pageIndex] === option.id;
              return (
                <Pressable
                  key={option.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  accessibilityLabel={option.label}
                  onPress={() => handlePageChange(PAGE_IDS.indexOf(option.id))}
                  style={({ pressed }) => [styles.chip, selected && styles.chipSelected, pressed && styles.pressed]}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{option.label}</Text>
                </Pressable>
              );
            })}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={startDate || endDate ? "修改日期范围筛选" : "按日期筛选"}
            accessibilityState={{ selected: Boolean(startDate && endDate) }}
            onPress={() => setDateModalVisible(true)}
            style={({ pressed }) => [styles.calendarButton, Boolean(startDate && endDate) && styles.calendarButtonSelected, pressed && styles.pressed]}
          >
            <Ionicons name="calendar-outline" size={19} color={startDate && endDate ? colors.accentText : colors.textPrimary} />
          </Pressable>
        </View>
        {startDate && endDate ? <Text style={styles.dateSummary}>{formatDateRange(startDate, endDate)}</Text> : null}
      </View>

      <ScrollView
        ref={pagerRef}
        style={styles.pager}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handlePagerScroll}
        scrollEventThrottle={16}
      >
        {PAGE_IDS.map((source) => (
          <RecordPage
            key={source}
            width={width}
            source={source}
            startDate={startDate}
            endDate={endDate}
            onRecordPress={(id) => router.push(`/profile/training-record/${id}`)}
            styles={styles}
          />
        ))}
      </ScrollView>

      <DateRangeModal
        visible={dateModalVisible}
        startDate={startDate}
        endDate={endDate}
        onClose={() => setDateModalVisible(false)}
        onApply={(nextStart, nextEnd) => {
          setStartDate(nextStart);
          setEndDate(nextEnd);
          setDateModalVisible(false);
        }}
        onClear={() => {
          setStartDate(undefined);
          setEndDate(undefined);
          setDateModalVisible(false);
        }}
        colors={colors}
      />
    </SafeAreaView>
  );
}

function RecordPage({
  width,
  source,
  startDate,
  endDate,
  onRecordPress,
  styles,
}: {
  width: number;
  source: RecordSourceFilter;
  startDate?: string;
  endDate?: string;
  onRecordPress: (id: string) => void;
  styles: ReturnType<typeof createStyles>;
}) {
  const records = useMemo(
    () => filterTrainingRecords(trainingRecords, source, startDate, endDate),
    [source, startDate, endDate],
  );
  const items = useMemo<ListItem[]>(() => {
    const result: ListItem[] = [];
    groupTrainingRecordsByDate(records).forEach((group) => {
      result.push({ type: "header", title: group.title });
      group.records.forEach((record) => result.push({ type: "record", record }));
    });
    return result;
  }, [records]);

  return (
    <FlatList
      data={items}
      style={[{ width }, styles.page]}
      keyExtractor={(item, index) => item.type === "header" ? `header-${item.title}-${index}` : item.record.id}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>暂无训练记录</Text>
          <Text style={styles.emptyHint}>尝试调整日期筛选查看更多记录</Text>
        </View>
      }
      renderItem={({ item }) => item.type === "header" ? (
        <Text style={styles.groupTitle}>{item.title}</Text>
      ) : (
        <TrainingRecordRow record={item.record} onPress={() => onRecordPress(item.record.id)} />
      )}
    />
  );
}

function DateRangeModal({
  visible,
  startDate,
  endDate,
  onClose,
  onApply,
  onClear,
  colors,
}: {
  visible: boolean;
  startDate?: string;
  endDate?: string;
  onClose: () => void;
  onApply: (startDate: string, endDate: string) => void;
  onClear: () => void;
  colors: ColorPalette;
}) {
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [draftStart, setDraftStart] = useState(startDate);
  const [draftEnd, setDraftEnd] = useState(endDate);
  const [cursor, setCursor] = useState("2026-07");
  const [error, setError] = useState("");

  const open = () => {
    setDraftStart(startDate);
    setDraftEnd(endDate);
    setError("");
  };
  const monthDays = getMonthDays(cursor);
  const selectDay = (date: string) => {
    setError("");
    if (!draftStart || (draftStart && draftEnd)) {
      setDraftStart(date);
      setDraftEnd(undefined);
    } else if (date < draftStart) {
      setDraftStart(date);
      setDraftEnd(undefined);
    } else {
      setDraftEnd(date);
    }
  };
  const apply = () => {
    if (!draftStart || !draftEnd) {
      setError("请选择开始和结束日期");
      return;
    }
    onApply(draftStart, draftEnd);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} onShow={open}>
      <View style={styles.modalOverlay}>
        <GlassSurface contentStyle={styles.dateModal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>日期筛选</Text>
            <Pressable accessibilityLabel="关闭日期筛选" onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </Pressable>
          </View>
          <Text style={styles.modalHint}>选择开始和结束日期</Text>
          <View style={styles.rangeFields}>
            <View style={[styles.rangeField, draftStart && styles.rangeFieldSelected]}>
              <Text style={styles.rangeFieldLabel}>开始日期</Text>
              <Text style={styles.rangeFieldValue}>{draftStart ? formatDate(draftStart) : "请选择"}</Text>
            </View>
            <Ionicons name="arrow-forward" size={16} color={colors.textMuted} />
            <View style={[styles.rangeField, draftEnd && styles.rangeFieldSelected]}>
              <Text style={styles.rangeFieldLabel}>结束日期</Text>
              <Text style={styles.rangeFieldValue}>{draftEnd ? formatDate(draftEnd) : "请选择"}</Text>
            </View>
          </View>
          <View style={styles.monthHeader}>
            <Pressable onPress={() => setCursor(addMonth(cursor, -1))} accessibilityLabel="上个月"><Ionicons name="chevron-back" size={20} color={colors.textPrimary} /></Pressable>
            <Text style={styles.monthTitle}>{formatMonth(cursor)}</Text>
            <Pressable onPress={() => setCursor(addMonth(cursor, 1))} accessibilityLabel="下个月"><Ionicons name="chevron-forward" size={20} color={colors.textPrimary} /></Pressable>
          </View>
          <View style={styles.weekRow}>{["日", "一", "二", "三", "四", "五", "六"].map((day) => <Text key={day} style={styles.weekDay}>{day}</Text>)}</View>
          <View style={styles.calendarGrid}>
            {monthDays.map((date, index) => {
              if (!date) return <View key={`empty-${index}`} style={styles.dayCell} />;
              const selected = date === draftStart || date === draftEnd;
              const inRange = Boolean(draftStart && draftEnd && date > draftStart && date < draftEnd);
              return <Pressable key={date} onPress={() => selectDay(date)} style={[styles.dayCell, inRange && styles.dayInRange, selected && styles.daySelected]}><Text style={[styles.dayText, selected && styles.dayTextSelected]}>{Number(date.slice(-2))}</Text></Pressable>;
            })}
          </View>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <View style={styles.modalActions}>
            <Pressable onPress={onClear} style={styles.clearButton}><Text style={styles.clearText}>清除筛选</Text></Pressable>
            <Pressable onPress={apply} style={styles.applyButton}><Text style={styles.applyText}>应用</Text></Pressable>
          </View>
        </GlassSurface>
      </View>
    </Modal>
  );
}

function getMonthDays(month: string): (string | null)[] {
  const [year, monthNumber] = month.split("-").map(Number);
  const firstDay = new Date(year, monthNumber - 1, 1).getDay();
  const count = new Date(year, monthNumber, 0).getDate();
  return [...Array(firstDay).fill(null), ...Array.from({ length: count }, (_, index) => `${year}-${String(monthNumber).padStart(2, "0")}-${String(index + 1).padStart(2, "0")}`)];
}
function addMonth(month: string, delta: number) { const date = new Date(`${month}-01T00:00:00`); date.setMonth(date.getMonth() + delta); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`; }
function formatMonth(month: string) { const [year, monthNumber] = month.split("-"); return `${year}年${Number(monthNumber)}月`; }
function formatDate(date: string) { const [, month, day] = date.split("-"); return `${Number(month)}月${Number(day)}日`; }
function formatDateRange(start: string, end: string) { return `${formatDate(start)} - ${formatDate(end)}`; }

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: layout.screenPadding, paddingTop: spacing.sm, paddingBottom: spacing.md },
    title: { ...typography.sectionTitle, color: colors.textPrimary },
    headerSpacer: { width: 44 },
    filters: { paddingHorizontal: layout.screenPadding, marginBottom: spacing.md },
    filterRow: { flexDirection: "row", gap: spacing.xs, alignItems: "center" },
    chip: { flex: 1, minHeight: 36, paddingHorizontal: spacing.xs, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.glassBorder, backgroundColor: colors.glassHighlight, alignItems: "center", justifyContent: "center" },
    chipSelected: { backgroundColor: colors.accent, borderColor: colors.accent },
    chipText: { ...typography.label, color: colors.textSecondary },
    chipTextSelected: { color: colors.accentText },
    calendarButton: { width: 38, height: 36, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.glassBorder, backgroundColor: colors.glassHighlight, alignItems: "center", justifyContent: "center" },
    calendarButtonSelected: { backgroundColor: colors.accent, borderColor: colors.accent },
    dateSummary: { ...typography.caption, color: colors.accent, marginTop: spacing.xs },
    pager: { flex: 1 },
    page: { flex: 1 },
    listContent: { paddingHorizontal: layout.screenPadding, paddingBottom: spacing.xxxl },
    groupTitle: { ...typography.subtitle, color: colors.textPrimary, marginTop: spacing.md, marginBottom: spacing.sm },
    emptyState: { alignItems: "center", paddingVertical: spacing.xxxl, gap: spacing.sm },
    emptyTitle: { ...typography.subtitle, color: colors.textPrimary },
    emptyHint: { ...typography.caption, color: colors.textSecondary },
    pressed: { opacity: 0.88 },
    modalOverlay: { flex: 1, justifyContent: "flex-end", backgroundColor: colors.overlay },
    dateModal: { borderBottomLeftRadius: 0, borderBottomRightRadius: 0, padding: spacing.xl, backgroundColor: colors.surfaceElevated },
    modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    modalTitle: { ...typography.subtitle, color: colors.textPrimary },
    closeButton: { padding: spacing.xs },
    modalHint: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.xs },
    rangeFields: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: spacing.lg },
    rangeField: { flex: 1, padding: spacing.md, borderRadius: radius.md, borderWidth: 1, borderColor: colors.glassBorder, backgroundColor: colors.glassHighlight },
    rangeFieldSelected: { borderColor: colors.accent },
    rangeFieldLabel: { ...typography.label, color: colors.textMuted },
    rangeFieldValue: { ...typography.caption, color: colors.textPrimary, marginTop: spacing.xs },
    monthHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: spacing.xl },
    monthTitle: { ...typography.label, color: colors.textPrimary },
    weekRow: { flexDirection: "row", marginTop: spacing.md },
    weekDay: { flex: 1, textAlign: "center", ...typography.caption, color: colors.textMuted },
    calendarGrid: { flexDirection: "row", flexWrap: "wrap", marginTop: spacing.xs },
    dayCell: { width: "14.285%", height: 40, alignItems: "center", justifyContent: "center", borderRadius: radius.pill },
    dayInRange: { backgroundColor: colors.accentGlass, borderRadius: 0 },
    daySelected: { backgroundColor: colors.accent },
    dayText: { ...typography.caption, color: colors.textPrimary },
    dayTextSelected: { color: colors.accentText, fontWeight: "700" },
    errorText: { ...typography.caption, color: colors.red, marginTop: spacing.sm },
    modalActions: { flexDirection: "row", justifyContent: "flex-end", alignItems: "center", gap: spacing.md, marginTop: spacing.lg },
    clearButton: { padding: spacing.md },
    clearText: { ...typography.label, color: colors.textSecondary },
    applyButton: { minWidth: 88, paddingVertical: spacing.md, paddingHorizontal: spacing.xl, borderRadius: radius.pill, backgroundColor: colors.accent, alignItems: "center" },
    applyText: { ...typography.label, color: colors.accentText },
  });
}
