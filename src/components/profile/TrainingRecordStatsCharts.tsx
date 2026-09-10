import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import Svg, { G, Line, Path, Polygon, Polyline, Rect, Circle } from "react-native-svg";
import { GlassSurface } from "@/components/GlassSurface";
import { SegmentedControl } from "@/components/profile/SegmentedControl";
import { TrainingRecordRow } from "@/components/profile/TrainingRecordRow";
import { useTheme } from "@/context/ThemeContext";
import type { TrainingRecord } from "@/data/userMock";
import { ColorPalette, radius, spacing, typography } from "@/theme";
import type { CalendarDay, PeriodStatsBundle, StructureSlice } from "@/types/trainingRecord";
import {
  BACK_MUSCLE_IDS,
  FRONT_MUSCLE_IDS,
  MODE_COLORS,
  MUSCLE_LABELS,
  mapZoneLevel,
} from "@/utils/trainingRecordStats";

type TrainingRecordStatsChartsProps = {
  stats: PeriodStatsBundle;
  periodRecords: TrainingRecord[];
  onSelectRecord?: (record: TrainingRecord) => void;
};

const ZONE_COLORS = ["transparent", "#1E3A5F", "#2563A8", "#3B82F6", "#60A5FA", "#93C5FD"];
const WEEKDAY_HEADERS = ["一", "二", "三", "四", "五", "六", "日"];
const MODE_LABELS: Record<keyof typeof MODE_COLORS, string> = {
  strength: "力量训练",
  pilates: "普拉提",
  cardio: "有氧燃脂",
};

export function TrainingRecordStatsCharts({
  stats,
  periodRecords,
  onSelectRecord,
}: TrainingRecordStatsChartsProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { width } = useWindowDimensions();
  const chartWidth = Math.max(280, width - 72);

  return (
    <View style={styles.stack}>
      {stats.calendar ? (
        <GlassSurface contentStyle={styles.card}>
          <Text style={styles.cardTitle}>训练日历</Text>
          <Text style={styles.cardHint}>圆点表示当天训练，颜色对应训练场景；点选查看当天记录</Text>
          <MonthCalendarHeatmap
            days={stats.calendar}
            periodRecords={periodRecords}
            onSelectRecord={onSelectRecord}
            colors={colors}
            styles={styles}
          />
        </GlassSurface>
      ) : null}

      <GlassSurface contentStyle={styles.card}>
        <Text style={styles.cardTitle}>训练容量</Text>
        <Text style={styles.cardHint}>柱状图显示总容量，折线显示平均趋势</Text>
        <StackedVolumeChart series={stats.volume} width={chartWidth} colors={colors} />
      </GlassSurface>

      <GlassSurface contentStyle={styles.card}>
        <Text style={styles.cardTitle}>AI 动作评分</Text>
        <Text style={styles.cardHint}>所选周期内的评分趋势</Text>
        {stats.quality.hasData ? (
          <QualityChart series={stats.quality} width={chartWidth} colors={colors} />
        ) : (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>暂无 AI 动作评分</Text>
            <Text style={styles.emptyHint}>完成更多 AI 动作后即可解锁此图表</Text>
          </View>
        )}
      </GlassSurface>

      <GlassSurface contentStyle={styles.card}>
        <Text style={styles.cardTitle}>训练结构</Text>
        <Text style={styles.cardHint}>按训练类型与场景分布</Text>
        {stats.structure.totalSessions ? (
          <View style={[styles.ringRow, width < 390 && styles.ringColumn]}>
            <DonutChart
              title="训练来源"
              slices={stats.structure.source}
              total={stats.structure.totalSessions}
              colors={colors}
            />
            <DonutChart
              title="训练场景"
              slices={stats.structure.mode}
              total={stats.structure.totalSessions}
              colors={colors}
            />
          </View>
        ) : (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>本周期暂无训练</Text>
            <Text style={styles.emptyHint}>切换到其他周或月查看统计</Text>
          </View>
        )}
      </GlassSurface>

      <GlassSurface contentStyle={styles.card}>
        <Text style={styles.cardTitle}>肌肉热力图</Text>
        <Text style={styles.cardHint}>以下统计来自已完成动作训练的肌群数据</Text>
        <MuscleHeatmap muscles={stats.muscles} styles={styles} />
      </GlassSurface>
    </View>
  );
}

