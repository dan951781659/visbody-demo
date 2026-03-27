import React from "https://esm.sh/react@18.3.1";
import htm from "https://esm.sh/htm@3.1.1";

const html = htm.bind(React.createElement);

function ScoreBox({ score, label }) {
  return html`
    <div className="rounded-[12px] border border-fxPrimary/35 bg-[#182448]/62 px-3 py-2 backdrop-blur-[12px] shadow-[0_0_16px_rgba(0,229,255,0.10)]">
      <div className="text-[50px] leading-[44px] font-light tracking-wide text-white">${score}</div>
      <div className="mt-1 text-[13px] text-fxPrimary">${label}</div>
    </div>
  `;
}

function QuickMetric({ icon, label, value }) {
  return html`
    <div className="flex min-w-[110px] items-center gap-2 rounded-[10px] border border-fxPrimary/20 bg-fxPrimary/5 px-2 py-2">
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-[6px] border border-fxPrimary/35 text-[13px] text-fxPrimary">${icon}</span>
      <div className="min-w-0">
        <p className="truncate text-[11px] text-fxSub">${label}</p>
        <p className="truncate text-[16px] leading-4 font-bold text-white">${value}</p>
      </div>
    </div>
  `;
}

export function ResultHero({ user, report, model3d, onViewModel }) {
  const hasModel = Boolean(model3d?.hasModel && model3d?.coverImage);
  const coreResults = Array.isArray(report.coreResultsText)
    ? report.coreResultsText
    : (report.coreResults || []).map((item) => item.note || item.value || item.label).filter(Boolean);

  return html`
    <section className="relative overflow-hidden rounded-card border border-fxPrimary/20 bg-[linear-gradient(180deg,#1e2754_0%,#1a244b_45%,#141f43_100%)] shadow-card">
      <button
        className="relative block w-full text-left"
        onClick=${() => onViewModel(model3d?.modelUrl || "fallback")}
      >
        ${hasModel
          ? html`
              <img
                src=${model3d.coverImage}
                alt="3D 模型"
                className="h-[52vh] w-full object-contain object-center"
              />
            `
          : html`
              <div className="h-[52vh] w-full bg-[radial-gradient(circle_at_30%_20%,rgba(0,229,255,0.20),transparent_45%),radial-gradient(circle_at_75%_10%,rgba(167,139,250,0.20),transparent_40%),linear-gradient(180deg,#1e2754,#141f43)]"></div>
            `}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a1026]/90 via-[#0a1026]/18 to-transparent"></div>

        <div className="absolute right-3 top-3 flex gap-2">
          <${ScoreBox} score=${report.bodyCompositionScore ?? "--"} label="身体成分" />
          <${ScoreBox} score=${report.postureScore ?? "--"} label="体态评估" />
        </div>

        <div className="absolute bottom-4 left-3 right-3">
          <div className="rounded-[12px] border border-fxLine bg-black/22 p-3 backdrop-blur-[10px]">
            <div className="flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-fxText">
              <span>身高：${user.height || "--"}</span>
              <span>年龄：${user.age || "--"}岁</span>
              <span>时间：${user.latestAssessmentTime}</span>
            </div>
          </div>
        </div>
      </button>

      <div className="space-y-3 p-3">
        <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-1">
          ${(report.quickMetrics || []).slice(0, 3).map(
            (item) => html`<${QuickMetric} key=${item.label} icon=${item.icon} label=${item.label} value=${item.value} />`,
          )}
        </div>

        <div className="rounded-[12px] border border-fxLine bg-white/[0.03] p-3">
          <div className="text-[13px] font-semibold text-fxPrimary">结论</div>
          <p className="mt-1 text-[15px] leading-6 text-fxText">${report.conclusionShort || report.summary}</p>
        </div>

        <div className="rounded-[12px] border border-fxLine bg-white/[0.03] p-3">
          <div className="text-[13px] font-semibold text-fxPrimary">核心结果</div>
          ${coreResults.length
            ? html`
                <ul className="mt-1 space-y-1">
                  ${coreResults.slice(0, 3).map(
                    (text, idx) =>
                      html`<li key=${idx} className="text-[14px] leading-5 text-fxText/90">${idx + 1}. ${text}</li>`,
                  )}
                </ul>
              `
            : html`<p className="mt-1 text-[14px] text-fxSub">暂无核心结果，建议先查看完整报告。</p>`}
        </div>
      </div>
    </section>
  `;
}

