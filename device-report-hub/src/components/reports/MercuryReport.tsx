import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Eye, EyeOff, Minus, Plus, RotateCcw, Save, Star } from "lucide-react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import neckFront from "@/assets/neck-front.png";
import neckSide from "@/assets/neck-side.png";
import pressureSupine from "@/assets/mercury-pressure-supine.png";
import pressureLeft from "@/assets/mercury-pressure-left.png";
import pressureRight from "@/assets/mercury-pressure-right.png";
import generationOnePillow from "@/assets/mercury-pillow-gen1-clean.png";
import generationTwoPillow from "@/assets/mercury-pillow-gen2-clean.png";
import mercuryReportHero from "@/assets/mercury-report-hero.jpg";
import mercuryReportQr from "@/assets/mercury-report-qr.png";
import {
  MercuryBodyCompositionReport,
  MercuryBodyMeasureReport,
  MercurySpineReport,
} from "./MercuryAssessmentReports";
import { MERCURY_REPORT_VERSION, mercuryPostureInsights, postureSeverityMeta, spineLevelMeta } from "./mercurySpineData";

type MercuryTab = "AI推荐" | "脊柱评估" | "身体成分" | "体围测量" | "睡眠顾问";
type PillowGeneration = "gen1" | "gen2";
type PillowOrientation = "convex" | "concave";
type PillowHeightPreference = "偏低" | "适中" | "偏高";
type PillowZone = {
  id: number;
  name: string;
  /** 出厂/型号基础高度；导购通过垫片数调节，不直接改 cm */
  baseHeight: number;
  recommendedHeight: number;
  hotspot: { x: number; y: number };
};

/** 中国·梦 瑧享定制枕垫片规则（二代复用同一交互；克重映射待江田表落地后替换） */
const SHIM_HEIGHT_CM = 0.5;
const SHIM_WEIGHT_G = 15;

function heightFromPads(baseHeight: number, pads: number) {
  return Math.round((baseHeight + pads * SHIM_HEIGHT_CM) * 10) / 10;
}

function weightFromPads(pads: number) {
  return Math.round(pads * SHIM_WEIGHT_G * 10) / 10;
}

function padsFromTargetHeight(baseHeight: number, targetHeight: number) {
  return Math.max(0, Math.round((targetHeight - baseHeight) / SHIM_HEIGHT_CM));
}

const userTabs: MercuryTab[] = ["AI推荐", "脊柱评估", "身体成分", "体围测量"];
const pillowProductNames: Record<PillowGeneration, string> = {
  gen1: "中国·梦 瑧享定制枕",
  gen2: "中国·梦 尊享定制枕",
};

const pillowOrientationMeta: Record<PillowOrientation, { label: string; supineZoneId: number; copy: string }> = {
  convex: { label: "凸面", supineZoneId: 1, copy: "1区仰睡" },
  concave: { label: "凹面", supineZoneId: 3, copy: "3区仰睡" },
};

const forwardNeckSignal = mercuryPostureInsights
  .find((insight) => insight.key === "head-neck")
  ?.signals.find((signal) => signal.label === "颈椎前伸");
const recommendedPillowOrientation: PillowOrientation = forwardNeckSignal?.severity === "severe" ? "convex" : "concave";

const profileStats = [["身高", "161.0cm"], ["体重", "51.2kg"], ["年龄", "31岁"], ["BMI", "19.8"]];

/** 问卷枕高偏好：用于中国·梦 瑧享定制枕高度区间重叠时的型号仲裁 */
const pillowHeightPreference: PillowHeightPreference = "偏低";

/** 算法关联问卷：最多 4 题，必须保留高低枕偏好 */
const surveyItems = [
  { label: "主睡姿", value: "俯卧" },
  { label: "床垫硬度", value: "中等" },
  { label: "睡眠问题", value: "颈肩酸痛" },
  { label: "枕高偏好", value: pillowHeightPreference },
];

const neckMetrics = [
  { code: "L1", label: "耳宽", value: "17.5", desc: "两侧耳廓最外侧水平距离", explanation: "反映头部侧面宽度，帮助判断侧睡时耳部和头侧区域所需的接触空间，不用于单独确定枕高。" },
  { code: "L2", label: "颈宽", value: "16.6", desc: "颈部最宽处的水平横向距离", explanation: "帮助判断颈托区域的宽度和受力面积，使颈部获得较均匀的承托，并避免枕头延伸到肩部。" },
  { code: "L3", label: "肩宽", value: "40.2", desc: "左右肩峰点间水平直线距离", explanation: "是判断侧睡头肩间隙的重要参考；还需结合睡姿、床垫软硬和肩部实际下沉情况理解。" },
  { code: "L4", label: "头背距", value: "8.2", desc: "背部后缘至后脑最突出点", explanation: "帮助判断仰睡时头窝深度，以及后脑与颈托之间的高度差，需结合上背部实际下沉情况使用。" },
  { code: "L5", label: "颈深", value: "9.6", desc: "背部后缘至第七颈椎点距离", explanation: "帮助判断颈托凸起高度和承托曲面的深度，反映颈部需要怎样贴合，不等于整只枕头的高度。" },
  { code: "L6", label: "背深", value: "11.8", desc: "背部后缘至肩峰点水平距离", explanation: "帮助理解肩背到头颈的过渡关系，以及枕头肩部避让区域，使肩背能够更自然地贴合。" },
  { code: "H1", label: "头颈高", value: "16.4", desc: "头顶至第七颈椎点垂直高度", explanation: "用于判断头区和颈托区的纵向尺寸与分区位置，反映头颈比例，不能单独换算为枕高。" },
  { code: "H2", label: "头背高", value: "29.3", desc: "头顶至肩峰点垂直高度", explanation: "帮助判断头、颈、肩的整体比例及枕头分区位置，最终仍需结合常用睡姿和实际体验确认。" },
];

const pressureImages = [
  { label: "仰睡", value: "压力集中于肩背与臀部，需增强头颈承托", image: pressureSupine },
  { label: "左侧睡", value: "侧卧肩颈压力较高，建议分区缓冲", image: pressureLeft },
  { label: "右侧睡", value: "右侧支撑相对均衡，保留腰臀贴合", image: pressureRight },
];

const balanceChartData = [
  { zone: "头部", actual: 0.05, ideal: 0.08 }, { zone: "颈部", actual: 0.13, ideal: 0.035 },
  { zone: "肩背", actual: 0.26, ideal: 0.305 }, { zone: "腰部", actual: 0.065, ideal: 0.08 },
  { zone: "臀部", actual: 0.285, ideal: 0.26 }, { zone: "大腿", actual: 0.03, ideal: 0.065 },
  { zone: "小腿", actual: 0.125, ideal: 0.105 }, { zone: "足部", actual: 0.045, ideal: 0.065 },
];

const balanceRows = [
  {
    title: "正躺最佳平衡比",
    values: ["5", "16", "26", "8", "29", "3", "12", "4"],
    chartData: balanceChartData,
  },
  {
    title: "侧躺最佳平衡比",
    values: ["13", "23", "16", "7", "20", "23", "2", "1"],
    chartData: balanceChartData.map((item, index) => ({ ...item, actual: [0.13, 0.23, 0.16, 0.07, 0.2, 0.23, 0.02, 0.01][index] })),
  },
];

const balanceZones = ["头部", "颈部", "肩背", "腰部", "臀部", "大腿", "小腿", "足部"];

