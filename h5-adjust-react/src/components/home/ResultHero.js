<<<<<<< HEAD
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

=======
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

function ScoreBadge({ label, score }) {
  return html`
    <div className="fx-statPlate min-w-[60px] px-2 py-2 text-center">
      <div className="text-[10px] text-white/60">${label}</div>
      <div className="mt-1 text-[22px] leading-none font-extrabold text-white">${score}</div>
    </div>
  `;
}

function ResultTag({ item }) {
  const toneClass = resultToneMap[item.tone] || resultToneMap.neutral;

  return html`
    <div className="rounded-[18px] border border-white/10 bg-black/20 p-3 backdrop-blur-[12px]">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] text-fxSub">${item.label}</span>
        <span className=${`rounded-full border px-2 py-0.5 text-[10px] ${toneClass}`}>${item.note}</span>
      </div>
      <div className="mt-2 text-[17px] font-extrabold leading-none text-white">${item.value}</div>
    </div>
  `;
}

export function ResultHero({ user, report, model3d, onViewModel, onViewFullReport }) {
  const risk = riskMap[report.riskLevel] || riskMap.medium;
  const hasModel = Boolean(model3d?.hasModel && model3d?.coverImage);
  const coreResults = (report.coreResults || []).slice(0, 3);
  const quickMetrics = (report.quickMetrics || []).slice(0, 3);
  const sectionScores = (report.sectionScores || []).slice(0, 5);
  const scoreBadges = (sectionScores.length
    ? sectionScores
    : [
        { label: "综合", score: report.score ?? "--" },
        { label: "体态", score: report.postureScore ?? "--" },
        { label: "成分", score: report.bodyCompositionScore ?? "--" },
      ]
  ).filter((item) => item.score !== undefined && item.score !== null);
  const primaryScore = scoreBadges[0] || { label: "综合", score: report.score ?? "--" };
  const secondaryScores = scoreBadges.slice(1);

  return html`
    <section className="relative overflow-hidden rounded-[28px] border border-fxPrimary/20 bg-[linear-gradient(180deg,#1a244b_0%,#131d3d_45%,#0e1733_100%)] shadow-[0_18px_48px_rgba(0,0,0,0.35)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_12%,rgba(0,229,255,0.16),transparent_32%),radial-gradient(circle_at_88%_0%,rgba(167,139,250,0.16),transparent_28%)]"></div>

      <div className="relative p-3.5 pb-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="mt-1 text-[15px] font-bold text-white">${user.name}</div>
            <div className="mt-1 text-[12px] text-fxSub">身高 ${user.height || "--"} · 年龄 ${user.age || "--"} 岁 · ${user.latestAssessmentTime}</div>
          </div>
          <span className=${`shrink-0 rounded-full border px-3 py-1 text-xs ${risk.className}`}>${risk.label}</span>
        </div>

        <button className="group mt-2.5 block w-full text-left" onClick=${() => onViewModel(model3d?.modelUrl || "fallback")}>
          <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.03]">
            ${hasModel
              ? html`
                  <img
                    src=${model3d.coverImage}
                    alt="3D 模型"
                    className="fx-modelRotate h-[38vh] min-h-[260px] w-full object-contain object-center transition-transform duration-500 group-hover:scale-[1.01]"
                  />
                `
              : html`
                  <div className="h-[38vh] min-h-[260px] w-full bg-[radial-gradient(circle_at_30%_20%,rgba(0,229,255,0.20),transparent_45%),radial-gradient(circle_at_75%_10%,rgba(167,139,250,0.20),transparent_40%),linear-gradient(180deg,#1e2754,#141f43)]"></div>
                `}

            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,10,22,0.10)_0%,rgba(6,10,22,0.16)_28%,rgba(6,10,22,0.88)_100%)]"></div>

            <div className="absolute right-3 top-3 rounded-[16px] border border-white/10 bg-black/30 px-3 py-2 text-right backdrop-blur-[10px]">
              <div className="text-[10px] text-white/65">${primaryScore.label}</div>
              <div className="mt-0.5 text-[34px] leading-none font-extrabold text-white">${primaryScore.score}</div>
            </div>

            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-end gap-2">
              <div className="flex max-w-full flex-wrap justify-end gap-2">
                ${secondaryScores.slice(0, 2).map((item) => html`<${ScoreBadge} key=${item.label} label=${item.label} score=${item.score} />`)}
              </div>
            </div>
          </div>
        </button>

        <div className="mt-3 rounded-[22px] border border-white/10 bg-white/[0.04] p-3 backdrop-blur-[12px]">
          <div className="text-[13px] font-semibold text-fxPrimary">一句话总体结论</div>
          <h2 className="mt-1 text-[19px] font-bold leading-tight text-white">${report.headline || report.title}</h2>
          <p className="mt-2 text-[13px] leading-relaxed text-fxText/92">${report.conclusionShort || report.summary}</p>
          ${quickMetrics.length > 0 &&
          html`
            <div className="fx-dataStrip mt-2">
              ${quickMetrics.map(
                (metric) => html`
                  <div key=${metric.label} className="fx-cardInner rounded-[14px] px-2 py-2">
                    <div className="text-[11px] text-fxSub">${metric.icon} ${metric.label}</div>
                    <div className="mt-1 text-[16px] font-extrabold text-white">${metric.value}</div>
                  </div>
                `,
              )}
            </div>
          `}
          <div className="mt-2 rounded-[14px] border border-fxPrimary/15 bg-fxPrimary/5 px-3 py-2 text-[12px] leading-relaxed text-fxText/90">
            <span className="mr-2 text-fxPrimary">建议</span>${report.priorityAdvice || report.oneLineConclusion}
          </div>
        </div>

        <div className="mt-2 grid grid-cols-3 gap-2">
          ${coreResults.map((item) => html`<${ResultTag} key=${item.id || item.label} item=${item} />`)}
        </div>

        ${secondaryScores.length > 2 &&
        html`
          <div className="hide-scrollbar mt-2 flex gap-2 overflow-x-auto pb-1">
            ${secondaryScores.slice(2).map(
              (item) =>
                html`<div key=${item.label} className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1 text-[12px] text-fxText">
                  ${item.label} <span className="ml-1 font-bold text-white">${item.score}</span>
                </div>`,
            )}
          </div>
        `}

        <div className="mt-3 flex gap-2">
          <button onClick=${onViewFullReport} className="flex-1 fx-cta px-4 py-3 text-sm font-semibold">查看完整报告</button>
          <button
            onClick=${() => onViewModel(model3d?.modelUrl || "fallback")}
            className="rounded-[16px] border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-medium text-white"
          >
            模型详情
          </button>
        </div>
      </div>
    </section>
  `;
}
>>>>>>> f1ef4b3 (Update HTML structure and styles for PRO权益与积分 page; remove unused CSS and optimize layout. Update .DS_Store files.)
