import {
  Scan,
  Sparkles,
  BedDouble,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
} from "lucide-react";
import { BrandHero } from "./BrandHero";
import neckFront from "@/assets/neck-front.png";
import neckSide from "@/assets/neck-side.png";
import pillowIllu from "@/assets/pillow-illu.png";
import pillowZones from "@/assets/pillow-zones.png";
import spineNeckTilt from "@/assets/spine/neck-tilt.png";
import spineNeckForward from "@/assets/spine/neck-forward.png";
import spineShoulderLeft from "@/assets/spine/shoulder-left.png";
import spineShoulderRight from "@/assets/spine/shoulder-right.png";
import spineShoulderBalance from "@/assets/spine/shoulder-balance.png";
import spinePelvisForward from "@/assets/spine/pelvis-forward.png";

/* ---------- Health-tech token palette ---------- */
const c = {
  page: "#F4F8FD",
  pageDeep: "#E9F1FA",
  card: "#FFFFFF",
  ink: "#0B2545",
  ink2: "#3E5879",
  muted: "#8597B0",
  hair: "rgba(11, 37, 69, 0.08)",
  hairSoft: "rgba(11, 37, 69, 0.05)",

  blue: "#3B82F6",
  blueDeep: "#1E40AF",
  blueSoft: "#E4EEFD",

  teal: "#0FB5A6",
  tealDeep: "#0E8F84",
  tealSoft: "#DCF5F1",

  warm: "#F59E4B",
  warmDeep: "#C2410C",
  warmSoft: "#FFEAD4",
};

const sans = `"PingFang SC", "Microsoft YaHei", -apple-system, system-ui, sans-serif`;
const display = `"PingFang SC", -apple-system, system-ui, sans-serif`;

/* ---------- Atoms ---------- */
function Card({
  children,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`rounded-[20px] ${className}`}
      style={{
        background: c.card,
        boxShadow:
          "0 1px 0 rgba(255,255,255,0.6) inset, 0 6px 20px -10px rgba(11,37,69,0.12), 0 1px 3px rgba(11,37,69,0.04)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionHeader({
  icon,
  kicker,
  title,
  tone = "blue",
}: {
  icon: React.ReactNode;
  kicker: string;
  title: string;
  tone?: "blue" | "teal" | "warm";
}) {
  const tint = tone === "teal" ? c.tealDeep : tone === "warm" ? c.warmDeep : c.blueDeep;
  const bg = tone === "teal" ? c.tealSoft : tone === "warm" ? c.warmSoft : c.blueSoft;
  return (
    <div className="flex items-center gap-3 mb-3 px-0.5">
      <span
        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: bg, color: tint }}
      >
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <div
          className="text-[11.5px] tracking-[0.18em] font-medium uppercase"
          style={{ color: tint, opacity: 0.7 }}
        >
          {kicker}
        </div>
        <h2
          className="text-[17px] font-semibold leading-tight mt-0.5"
          style={{ color: c.ink, fontFamily: display }}
        >
          {title}
        </h2>
      </div>
      <div
        className="h-px flex-1 max-w-[60px]"
        style={{ background: `linear-gradient(to right, ${c.hair}, transparent)` }}
      />
    </div>
  );
}

function MetricCard({
  code,
  label,
  value,
  desc,
}: {
  code: string;
  label: string;
  value: string;
  desc?: string;
}) {
  return (
    <Card className="p-3.5">
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-[12px] font-bold px-1.5 py-0.5 rounded-md tabular-nums tracking-wide"
          style={{ background: c.blueSoft, color: c.blueDeep }}
        >
          {code}
        </span>
        <span className="text-[13px] font-medium" style={{ color: c.ink2 }}>
          {label}
        </span>
      </div>
      <div className="flex items-baseline gap-1">
        <span
          className="text-[20px] font-semibold leading-none tabular-nums"
          style={{ color: c.ink, fontFamily: display, letterSpacing: "-0.02em" }}
        >
          {value}
        </span>
        <span className="text-[12px]" style={{ color: c.muted }}>
          cm
        </span>
      </div>
      {desc && (
        <div
          className="mt-2 pt-2 text-[12px] leading-relaxed"
          style={{ color: c.muted, borderTop: `1px solid ${c.hairSoft}` }}
        >
          {desc}
        </div>
      )}
    </Card>
  );
}