const universalPillowZones = [
  { id: "Z1", title: "仰睡区1", desc: "仰睡颈部核心支撑", height: 10.4, gen1: [1, 2], gen2: [1] },
  { id: "Z2", title: "头窝区", desc: "头部上方凹陷支撑", height: 4.4, gen1: [3], gen2: [2] },
  { id: "Z3", title: "仰睡区2", desc: "仰睡颈部核心支撑", height: 5.0, gen1: [4], gen2: [3] },
  { id: "Z4", title: "左侧睡区1", desc: "左侧睡肩颈支撑", height: 15.5, gen1: [5], gen2: [4, 8] },
  { id: "Z5", title: "左侧睡区2", desc: "左侧睡肩颈支撑", height: 10.4, gen1: [7], gen2: [5, 9] },
  { id: "Z6", title: "右侧睡区1", desc: "右侧睡肩颈支撑", height: 14.5, gen1: [6], gen2: [6, 10] },
  { id: "Z7", title: "右侧睡区2", desc: "右侧睡肩颈支撑", height: 10.4, gen1: [8], gen2: [7, 11] },
];

const generationOneZoneNames = [
  "仰睡肩颈承托区",
  "仰睡颈部承托区",
  "下头窝区",
  "上头窝区",
  "左颈承托区",
  "右颈承托区",
  "左上侧睡区",
  "右上侧睡区",
];

const generationOneHotspots = [
  { x: 50, y: 83 },
  { x: 50, y: 68 },
  { x: 50, y: 43 },
  { x: 50, y: 19 },
  { x: 72, y: 81 },
  { x: 26, y: 81 },
  { x: 72, y: 32 },
  { x: 26, y: 33 },
];

const generationTwoHotspots = [
  { x: 50, y: 73 },
  { x: 50, y: 46 },
  { x: 50, y: 26 },
  { x: 68, y: 73 },
  { x: 68, y: 26 },
  { x: 32, y: 73 },
  { x: 32, y: 26 },
  { x: 84, y: 73 },
  { x: 84, y: 26 },
  { x: 16, y: 73 },
  { x: 16, y: 26 },
];

const generationOneRecommendedHeights = [10.4, 10.4, 4.4, 5.0, 15.5, 14.5, 10.4, 10.4];

const generationOneModels = [
  { id: "1号枕", overall: "整体高度调节区 1/2cm", ranges: "仰睡7-9cm；左右侧睡9-11cm", preference: "偏低" as PillowHeightPreference, zones: [{ weight: 90, height: 7.0 }, { weight: 60, height: 6.5 }, { weight: 50, height: 4.2 }, { weight: 50, height: 4.8 }, { weight: 180, height: 9.0 }, { weight: 180, height: 9.0 }, { weight: 300, height: 8.3 }, { weight: 300, height: 8.3 }] },
  { id: "2号枕", overall: "整体高度调节区 1/2cm", ranges: "仰睡8-10cm；左右侧睡10-12cm", preference: "偏低" as PillowHeightPreference, zones: [{ weight: 110, height: 8.0 }, { weight: 80, height: 7.5 }, { weight: 50, height: 4.2 }, { weight: 50, height: 4.8 }, { weight: 200, height: 10.0 }, { weight: 200, height: 10.0 }, { weight: 300, height: 8.3 }, { weight: 300, height: 8.3 }] },
  { id: "3号枕", overall: "整体高度调节区 1.5/3cm", ranges: "仰睡9-11cm；左右侧睡11-13cm", preference: "偏高" as PillowHeightPreference, zones: [{ weight: 130, height: 9.0 }, { weight: 100, height: 8.5 }, { weight: 50, height: 4.7 }, { weight: 50, height: 5.3 }, { weight: 220, height: 11.0 }, { weight: 220, height: 11.0 }, { weight: 300, height: 9.3 }, { weight: 300, height: 9.3 }] },
  { id: "4号枕", overall: "整体高度调节区 1.5/3cm", ranges: "仰睡10-12cm；左右侧睡12-14cm", preference: "偏高" as PillowHeightPreference, zones: [{ weight: 150, height: 10.0 }, { weight: 120, height: 9.5 }, { weight: 50, height: 4.7 }, { weight: 50, height: 5.3 }, { weight: 240, height: 12.0 }, { weight: 240, height: 12.0 }, { weight: 300, height: 9.3 }, { weight: 300, height: 9.3 }] },
];

function getGenerationTwoZones(orientation: PillowOrientation) {
  return Array.from({ length: 11 }, (_, index) => {
    const zoneNumber = index + 1;
    const source = universalPillowZones.find((zone) => zone.gen2.includes(zoneNumber));
    const height = source?.height ?? 10;
    const hotspot = generationTwoHotspots[index];
    return {
      id: zoneNumber,
      name: source?.title ?? `${zoneNumber}区`,
      baseHeight: height,
      recommendedHeight: height,
      hotspot: orientation === "concave" ? { x: 100 - hotspot.x, y: 100 - hotspot.y } : hotspot,
    };
  });
}

const generationOneMatchRows = generationOneModels.map((model) => {
  const diffs = universalPillowZones.map((zone) => {
    const mappedHeight = zone.gen1.reduce((sum, zoneNumber) => sum + model.zones[zoneNumber - 1].height, 0) / zone.gen1.length;
    return Math.abs(mappedHeight - zone.height);
  });
  const averageDiff = diffs.reduce((sum, diff) => sum + diff, 0) / diffs.length;
  return { model, averageDiff };
});

/** 中国·梦 瑧享定制枕高度区间重叠时：先取高度接近的候选，再用问卷高低枕偏好仲裁 */
function resolveRecommendedGenerationOneModel(preference: PillowHeightPreference) {
  const sorted = [...generationOneMatchRows].sort((a, b) => a.averageDiff - b.averageDiff);
  const bestDiff = sorted[0].averageDiff;
  const candidates = sorted.filter((row) => row.averageDiff <= bestDiff + 0.5);
  if (candidates.length === 1) return candidates[0].model;

  const preferred = candidates.filter((row) => row.model.preference === preference);
  const pool = preferred.length > 0 ? preferred : candidates;
  const modelIndex = (id: string) => generationOneModels.findIndex((model) => model.id === id);

  if (preference === "偏低") {
    return [...pool].sort((a, b) => modelIndex(a.model.id) - modelIndex(b.model.id))[0].model;
  }
  if (preference === "偏高") {
    return [...pool].sort((a, b) => modelIndex(b.model.id) - modelIndex(a.model.id))[0].model;
  }
  return pool[0].model;
}

const recommendedGenerationOneModel = resolveRecommendedGenerationOneModel(pillowHeightPreference);

const bodyMeasureItems = [
  ["颈围", "38.6cm"],
  ["肩宽", "40.2cm"],
  ["左腕围", "15.1cm"],
  ["右腕围", "15.1cm"],
  ["小腿围-左", "55.1cm"],
  ["小腿围-右", "55.4cm"],
  ["膝围", "56.8cm"],
  ["足踝围", "32.6cm"],
];

const bodyCompositionItems = [
  ["体重", "***"],
  ["BMI", "***"],
  ["体脂率", "22.1%"],
  ["骨骼肌量", "17.5kg"],
  ["基础代谢", "1088kcal/d"],
  ["身体年龄", "18岁"],
];

const postureHighlights = ["颈椎曲度变直", "颈肩酸痛", "圆肩（可能）", "左高右低"];

