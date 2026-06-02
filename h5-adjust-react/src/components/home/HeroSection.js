import React from "https://esm.sh/react@18.3.1";
import htm from "https://esm.sh/htm@3.1.1";

const html = htm.bind(React.createElement);

const riskMap = {
  low: { label: "低风险", className: "text-fxGreen bg-fxGreenSoft border-fxGreen/20" },
  medium: { label: "中风险", className: "text-fxOrange bg-fxOrangeSoft border-fxOrange/20" },
  high: { label: "高风险", className: "text-fxRed bg-fxRed/10 border-fxRed/20" },
};

const resultToneMap = {
  good: "border-fxGreen/20 bg-fxGreenSoft text-fxGreen",
  warning: "border-fxOrange/20 bg-fxOrangeSoft text-fxOrange",
  danger: "border-fxRed/20 bg-fxRed/10 text-fxRed",
  neutral: "border-fxPrimary/15 bg-fxPrimary/5 text-fxPrimary",
};

function CoreResult({ item }) {
  const toneClass = resultToneMap[item.tone] || resultToneMap.neutral;

  return html`
    <div className="rounded-[16px] border border-white/10 bg-black/20 p-3 backdrop-blur-[10px]">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] text-fxSub">${item.label}</span>
        <span className=${`rounded-full border px-2 py-0.5 text-[10px] ${toneClass}`}>${item.note}</span>
      </div>
      <div className="mt-2 text-[18px] font-extrabold leading-none text-white">${item.value}</div>
    </div>
  `;
}

export function HeroSection({ user, report, model3d, keyMetrics, onViewFullReport, onViewModel }) {
  const risk = riskMap[report.riskLevel] || riskMap.medium;
  const heroResults =
    report.coreResults ||
    (keyMetrics || []).slice(0, 3).map((metric) => ({
      id: metric.label,
      label: metric.label,
      value: metric.value,
      tone: "neutral",
      note: "核心结果",
    }));

  return html`
    <section
      className="relative overflow-hidden rounded-[28px] border border-fxPrimary/20 bg-[linear-gradient(180deg,rgba(10,20,42,0.96)_0%,rgba(10,18,36,0.96)_100%)] p-4 shadow-[0_12px_42px_rgba(0,0,0,0.35)]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(0,229,255,0.14),transparent_30%),radial-gradient(circle_at_88%_0%,rgba(167,139,250,0.14),transparent_28%)]"></div>
      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-[0.24em] text-fxPrimary/85">评估结果首页</div>
            <div className="mt-2 text-[15px] font-bold text-white">${user.name}</div>
            <div className="mt-1 text-[12px] text-fxSub">最近评估 ${user.latestAssessmentTime}</div>
          </div>
          <div className="shrink-0 text-right">
            <span className=${`inline-flex rounded-full border px-3 py-1 text-xs ${risk.className}`}>${risk.label}</span>
          </div>
        </div>

        <button className="group mt-4 block w-full text-left" onClick=${() => onViewModel(model3d?.modelUrl || "model")}>
          <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.03]">
            <img
              src=${model3d?.coverImage}
              alt="三维模型封面"
              className="h-[320px] w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,10,20,0.10)_0%,rgba(4,8,16,0.14)_30%,rgba(4,8,16,0.88)_100%)]"></div>

            <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-3">
              <div className="rounded-full border border-white/15 bg-black/35 px-3 py-1 text-[11px] text-white backdrop-blur-[12px]">
                ${model3d?.focusLabel || "三维结果总览"}
              </div>
              <div className="rounded-full border border-white/15 bg-black/35 px-3 py-1 text-[11px] text-white backdrop-blur-[12px]">
                点击查看模型
              </div>
            </div>

            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-end justify-between gap-3">
                <div className="max-w-[68%]">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-white/70">第一眼先看模型</div>
                  <div className="mt-2 text-[14px] leading-relaxed text-white/86">
                    ${model3d?.caption || "先看整体姿态和关键异常，再往下展开详细模块。"}
                  </div>
                </div>
                <div className="min-w-[92px] rounded-[22px] border border-white/10 bg-black/35 px-3 py-3 text-center backdrop-blur-[14px]">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-white/60">综合评分</div>
                  <div className="mt-2 text-[34px] font-extrabold leading-none text-white">${report.score}</div>
                </div>
              </div>
            </div>
          </div>
        </button>

        <div className="mt-4 rounded-[22px] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-[10px]">
          <div className="text-[11px] uppercase tracking-[0.24em] text-fxPrimary/80">总体结论</div>
          <h2 className="mt-2 text-[24px] font-extrabold leading-tight text-white">${report.headline || report.title}</h2>
          <p className="mt-2 text-[14px] leading-relaxed text-fxText/90">${report.summary}</p>
          <div className="mt-3 rounded-[16px] border border-fxPrimary/15 bg-fxPrimary/5 px-3 py-3 text-[13px] leading-relaxed text-fxText/90">
            <span className="mr-2 text-fxPrimary">优先建议</span>${report.priorityAdvice || report.oneLineConclusion}
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          ${heroResults.slice(0, 3).map((item) => html`<${CoreResult} key=${item.id || item.label} item=${item} />`)}
        </div>

        <div className="mt-4 flex gap-2">
          <button onClick=${onViewFullReport} className="flex-1 fx-cta px-4 py-3 text-sm font-semibold">
            查看完整报告
          </button>
          <button
            onClick=${() => onViewModel(model3d?.modelUrl || "model")}
            className="rounded-[16px] border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-medium text-white"
          >
            模型详情
          </button>
        </div>
      </div>
    </section>
  `;
}