function DonutChart({
  title,
  slices,
  total,
  colors,
}: {
  title: string;
  slices: StructureSlice[];
  total: number;
  colors: ColorPalette;
}) {
  const size = 148;
  const stroke = 16;
  const ringRadius = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * ringRadius;
  let offset = 0;

  return (
    <View style={donutStyles.wrap} accessibilityRole="image" accessibilityLabel={title}>
      <Text style={[donutStyles.title, { color: colors.textPrimary }]}>{title}</Text>
      <View style={donutStyles.chart}>
        <Svg width={size} height={size}>
          <Circle
            cx={cx}
            cy={cy}
            r={ringRadius}
            stroke="rgba(148,163,184,0.16)"
            strokeWidth={stroke}
            fill="none"
          />
          {slices.map((slice) => {
            const ratio = total > 0 ? slice.value / total : 0;
            const length = circumference * ratio;
            const dashOffset = -offset;
            offset += length;
            return (
              <Circle
                key={slice.id}
                cx={cx}
                cy={cy}
                r={ringRadius}
                stroke={slice.color}
                strokeWidth={stroke}
                fill="none"
                strokeDasharray={`${length} ${circumference - length}`}
                strokeDashoffset={dashOffset}
                strokeLinecap="butt"
                transform={`rotate(-90 ${cx} ${cy})`}
              />
            );
          })}
        </Svg>
        <View style={donutStyles.center} pointerEvents="none">
          <Text style={[donutStyles.centerValue, { color: colors.textPrimary }]}>{total}</Text>
          <Text style={[donutStyles.centerLabel, { color: colors.textMuted }]}>次</Text>
        </View>
      </View>
      <View style={donutStyles.legend}>
        {slices.map((slice) => (
          <View key={slice.id} style={donutStyles.legendItem}>
            <View style={[donutStyles.dot, { backgroundColor: slice.color }]} />
            <Text style={[donutStyles.legendText, { color: colors.textSecondary }]}>
              {slice.label} {slice.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function MonthCalendarHeatmap({
  days,
  periodRecords,
  onSelectRecord,
  colors,
  styles,
}: {
  days: CalendarDay[];
  periodRecords: TrainingRecord[];
  onSelectRecord?: (record: TrainingRecord) => void;
  colors: ColorPalette;
  styles: ReturnType<typeof createStyles>;
}) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    setSelectedDate(null);
  }, [days]);

  const leadingEmpty = useMemo(() => {
    if (!days.length) return 0;
    const jsDay = new Date(`${days[0].date}T12:00:00`).getDay();
    return jsDay === 0 ? 6 : jsDay - 1;
  }, [days]);

  const selectedRecords = useMemo(
    () =>
      selectedDate
        ? periodRecords
            .filter((record) => record.date === selectedDate)
            .sort((a, b) => b.finishedAt - a.finishedAt)
        : [],
    [periodRecords, selectedDate],
  );

  const cells: Array<CalendarDay | null> = [
    ...Array.from({ length: leadingEmpty }, () => null),
    ...days,
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <View style={styles.calendarWrap}>
      <View style={styles.weekdayRow}>
        {WEEKDAY_HEADERS.map((label) => (
          <Text key={label} style={styles.weekdayLabel}>
            {label}
          </Text>
        ))}
      </View>
      <View style={styles.calendarGrid}>
        {cells.map((day, index) => {
          if (!day) {
            return <View key={`empty-${index}`} style={styles.calendarCell} />;
          }
          const selected = selectedDate === day.date;
          const hasSessions = day.sessions > 0;
          const modeHint = day.modeMarks.map((mode) => MODE_LABELS[mode]).join("、");
          return (
            <Pressable
              key={day.date}
              accessibilityRole="button"
              accessibilityLabel={`${day.day}日${
                hasSessions ? `，${day.sessions} 次训练${modeHint ? `，${modeHint}` : ""}` : ""
              }`}
              accessibilityState={{ disabled: !hasSessions, selected }}
              disabled={!hasSessions}
              onPress={() => setSelectedDate((current) => (current === day.date ? null : day.date))}
              style={[
                styles.calendarCell,
                hasSessions && { backgroundColor: colors.accentGlass },
                selected && styles.calendarCellSelected,
                !hasSessions && styles.calendarCellEmpty,
              ]}
            >
              <Text
                style={[
                  styles.calendarDayText,
                  hasSessions ? styles.calendarDayActive : styles.calendarDayMuted,
                ]}
              >
                {day.day}
              </Text>
              <View style={styles.calendarDots}>
                {hasSessions
                  ? day.modeMarks.map((mode, markIndex) => (
                      <View
                        key={`${day.date}-${mode}-${markIndex}`}
                        style={[styles.calendarDot, { backgroundColor: MODE_COLORS[mode] }]}
                        accessibilityElementsHidden
                        importantForAccessibility="no"
                      />
                    ))
                  : (
                    <View style={styles.calendarDotSpacer} />
                  )}
              </View>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.calendarLegend}>
        <LegendDot color={MODE_COLORS.strength} label="力量训练" textColor={colors.textSecondary} />
        <LegendDot color={MODE_COLORS.pilates} label="普拉提" textColor={colors.textSecondary} />
        <LegendDot color={MODE_COLORS.cardio} label="有氧燃脂" textColor={colors.textSecondary} />
      </View>
      {selectedDate ? (
        <View style={styles.dayRecords}>
          <Text style={styles.dayRecordsTitle}>
            {(() => {
              const [, month, day] = selectedDate.split("-");
              return `${Number(month)}月${Number(day)}日记录`;
            })()}
          </Text>
          {selectedRecords.length ? (
            selectedRecords.map((record) => (
              <TrainingRecordRow
                key={record.id}
                record={record}
                onPress={() => onSelectRecord?.(record)}
              />
            ))
          ) : (
            <Text style={styles.dayRecordsEmpty}>当天暂无训练记录</Text>
          )}
        </View>
      ) : null}
    </View>
  );
}

function StackedVolumeChart({
  series,
  width,
  colors,
}: {
  series: PeriodStatsBundle["volume"];
  width: number;
  colors: ColorPalette;
}) {
  const height = 180;
  const padL = 36;
  const padR = 12;
  const padT = 12;
  const padB = 28;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const count = Math.max(1, series.labels.length);
  const totals = series.labels.map(
    (_, index) => series.strength[index] + series.pilates[index] + series.cardio[index],
  );
  const maxValue = Math.max(1, ...totals, ...series.movingAverage);
  const barWidth = Math.min(22, (plotW / count) * 0.55);
  const gap = plotW / count;

  const linePoints = series.movingAverage
    .map((value, index) => {
      const x = padL + gap * index + gap / 2;
      const y = padT + plotH - (value / maxValue) * plotH;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <View accessibilityRole="image" accessibilityLabel="训练容量趋势图">
      <View style={{ width, height }}>
        <Svg width={width} height={height}>
          {[0.25, 0.5, 0.75, 1].map((ratio) => (
            <Line
              key={ratio}
              x1={padL}
              x2={width - padR}
              y1={padT + plotH * (1 - ratio)}
              y2={padT + plotH * (1 - ratio)}
              stroke="rgba(148,163,184,0.14)"
              strokeWidth={1}
            />
          ))}
          {series.labels.map((label, index) => {
            const x = padL + gap * index + gap / 2 - barWidth / 2;
            let y = padT + plotH;
            const stacks = [
              { value: series.strength[index], color: MODE_COLORS.strength },
              { value: series.pilates[index], color: MODE_COLORS.pilates },
              { value: series.cardio[index], color: MODE_COLORS.cardio },
            ];
            return (
              <G key={`${label}-${index}`}>
                {stacks.map((stack) => {
                  const h = (stack.value / maxValue) * plotH;
                  y -= h;
                  if (h <= 0) return null;
                  return (
                    <Rect
                      key={stack.color}
                      x={x}
                      y={y}
                      width={barWidth}
                      height={Math.max(h, 0)}
                      rx={3}
                      fill={stack.color}
                    />
                  );
                })}
              </G>
            );
          })}
          {linePoints ? (
            <Polyline
              points={linePoints}
              fill="none"
              stroke={colors.cyan}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : null}
        </Svg>
        {series.labels.map((label, index) => (
          <SvgTextFallback
            key={`label-${label}-${index}`}
            x={padL + gap * index + gap / 2}
            y={height - 6}
            fill={colors.textMuted}
            fontSize={series.labels.length > 5 ? 9 : 10}
            textAnchor="middle"
            label={label}
          />
        ))}
      </View>
      <View style={legendStyles.row}>
        <LegendDot color={MODE_COLORS.strength} label="力量训练" textColor={colors.textSecondary} />
        <LegendDot color={MODE_COLORS.pilates} label="普拉提" textColor={colors.textSecondary} />
        <LegendDot color={MODE_COLORS.cardio} label="有氧燃脂" textColor={colors.textSecondary} />
        <LegendDot color={colors.cyan} label="移动平均" textColor={colors.textSecondary} />
      </View>
    </View>
  );
}

function SvgTextFallback({
  x,
  y,
  fill,
  fontSize,
  textAnchor,
  label,
}: {
  x: number;
  y: number;
  fill: string;
  fontSize: number;
  textAnchor: "middle" | "start" | "end";
  label: string;
}) {
  const width = Math.max(28, label.length * (fontSize * 0.7));
  const left =
    textAnchor === "middle" ? x - width / 2 : textAnchor === "end" ? x - width : x;
  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        left,
        top: y - fontSize,
        width,
        alignItems:
          textAnchor === "middle" ? "center" : textAnchor === "end" ? "flex-end" : "flex-start",
      }}
    >
      <Text style={{ color: fill, fontSize, lineHeight: fontSize + 2 }} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

function QualityChart({
  series,
  width,
  colors,
}: {
  series: PeriodStatsBundle["quality"];
  width: number;
  colors: ColorPalette;
}) {
  const height = 168;
  const padL = 36;
  const padR = 12;
  const padT = 16;
  const padB = 28;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const count = Math.max(1, series.labels.length);
  const gap = plotW / Math.max(1, count - 1);

  const points = series.scores.map((value, index) => {
    const x = count === 1 ? padL + plotW / 2 : padL + gap * index;
    const y = padT + plotH - (Math.max(0, Math.min(100, value)) / 100) * plotH;
    return { x, y };
  });
  const line = points.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" ");
  const area = points.length
    ? `${padL},${padT + plotH} ${line} ${(points[points.length - 1]?.x ?? padL).toFixed(1)},${padT + plotH}`
    : "";

  return (
    <View accessibilityRole="image" accessibilityLabel="AI 动作评分趋势图" style={{ width, height }}>
      <Svg width={width} height={height}>
        {[0, 0.5, 1].map((ratio) => (
          <Line
            key={ratio}
            x1={padL}
            x2={width - padR}
            y1={padT + plotH * (1 - ratio)}
            y2={padT + plotH * (1 - ratio)}
            stroke="rgba(148,163,184,0.14)"
            strokeWidth={1}
          />
        ))}
        {area ? <Polygon points={area} fill="rgba(74,222,128,0.16)" /> : null}
        {line ? (
          <Polyline
            points={line}
            fill="none"
            stroke="#4ADE80"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : null}
        {points.map((point, index) => (
          <Circle key={index} cx={point.x} cy={point.y} r={3.5} fill="#4ADE80" />
        ))}
      </Svg>
      {series.labels.map((label, index) => {
        const x = count === 1 ? padL + plotW / 2 : padL + gap * index;
        return (
          <SvgTextFallback
            key={`${label}-${index}`}
            x={x}
            y={height - 6}
            fill={colors.textMuted}
            fontSize={series.labels.length > 5 ? 9 : 10}
            textAnchor="middle"
            label={label}
          />
        );
      })}
    </View>
  );
}

function MuscleHeatmap({
  muscles,
  styles,
}: {
  muscles: PeriodStatsBundle["muscles"];
  styles: ReturnType<typeof createStyles>;
}) {
  const [side, setSide] = useState<"front" | "back">("front");
  const ids = side === "front" ? FRONT_MUSCLE_IDS : BACK_MUSCLE_IDS;
  const legend = [...ids]
    .map((id) => ({
      id,
      label: MUSCLE_LABELS[id],
      count: muscles.sessions[id] ?? 0,
      load: muscles.load[id] ?? 0,
      level: mapZoneLevel(muscles.load[id] ?? 0, muscles.maxLoad),
    }))
    .sort((a, b) => b.count - a.count || b.load - a.load);

  return (
    <View style={styles.muscleWrap}>
      <SegmentedControl
        options={[
          { id: "front", label: "正面" },
          { id: "back", label: "背面" },
        ]}
        value={side}
        onChange={setSide}
        accessibilityLabel="肌肉热力图视角"
      />
      <View style={styles.bodyCenter}>
        <BodyFigureSvg side={side} muscles={muscles} />
      </View>
      <View style={styles.muscleBars}>
        {legend.map((item) => {
          const ratio = muscles.maxLoad > 0 ? item.load / muscles.maxLoad : 0;
          return (
            <View key={item.id} style={styles.muscleBarRow}>
              <Text style={styles.muscleBarLabel}>{item.label}</Text>
              <View style={styles.muscleBarTrack}>
                <View
                  style={[
                    styles.muscleBarFill,
                    {
                      width: `${Math.max(ratio > 0 ? 8 : 0, ratio * 100)}%`,
                      backgroundColor: ZONE_COLORS[item.level] || ZONE_COLORS[1],
                    },
                  ]}
                />
              </View>
              <Text style={styles.muscleBarCount}>{item.count} 次</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function BodyFigureSvg({
  side,
  muscles,
}: {
  side: "front" | "back";
  muscles: PeriodStatsBundle["muscles"];
}) {
  return (
    <Svg width={132} height={242} viewBox="0 0 120 220" accessibilityLabel={`${side === "front" ? "正面" : "背面"}肌群热力`}>
      <Path
        d="M60 10c11 0 20 9 20 20 0 8-5 15-11 18l2 13 10 15-3 53-10 12v26h-16v-26l-10-12-3-53 10-15 2-13c-6-3-11-10-11-18 0-11 9-20 20-20z"
        fill="rgba(255,255,255,0.06)"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth={1.5}
      />
      {side === "front" ? (
        <>
          <Path d="M45 67h30v24H45z" fill={ZONE_COLORS[mapZoneLevel(muscles.load.chest, muscles.maxLoad)]} />
          <Path d="M48 93h24v34H48z" fill={ZONE_COLORS[mapZoneLevel(muscles.load.core, muscles.maxLoad)]} />
          <Path d="M33 78h10v40H33zm44 0h10v40H77z" fill={ZONE_COLORS[mapZoneLevel(muscles.load.arms, muscles.maxLoad)]} />
          <Path d="M47 127h26v16H47z" fill={ZONE_COLORS[mapZoneLevel(muscles.load.glutes, muscles.maxLoad)]} />
          <Path d="M44 144h13v46H44zm19 0h13v46H63z" fill={ZONE_COLORS[mapZoneLevel(muscles.load.legs, muscles.maxLoad)]} />
        </>
      ) : (
        <>
          <Path d="M45 67h30v48H45z" fill={ZONE_COLORS[mapZoneLevel(muscles.load.back, muscles.maxLoad)]} />
          <Path
            d="M36 68h11v24H36zm37 0h11v24H73z"
            fill={ZONE_COLORS[mapZoneLevel(muscles.load.rearShoulders, muscles.maxLoad)]}
          />
          <Path
            d="M44 144h13v46H44zm19 0h13v46H63z"
            fill={ZONE_COLORS[mapZoneLevel(muscles.load.hamstrings, muscles.maxLoad)]}
          />
        </>
      )}
    </Svg>
  );
}

function LegendDot({ color, label, textColor }: { color: string; label: string; textColor: string }) {
  return (
    <View style={legendStyles.item}>
      <View style={[legendStyles.dot, { backgroundColor: color }]} />
      <Text style={[legendStyles.text, { color: textColor }]}>{label}</Text>
    </View>
  );
}

const donutStyles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: "center",
    gap: spacing.sm,
    minWidth: 150,
  },
  title: {
    ...typography.label,
  },
  chart: {
    width: 148,
    height: 148,
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  centerValue: {
    ...typography.subtitle,
    fontSize: 22,
  },
  centerLabel: {
    ...typography.caption,
    fontSize: 12,
  },
  legend: {
    gap: 4,
    alignSelf: "stretch",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    ...typography.caption,
    fontSize: 12,
  },
});

const legendStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  text: {
    ...typography.caption,
    fontSize: 12,
  },
});

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    stack: {
      gap: spacing.md,
    },
    card: {
      padding: spacing.lg,
      gap: spacing.xs,
    },
    cardTitle: {
      ...typography.subtitle,
      color: colors.textPrimary,
    },
    cardHint: {
      ...typography.caption,
      color: colors.textMuted,
      marginBottom: spacing.sm,
    },
    emptyBox: {
      minHeight: 96,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.xs,
      padding: spacing.lg,
      marginTop: spacing.sm,
    },
    emptyTitle: {
      ...typography.label,
      color: colors.textPrimary,
    },
    emptyHint: {
      ...typography.caption,
      color: colors.textMuted,
      textAlign: "center",
    },
    ringRow: {
      flexDirection: "row",
      gap: spacing.md,
      marginTop: spacing.sm,
    },
    ringColumn: {
      flexDirection: "column",
    },
    calendarWrap: {
      gap: spacing.sm,
      marginTop: spacing.sm,
    },
    weekdayRow: {
      flexDirection: "row",
    },
    weekdayLabel: {
      flex: 1,
      textAlign: "center",
      ...typography.caption,
      fontSize: 11,
      color: colors.textMuted,
    },
    calendarGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    calendarCell: {
      width: "14.28%",
      minHeight: 48,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: radius.sm,
      marginBottom: 4,
      paddingVertical: 4,
      gap: 2,
    },
    calendarCellSelected: {
      borderWidth: 2,
      borderColor: colors.accent,
    },
    calendarCellEmpty: {
      opacity: 0.72,
    },
    calendarDayText: {
      ...typography.label,
      fontSize: 12,
    },
    calendarDayActive: {
      color: colors.textPrimary,
    },
    calendarDayMuted: {
      color: colors.textMuted,
    },
    calendarDots: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 3,
      minHeight: 5,
    },
    calendarDot: {
      width: 5,
      height: 5,
      borderRadius: 3,
    },
    calendarDotSpacer: {
      width: 5,
      height: 5,
    },
    calendarLegend: {
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      gap: spacing.sm,
      marginTop: spacing.xs,
    },
    dayRecords: {
      marginTop: spacing.sm,
      gap: spacing.sm,
    },
    dayRecordsTitle: {
      ...typography.label,
      color: colors.textPrimary,
    },
    dayRecordsEmpty: {
      ...typography.caption,
      color: colors.textMuted,
    },
    muscleWrap: {
      gap: spacing.md,
      marginTop: spacing.sm,
    },
    bodyCenter: {
      alignItems: "center",
    },
    muscleBars: {
      gap: spacing.sm,
    },
    muscleBarRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },
    muscleBarLabel: {
      width: 48,
      ...typography.caption,
      color: colors.textSecondary,
    },
    muscleBarTrack: {
      flex: 1,
      height: 8,
      borderRadius: 4,
      backgroundColor: "rgba(148,163,184,0.16)",
      overflow: "hidden",
    },
    muscleBarFill: {
      height: 8,
      borderRadius: 4,
    },
    muscleBarCount: {
      width: 44,
      textAlign: "right",
      ...typography.caption,
      fontSize: 12,
      color: colors.textSecondary,
    },
  });
}
