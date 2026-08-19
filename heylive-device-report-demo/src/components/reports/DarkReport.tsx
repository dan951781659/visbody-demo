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

/* ============ Design.md 深色版 tokens ============ */
const tokens = {
  bgGrad: "radial-gradient(ellipse at top, #0F2350 0%, #07142F 55%, #030B1F 100%)",
  card: "rgba(255,255,255,0.04)",
  cardElevated: "rgba(255,255,255,0.06)",
  border: "rgba(120,160,255,0.16)",
  borderSoft: "rgba(120,160,255,0.10)",
  textPrimary: "#FFFFFF",
  textSecondary: "#8AA0C7",
  textMuted: "#5E7396",
  accent: "#3DA9FF",
  accentGrad: "linear-gradient(135deg,#2D7CFF,#5B5BFF)",
  glow: "0 0 20px rgba(45,124,255,0.20)",
};

const sevTone = {
  severe: { bg: "rgba(220,38,38,0.18)", fg: "#FCA5A5" },
  mild: { bg: "rgba(245,158,75,0.18)", fg: "#FDBA74" },
  normal: { bg: "rgba(15,181,166,0.18)", fg: "#5EEAD4" },
} as const;

function DarkSection({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6">
      <div className="flex items-center gap-2 mb-3 px-1">
        <span
          className="inline-flex items-center justify-center w-6 h-6 rounded-md text-[14px]"
          style={{ background: tokens.accentGrad, color: "#fff", boxShadow: tokens.glow }}
        >
          {icon}
        </span>
        <h2
          className="text-[17px] font-semibold tracking-wide"
          style={{ color: tokens.textPrimary }}
        >
          {title}
        </h2>
        <div
          className="flex-1 h-px ml-2"
          style={{ background: `linear-gradient(90deg, ${tokens.border}, transparent)` }}
        />
      </div>
      {children}
    </section>
  );
}

function DarkMetric({
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
    <div
      className="rounded-[14px] p-3 backdrop-blur-sm relative overflow-hidden"
      style={{ background: tokens.card, border: `1px solid ${tokens.border}` }}
    >
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(91,91,255,0.5), transparent)",
        }}
      />
      <div className="flex items-baseline gap-1.5">
        <span
          className="text-[13px] font-bold px-1.5 py-0.5 rounded"
          style={{ background: tokens.accentGrad, color: "#fff" }}
        >
          {code}
        </span>
        <span className="text-[14px]" style={{ color: tokens.textSecondary }}>
          {label}
        </span>
        <span
          className="ml-auto text-lg font-semibold tabular-nums"
          style={{ color: tokens.textPrimary }}
        >
          {value}
          <span className="text-[13px] ml-0.5" style={{ color: tokens.textMuted }}>
            cm
          </span>
        </span>
      </div>
      {desc && (
        <div className="text-[13px] mt-2 leading-relaxed" style={{ color: tokens.textMuted }}>
          {desc}
        </div>
      )}
    </div>
  );
}