const measureGroups = [
  {
    title: "肩颈关键尺寸",
    desc: "用于计算定制枕头颈、肩背和侧睡区高度。",
    items: [
      ["耳宽", "17.5cm"],
      ["颈宽", "16.6cm"],
      ["肩宽", "40.2cm"],
      ["头背距", "8.2cm"],
      ["颈深", "9.6cm"],
      ["背深", "11.8cm"],
      ["头颈高", "16.4cm"],
      ["头背高", "29.3cm"],
    ],
  },
  {
    title: "体围测量",
    desc: "保留水星报告中的围度数据，用于后续尺码和体态复核。",
    items: bodyMeasureItems,
  },
];

const compositionInsights = [
  {
    title: "肌肉脂肪分析",
    level: "参考",
    tone: "info",
    desc: "体脂率 22.1%，骨骼肌量 17.5kg；建议结合用户实际身高体重继续评估。",
  },
  {
    title: "代谢状态",
    level: "参考",
    tone: "info",
    desc: "基础代谢 1088kcal/d，身体年龄 18岁；脱敏项保持原报告展示，不补充未知数值。",
  },
  {
    title: "睡眠支撑关联",
    level: "建议",
    tone: "warn",
    desc: "结合颈肩酸痛和颈椎曲度变直，优先保证头颈承托与肩背压力缓冲。",
  },
];

function toneClass(tone: string) {
  if (tone === "danger") return "bg-rose-50 text-rose-600 border-rose-100";
  if (tone === "warn") return "bg-amber-50 text-amber-600 border-amber-100";
  if (tone === "info") return "bg-sky-50 text-sky-600 border-sky-100";
  return "bg-emerald-50 text-emerald-600 border-emerald-100";
}

