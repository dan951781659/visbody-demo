import { useEffect, useRef, useState } from "react";
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
import { PostureReport } from "./PostureReport";
import { SpineReport } from "./SpineReport";
import { BodyMeasureReport } from "./BodyMeasureReport";
import { BodyCompositionReport } from "./BodyCompositionReport";
import { MattressReport } from "./MattressReport";
import { OverviewReport } from "./OverviewReport";
import { ReportTabs } from "./ReportTabs";
import { BrandHero } from "./BrandHero";

/* ---------- helpers ---------- */
function Section({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-5">
      <div className="flex items-center gap-1.5 mb-3 px-1">
        <span className="text-brand text-sm">{icon}</span>
        <h2 className="text-[17px] font-semibold text-foreground">{title}</h2>
      </div>
      {children}
    </section>
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
    <div className="bg-card border border-border rounded-lg p-3">
      <div className="flex items-baseline gap-1.5">
        <span className="text-[14px] font-semibold text-foreground">{code}</span>
        <span className="text-[14px] text-foreground">{label}</span>
        <span className="ml-auto text-brand text-base font-semibold">{value} cm</span>
      </div>
      {desc && <div className="text-[13px] text-muted-foreground mt-2 leading-relaxed">{desc}</div>}
    </div>
  );
}

const sevMap = {
  severe: { label: "重度异常", cls: "bg-red-100 text-red-700" },
  mild: { label: "轻度异常", cls: "bg-orange-100 text-orange-700" },
  normal: { label: "结构正常", cls: "bg-teal-100 text-teal-700" },
} as const;

const spineGroups: {
  region: string;
  severity: keyof typeof sevMap;
  summary: string;
  items: { img: string; name: string; tag: string; tagTone: keyof typeof sevMap; value: string }[];
}[] = [
  {
    region: "颈椎",
    severity: "severe",
    summary: "颈椎前曲不足，侧偏明显，建议加强颈部承托支撑",
    items: [
      { img: spineNeckTilt, name: "颈椎侧偏", tag: "偏右（可能）", tagTone: "mild", value: "0.3°" },
      { img: spineNeckForward, name: "颈椎前伸", tag: "前伸", tagTone: "severe", value: "5.7cm" },
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
      { img: spinePelvisForward, name: "骨盆前移", tag: "前移", tagTone: "severe", value: "6.6cm" },
    ],
  },
];