const spineGroups: {
  region: string;
  severity: keyof typeof sevTone;
  severityLabel: string;
  summary: string;
  items: { img: string; name: string; tag: string; tagTone: keyof typeof sevTone; value: string }[];
}[] = [
  {
    region: "颈椎",
    severity: "severe",
    severityLabel: "重度异常",
    summary: "颈椎前曲不足，侧偏明显，建议加强颈部承托支撑",
    items: [
      { img: spineNeckTilt, name: "颈椎侧偏", tag: "偏右（可能）", tagTone: "mild", value: "0.3°" },
      { img: spineNeckForward, name: "颈椎前伸", tag: "前伸", tagTone: "severe", value: "5.7cm" },
    ],
  },
  {
    region: "胸椎",
    severity: "mild",
    severityLabel: "轻度异常",
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
    severityLabel: "轻度异常",
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

export function DarkReport() {
  return (
    <div
      className="w-full max-w-[430px] mx-auto min-h-screen pb-10"
      style={{ background: tokens.bgGrad, color: tokens.textPrimary }}
    >
      <BrandHero />

      <div className="px-4">
        {/* Profile */}
        <div
          className="rounded-[14px] mt-4 px-4 py-3 backdrop-blur"
          style={{ background: tokens.card, border: `1px solid ${tokens.border}` }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[16px] font-semibold" style={{ color: tokens.textPrimary }}>
              王** 先生
            </span>
            <span
              className="text-[12px] px-1.5 py-0.5 rounded"
              style={{ background: "rgba(15,181,166,0.18)", color: "#5EEAD4" }}
            >
              已认证
            </span>
          </div>
          <div className="text-[13px] mb-3" style={{ color: tokens.textMuted }}>
            颈椎健康档案 · 2025.01.21
          </div>
          <div
            className="grid grid-cols-3 gap-2 pt-2"
            style={{ borderTop: `1px solid ${tokens.borderSoft}` }}
          >
            {[
              ["性别", "男"],
              ["年龄", "28"],
              ["编号", "#0121"],
            ].map(([k, v]) => (
              <div key={k} className="text-center">
                <div className="text-[12px]" style={{ color: tokens.textMuted }}>
                  {k}
                </div>
                <div
                  className="text-[15px] font-semibold mt-0.5"
                  style={{ color: tokens.textPrimary }}
                >
                  {v}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div
          className="mt-4 flex flex-wrap gap-2 pb-3"
          style={{ borderBottom: `1px solid ${tokens.borderSoft}` }}
        >
          {["综合报告", "体态评估", "脊柱评估", "体围测量", "身体成分", "枕型智配", "床垫智配"].map(
            (t) => {
              const active = t === "枕型智配";
              return (
                <button
                  key={t}
                  className="px-4 py-1.5 text-[14px] rounded-full whitespace-nowrap transition-all"
                  style={
                    active
                      ? { background: tokens.accentGrad, color: "#fff", boxShadow: tokens.glow }
                      : {
                          background: "rgba(255,255,255,0.04)",
                          color: tokens.textSecondary,
                          border: `1px solid ${tokens.borderSoft}`,
                        }
                  }
                >
                  {t}
                </button>
              );
            },
          )}
        </div>

        {/* 颈部测量数据 */}
        <DarkSection icon="◆" title="颈部测量数据">
          <div className="mb-2 text-[14px]" style={{ color: tokens.textSecondary }}>
            正面
          </div>
          <div
            className="rounded-[14px] flex items-center justify-center mb-3 overflow-hidden p-2"
            style={{ background: tokens.card, border: `1px solid ${tokens.border}` }}
          >
            <img
              src={neckFront}
              alt="正面"
              className="max-h-64 w-auto object-contain"
              style={{ filter: "brightness(0.95)" }}
            />
          </div>
          <div className="mb-2 text-[14px]" style={{ color: tokens.textSecondary }}>
            侧面
          </div>
          <div
            className="rounded-[14px] flex items-center justify-center mb-3 overflow-hidden p-2"
            style={{ background: tokens.card, border: `1px solid ${tokens.border}` }}
          >
            <img
              src={neckSide}
              alt="侧面"
              className="max-h-64 w-auto object-contain"
              style={{ filter: "brightness(0.95)" }}
            />
          </div>
          <div
            className="text-[13px] mb-3 flex items-center gap-1.5"
            style={{ color: tokens.textMuted }}
          >
            <span style={{ color: tokens.accent }}>✦</span> 基于 3D 人体工学扫描
          </div>
          <div className="grid grid-cols-2 gap-2">
            <DarkMetric code="L1" label="耳宽" value="15.3" desc="两侧耳廓最外侧水平距离" />
            <DarkMetric code="L2" label="颈宽" value="12.8" desc="颈部最宽处的水平横向距离" />
            <DarkMetric code="L3" label="肩宽" value="36.6" desc="左右肩峰点间水平直线距离" />
            <DarkMetric code="L4" label="头背距" value="6.2" desc="背部后缘至后脑最突出点" />
            <DarkMetric code="L5" label="颈深" value="8.9" desc="背部后缘至第七颈椎点距离" />
            <DarkMetric code="L6" label="背深" value="11.6" desc="背部后缘至肩峰点水平距离" />
            <DarkMetric code="H1" label="头颈高" value="18.5" desc="头顶至第七颈椎点垂直高度" />
            <DarkMetric code="H2" label="头背高" value="30.1" desc="头顶至肩峰点垂直高度" />
          </div>
        </DarkSection>

        {/* 颈脊健康分析 */}
        <DarkSection icon="◆" title="颈脊健康分析">
          <div className="space-y-3">
            {spineGroups.map((g) => {
              const sev = sevTone[g.severity];
              return (
                <div
                  key={g.region}
                  className="rounded-[14px] p-3"
                  style={{ background: tokens.card, border: `1px solid ${tokens.border}` }}
                >
                  <div className="flex items-center gap-2">
                    <h3 className="text-[16px] font-semibold" style={{ color: tokens.textPrimary }}>
                      {g.region}
                    </h3>
                    <span
                      className="text-[12px] px-2 py-0.5 rounded"
                      style={{ background: sev.bg, color: sev.fg }}
                    >
                      {g.severityLabel}
                    </span>
                  </div>
                  <p
                    className="mt-1 text-[13px] leading-snug"
                    style={{ color: tokens.textSecondary }}
                  >
                    {g.summary}
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {g.items.map((it) => {
                      const tone = sevTone[it.tagTone];
                      return (
                        <div
                          key={it.name}
                          className="rounded-xl overflow-hidden flex flex-col"
                          style={{
                            background: "rgba(255,255,255,0.03)",
                            border: `1px solid ${tokens.borderSoft}`,
                          }}
                        >
                          <div
                            className="bg-white flex items-center justify-center h-24"
                            style={{ borderBottom: `1px solid ${tokens.borderSoft}` }}
                          >
                            <img
                              src={it.img}
                              alt={it.name}
                              className="max-h-[88px] max-w-[92%] object-contain"
                            />
                          </div>
                          <div className="px-2 py-2">
                            <div
                              className="text-[14px] font-semibold truncate"
                              style={{ color: tokens.textPrimary }}
                            >
                              {it.name}
                            </div>
                            <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                              <span
                                className="text-[15px] font-semibold tabular-nums leading-none"
                                style={{ color: tokens.textPrimary }}
                              >
                                {it.value}
                              </span>
                              <span
                                className="text-[11.5px] px-1.5 py-0.5 rounded font-medium leading-none"
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
                </div>
              );
            })}
          </div>
        </DarkSection>

        {/* 枕头推荐 */}
        <DarkSection icon="◆" title="枕头推荐">
          {/* Hero recommendation */}
          <div
            className="rounded-[14px] p-4 mb-4 relative overflow-hidden"
            style={{ background: tokens.accentGrad, color: "#fff", boxShadow: tokens.glow }}
          >
            <div className="text-[12px] opacity-80 tracking-widest mb-1">RECOMMENDED HEIGHT</div>
            <div className="text-[14px] opacity-90">基于您的肩宽，建议枕高</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-[34px] font-bold leading-none tabular-nums">9</span>
              <span className="text-[18px] opacity-70">/</span>
              <span className="text-[34px] font-bold leading-none tabular-nums">10</span>
              <span className="text-[15px] opacity-90 ml-1">cm</span>
            </div>
            <div
              className="mt-3 inline-block text-[12px] px-2.5 py-1 rounded-full"
              style={{ background: "rgba(255,255,255,0.18)" }}
            >
              侧卧 9cm · 仰卧 10cm
            </div>
          </div>

          <div
            className="rounded-[14px] overflow-hidden mb-4"
            style={{ background: tokens.card, border: `1px solid ${tokens.border}` }}
          >
            <img src={pillowIllu} alt="睡姿与枕高" className="w-full h-auto block" />
          </div>

          <div
            className="rounded-[14px] p-3 relative overflow-hidden"
            style={{ background: tokens.cardElevated, border: `1px solid ${tokens.border}` }}
          >
            <div className="flex items-center mb-2">
              <div
                className="text-[14px] flex items-center gap-2"
                style={{ color: tokens.textPrimary }}
              >
                <span className="w-1 h-4 rounded" style={{ background: tokens.accentGrad }} />
                推荐枕头
              </div>
              <span
                className="ml-auto text-[13px] tabular-nums"
                style={{ color: tokens.textMuted }}
              >
                2 / 5
              </span>
            </div>
            <div className="rounded-lg overflow-hidden mb-3 bg-white">
              <img src={pillowZones} alt="枕头分区" className="w-full h-auto block" />
            </div>
            <div
              className="flex items-center gap-2 text-[14px] mb-2"
              style={{ color: tokens.textPrimary }}
            >
              <span
                className="w-5 h-5 rounded-full text-[12px] flex items-center justify-center"
                style={{ background: tokens.accentGrad, color: "#fff", boxShadow: tokens.glow }}
              >
                2
              </span>
              仰卧边缘区
              <span
                className="text-[13px] px-2 py-0.5 rounded-full"
                style={{ background: "rgba(61,169,255,0.18)", color: tokens.accent }}
              >
                2.2cm
              </span>
            </div>
            <ul className="text-[13px] space-y-1 mb-3 pl-2" style={{ color: tokens.textSecondary }}>
              <li>· 枕头上缘过渡区，支撑后枕部</li>
              <li>· 高度低于颈部区，让头部自然后仰</li>
              <li>· 有助于打开气道，改善打鼾</li>
            </ul>
            <div
              className="text-[13px] rounded px-3 py-2 mb-3"
              style={{ background: "rgba(255,255,255,0.04)", color: tokens.textMuted }}
            >
              过渡支撑，防止枕头滑移
            </div>
            <div
              className="flex items-center justify-center gap-1.5 text-[13px]"
              style={{ color: tokens.textSecondary }}
            >
              <span>‹</span>
              {[1, 2, 3, 4, 5].map((p) => (
                <span
                  key={p}
                  className="w-5 h-5 rounded-full flex items-center justify-center"
                  style={
                    p === 2
                      ? { background: tokens.accentGrad, color: "#fff", boxShadow: tokens.glow }
                      : { border: `1px solid ${tokens.borderSoft}` }
                  }
                >
                  {p}
                </span>
              ))}
              <span>›</span>
            </div>
          </div>

          <p
            className="text-[12px] text-center mt-4 leading-relaxed"
            style={{ color: tokens.textMuted }}
          >
            本报告仅供参考，具体方案请遵医嘱。本品不能替代药品及医疗器械，不能用于疾病的诊断、治疗。
          </p>
        </DarkSection>
      </div>
    </div>
  );
}
