import { useEffect, useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { DigitText } from "@/components/DigitText";
import { GlassIconButton } from "@/components/GlassIconButton";
import { GlassSurface } from "@/components/GlassSurface";
import { useTheme } from "@/context/ThemeContext";
import { getRecordModeIcon, getTrainingRecordById } from "@/data/userMock";
import { ColorPalette, layout, numericType, radius, spacing, typography } from "@/theme";

export default function TrainingRecordDetailScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { id } = useLocalSearchParams<{ id: string }>();
  const record = id ? getTrainingRecordById(id) : undefined;

  useEffect(() => {
    if (!record) {
      router.replace("/profile/training-records");
    }
  }, [record, router]);

  if (!record) {
    return null;
  }

  const iconName = getRecordModeIcon(record.mode);
  const metrics = [
    { label: "训练时长", value: record.durationLabel },
    { label: "训练类型", value: record.trainingTypeLabel },
    { label: "训练场景", value: record.modeLabel },
    { label: "训练来源", value: record.sourceLabel },
    { label: "完成时间", value: record.timeLabel },
    {
      label: record.capacityKg ? "训练容量" : "消耗热量",
      value: record.metricLabel,
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <GlassIconButton accessibilityLabel="返回" onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </GlassIconButton>
        <Text style={styles.title}>训练详情</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <GlassSurface contentStyle={styles.heroCard}>
          <View style={styles.iconWrap}>
            <Ionicons name={iconName} size={28} color={colors.accent} />
          </View>
          <Text style={styles.heroTitle}>{record.title}</Text>
          <DigitText style={styles.heroMetric}>{record.metricLabel}</DigitText>
          <DigitText style={styles.heroMeta}>
            {`${record.timeLabel} · ${record.durationLabel}`}
          </DigitText>
        </GlassSurface>

        <Text style={styles.sectionTitle}>训练数据</Text>
        <GlassSurface contentStyle={styles.metricsCard}>
          {metrics.map((metric, index) => (
            <View
              key={metric.label}
              style={[styles.metricRow, index < metrics.length - 1 && styles.metricRowBorder]}
            >
              <Text style={styles.metricLabel}>{metric.label}</Text>
              <DigitText style={styles.metricValue}>{metric.value}</DigitText>
            </View>
          ))}
        </GlassSurface>

        <Text style={styles.sectionTitle}>备注</Text>
        <GlassSurface contentStyle={styles.noteCard}>
          <Text style={styles.noteText}>该记录为演示数据，后续将接入真实训练会话与报告数据。</Text>
        </GlassSurface>
      </ScrollView>
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
  content: {
    paddingHorizontal: layout.screenPadding,
    paddingBottom: spacing.xxxl,
  },
  heroCard: {
    alignItems: "center",
    padding: spacing.xxl,
    gap: spacing.sm,
    marginBottom: spacing.xxl,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: colors.accentGlass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  heroTitle: {
    ...typography.title,
    color: colors.textPrimary,
    textAlign: "center",
  },
  heroMetric: {
    fontSize: 28,
    ...numericType,
    color: colors.accent,
  },
  heroMeta: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  metricsCard: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xxl,
  },
  metricRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  metricRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  metricLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  metricValue: {
    ...typography.subtitle,
    ...numericType,
    color: colors.textPrimary,
    textAlign: "right",
    flexShrink: 1,
  },
  noteCard: {
    padding: spacing.lg,
  },
  noteText: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  });
}
