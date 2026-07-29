import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { DigitText } from "@/components/DigitText";
import { GlassButton } from "@/components/GlassButton";
import { GlassSurface } from "@/components/GlassSurface";
import { useTheme } from "@/context/ThemeContext";
import { formatDuration } from "@/data/trainingMock";
import { TrainingReport } from "@/types/training";
import { ColorPalette, numericType, spacing, typography } from "@/theme";

type TrainingReportViewProps = {
  report: TrainingReport;
  onGoHome: () => void;
};

export function TrainingReportView({ report, onGoHome }: TrainingReportViewProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.container}>
      <Text style={styles.hero}>训练结束</Text>
      <Text style={styles.subtitle}>{report.trainingTypeLabel} · 自由训练</Text>

      <GlassSurface contentStyle={styles.card}>
        <View style={styles.metricsGrid}>
          <MetricItem styles={styles} label="训练时长" value={formatDuration(report.durationSeconds)} />
          <MetricItem styles={styles} label="总容量" value={`${report.capacityKg} kg`} />
          <MetricItem styles={styles} label="输出能量" value={`${report.energyKj} kJ`} />
          <MetricItem styles={styles} label="消耗" value={`${report.caloriesKcal} 千卡`} />
        </View>
      </GlassSurface>

      <GlassSurface contentStyle={styles.card}>
        <Text style={styles.cardTitle}>训练设置</Text>
        <SetupRow styles={styles} label="训练模式" value={report.trainingTypeLabel} />
        <SetupRow styles={styles} label="阻力模式" value={report.modeLabel} />
        <SetupRow styles={styles} label="器械" value={report.equipmentLabel} />
      </GlassSurface>

      <GlassButton onPress={onGoHome}>
        <Text style={styles.ctaText}>返回首页</Text>
      </GlassButton>
    </View>
  );
}

function MetricItem({
  label,
  value,
  styles,
}: {
  label: string;
  value: string;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <View style={styles.metricItem}>
      <Text style={styles.metricLabel}>{label}</Text>
      <DigitText style={styles.metricValue}>{value}</DigitText>
    </View>
  );
}

function SetupRow({
  label,
  value,
  styles,
}: {
  label: string;
  value: string;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <View style={styles.setupRow}>
      <Text style={styles.setupLabel}>{label}</Text>
      <Text style={styles.setupValue}>{value}</Text>
    </View>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  hero: {
    ...typography.hero,
    color: colors.accent,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  card: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  cardTitle: {
    ...typography.subtitle,
    color: colors.textPrimary,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  metricItem: {
    width: "47%",
    gap: spacing.xs,
  },
  metricLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  metricValue: {
    ...typography.subtitle,
    ...numericType,
    color: colors.textPrimary,
  },
  setupRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.md,
  },
  setupLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  setupValue: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  ctaText: {
    ...typography.subtitle,
    color: colors.accentText,
    textAlign: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  });
}
