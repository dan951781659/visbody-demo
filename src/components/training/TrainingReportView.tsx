import { useMemo, type Ref } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DigitText } from "@/components/DigitText";
import { ReportActionAnalysis, ReportActionCompletion } from "@/components/training/ReportActionSections";
import { ReportIntensitySection } from "@/components/training/ReportIntensitySection";
import { ReportPowerCurves } from "@/components/training/ReportPowerCurves";
import { useTheme } from "@/context/ThemeContext";
import { formatDuration } from "@/data/trainingMock";
import { TrainingReport } from "@/types/training";
import { ColorPalette, numericType, radius, spacing, typography } from "@/theme";
import { isPlanTrainingScene } from "@/utils/trainingReport";

export type TrainingReportViewProps = {
  report: TrainingReport;
  /** Capture target excludes action buttons so long images stay clean. */
  captureRef?: Ref<View>;
  mode?: "session" | "history";
  onPrimaryAction?: () => void;
  primaryActionLabel?: string;
};

function formatReportDateTime(finishedAt: number, durationSeconds: number): string {
  const end = new Date(finishedAt);
  const start = new Date(finishedAt - Math.max(0, durationSeconds) * 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  const date = `${end.getFullYear()}/${pad(end.getMonth() + 1)}/${pad(end.getDate())}`;
  const startTime = `${pad(start.getHours())}:${pad(start.getMinutes())}`;
  const endTime = `${pad(end.getHours())}:${pad(end.getMinutes())}`;
  return `${date} ${startTime} – ${endTime}`;
}

function formatDurationHms(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  const s = safe % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function TrainingReportView({
  report,
  captureRef,
  mode = "session",
  onPrimaryAction,
  primaryActionLabel = "返回首页",
}: TrainingReportViewProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const showStrength = !report.hideResistanceMetrics;
  const showActionCompletion = report.source === "plan_follow" && Boolean(report.planMoves?.length);
  const title =
    report.title ||
    report.planName ||
    `${report.trainingTypeLabel}${isPlanTrainingScene(report.scene) ? "" : ` · ${report.sourceLabel}`}`;
  const subtitle = isPlanTrainingScene(report.scene)
    ? `${report.planName ?? "计划训练"} · ${report.planDayName ?? ""}`
    : `${report.sourceLabel} · ${report.sceneLabel}`;

  const metricCells = [
    { label: "训练时长", value: formatDurationHms(report.durationSeconds) },
    { label: "输出能量", value: `${report.energyKj} kJ` },
    ...(report.hideResistanceMetrics
      ? []
      : [{ label: "总容量", value: `${Math.round(report.capacityKg)} kg` }]),
  ];

  return (
    <View style={styles.container}>
      <View ref={captureRef} collapsable={false} style={styles.captureRoot}>
        <View style={styles.hero}>
          <View style={styles.userRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{report.userAvatar}</Text>
            </View>
            <View style={styles.userCopy}>
              <Text style={styles.userName}>{report.userName}</Text>
              <Text style={styles.userTime}>
                {formatReportDateTime(report.finishedAt, report.durationSeconds)}
              </Text>
            </View>
          </View>

          <View style={styles.heroBody}>
            <View style={styles.heroCopy}>
              <View style={styles.typeRow}>
                <Ionicons
                  name={
                    report.trainingType === "pilates"
                      ? "body-outline"
                      : report.trainingType === "resistance_cardio"
                        ? "heart-outline"
                        : "barbell-outline"
                  }
                  size={16}
                  color={colors.textSecondary}
                />
                <Text style={styles.typeText}>{report.trainingTypeLabel}</Text>
              </View>

              <View style={styles.calorieRow}>
                <DigitText style={styles.calorieValue}>{report.caloriesKcal}</DigitText>
                <Text style={styles.calorieUnit}>千卡</Text>
              </View>
              <Text style={styles.calorieHint}>* 热量由训练时长与阻力综合估算</Text>
            </View>
          </View>
        </View>

        <View style={styles.banner}>
          <Text style={styles.bannerKicker}>{report.sourceLabel}</Text>
          <Text style={styles.bannerTitle} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.bannerMeta} numberOfLines={1}>
            {subtitle}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>训练数据</Text>
          <View style={styles.metricGrid}>
            {metricCells.map((cell) => (
              <View key={cell.label} style={styles.metricCell}>
                <DigitText style={styles.metricValue}>{cell.value}</DigitText>
                <Text style={styles.metricLabel}>{cell.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <ReportActionAnalysis report={report} />

        {showStrength ? (
          <>
            <ReportIntensitySection intensity={report.intensity} />
            <ReportPowerCurves timeline={report.timeline} />
          </>
        ) : null}

        {!Number.isFinite(Number(report.finalAiScore)) && report.coachNote ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>训练建议</Text>
            <Text style={styles.coachText}>{report.coachNote}</Text>
          </View>
        ) : null}

        {showActionCompletion ? <ReportActionCompletion moves={report.planMoves} /> : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>我的设备</Text>
          <View style={styles.deviceRow}>
            <View style={styles.deviceIcon}>
              <Ionicons name="hardware-chip-outline" size={22} color={colors.accent} />
            </View>
            <View style={styles.deviceCopy}>
              <Text style={styles.deviceName}>MotionStation</Text>
              <Text style={styles.deviceMeta}>
                本次训练 {formatDuration(report.durationSeconds)} · {report.sceneLabel}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerBrand}>
            <Text style={styles.footerBrandTitle}>MotionStation</Text>
            <Text style={styles.footerBrandHint}>训练报告</Text>
          </View>
        </View>
      </View>

      {onPrimaryAction ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={primaryActionLabel}
          onPress={onPrimaryAction}
          style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
        >
          <Text style={styles.primaryButtonText}>{primaryActionLabel}</Text>
        </Pressable>
      ) : mode === "history" ? null : null}
    </View>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    container: {
      gap: spacing.lg,
    },
    captureRoot: {
      backgroundColor: colors.background,
      gap: 0,
    },
    hero: {
      gap: spacing.md,
      paddingBottom: spacing.lg,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    userRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
    },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: radius.pill,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.surfaceElevated,
    },
    avatarText: {
      ...typography.subtitle,
      color: colors.textPrimary,
    },
    userCopy: {
      flex: 1,
      gap: 2,
    },
    userName: {
      ...typography.subtitle,
      color: colors.textPrimary,
    },
    userTime: {
      ...typography.caption,
      fontSize: 13,
      color: colors.textMuted,
    },
    heroBody: {
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "space-between",
      gap: spacing.md,
    },
    heroCopy: {
      flex: 1,
      gap: spacing.xs,
      paddingBottom: spacing.xs,
      minWidth: 0,
    },
    typeRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
    },
    typeText: {
      ...typography.caption,
      color: colors.textSecondary,
    },
    calorieRow: {
      flexDirection: "row",
      alignItems: "baseline",
      gap: spacing.sm,
      marginTop: spacing.xs,
    },
    calorieValue: {
      fontSize: 56,
      lineHeight: 60,
      ...numericType,
      color: colors.textPrimary,
    },
    calorieUnit: {
      ...typography.subtitle,
      color: colors.textSecondary,
    },
    calorieHint: {
      ...typography.caption,
      fontSize: 12,
      color: colors.textMuted,
      marginTop: 2,
    },
    banner: {
      marginTop: spacing.lg,
      marginBottom: spacing.sm,
      borderRadius: radius.lg,
      padding: spacing.lg,
      gap: spacing.xs,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    bannerKicker: {
      ...typography.caption,
      fontSize: 12,
      color: colors.accent,
    },
    bannerTitle: {
      ...typography.subtitle,
      color: colors.textPrimary,
    },
    bannerMeta: {
      ...typography.caption,
      fontSize: 13,
      color: colors.textMuted,
    },
    section: {
      gap: spacing.md,
      paddingVertical: spacing.lg,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    sectionTitle: {
      ...typography.subtitle,
      color: colors.textPrimary,
    },
    metricGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      rowGap: spacing.lg,
    },
    metricCell: {
      width: "33.33%",
      gap: 4,
      paddingRight: spacing.sm,
    },
    metricValue: {
      fontSize: 20,
      ...numericType,
      color: colors.textPrimary,
    },
    metricLabel: {
      ...typography.caption,
      fontSize: 12,
      color: colors.textMuted,
    },
    coachText: {
      ...typography.caption,
      color: colors.textSecondary,
      lineHeight: 22,
    },
    deviceRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
    },
    deviceIcon: {
      width: 48,
      height: 48,
      borderRadius: radius.md,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    deviceCopy: {
      flex: 1,
      gap: 2,
    },
    deviceName: {
      ...typography.body,
      fontWeight: "600",
      color: colors.textPrimary,
    },
    deviceMeta: {
      ...typography.caption,
      fontSize: 13,
      color: colors.textMuted,
    },
    footer: {
      marginTop: spacing.lg,
      marginBottom: spacing.sm,
      borderRadius: radius.md,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      backgroundColor: colors.surfaceElevated,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: spacing.md,
    },
    footerBrand: {
      alignItems: "flex-end",
      gap: 2,
    },
    footerBrandTitle: {
      ...typography.label,
      color: colors.textPrimary,
      fontSize: 13,
    },
    footerBrandHint: {
      ...typography.caption,
      fontSize: 11,
      color: colors.textMuted,
    },
    primaryButton: {
      minHeight: 48,
      borderRadius: radius.pill,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.accentButtonFillStrong,
    },
    primaryButtonText: {
      ...typography.subtitle,
      color: colors.accentText,
    },
    pressed: {
      opacity: 0.88,
    },
  });
}