function Section({
  title,
  eyebrow,
  action,
  children,
}: {
  title: string;
  eyebrow?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-5">
      <div className="mb-3 px-1">
        {eyebrow && <div className="text-[11px] tracking-[0.18em] text-sky-500 font-semibold uppercase">{eyebrow}</div>}
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[17px] font-semibold text-slate-900">{title}</h2>
          {action}
        </div>
      </div>
      {children}
    </section>
  );
}

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-sky-100 shadow-[0_8px_24px_rgba(32,120,180,0.06)] ${className}`}>
      {children}
    </div>
  );
}

function BlockingModal({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 px-5 backdrop-blur-[2px]" role="presentation">
      <div className="w-full max-w-[382px] rounded-[24px] border border-white/70 bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.28)]" role="dialog" aria-modal="true">
        {children}
      </div>
    </div>
  );
}

function SalesReminderModal({ onConfirm }: { onConfirm: () => void }) {
  const reminders = [
    "压力采集",
    "分区调节",
    "成交记录",
  ];

  return (
    <BlockingModal>
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-sky-50 text-sky-600">
        <Check className="h-6 w-6" strokeWidth={2.5} />
      </div>
      <h2 className="mt-4 text-center text-[19px] font-bold text-slate-900">必做 3 步</h2>
      <div className="mt-4 space-y-2.5">
        {reminders.map((reminder, index) => (
          <div key={reminder} className="flex items-start gap-3 rounded-2xl bg-slate-50 px-3.5 py-3">
            <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-sky-600 text-[12px] font-bold text-white">{index + 1}</span>
            <p className="pt-0.5 text-[13px] leading-5 text-slate-700">{reminder}</p>
          </div>
        ))}
      </div>
      <button type="button" onClick={onConfirm} className="mt-5 min-h-12 w-full rounded-full bg-sky-600 px-4 text-[14px] font-semibold text-white shadow-[0_8px_18px_rgba(2,132,199,0.24)] active:scale-[0.99]">
        我知道了，开始操作
      </button>
    </BlockingModal>
  );
}

function OrientationChangeDialog({ target, onCancel, onConfirm }: { target: PillowOrientation; onCancel: () => void; onConfirm: () => void }) {
  return (
    <BlockingModal>
      <h2 className="text-[18px] font-bold text-slate-900">切换为{pillowOrientationMeta[target].label}？</h2>
      <p className="mt-2 text-[13px] leading-6 text-slate-600">当前面型的调整尚未保存，切换后将恢复目标面型的推荐设置，是否继续？</p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <button type="button" onClick={onCancel} className="min-h-11 rounded-full border border-slate-200 bg-white text-[13px] font-semibold text-slate-600">取消</button>
        <button type="button" onClick={onConfirm} className="min-h-11 rounded-full bg-sky-600 text-[13px] font-semibold text-white">确认切换</button>
      </div>
    </BlockingModal>
  );
}

function InfoCard({ label, value, emphasize = false }: { label: string; value: string; emphasize?: boolean }) {
  return (
    <div className={`rounded-2xl border p-3 ${emphasize ? "border-amber-200 bg-amber-50/90 shadow-[0_4px_14px_rgba(245,158,11,0.12)]" : "border-sky-100 bg-white/90"}`}>
      <div className={`flex items-center gap-1.5 text-[12px] ${emphasize ? "text-amber-700 font-medium" : "text-slate-500"}`}>
        {label}
        {emphasize ? <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">算法输入</span> : null}
      </div>
      <div className={`mt-1 text-[15px] font-semibold leading-snug ${emphasize ? "text-amber-900" : "text-slate-800"}`}>{value}</div>
    </div>
  );
}

function MetricCard({ code, label, value, desc, explanation }: (typeof neckMetrics)[number]) {
  return (
    <details className="group rounded-2xl border border-[#dce8f2] bg-white px-3 pb-3.5 pt-3 shadow-[0_4px_14px_rgba(67,112,148,0.05)] open:border-sky-200">
      <summary className="cursor-pointer list-none">
        <div className="flex items-start gap-1.5">
          <span className="text-[13px] font-bold text-sky-600">{code}</span>
          <span className="text-[14px] font-semibold text-slate-800">{label}</span>
          <span className="ml-auto whitespace-nowrap text-[15px] font-bold tabular-nums text-slate-900">{value} cm</span>
          <ChevronDown className="mt-0.5 h-4 w-4 flex-none text-sky-500 transition-transform duration-200 group-open:rotate-180" />
        </div>
        <p className="mt-2 pr-5 text-[12px] leading-relaxed text-slate-500">{desc}</p>
      </summary>
      <div className="mt-3 text-[11px] leading-[1.65] text-[#43546b]">
        <p className="border-l-[3px] border-sky-300 py-px pl-2.5">{explanation}</p>
      </div>
    </details>
  );
}

function PlaceholderTab({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-4 pt-4 pb-10">
      <Section title={title} eyebrow="Mercury">
        {children}
      </Section>
    </div>
  );
}

function StatusCard({
  title,
  level,
  tone,
  desc,
  rows,
}: {
  title: string;
  level: string;
  tone: string;
  desc: string;
  rows?: string[][];
}) {
  return (
    <Panel className="p-3">
      <div className="flex items-center gap-2">
        <h3 className="text-[16px] font-semibold text-slate-900">{title}</h3>
        <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${toneClass(tone)}`}>{level}</span>
      </div>
      <p className="mt-2 text-[12px] leading-relaxed text-slate-500">{desc}</p>
      {rows && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          {rows.map(([label, value]) => (
            <div key={label} className="rounded-xl bg-slate-50 p-2">
              <div className="text-[11px] text-slate-500">{label}</div>
              <div className="mt-1 text-[13px] font-semibold text-slate-800 leading-snug">{value}</div>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

function CompactTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <Panel className="overflow-hidden">
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full min-w-[620px] text-[12px]">
          <thead>
            <tr className="text-slate-500 border-b border-slate-100">
              {headers.map((header, index) => (
                <th key={header} className={`px-3 py-2 font-medium ${index === 0 ? "text-left" : "text-center"}`}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.join("-")} className="border-b border-slate-50 last:border-b-0">
                {row.map((cell, index) => (
                  <td key={`${row[0]}-${index}`} className={`px-3 py-2 ${index === 0 ? "text-slate-700" : "text-center text-slate-900 font-medium"}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function MercuryTabs({ active, onChange, isSalesMode }: { active: MercuryTab; onChange: (tab: MercuryTab) => void; isSalesMode: boolean }) {
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const tabs = isSalesMode ? [...userTabs, "睡眠顾问" as MercuryTab] : userTabs;

  const handleClick = (tab: MercuryTab) => {
    onChange(tab);
    tabRefs.current[tab]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  return (
    <div className="sticky top-[41px] z-40 bg-[#eef8ff]/95 backdrop-blur border-y border-sky-100">
      <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 py-2 max-w-[430px] mx-auto">
        {tabs.map((tab) => {
          const isActive = active === tab;
          return (
            <button
              key={tab}
              ref={(el) => {
                tabRefs.current[tab] = el;
              }}
              onClick={() => handleClick(tab)}
              className={`flex-none px-4 py-2 rounded-full text-[13px] transition-all ${
                isActive
                  ? "bg-sky-600 text-white font-semibold shadow-[0_6px_16px_rgba(2,132,199,0.25)]"
                  : "bg-white text-slate-500 border border-sky-100"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Hero() {
  return (
    <div className="bg-[linear-gradient(180deg,#eaf4f8_0%,#f4f7f9_100%)]">
      <div className="relative aspect-[1080/458] overflow-hidden border border-sky-200/60 bg-[#02050b] shadow-[0_10px_28px_rgba(15,23,42,0.16)]">
        <img src={mercuryReportHero} alt="水星睡眠科技AI智配系统" className="absolute inset-0 h-full w-full object-cover" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(56,189,248,0.08),transparent_48%,rgba(255,255,255,0.05))]" />
        <img
          src={mercuryReportQr}
          alt="报告二维码"
          className="absolute left-[81.1%] top-[12.2%] h-auto w-[11.35%] rounded-[8px] border-2 border-white/90 shadow-[0_4px_12px_rgba(2,8,23,0.32)]"
        />
      </div>
    </div>
  );
}

function Profile() {
  const [visible, setVisible] = useState(false);
  return (
    <div className="px-4 pt-4">
      <Panel className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[12px] text-slate-500">检测用户</div>
            <div className="mt-1 text-[20px] font-bold text-slate-900">郭英俊</div>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setVisible((value) => !value)} aria-label={visible ? "隐藏用户数据" : "显示用户数据"} className="grid h-8 w-8 place-items-center rounded-full border border-sky-100 bg-sky-50 text-sky-600">
              {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-2">
          {profileStats.map(([label, value]) => (
            <div key={label} className="rounded-xl bg-slate-50 p-2 text-center">
              <div className="text-[11px] text-slate-400">{label}</div>
              <div className="mt-1 text-[14px] font-semibold text-slate-700">{visible ? value : "***"}</div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function SurveySummary() {
  return (
    <Section title="问卷信息" eyebrow="算法关联 · 共4题">
      <div className="grid grid-cols-2 gap-3">
        {surveyItems.map((item) => (
          <InfoCard key={item.label} {...item} emphasize={item.label === "枕高偏好"} />
        ))}
      </div>
      <p className="mt-2 px-1 text-[11px] leading-5 text-slate-400">枕高偏好用于中国·梦 瑧享定制枕型号重叠区间仲裁；其余题项为睡姿与承托背景参考。</p>
    </Section>
  );
}

function NeckMeasure() {
  return (
    <Section title="肩颈尺寸测量">
      <div className="grid grid-cols-2 gap-3 mb-3">
        <Panel className="p-3">
          <div className="mb-2 text-[13px] font-medium text-slate-600">正面</div>
          <div className="h-48 rounded-xl bg-sky-50 flex items-center justify-center overflow-hidden">
            <img src={neckFront} alt="正面肩颈尺寸测量" className="max-h-full w-auto object-contain" />
          </div>
        </Panel>
        <Panel className="p-3">
          <div className="mb-2 text-[13px] font-medium text-slate-600">侧面</div>
          <div className="h-48 rounded-xl bg-sky-50 flex items-center justify-center overflow-hidden">
            <img src={neckSide} alt="侧面肩颈尺寸测量" className="max-h-full w-auto object-contain" />
          </div>
        </Panel>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {neckMetrics.map((metric) => (
          <MetricCard key={metric.code} {...metric} />
        ))}
      </div>
    </Section>
  );
}

const universalZoneHeights = [
  { zone: "Z7", height: "10.4cm", className: "col-start-1 row-span-2 row-start-1 bg-[#eadfff]" },
  { zone: "Z6", height: "14.5cm", className: "col-start-1 row-span-2 row-start-3 bg-[#dfe9ff]" },
  { zone: "Z3", height: "5.0cm", className: "col-start-2 row-start-1 bg-[#fff2f2]" },
  { zone: "Z2", height: "4.4cm", className: "col-start-2 row-span-2 row-start-2 bg-[#f3efff]" },
  { zone: "Z1", height: "10.4cm", className: "col-start-2 row-start-4 bg-[#fff2f2]" },
  { zone: "Z5", height: "10.4cm", className: "col-start-3 row-span-2 row-start-1 bg-[#dcf7d7]" },
  { zone: "Z4", height: "15.5cm", className: "col-start-3 row-span-2 row-start-3 bg-[#ffe9c9]" },
];

function UniversalZoneRecommendations() {
  return (
    <Section title="通用 7 分区推荐高度">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_6px_18px_rgba(67,112,148,0.05)]">
        <div className="grid h-[188px] grid-cols-3 grid-rows-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
          {universalZoneHeights.map((item) => (
            <div key={item.zone} className={`grid place-items-center border-b border-r border-white/80 text-center ${item.className}`}>
              <div>
                <b className="block text-[17px] leading-none text-slate-900">{item.zone}</b>
                <span className="mt-2 block text-[12px] text-slate-600">{item.height}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function SpineHealth() {
  return (
    <Section title="颈脊健康分析">
      <div className="mb-2.5 flex items-start gap-2 rounded-xl bg-sky-50 px-[11px] py-[9px] text-[11px] leading-[1.65] text-sky-700">
        <span className="mt-[5px] h-2 w-2 flex-none rounded-full bg-sky-500" />
        基于单项体态测量，用于解释当前姿态表现，不代表脊柱综合评分。
      </div>
      <div className="space-y-3">
        {mercuryPostureInsights.map((insight) => (
            <Panel key={insight.key} className="p-[14px]">
              <div className="flex items-center justify-between gap-2.5">
                <h3 className="text-[16px] font-semibold text-slate-900">{insight.title}</h3>
                <span className={`ml-2 flex-none rounded-full border px-2 py-0.5 text-[11px] font-bold ${spineLevelMeta[insight.level].badge}`}>{spineLevelMeta[insight.level].label}</span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {insight.signals.map((item) => {
                  const severity = postureSeverityMeta[item.severity];
                  return (
                    <div key={item.label} className="overflow-hidden rounded-[14px] border border-slate-200 bg-slate-50">
                      <img src={item.image} alt={item.label} className="block h-[86px] w-full border-b border-slate-200 bg-[#eff2f5] object-contain" />
                      <div className="p-2 text-[12px] text-slate-900">
                        {item.label}
                        <div className="mt-[3px] flex flex-wrap items-center gap-1.5 text-[14px] font-bold">
                          <span className={`rounded-md border px-1.5 py-0.5 text-[10px] font-bold ${severity.badge}`}>{item.status}</span>
                          <span>{item.value}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-[11px] space-y-2.5 border-t border-slate-100 pt-2.5">
                <p className="text-[11px] leading-[1.65] text-slate-600"><b className="text-sky-700">常见原因：</b>{insight.cause}</p>
                <p className="text-[11px] leading-[1.65] text-slate-600"><b className="text-slate-800">重点影响：</b>{insight.impact}</p>
                <div className="rounded-lg bg-amber-50 px-[9px] py-2 text-[11px] leading-[1.65] text-slate-600">
                  <b className="text-amber-700">建议怎么做</b>
                  <p className="mt-1"><b className="text-slate-700">睡眠承托：</b>{insight.sleepSupport}</p>
                  <p className="mt-1"><b className="text-slate-700">日常建议：</b>{insight.action}</p>
                </div>
              </div>
            </Panel>
        ))}
      </div>
      <p className="mt-2.5 px-0.5 text-[10px] leading-[1.6] text-slate-400">体态表现可能受到穿着、站姿和检测状态影响；相关因素为健康管理参考，不代表确定原因。</p>
    </Section>
  );
}

function PressureDistribution() {
  return (
    <Section title="压力分布">
      <div className="space-y-3">
        {pressureImages.map((item) => (
          <Panel key={item.label} className="overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2.5 text-[14px] font-semibold text-slate-800"><span className="h-2 w-2 rounded-full bg-sky-500" />{item.label}</div>
            <div className="relative aspect-[720/361] overflow-hidden bg-black">
              <img src={item.image} alt={`${item.label}压力分布`} className="h-full w-full object-cover" />
            </div>
            <p className="px-3 py-2.5 text-[11px] leading-snug text-slate-500">{item.value}</p>
          </Panel>
        ))}
      </div>
    </Section>
  );
}

function BalanceAnalysis() {
  return (
    <Section title="最优压力平衡分析">
      <div className="space-y-3">
        {balanceRows.map((row) => (
          <Panel key={row.title} className="overflow-hidden">
            <div className="bg-emerald-500 px-3 py-2 text-[14px] font-semibold text-white">{row.title}</div>
            <div className="h-[240px] px-1 pt-3">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={row.chartData} margin={{ top: 8, right: 10, left: -18, bottom: 0 }}>
                    <CartesianGrid stroke="#e8edf3" vertical={false} />
                    <XAxis dataKey="zone" tick={{ fontSize: 10, fill: "#64748b" }} />
                    <YAxis domain={[0, 0.35]} tick={{ fontSize: 10, fill: "#64748b" }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Line type="monotone" name="实际测量值" dataKey="actual" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" name="黄金理想值" dataKey="ideal" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full min-w-[560px] text-[12px]">
                <thead>
                  <tr className="text-slate-500">
                    <th className="px-2 py-2 text-left font-medium">分区</th>
                    {balanceZones.map((zone) => (
                      <th key={zone} className="px-2 py-2 font-medium">{zone}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-sky-50">
                    <td className="px-2 py-2 text-slate-500">压力分布</td>
                    {row.values.map((value, index) => <td key={`bar-${row.title}-${index}`} className="h-14 px-2 align-bottom"><span className="mx-auto block w-4 rounded-t bg-[linear-gradient(#fb923c,#14b8a6)]" style={{ height: `${Math.max(4, Number(value) * 1.4)}px` }} /></td>)}
                  </tr>
                  <tr className="border-t border-sky-50">
                    <td className="px-2 py-2 text-slate-500">分布占比</td>
                    {row.values.map((value, index) => (
                      <td key={`${row.title}-${balanceZones[index]}`} className="px-2 py-2 text-center font-semibold text-slate-800 tabular-nums">
                        {value}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </Panel>
        ))}
      </div>
    </Section>
  );
}

function ProductSelection({
  productType,
  selectedModel,
  orientation,
  onProductTypeChange,
  onModelChange,
  onOrientationChange,
}: {
  productType: PillowGeneration;
  selectedModel: string;
  orientation: PillowOrientation;
  onProductTypeChange: (type: PillowGeneration) => void;
  onModelChange: (model: string) => void;
  onOrientationChange: (orientation: PillowOrientation) => void;
}) {
  return (
    <section id="product-selection">
    <Section title="产品选择与型号匹配">
      <Panel className="p-3">
        <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-1">
          {(["gen2", "gen1"] as PillowGeneration[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => onProductTypeChange(type)}
              className={`flex min-h-14 items-center justify-center rounded-lg px-2 py-2 text-center text-[12px] font-semibold leading-5 transition-colors ${productType === type ? "bg-white text-sky-700 shadow-sm" : "text-slate-500"}`}
            >
              {pillowProductNames[type]}
            </button>
          ))}
        </div>
        {productType === "gen1" ? (
          <>
            <div className="mt-3 rounded-xl bg-emerald-50 px-3 py-2">
              <div className="text-[13px] font-semibold text-emerald-700">推荐型号：{recommendedGenerationOneModel.id}</div>
              <p className="mt-1 text-[11px] leading-5 text-emerald-700">结合测量高度与问卷「枕高偏好：{pillowHeightPreference}」仲裁得出，可作为试躺起始型号；导购可按试睡体验自由改选。</p>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {generationOneModels.map((model) => (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => onModelChange(model.id)}
                  className={`rounded-full py-2 text-[12px] transition-colors ${selectedModel === model.id ? "bg-sky-600 text-white" : "bg-slate-50 text-slate-600"}`}
                >
                  {model.id}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="mt-3 rounded-xl bg-sky-50 px-3 py-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[13px] font-semibold text-sky-700">中国·梦 尊享定制枕（已选）</div>
                <p className="mt-1 text-[11px] leading-5 text-sky-700">系统推荐：{pillowOrientationMeta[recommendedPillowOrientation].label}（{pillowOrientationMeta[recommendedPillowOrientation].copy}）。{recommendedPillowOrientation === "convex" ? "颈椎前伸重度异常，优先加强仰睡颈部承托。" : "当前颈椎前伸未达到重度异常，优先从凹面方案开始试躺。"}</p>
              </div>
              <span className="flex-none rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-sky-700 shadow-sm">系统推荐</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-1 rounded-xl bg-white/70 p-1">
              {(["convex", "concave"] as PillowOrientation[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => onOrientationChange(item)}
                  aria-pressed={orientation === item}
                  className={`rounded-lg px-2 py-2 text-center transition-colors ${orientation === item ? "bg-sky-600 text-white shadow-sm" : "text-slate-500"}`}
                >
                  <span className="block text-[12px] font-semibold">{pillowOrientationMeta[item].label}</span>
                  <span className={`mt-0.5 block text-[10px] ${orientation === item ? "text-sky-100" : "text-slate-400"}`}>{pillowOrientationMeta[item].copy}</span>
                </button>
              ))}
            </div>
            <p className="mt-2 text-[10px] leading-4 text-sky-600">导购可结合用户试躺感受切换面型；切换后加载对应的分区推荐设置。</p>
          </div>
        )}
      </Panel>
    </Section>
    </section>
  );
}

function ZoneAdjustment({
  productType,
  orientation,
  zones,
  pads,
  originalPads,
  selectedZoneId,
  onSelectedZoneChange,
  onChange,
  onSave,
}: {
  productType: PillowGeneration;
  orientation: PillowOrientation;
  zones: PillowZone[];
  pads: number[];
  originalPads: number[];
  selectedZoneId: number;
  onSelectedZoneChange: (zoneId: number) => void;
  onChange: (pads: number[]) => void;
  onSave: () => void;
}) {
  const [message, setMessage] = useState("");
  const selectedIndex = Math.max(0, zones.findIndex((zone) => zone.id === selectedZoneId));
  const selectedZone = zones[selectedIndex];
  const currentPads = pads[selectedIndex] ?? 0;
  const recommendedPads = padsFromTargetHeight(selectedZone.baseHeight, selectedZone.recommendedHeight);
  const currentHeight = heightFromPads(selectedZone.baseHeight, currentPads);
  const currentWeight = weightFromPads(currentPads);
  const currentOrientation = pillowOrientationMeta[orientation];
  const selectedZoneName = productType === "gen2" && selectedZone.id === currentOrientation.supineZoneId
    ? `${selectedZone.name}（当前仰睡区）`
    : selectedZone.name;
  const updatePads = (index: number, value: number) =>
    onChange(pads.map((item, itemIndex) => (itemIndex === index ? Math.min(12, Math.max(0, Math.round(value))) : item)));

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(""), 2200);
    return () => window.clearTimeout(timer);
  }, [message]);

  return (
    <section id="zone-adjustment"><Section title="分区垫片调节">
      <Panel className="overflow-hidden">
        <div className="relative aspect-[16/9] overflow-hidden bg-slate-50">
          <img
            src={productType === "gen1" ? generationOnePillow : generationTwoPillow}
            alt={`${pillowProductNames[productType]}分区调节`}
            className={`h-full w-full object-contain transition-transform duration-300 ${productType === "gen2" && orientation === "concave" ? "rotate-180" : ""}`}
          />
          {productType === "gen2" && (
            <div className="absolute left-3 top-3 z-20 rounded-full border border-sky-100 bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-sky-700 shadow-sm backdrop-blur-sm">
              当前：{currentOrientation.label} · {currentOrientation.copy}
            </div>
          )}
          {zones.map((zone) => {
            const active = zone.id === selectedZone.id;
            return (
              <button
                key={zone.id}
                type="button"
                aria-label={`选择${zone.id === currentOrientation.supineZoneId && productType === "gen2" ? `${zone.name}，当前仰睡区` : zone.name}`}
                aria-pressed={active}
                onClick={() => onSelectedZoneChange(zone.id)}
                className={`absolute z-10 grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[3px] text-[13px] font-bold shadow-sm transition-transform active:scale-95 ${active ? "border-blue-500 bg-blue-500 text-white scale-110" : "border-blue-400 bg-white/90 text-blue-500"}`}
                style={{ left: `${zone.hotspot.x}%`, top: `${zone.hotspot.y}%` }}
              >
                {zone.id}
              </button>
            );
          })}
        </div>
        <div className="pointer-events-none relative z-20 mx-auto -mt-5 w-fit rounded-xl bg-white/95 px-3 py-2 text-center shadow-lg backdrop-blur-sm">
          <div className="whitespace-nowrap text-[12px] font-semibold text-slate-800">{selectedZoneName}</div>
          <div className="mt-0.5 text-[16px] font-bold text-blue-500">{currentHeight.toFixed(1)}cm · {currentPads}片</div>
          <span className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-white" />
        </div>
        <div className="p-3 pt-2">
          <div className="mb-3 flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            {zones.map((zone, index) => {
              const active = zone.id === selectedZoneId;
              return (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => onSelectedZoneChange(zone.id)}
                  className={`flex-none rounded-full px-2.5 py-1.5 text-[11px] font-semibold transition-colors ${active ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-600"}`}
                >
                  {zone.id}区{(pads[index] ?? 0) > 0 ? ` · ${pads[index]}片` : ""}
                </button>
              );
            })}
          </div>
          <div className="text-[14px] font-semibold text-slate-900">{selectedZone.id}区 · {selectedZoneName}</div>
          <p className="mt-1 text-[11px] text-slate-500">按垫片片数调节，高度与克重自动换算（非直接改高度）。</p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-center sm:grid-cols-4">
            <div className="rounded-xl bg-slate-50 px-2 py-2"><span className="block text-[10px] text-slate-400">基础高度</span><b className="mt-1 block text-[13px] text-slate-800">{selectedZone.baseHeight.toFixed(1)}cm</b></div>
            <div className="rounded-xl bg-amber-50 px-2 py-2"><span className="block text-[10px] text-amber-600">调节垫片数</span><b className="mt-1 block text-[13px] text-amber-700">{currentPads}片</b></div>
            <div className="rounded-xl bg-slate-50 px-2 py-2"><span className="block text-[10px] text-slate-400">调节克重</span><b className="mt-1 block text-[13px] text-slate-800">{currentWeight}g</b></div>
            <div className="rounded-xl bg-blue-50 px-2 py-2"><span className="block text-[10px] text-blue-500">调节后高度</span><b className="mt-1 block text-[13px] text-blue-700">{currentHeight.toFixed(1)}cm</b></div>
          </div>
          <div className="mt-2 flex items-center justify-between gap-2 rounded-xl bg-sky-50 px-3 py-2 text-[11px] text-sky-700">
            <span>推荐高度 {selectedZone.recommendedHeight.toFixed(1)}cm · 建议 {recommendedPads} 片</span>
            {currentPads !== recommendedPads ? (
              <button type="button" onClick={() => updatePads(selectedIndex, recommendedPads)} className="flex-none rounded-full bg-white px-2.5 py-1 font-semibold text-sky-700 shadow-sm">
                一键对齐
              </button>
            ) : (
              <span className="font-semibold text-emerald-600">已对齐</span>
            )}
          </div>
          <div className="mt-3 flex items-center justify-center gap-3">
            <button type="button" aria-label="减少垫片" onClick={() => updatePads(selectedIndex, currentPads - 1)} className="grid h-11 w-11 place-items-center rounded-full bg-slate-100 text-slate-600 active:scale-95"><Minus className="h-4 w-4" /></button>
            <div className="relative w-28">
              <input aria-label={`${selectedZoneName}垫片数`} type="number" min="0" max="12" step="1" value={currentPads} onChange={(event) => updatePads(selectedIndex, Number(event.target.value))} className="w-full rounded-xl border border-sky-100 px-3 py-2.5 text-center text-[16px] font-bold text-slate-900" />
              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-slate-400">片</span>
            </div>
            <button type="button" aria-label="增加垫片" onClick={() => updatePads(selectedIndex, currentPads + 1)} className="grid h-11 w-11 place-items-center rounded-full bg-sky-600 text-white active:scale-95"><Plus className="h-4 w-4" /></button>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button type="button" onClick={() => { onChange(originalPads); setMessage("已恢复原始垫片数"); }} className="flex min-h-11 items-center justify-center gap-1 rounded-full border border-slate-200 px-2 py-2.5 text-[11px] text-slate-600"><RotateCcw className="h-4 w-4 flex-none" />重置垫片</button>
            <button type="button" onClick={() => { onSave(); setMessage(productType === "gen2" ? `${currentOrientation.label}分区垫片设置已保存` : "分区垫片设置已保存"); }} className="flex min-h-11 items-center justify-center gap-1 rounded-full bg-sky-600 px-2 py-2.5 text-[12px] font-semibold text-white"><Save className="h-4 w-4 flex-none" />保存设置</button>
          </div>
          {message && <div className="mt-2 text-center text-[12px] text-emerald-600 transition-opacity">{message}</div>}
        </div>
      </Panel>
    </Section></section>
  );
}

function AdjustmentPreview({ productType, orientation, zones, pads, selectedModel }: { productType: PillowGeneration; orientation: PillowOrientation; zones: PillowZone[]; pads: number[]; selectedModel: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Section title="臻享定制枕 · 定制方案预览">
      <Panel className="overflow-hidden">
        <button type="button" onClick={() => setOpen((value) => !value)} className="flex w-full items-center justify-between gap-3 bg-slate-50 px-3 py-3 text-left">
          <div>
            <div className="text-[13px] font-semibold text-slate-700">当前方案：{pillowProductNames[productType]}{productType === "gen1" ? ` · ${selectedModel}` : ` · ${pillowOrientationMeta[orientation].label}`}</div>
            <p className="mt-0.5 text-[11px] text-slate-500">{zones.length} 个分区 · 点击{open ? "收起" : "展开"}明细</p>
          </div>
          <ChevronDown className={`h-4 w-4 flex-none text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        {open && (
          <>
            <p className="border-b border-slate-100 px-3 py-2 text-[11px] leading-5 text-slate-500">分区垫片随调节结果同步；确认试躺满意后进入成交。</p>
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full min-w-[560px] text-[12px]">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-100">
                    <th className="px-3 py-2 text-left font-medium">分区</th>
                    <th className="px-3 py-2 font-medium">基础高度(cm)</th>
                    <th className="px-3 py-2 font-medium">垫片数</th>
                    <th className="px-3 py-2 font-medium">克重(g)</th>
                    <th className="px-3 py-2 font-medium">调节后高度(cm)</th>
                  </tr>
                </thead>
                <tbody>
                  {zones.map((zone, rowIndex) => {
                    const zonePads = pads[rowIndex] ?? 0;
                    return (
                      <tr key={zone.id} className="border-b border-slate-50 last:border-b-0">
                        <td className="px-3 py-2 text-slate-700">{zone.id}区 {zone.name}</td>
                        <td className="px-3 py-2 text-center text-slate-900 font-medium tabular-nums">{zone.baseHeight.toFixed(1)}</td>
                        <td className="px-3 py-2 text-center text-slate-900 font-medium tabular-nums">{zonePads}</td>
                        <td className="px-3 py-2 text-center text-slate-900 font-medium tabular-nums">{weightFromPads(zonePads)}</td>
                        <td className="px-3 py-2 text-center text-slate-900 font-medium tabular-nums">{heightFromPads(zone.baseHeight, zonePads).toFixed(1)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Panel>
    </Section>
  );
}

function BusinessControls({ productType, orientation, selectedModel, onModelChange }: { productType: PillowGeneration; orientation: PillowOrientation; selectedModel: string; onModelChange: (model: string) => void }) {
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [date, setDate] = useState("");
  const modelOptions = productType === "gen1" ? generationOneModels.map((model) => model.id) : [pillowProductNames.gen2];

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(""), 2200);
    return () => window.clearTimeout(timer);
  }, [message]);

  return (
    <section id="deal-confirm">
    <Section title="方案确认与成交">
      <div className="space-y-3">
        <Panel className="p-3">
          <div className="text-[13px] font-semibold text-slate-800">舒适度评分</div>
          <p className="mt-1 text-[12px] text-slate-500">当前方案：{pillowProductNames[productType]}{productType === "gen1" ? ` · ${selectedModel}` : ` · ${pillowOrientationMeta[orientation].label}`}。请根据用户试躺反馈选择1-5星。</p>
          <div className="mt-3 flex items-center gap-1">
            {[1,2,3,4,5].map((value) => <button type="button" aria-label={`${value}星`} onClick={() => setRating(value)} key={value}><Star className={`h-8 w-8 transition-transform active:scale-90 ${value <= rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} /></button>)}
            <span className="ml-2 text-[14px] text-slate-600">{rating}分</span>
          </div>
          <div className="mt-3">
            <button type="button" onClick={() => setMessage(`已确认${selectedModel}，舒适度${rating}分`)} className="w-full rounded-full bg-sky-600 text-white py-2.5 text-[13px] font-semibold active:scale-[0.99]">确认试躺方案</button>
          </div>
          {message && <div className="mt-2 text-center text-[12px] text-emerald-600">{message}</div>}
        </Panel>
        <Panel className="p-3">
          <div className="text-[13px] font-semibold text-slate-800 mb-2">成交信息</div>
          <div className="grid grid-cols-[40px_1fr_58px_82px] text-[12px] text-slate-500 bg-slate-50 rounded-t-xl">
            <div className="px-2 py-2">序号</div>
            <div className="px-2 py-2">枕头型号</div>
            <div className="px-2 py-2 text-center">成交数量</div>
            <div className="px-2 py-2">成交日期</div>
          </div>
          <div className="grid grid-cols-[40px_1fr_58px_82px] text-[12px] border border-slate-100 border-t-0 rounded-b-xl">
            <div className="px-2 py-2 text-slate-700">1</div>
            <select value={selectedModel} onChange={(event) => onModelChange(event.target.value)} className="min-w-0 px-1 text-slate-700">{modelOptions.map((model) => <option key={model}>{model}</option>)}</select>
            <div className="flex items-center justify-center gap-1 text-slate-700"><button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button><b>{quantity}</b><button type="button" onClick={() => setQuantity(quantity + 1)}>+</button></div>
            <input aria-label="成交日期" type="date" value={date} onChange={(event) => setDate(event.target.value)} className="min-w-0 px-1 text-[10px]" />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <button type="button" onClick={() => setMessage("已添加一项商品")} className="rounded-full bg-white border border-slate-200 text-slate-500 py-2 text-[12px]">添加商品</button>
            <button type="button" onClick={() => setMessage(date ? "成交信息已保存" : "请填写成交日期")} className="rounded-full bg-emerald-500 text-white py-2 text-[12px] font-medium">保存成交信息</button>
          </div>
        </Panel>
      </div>
    </Section>
    </section>
  );
}

function AiRecommend({ onNavigate }: { onNavigate: (tab: MercuryTab) => void }) {
  return (
    <div className="px-4 pt-4 pb-10">
      <SurveySummary />
      <NeckMeasure />
      <UniversalZoneRecommendations />
      <SpineHealth />
      <div className="mt-4">
        <button
          type="button"
          onClick={() => onNavigate("脊柱评估")}
          className="flex w-full items-center justify-between rounded-2xl border border-sky-100 bg-white px-4 py-3 text-left shadow-[0_8px_24px_rgba(32,120,180,0.06)]"
        >
          <div>
            <div className="text-[13px] font-semibold text-slate-800">查看综合姿态评分</div>
            <p className="mt-0.5 text-[11px] text-slate-500">脊柱评估页侧重整体偏离程度，与上方单项解读口径不同</p>
          </div>
          <span className="text-[12px] font-semibold text-sky-600">前往 →</span>
        </button>
      </div>
      <PressureDistribution />
      <BalanceAnalysis />
    </div>
  );
}

function SalesOperations() {
  const [productType, setProductType] = useState<PillowGeneration>("gen2");
  const [selectedModel, setSelectedModel] = useState(pillowProductNames.gen2);
  const [orientation, setOrientation] = useState<PillowOrientation>(recommendedPillowOrientation);
  const [pendingOrientation, setPendingOrientation] = useState<PillowOrientation | null>(null);
  const [selectedZoneId, setSelectedZoneId] = useState(pillowOrientationMeta[recommendedPillowOrientation].supineZoneId);
  const selectedGenerationOneModel = generationOneModels.find((model) => model.id === selectedModel) ?? recommendedGenerationOneModel;
  const generationOneZones = selectedGenerationOneModel.zones.map((zone, index) => ({
    id: index + 1,
    name: generationOneZoneNames[index],
    baseHeight: zone.height,
    recommendedHeight: generationOneRecommendedHeights[index],
    hotspot: generationOneHotspots[index],
  }));
  const gen1OriginalPads = generationOneZones.map((zone) => padsFromTargetHeight(zone.baseHeight, zone.recommendedHeight));
  const generationTwoZones = getGenerationTwoZones(orientation);
  const gen2OriginalPads = generationTwoZones.map((zone) => padsFromTargetHeight(zone.baseHeight, zone.recommendedHeight));
  const [gen1Pads, setGen1Pads] = useState(gen1OriginalPads);
  const [gen2Pads, setGen2Pads] = useState(gen2OriginalPads);
  const [gen2SavedPads, setGen2SavedPads] = useState(gen2OriginalPads);
  const activeZones = productType === "gen1" ? generationOneZones : generationTwoZones;
  const activePads = productType === "gen1" ? gen1Pads : gen2Pads;
  const activeOriginalPads = productType === "gen1" ? gen1OriginalPads : gen2OriginalPads;
  const setActivePads = productType === "gen1" ? setGen1Pads : setGen2Pads;
  const gen2HasUnsavedChanges = gen2Pads.some((pads, index) => pads !== gen2SavedPads[index]);

  const applyOrientation = (nextOrientation: PillowOrientation) => {
    const nextZones = getGenerationTwoZones(nextOrientation);
    const nextPads = nextZones.map((zone) => padsFromTargetHeight(zone.baseHeight, zone.recommendedHeight));
    setOrientation(nextOrientation);
    setSelectedZoneId(pillowOrientationMeta[nextOrientation].supineZoneId);
    setGen2Pads(nextPads);
    setGen2SavedPads(nextPads);
    setPendingOrientation(null);
  };

  const handleOrientationChange = (nextOrientation: PillowOrientation) => {
    if (nextOrientation === orientation) return;
    if (gen2HasUnsavedChanges) {
      setPendingOrientation(nextOrientation);
      return;
    }
    applyOrientation(nextOrientation);
  };

  const handleProductTypeChange = (type: PillowGeneration) => {
    setProductType(type);
    if (type === "gen1") {
      setSelectedModel(recommendedGenerationOneModel.id);
      setSelectedZoneId(3);
      const nextZones = recommendedGenerationOneModel.zones.map((zone, index) => ({
        baseHeight: zone.height,
        recommendedHeight: generationOneRecommendedHeights[index],
      }));
      setGen1Pads(nextZones.map((zone) => padsFromTargetHeight(zone.baseHeight, zone.recommendedHeight)));
    } else {
      setSelectedModel(pillowProductNames.gen2);
      applyOrientation(recommendedPillowOrientation);
    }
  };

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    const nextModel = generationOneModels.find((item) => item.id === model);
    if (nextModel) {
      const nextZones = nextModel.zones.map((zone, index) => ({
        baseHeight: zone.height,
        recommendedHeight: generationOneRecommendedHeights[index],
      }));
      setGen1Pads(nextZones.map((zone) => padsFromTargetHeight(zone.baseHeight, zone.recommendedHeight)));
      setSelectedZoneId(3);
    }
  };

  return (
    <div className="px-4 pt-4 pb-10">
      <ProductSelection productType={productType} selectedModel={selectedModel} orientation={orientation} onProductTypeChange={handleProductTypeChange} onModelChange={handleModelChange} onOrientationChange={handleOrientationChange} />
      <ZoneAdjustment productType={productType} orientation={orientation} zones={activeZones} pads={activePads} originalPads={activeOriginalPads} selectedZoneId={selectedZoneId} onSelectedZoneChange={setSelectedZoneId} onChange={setActivePads} onSave={() => { if (productType === "gen2") setGen2SavedPads([...gen2Pads]); }} />
      <AdjustmentPreview productType={productType} orientation={orientation} zones={activeZones} pads={activePads} selectedModel={selectedModel} />
      <BusinessControls productType={productType} orientation={orientation} selectedModel={selectedModel} onModelChange={handleModelChange} />
      {pendingOrientation && <OrientationChangeDialog target={pendingOrientation} onCancel={() => setPendingOrientation(null)} onConfirm={() => applyOrientation(pendingOrientation)} />}
    </div>
  );
}

function SpineTab() {
  return <MercurySpineReport />;
}

function MeasureTab() {
  return <MercuryBodyMeasureReport />;
}

function CompositionTab() {
  return <MercuryBodyCompositionReport />;
}

export function MercuryReport() {
  const [activeTab, setActiveTab] = useState<MercuryTab>("AI推荐");
  const [isSalesMode, setIsSalesMode] = useState(false);
  const [showSalesReminder, setShowSalesReminder] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const salesMode = params.get("mode") === "sales" || window.location.hash === "#sales";
    setIsSalesMode(salesMode);
    if (salesMode) {
      setShowSalesReminder(true);
      const requestedTab = params.get("tab");
      const tabAliases: Record<string, MercuryTab> = {
        ai: "AI推荐",
        spine: "脊柱评估",
        composition: "身体成分",
        measure: "体围测量",
        operations: "睡眠顾问",
        导购操作: "睡眠顾问",
        睡眠顾问: "睡眠顾问",
      };
      const salesTab = requestedTab ? tabAliases[requestedTab] ?? "睡眠顾问" : "睡眠顾问";
      setActiveTab(salesTab);
    }
  }, []);
  const navigateTo = (tab: MercuryTab) => {
    setActiveTab(tab);
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  };

  return (
    <div className="w-full max-w-[430px] mx-auto min-h-screen bg-[#eef8ff] text-slate-900 pb-10">
      <Hero />
      <Profile />
      <MercuryTabs active={activeTab} onChange={navigateTo} isSalesMode={isSalesMode} />
      {activeTab === "AI推荐" && <AiRecommend onNavigate={navigateTo} />}
      {activeTab === "脊柱评估" && <SpineTab />}
      {activeTab === "身体成分" && <CompositionTab />}
      {activeTab === "体围测量" && <MeasureTab />}
      {activeTab === "睡眠顾问" && isSalesMode && <SalesOperations />}
      {showSalesReminder && (
        <SalesReminderModal
          onConfirm={() => {
            setShowSalesReminder(false);
            navigateTo("睡眠顾问");
          }}
        />
      )}
      <p className="px-4 pb-6 text-center text-[11px] leading-relaxed text-slate-400">
        本页面为水星报告静态兼容预览 · {MERCURY_REPORT_VERSION}
      </p>
    </div>
  );
}
