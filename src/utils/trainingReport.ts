import {
  AccuracyDistribution,
  IntensityDistribution,
  IntensityZone,
  TrainingReport,
  TrainingReportScene,
} from "@/types/training";

const INTENSITY_ZONE_CLASSES: IntensityZone["className"][] = ["z1", "z2", "z3", "z4", "z5"];
const AMPLITUDE_DISPLAY_CM = 40;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function formatDurationCompact(seconds: number): string {
  const safe = Math.max(0, Math.floor(Number(seconds) || 0));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  if (m > 0 && s > 0) return `${m}分 ${s}秒`;
  if (m > 0) return `${m}分`;
  return `${s}秒`;
}

function roundResistanceBucket(value: number): number {
  const numeric = Number(value) || 0;
  if (numeric <= 0) return 0;
  if (numeric < 10) return Math.round(numeric * 2) / 2;
  return Math.round(numeric);
}

function intensityClassForResistance(
  resistanceKg: number,
  sessionMin: number,
  sessionMax: number,
): IntensityZone["className"] {
  if (sessionMax <= sessionMin) return INTENSITY_ZONE_CLASSES[2];
  const position = (resistanceKg - sessionMin) / (sessionMax - sessionMin);
  const idx = Math.min(
    INTENSITY_ZONE_CLASSES.length - 1,
    Math.round(position * (INTENSITY_ZONE_CLASSES.length - 1)),
  );
  return INTENSITY_ZONE_CLASSES[idx];
}

export function buildIntensityDistribution(timeline: number[]): IntensityDistribution {
  const samples = (Array.isArray(timeline) ? timeline : [])
    .map((value) => Number(value) || 0)
    .filter((value) => value > 0);
  const bucketCounts = new Map<number, number>();

  samples.forEach((value) => {
    const kg = roundResistanceBucket(value);
    if (kg <= 0) return;
    bucketCounts.set(kg, (bucketCounts.get(kg) || 0) + 1);
  });

  if (!bucketCounts.size) {
    return { zones: [], ceiling: 0, settingsCount: 0, workingSeconds: 0, sessionSpan: "" };
  }

  const total = [...bucketCounts.values()].reduce((sum, count) => sum + count, 0) || 1;
  const entries = [...bucketCounts.entries()]
    .map(([resistanceKg, count]) => ({
      resistanceKg,
      seconds: count,
      ratio: count / total,
    }))
    .sort((a, b) => a.resistanceKg - b.resistanceKg);

  const sessionMin = entries[0].resistanceKg;
  const sessionMax = entries[entries.length - 1].resistanceKg;
  let dominantRatio = 0;
  entries.forEach((entry) => {
    if (entry.ratio > dominantRatio) dominantRatio = entry.ratio;
  });

  const zones: IntensityZone[] = entries.map((entry) => ({
    className: intensityClassForResistance(entry.resistanceKg, sessionMin, sessionMax),
    label: `${entry.resistanceKg}kg`,
    resistanceKg: entry.resistanceKg,
    ratio: entry.ratio,
    seconds: entry.seconds,
    durationLabel: formatDurationCompact(entry.seconds),
    dominant: entry.ratio === dominantRatio,
  }));

  return {
    zones,
    ceiling: sessionMax,
    settingsCount: zones.length,
    workingSeconds: total,
    sessionSpan: sessionMin === sessionMax ? `${sessionMin}kg` : `${sessionMin}-${sessionMax}kg`,
  };
}

export function buildPowerSeries(resistanceSeries: number[]): number[] {
  const safe = Array.isArray(resistanceSeries) ? resistanceSeries : [];
  if (!safe.length) return [];
  const rough = safe.map((value, idx) => {
    const prev = idx > 0 ? Number(safe[idx - 1] || 0) : Number(value || 0);
    const delta = Math.abs(Number(value || 0) - prev);
    return Math.max(0, Number(value || 0) * 0.46 + delta * 1.8);
  });
  return rough.map((_, idx) => {
    const from = Math.max(0, idx - 1);
    const to = Math.min(rough.length - 1, idx + 1);
    const segment = rough.slice(from, to + 1);
    return segment.reduce((sum, item) => sum + item, 0) / segment.length;
  });
}

export function buildAmplitudeSeries(sourceSeries: number[]): number[] {
  const safe = (Array.isArray(sourceSeries) ? sourceSeries : []).map((value) => Number(value) || 0);
  if (!safe.length) return [];
  const maxValue = Math.max(1, ...safe);
  const rough = safe.map((value, idx) => {
    const normalized = value / maxValue;
    const wave = Math.sin(idx * 0.55) * 0.16 + Math.sin(idx * 0.21 + 0.8) * 0.1;
    const base = 0.92 - normalized * 0.42;
    return Math.max(0.18, base + wave);
  });
  return rough.map((_, idx) => {
    const from = Math.max(0, idx - 1);
    const to = Math.min(rough.length - 1, idx + 1);
    const segment = rough.slice(from, to + 1);
    return segment.reduce((sum, item) => sum + item, 0) / segment.length;
  });
}