const metrics = [
  { code: "L1", label: "耳宽", value: "15.3", desc: "两侧耳廓最外侧水平距离" },
  { code: "L2", label: "颈宽", value: "12.8", desc: "颈部最宽处的水平横向距离" },
  { code: "L3", label: "肩宽", value: "36.6", desc: "左右肩峰点间水平直线距离" },
  { code: "L4", label: "头背距", value: "6.2", desc: "背部后缘至后脑最突出点" },
  { code: "L5", label: "颈深", value: "8.9", desc: "背部后缘至第七颈椎点距离" },
  { code: "L6", label: "背深", value: "11.6", desc: "背部后缘至肩峰点水平距离" },
  { code: "H1", label: "头颈高", value: "18.5", desc: "头顶至第七颈椎点垂直高度" },
  { code: "H2", label: "头背高", value: "30.1", desc: "头顶至肩峰点垂直高度" },
];

export function LightReport() {
  return (
    <div
      className="w-full max-w-[430px] min-h-screen pb-10 mx-auto relative"
      style={{
        background: `linear-gradient(180deg, ${c.page} 0%, ${c.pageDeep} 100%)`,
        fontFamily: sans,
        color: c.ink,
      }}
    >
      {/* Banner */}
      <BrandHero />

      <div className="px-4 -mt-5 relative z-10">
        {/* Profile card with health badges */}
        <Card className="p-4 relative overflow-hidden">
          <div
            className="absolute -right-12 -top-12 w-32 h-32 rounded-full opacity-50"
            style={{
              background: `radial-gradient(circle, ${c.tealSoft}, transparent 70%)`,
            }}
          />
          <div className="relative flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-[18px] font-semibold flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, ${c.blue}, ${c.teal})`,
                color: "#fff",
                boxShadow: `0 6px 14px -6px ${c.blue}80`,
                fontFamily: display,
              }}
            >
              王
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span
                  className="text-[16px] font-semibold"
                  style={{ color: c.ink, fontFamily: display }}
                >
                  王** 先生
                </span>
                <span
                  className="text-[12px] px-1.5 py-0.5 rounded-md flex items-center gap-0.5"
                  style={{ background: c.tealSoft, color: c.tealDeep }}
                >
                  <ShieldCheck size={10} strokeWidth={2.5} />
                  已认证
                </span>
              </div>
              <div className="text-[13px] mt-1" style={{ color: c.muted }}>
                颈椎健康档案 · 2025.01.21
              </div>
            </div>
          </div>

          <div
            className="mt-3.5 pt-3.5 grid grid-cols-3 gap-2"
            style={{ borderTop: `1px solid ${c.hairSoft}` }}
          >
            {[
              ["性别", "男"],
              ["年龄", "28"],
              ["编号", "#0121"],
            ].map(([k, v]) => (
              <div key={k} className="text-center">
                <div className="text-[12px]" style={{ color: c.muted }}>
                  {k}
                </div>
                <div
                  className="text-[16px] font-semibold mt-1 tabular-nums"
                  style={{ color: c.ink, fontFamily: display }}
                >
                  {v}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Tabs */}
        <div className="mt-5 flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
          {["综合报告", "体态评估", "脊柱评估", "体围测量", "身体成分", "枕型智配", "床垫智配"].map(
            (tab) => {
              const active = tab === "枕型智配";
              return (
                <button
                  key={tab}
                  className="px-4 py-2 text-[14px] rounded-full whitespace-nowrap transition-all flex-shrink-0"
                  style={
                    active
                      ? {
                          background: `linear-gradient(135deg, ${c.blue}, ${c.blueDeep})`,
                          color: "#fff",
                          boxShadow: `0 6px 16px -6px ${c.blue}99`,
                          fontWeight: 600,
                        }
                      : {
                          background: c.card,
                          color: c.ink2,
                          border: `1px solid ${c.hair}`,
                        }
                  }
                >
                  {tab}
                </button>
              );
            },
          )}
        </div>

        {/* 颈部测量数据 */}
        <section className="mt-6">
          <SectionHeader
            icon={<Scan size={16} strokeWidth={2.2} />}
            kicker="STEP 01 · MEASURE"
            title="颈部测量数据"
            tone="blue"
          />

          {/* Scan visual — unified container */}
          <Card className="p-3 mb-3">
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "正面", img: neckFront },
                { label: "侧面", img: neckSide },
              ].map((m) => (
                <div
                  key={m.label}
                  className="rounded-2xl overflow-hidden relative"
                  style={{
                    background: "#FFFFFF",
                    border: `1px solid ${c.hairSoft}`,
                    aspectRatio: "1/1",
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center p-3">
                    <img
                      src={m.img}
                      alt={m.label}
                      className="max-h-full w-auto object-contain"
                      style={{ mixBlendMode: "multiply" }}
                    />
                  </div>
                  <span
                    className="absolute bottom-2 left-2 text-[12px] font-medium px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(255,255,255,0.85)", color: c.ink2 }}
                  >
                    {m.label}视图
                  </span>
                </div>
              ))}
            </div>
            <div
              className="mt-3 pt-3 flex items-center gap-2 text-[12px]"
              style={{ color: c.muted, borderTop: `1px solid ${c.hairSoft}` }}
            >
              <Sparkles size={11} style={{ color: c.blueDeep }} />
              基于 3D 人体工学扫描
            </div>
          </Card>

          {/* Metric grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {metrics.map((m) => (
              <MetricCard key={m.code} {...m} />
            ))}
          </div>
        </section>

        {/* 颈脊健康分析 */}
        <section className="mt-6">
          <SectionHeader
            icon={<Stethoscope size={16} strokeWidth={2.2} />}
            kicker="STEP 02 · DIAGNOSE"
            title="颈脊健康分析"
            tone="warm"
          />

          {(() => {
            const sevMap = {
              severe: { label: "重度异常", bg: "#FEE2E2", fg: "#B91C1C", dot: "#DC2626" },
              mild: { label: "轻度异常", bg: c.warmSoft, fg: c.warmDeep, dot: c.warm },
              normal: { label: "结构正常", bg: c.tealSoft, fg: c.tealDeep, dot: c.teal },
            } as const;
            const groups: {
              region: string;
              severity: keyof typeof sevMap;
              summary: string;
              items: {
                img: string;
                name: string;
                tag: string;
                tagTone: "severe" | "mild" | "normal";
                value: string;
              }[];
            }[] = [
              {
                region: "颈椎",
                severity: "severe",
                summary: "颈椎前曲不足，侧偏明显，建议加强颈部承托支撑",
                items: [
                  {
                    img: spineNeckTilt,
                    name: "颈椎侧偏",
                    tag: "偏右（可能）",
                    tagTone: "mild",
                    value: "0.3°",
                  },
                  {
                    img: spineNeckForward,
                    name: "颈椎前伸",
                    tag: "前伸",
                    tagTone: "severe",
                    value: "5.7cm",
                  },
                ],
              },
              {
                region: "胸椎",
                severity: "mild",
                summary: "胸椎左右不对称，注意肩部均衡支撑",
                items: [
                  {
                    img: spineShoulderLeft,
                    name: "左肩内收度",
                    tag: "圆肩",
                    tagTone: "severe",
                    value: "3.7cm",
                  },
                  {
                    img: spineShoulderRight,
                    name: "右肩内收度",
                    tag: "圆肩（可能）",
                    tagTone: "mild",
                    value: "0.6cm",
                  },
                ],
              },
              {
                region: "腰椎",
                severity: "mild",
                summary: "腰椎结构正常，维持当前睡眠支撑即可",
                items: [
                  {
                    img: spineShoulderBalance,
                    name: "肩部平衡",
                    tag: "右高左低（可能）",
                    tagTone: "mild",
                    value: "1.0°",
                  },
                  {
                    img: spinePelvisForward,
                    name: "骨盆前移",
                    tag: "前移",
                    tagTone: "severe",
                    value: "6.6cm",
                  },
                ],
              },
            ];
            return (
              <div className="space-y-2.5">
                {groups.map((g) => {
                  const sev = sevMap[g.severity];
                  return (
                    <Card key={g.region} className="p-3">
                      <div className="flex items-center gap-2">
                        <h3
                          className="text-[16px] font-semibold"
                          style={{ color: c.ink, fontFamily: display }}
                        >
                          {g.region}
                        </h3>
                        <span
                          className="text-[12px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1"
                          style={{ background: sev.bg, color: sev.fg }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: sev.dot }}
                          />
                          {sev.label}
                        </span>
                      </div>
                      <p className="mt-1 text-[13px] leading-snug" style={{ color: c.ink2 }}>
                        {g.summary}
                      </p>

                      <div className="mt-2.5 grid grid-cols-2 gap-2">
                        {g.items.map((it) => {
                          const tone = sevMap[it.tagTone];
                          return (
                            <div
                              key={it.name}
                              className="rounded-xl overflow-hidden flex flex-col"
                              style={{
                                background: c.page,
                                border: `1px solid ${c.hairSoft}`,
                              }}
                            >
                              <div
                                className="w-full flex items-center justify-center"
                                style={{
                                  background: "#FFFFFF",
                                  borderBottom: `1px solid ${c.hairSoft}`,
                                  height: 110,
                                }}
                              >
                                <img
                                  src={it.img}
                                  alt={it.name}
                                  className="max-h-[100px] max-w-[92%] object-contain"
                                  style={{ mixBlendMode: "multiply" }}
                                />
                              </div>
                              <div className="px-2.5 py-2">
                                <div
                                  className="text-[14px] font-semibold leading-tight truncate"
                                  style={{ color: c.ink, fontFamily: display }}
                                >
                                  {it.name}
                                </div>
                                <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                                  <span
                                    className="text-[15px] font-semibold tabular-nums leading-none"
                                    style={{ color: c.ink, fontFamily: display }}
                                  >
                                    {it.value}
                                  </span>
                                  <span
                                    className="text-[11.5px] px-1.5 py-0.5 rounded-md font-medium leading-none"
                                    style={{ background: tone.bg, color: tone.fg }}
                                  >
                                    {it.tag}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </Card>
                  );
                })}
              </div>
            );
          })()}
        </section>

        {/* 枕头推荐 */}
        <section className="mt-6">
          <SectionHeader
            icon={<BedDouble size={16} strokeWidth={2.2} />}
            kicker="STEP 04 · RECOMMEND"
            title="枕头推荐"
            tone="blue"
          />

          {/* Hero recommendation banner */}
          <Card
            className="p-5 mb-4 relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${c.blueDeep} 0%, ${c.blue} 60%, ${c.teal} 130%)`,
              color: "#fff",
            }}
          >
            <div
              className="absolute -right-8 -top-8 w-28 h-28 rounded-full"
              style={{ background: "rgba(255,255,255,0.10)" }}
            />
            <div
              className="absolute -right-4 bottom-2 w-20 h-20 rounded-full"
              style={{ background: "rgba(255,255,255,0.07)" }}
            />
            <div className="relative">
              <div className="text-[12px] opacity-80 mb-1.5 tracking-[0.2em] font-medium flex items-center gap-1.5">
                <ShieldCheck size={11} strokeWidth={2.4} />
                RECOMMENDED HEIGHT
              </div>
              <div className="text-[14px] opacity-90">基于您的肩宽，建议枕高</div>
              <div className="flex items-baseline gap-2 mt-1.5">
                <span
                  className="text-[34px] font-bold leading-none tabular-nums"
                  style={{ fontFamily: display, letterSpacing: "-0.03em" }}
                >
                  9
                </span>
                <span className="text-[18px] opacity-70">/</span>
                <span
                  className="text-[34px] font-bold leading-none tabular-nums"
                  style={{ fontFamily: display, letterSpacing: "-0.03em" }}
                >
                  10
                </span>
                <span className="text-[15px] opacity-90 ml-1">cm</span>
              </div>
              <div
                className="mt-3 inline-flex items-center gap-1 text-[12px] px-2.5 py-1 rounded-full"
                style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(4px)" }}
              >
                <Sparkles size={10} />
                侧卧 9cm · 仰卧 10cm
              </div>
            </div>
          </Card>

          <Card className="overflow-hidden mb-4">
            <img src={pillowIllu} alt="睡姿与枕高推荐" className="w-full h-auto block" />
          </Card>

          {/* Product card */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <span
                className="text-[12px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1"
                style={{ background: c.tealSoft, color: c.tealDeep }}
              >
                <Sparkles size={10} strokeWidth={2.4} />
                推荐枕头
              </span>
              <span
                className="text-[12px] ml-auto tabular-nums font-medium"
                style={{ color: c.muted }}
              >
                2 <span style={{ color: c.muted, opacity: 0.5 }}>/ 5</span>
              </span>
            </div>

            <div
              className="rounded-2xl overflow-hidden mb-3"
              style={{
                background: `linear-gradient(180deg, ${c.blueSoft} 0%, ${c.card} 100%)`,
                border: `1px solid ${c.hairSoft}`,
              }}
            >
              <img src={pillowZones} alt="枕头分区" className="w-full h-auto block" />
            </div>

            {/* Zone detail */}
            <div className="px-0.5 mb-3">
              <div className="flex items-center gap-2.5 mb-3">
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[14px] font-bold text-white flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${c.blue}, ${c.blueDeep})`,
                  }}
                >
                  2
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className="text-[16px] font-semibold"
                    style={{ color: c.ink, fontFamily: display }}
                  >
                    仰卧边缘区
                  </span>
                  <span
                    className="text-[13px] px-2 py-0.5 rounded-full font-medium tabular-nums"
                    style={{ background: c.blueSoft, color: c.blueDeep }}
                  >
                    2.2cm
                  </span>
                </div>
              </div>

              <div style={{ borderTop: `1px solid ${c.hairSoft}` }} className="pt-3">
                <ul className="space-y-1.5 mb-3">
                  {[
                    "枕头上缘过渡区，支撑后枕部",
                    "高度低于颈部区，让头部自然后仰",
                    "有助于打开气道，改善打鼾",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-2">
                      <span
                        className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                        style={{ background: c.blueDeep }}
                      />
                      <span className="text-[14px] leading-snug" style={{ color: c.ink }}>
                        {t}
                      </span>
                    </li>
                  ))}
                </ul>
                <div
                  className="text-[13px] px-3 py-2 rounded-lg mb-3"
                  style={{ background: c.page, color: c.muted }}
                >
                  过渡支撑，防止枕头滑移
                </div>
              </div>
            </div>

            {/* Pagination */}
            <div
              className="flex items-center justify-center gap-1.5 pt-3"
              style={{ borderTop: `1px solid ${c.hairSoft}` }}
            >
              <button
                className="w-7 h-7 rounded-full flex items-center justify-center"
                style={{ color: c.muted, background: c.page }}
              >
                <ChevronLeft size={13} />
              </button>
              {[1, 2, 3, 4, 5].map((p) => (
                <button
                  key={p}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[13px] font-medium transition-all tabular-nums"
                  style={
                    p === 2
                      ? {
                          background: `linear-gradient(135deg, ${c.blue}, ${c.blueDeep})`,
                          color: "#fff",
                          boxShadow: `0 4px 10px -4px ${c.blue}99`,
                        }
                      : { color: c.muted, background: "transparent" }
                  }
                >
                  {p}
                </button>
              ))}
              <button
                className="w-7 h-7 rounded-full flex items-center justify-center"
                style={{ color: c.muted, background: c.page }}
              >
                <ChevronRight size={13} />
              </button>
            </div>
          </Card>

          {/* Disclaimer */}
          <div className="mt-6 px-3 text-center">
            <p className="text-[12px] leading-relaxed" style={{ color: c.muted }}>
              本报告仅供参考，具体方案请遵医嘱。
              <br />
              本品不能替代药品及医疗器械，不能用于疾病的诊断、治疗。
            </p>
          </div>
        </section>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { scrollbar-width: none; }
      `}</style>
    </div>
  );
}