/* ---------- page ---------- */
export function BaseReport() {
  const [tab, setTab] = useState<string>("床垫智配");
  const tabs = ["综合报告", "体态评估", "脊柱评估", "体围测量", "身体成分", "枕型智配", "床垫智配"];
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const handleTabClick = (t: string) => {
    setTab(t);
    const el = tabRefs.current[t];
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  useEffect(() => {
    tabRefs.current["床垫智配"]?.scrollIntoView({
      behavior: "auto",
      inline: "center",
      block: "nearest",
    });
  }, []);

  return (
    <div className="w-full max-w-[430px] bg-background min-h-screen pb-10 mx-auto">
      <BrandHero />

      <div className="px-4">
        {/* Profile - 医疗玻璃质感 */}
        <div className="relative overflow-hidden bg-white rounded-[24px] p-5 mt-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-blue-50">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-red-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

          <div className="relative mb-1">
            <h1 className="text-[20px] font-bold text-slate-800 tracking-tight">王** 先生</h1>
            <p className="text-[13px] text-slate-400 mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e31937]"></span>
              检测时间 · 2025.01.21 09:32
            </p>
          </div>

          <div className="h-px w-full bg-slate-100 my-4"></div>

          <div className="relative grid grid-cols-4 gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-[12px] text-slate-400 font-medium">性别</span>
              <span className="text-[16px] font-bold text-slate-700">男</span>
            </div>
            <div className="flex flex-col gap-1 border-l border-slate-100 pl-3">
              <span className="text-[12px] text-slate-400 font-medium">年龄</span>
              <span className="text-[16px] font-bold text-slate-700">28</span>
            </div>
            <div className="flex flex-col gap-1 border-l border-slate-100 pl-3">
              <span className="text-[12px] text-slate-400 font-medium">身高</span>
              <span className="text-[16px] font-bold text-slate-700">
                174<span className="text-[12px] font-medium text-slate-400 ml-0.5">cm</span>
              </span>
            </div>
            <div className="flex flex-col gap-1 border-l border-slate-100 pl-3">
              <span className="text-[12px] text-slate-400 font-medium">BMI</span>
              <span className="text-[16px] font-bold text-[#c9152f]">18.8</span>
            </div>
          </div>
        </div>

        {/* Tab Switch Bar - 参考报告蓝色选中态 */}
        <div className="mt-4 -mx-4 px-4">
          <div className="flex overflow-x-auto no-scrollbar items-center gap-0.5 py-1 scroll-smooth">
            {tabs.map((t) => {
              const active = t === tab;
              return (
                <button
                  key={t}
                  ref={(el) => {
                    tabRefs.current[t] = el;
                  }}
                  onClick={() => handleTabClick(t)}
                  className={`flex-none py-2 rounded-full text-[14px] whitespace-nowrap transition-all ${
                    active
                      ? "px-3 font-semibold bg-white text-[#2f80ed] shadow-[0_4px_14px_rgba(70,132,222,0.12)] ring-1 ring-white"
                      : "px-2.5 font-semibold text-[#64758b] hover:text-[#40546f]"
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {tab === "综合报告" && <OverviewReport onNavigate={handleTabClick} />}
      {tab === "体态评估" && <PostureReport />}
      {tab === "脊柱评估" && <SpineReport />}
      {tab === "体围测量" && <BodyMeasureReport />}
      {tab === "身体成分" && <BodyCompositionReport />}
      {tab === "床垫智配" && <MattressReport />}
      {tab === "枕型智配" && <PillowContent />}
    </div>
  );
}

function PillowContent() {
  return (
    <div className="px-4">
      <Section icon="◆" title="颈部测量数据">
        <div className="mb-2 text-[14px] text-foreground">正面</div>
        <div className="bg-muted rounded-lg flex items-center justify-center mb-3 overflow-hidden p-2">
          <img src={neckFront} alt="正面颈部测量" className="max-h-64 w-auto object-contain" />
        </div>
        <div className="mb-2 text-[14px] text-foreground">侧面</div>
        <div className="bg-muted rounded-lg flex items-center justify-center mb-3 overflow-hidden p-2">
          <img src={neckSide} alt="侧面颈部测量" className="max-h-64 w-auto object-contain" />
        </div>
        <div className="text-[13px] text-muted-foreground mb-3">✨ 基于 3D 人体工学扫描</div>
        <div className="grid grid-cols-2 gap-2">
          <MetricCard code="L1" label="耳宽" value="15.3" desc="两侧耳廓最外侧水平距离" />
          <MetricCard code="L2" label="颈宽" value="12.8" desc="颈部最宽处的水平横向距离" />
          <MetricCard code="L3" label="肩宽" value="36.6" desc="左右肩峰点间水平直线距离" />
          <MetricCard code="L4" label="头背距" value="6.2" desc="背部后缘至后脑最突出点" />
          <MetricCard code="L5" label="颈深" value="8.9" desc="背部后缘至第七颈椎点距离" />
          <MetricCard code="L6" label="背深" value="11.6" desc="背部后缘至肩峰点水平距离" />
          <MetricCard code="H1" label="头颈高" value="18.5" desc="头顶至第七颈椎点垂直高度" />
          <MetricCard code="H2" label="头背高" value="30.1" desc="头顶至肩峰点垂直高度" />
        </div>
      </Section>

      <Section icon="◆" title="颈脊健康分析">
        <div className="space-y-3">
          {spineGroups.map((g) => {
            const sev = sevMap[g.severity];
            return (
              <div key={g.region} className="bg-card border border-border rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-[16px] font-semibold text-foreground">{g.region}</h3>
                  <span className={`text-[12px] px-2 py-0.5 rounded ${sev.cls}`}>{sev.label}</span>
                </div>
                <p className="mt-1 text-[13px] text-muted-foreground leading-snug">{g.summary}</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {g.items.map((it) => {
                    const tone = sevMap[it.tagTone];
                    return (
                      <div
                        key={it.name}
                        className="rounded-lg border border-border overflow-hidden flex flex-col bg-background"
                      >
                        <div className="bg-white flex items-center justify-center h-24 border-b border-border">
                          <img
                            src={it.img}
                            alt={it.name}
                            className="max-h-[88px] max-w-[92%] object-contain"
                          />
                        </div>
                        <div className="px-2 py-2">
                          <div className="text-[14px] font-semibold text-foreground truncate">
                            {it.name}
                          </div>
                          <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                            <span className="text-[15px] font-semibold text-foreground tabular-nums leading-none">
                              {it.value}
                            </span>
                            <span
                              className={`text-[11.5px] px-1.5 py-0.5 rounded font-medium leading-none ${tone.cls}`}
                            >
                              {it.tag}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <Section icon="◆" title="枕头推荐">
        <div
          className="rounded-lg p-4 mb-3 text-white"
          style={{ background: "linear-gradient(135deg, #181313, #6f1726 62%, #d71938 130%)" }}
        >
          <div className="text-[12px] opacity-80 tracking-widest mb-1">RECOMMENDED HEIGHT</div>
          <div className="text-[14px] opacity-90">基于您的肩宽，建议枕高</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-[34px] font-bold leading-none tabular-nums">9</span>
            <span className="text-[18px] opacity-70">/</span>
            <span className="text-[34px] font-bold leading-none tabular-nums">10</span>
            <span className="text-[15px] opacity-90 ml-1">cm</span>
          </div>
          <div className="mt-3 inline-block text-[12px] px-2.5 py-1 rounded-full bg-white/20">
            侧卧 9cm · 仰卧 10cm
          </div>
        </div>
        <div className="rounded-lg overflow-hidden mb-4 bg-card border border-border">
          <img src={pillowIllu} alt="睡姿与枕高推荐" className="w-full h-auto block" />
        </div>
        <div className="bg-card border border-border rounded-lg p-3">
          <div className="flex items-center mb-2">
            <span className="text-[14px] text-foreground flex items-center gap-1">
              <span className="text-brand">▌</span>推荐枕头
            </span>
            <span className="ml-auto text-[13px] text-muted-foreground tabular-nums">2 / 5</span>
          </div>
          <div className="rounded-lg overflow-hidden mb-3 bg-white border border-border">
            <img src={pillowZones} alt="枕头分区" className="w-full h-auto block" />
          </div>
          <div className="flex items-center gap-2 text-[14px] text-foreground mb-2">
            <span className="w-5 h-5 rounded-full bg-brand text-white text-[12px] flex items-center justify-center">
              2
            </span>
            仰卧边缘区
            <span className="text-[13px] px-2 py-0.5 rounded-full bg-brand-soft text-brand">
              2.2cm
            </span>
          </div>
          <ul className="text-[13px] text-muted-foreground space-y-1 mb-3 pl-2">
            <li>· 枕头上缘过渡区，支撑后枕部</li>
            <li>· 高度低于颈部区，让头部自然后仰</li>
            <li>· 有助于打开气道，改善打鼾</li>
          </ul>
          <div className="text-[13px] bg-muted text-muted-foreground rounded px-3 py-2 mb-3">
            过渡支撑，防止枕头滑移
          </div>
          <div className="flex items-center justify-center gap-1.5 text-[13px] text-muted-foreground">
            <span>‹</span>
            {[1, 2, 3, 4, 5].map((p) => (
              <span
                key={p}
                className={`w-5 h-5 rounded-full flex items-center justify-center ${p === 2 ? "bg-brand text-white" : "border border-border"}`}
              >
                {p}
              </span>
            ))}
            <span>›</span>
          </div>
        </div>
      </Section>

      <p className="text-[12px] text-muted-foreground text-center mt-4 leading-relaxed">
        本报告仅供参考，具体方案请遵医嘱。本品不能替代药品及医疗器械，不能用于疾病的诊断、治疗。
      </p>
    </div>
  );
}