export function calcConsistency(timeline: number[], maxResistance: number): number {
  if (!timeline.length) return 0;
  const avg = timeline.reduce((sum, item) => sum + item, 0) / timeline.length;
  const variance = timeline.reduce((sum, item) => sum + (item - avg) ** 2, 0) / timeline.length;
  const std = Math.sqrt(variance);
  return Math.round(clamp(100 - (std / Math.max(1, maxResistance)) * 180, 0, 100));
}

export function getCoachNote(
  consistency: number,
  peakResistance: number,
  maxResistance: number,
): string {
  const peakRatio = peakResistance / Math.max(1, maxResistance);
  if (consistency >= 86 && peakRatio >= 0.7) {
    return "节奏控制出色。保持当前输出曲线，下次可将峰值阻力提升 2–5kg。";
  }
  if (consistency >= 72) {
    return "整体控制良好。可尝试延长高强度阶段，提升总做功能力。";
  }
  return "强度波动偏大。下次请更关注稳定节奏与匀速发力。";
}

export function summarizeCurve(
  series: number[],
  unit: string,
  displayScale = 1,
): { peakLabel: string; avgLabel: string; foot: string } {
  if (!series.length) {
    return { peakLabel: "--", avgLabel: "--", foot: "暂无数据" };
  }
  const peak = Math.max(...series) * displayScale;
  const avg = (series.reduce((sum, item) => sum + item, 0) / series.length) * displayScale;
  const peakLabel = `${peak.toFixed(0)}${unit}`;
  const avgLabel = `${avg.toFixed(0)}${unit}`;
  return {
    peakLabel,
    avgLabel,
    foot: `峰值 ${peakLabel} · 均值 ${avgLabel}`,
  };
}

export function normalizeAccuracyDistribution(
  distribution?: AccuracyDistribution | null,
): AccuracyDistribution | null {
  if (!distribution) return null;
  const better = Math.max(0, Math.min(100, Number(distribution.better) || 0));
  const good = Math.max(0, Math.min(100, Number(distribution.good) || 0));
  const perfect = Math.max(0, Math.min(100, Number(distribution.perfect) || 0));
  const total = Math.max(1, better + good + perfect);
  return {
    better: Math.round((better / total) * 100),
    good: Math.round((good / total) * 100),
    perfect: Math.max(0, 100 - Math.round((better / total) * 100) - Math.round((good / total) * 100)),
  };
}

export function shouldHideResistanceMetrics(report: Pick<TrainingReport, "scene" | "trainingType" | "sceneLabel">): boolean {
  if (report.scene === "pilates" || report.trainingType === "pilates") return true;
  const context = `${report.scene} ${report.sceneLabel} ${report.trainingType}`;
  return /bodyweight[_\s-]*cardio|非阻力|徒手/i.test(context);
}

export function getReportSessionMeta(report: TrainingReport): string {
  if (report.scene === "plan-training") {
    return `训练完成 · ${report.planName || "计划训练"} · ${report.planDayName || "第 1 周第 1 天"}`;
  }
  return `训练完成 · ${report.sceneLabel}`;
}

export function getIntensityRangeLabel(intensity: IntensityDistribution): string {
  if (!intensity.settingsCount) return "未记录阻力";
  if (intensity.settingsCount > 1) {
    return `${intensity.settingsCount} 档设置 · ${intensity.sessionSpan}`;
  }
  return `1 档设置 · ${intensity.sessionSpan}`;
}

const INTENSITY_BAND_LABELS: Record<IntensityZone["className"], string> = {
  z1: "低",
  z2: "较轻",
  z3: "中等",
  z4: "较高",
  z5: "极高",
};

/** Collapse per-resistance buckets into the five color bands used by the bar. */
export function getIntensityColorBands(intensity: IntensityDistribution) {
  return INTENSITY_ZONE_CLASSES.map((className) => {
    const members = intensity.zones.filter((zone) => zone.className === className);
    const ratio = members.reduce((sum, zone) => sum + zone.ratio, 0);
    const seconds = members.reduce((sum, zone) => sum + zone.seconds, 0);
    return {
      className,
      label: INTENSITY_BAND_LABELS[className],
      ratio,
      seconds,
      durationLabel: formatDurationCompact(seconds),
    };
  }).filter((band) => band.ratio > 0);
}

export function getIntensityLegendNote(hasZones: boolean): string {
  if (hasZones) {
    return "每一行对应本次训练中设置过的阻力档位。分段按从低到高排列，颜色表示相对强度。";
  }
  return "完成一次力量训练后，可查看各阻力档位的使用时长分布。";
}

export { AMPLITUDE_DISPLAY_CM };

export function isPlanTrainingScene(scene: TrainingReportScene): boolean {
  return scene === "plan-training";
}
