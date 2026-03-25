import React from "https://esm.sh/react@18.3.1";
import htm from "https://esm.sh/htm@3.1.1";

const html = htm.bind(React.createElement);

const riskMap = {
  low: { label: "低风险", className: "text-fxGreen bg-fxGreenSoft border-fxGreen/20" },
  medium: { label: "中风险", className: "text-fxOrange bg-fxOrangeSoft border-fxOrange/20" },
  high: { label: "高风险", className: "text-fxRed bg-fxRed/10 border-fxRed/20" },
};

function Metric({ label, value, variant = "primary" }) {
  const base =
    "rounded-[10px] border px-3 py-2 bg-white/[0.03] transition-colors";
  const variants = {
    primary: "border-fxPrimary/15 bg-fxPrimary/5",
    purple: "border-fxPurple/15 bg-fxPurple/5",
    warm: "border-fxOrange/15 bg-fxOrange/5",
    green: "border-fxGreen/15 bg-fxGreen/5",
  };

  return html`
    <div className=${`${base} ${variants[variant] || variants.primary}`}>
      <div className="text-[13px] text-fxSub">${label}</div>
      <div className="mt-1 text-[15px] font-bold fx-gradText">${value}</div>
    </div>
  `;
}

export function HeroSection({ user, report, keyMetrics, onViewFullReport }) {
  const risk = riskMap[report.riskLevel] || riskMap.medium;

  return html`
    <section
      className="relative overflow-hidden rounded-card border border-fxPrimary/20 bg-[linear-gradient(135deg,rgba(0,229,255,0.12)_0%,rgba(120,80,255,0.06)_50%,rgba(20,30,80,0.90)_100%)] p-4 shadow-[0_0_30px_rgba(0,229,255,0.06)] backdrop-blur-[12px]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-fxPrimary via-fxPurple to-fxPink text-[13px] text-slate-950 shadow-[0_0_16px_rgba(167,139,250,0.40),0_0_6px_rgba(0,229,255,0.30)]">
              ✦
            </span>
            <h2 className="truncate text-[24px] font-extrabold tracking-wide fx-gradText">最新评估结果</h2>
          </div>
          <p className="mt-1 text-[14px] text-fxSub">
            ${user.name} · 最近评估 ${user.latestAssessmentTime}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className=${`rounded-full border px-3 py-1 text-xs ${risk.className}`}>${risk.label}</span>
          <div className="text-right">
            <div className="text-[11px] text-fxSub">综合评分</div>
            <div className="text-[28px] font-extrabold text-white">${report.score}</div>
          </div>
        </div>
      </div>

      <p className="mt-2 text-[14px] leading-relaxed text-fxText/90">${report.summary}</p>

      <div className="mt-3 grid grid-cols-2 gap-2">
        ${(keyMetrics || []).slice(0, 4).map(
          (m, idx) =>
            html`<${Metric} key=${m.label} label=${m.label} value=${m.value} variant=${idx === 1 ? "purple" : idx === 2 ? "warm" : "primary"} />`,
        )}
      </div>

      <button onClick=${onViewFullReport} className="mt-3 w-full fx-cta px-4 py-3 text-sm font-semibold">
        查看完整报告
      </button>
    </section>
  `;
}

