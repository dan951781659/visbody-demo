import React from "https://esm.sh/react@18.3.1";
import htm from "https://esm.sh/htm@3.1.1";
import { InteractiveBodyModel } from "./InteractiveBodyModel.js";
import { FxIconFilled } from "../common/FxIcons.js";

const html = htm.bind(React.createElement);
const { useMemo, useState } = React;

const riskMap = {
  low: { label: "低风险", className: "text-fxGreen bg-fxGreenSoft border-fxGreen/20" },
  medium: { label: "中风险", className: "text-fxOrange bg-fxOrangeSoft border-fxOrange/20" },
  high: { label: "高风险", className: "text-fxRed bg-fxRed/10 border-fxRed/20" },
};

function toNumberScore(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
}

function normalizeScoreLabel(label) {
  const map = { 平衡: "平衡能力", 臀型: "臀型评估", 成分: "体成分" };
  return map[label] || label;
}

function getConclusionHeadline(report) {
  if (report.conclusionHeadline && String(report.conclusionHeadline).trim()) return String(report.conclusionHeadline).trim();
  if (report.headline && String(report.headline).trim()) return String(report.headline).trim();
  const risk = report.riskLevel || "medium";
  const sections = (report.sectionScores || []).filter((s) => toNumberScore(s.score) === toNumberScore(s.score));
  let weakest = null;
  for (const s of sections) {
    const n = toNumberScore(s.score);
    if (!weakest || n < toNumberScore(weakest.score)) weakest = s;
  }
  const weakLabel = weakest ? normalizeScoreLabel(weakest.label) : "";
  if (risk === "high") return weakLabel ? `${weakLabel}风险偏高，建议优先干预` : "综合风险偏高，建议优先干预";
  if (risk === "low") return weakLabel ? `整体良好，${weakLabel}可继续巩固` : "整体良好，建议保持习惯并定期复测";
  return weakLabel ? `整体可控，${weakLabel}需重点关注` : "整体可控，存在需关注项";
}

function otherReportStatusClass(status) {
  if (status === "danger") return "border-fxRed/40 text-fxRed";
  if (status === "warning") return "border-fxOrange/40 text-fxOrange";
  return "border-fxGreen/35 text-fxGreen";
}

function otherReportStatusLabel(status) {
  if (status === "danger") return "需关注";
  if (status === "warning") return "注意";
  return "正常";
}

function severityRank(status) {
  if (status === "danger") return 3;
  if (status === "warning") return 2;
  return 1;
}

function compactIssueText(text) {
  const s = String(text || "").replace(/\s+/g, " ").trim();
  if (!s) return "查看该分项关键风险与改进建议。";
  return s.length > 50 ? `${s.slice(0, 50)}...` : s;
}

function sortSubReportsForList(subReports) {
  const priorityType = { body_composition: 1, posture: 2, waist_girth: 3 };
  return [...(subReports || [])].sort((a, b) => {
    const pa = priorityType[a.reportTypeId] || 9;
    const pb = priorityType[b.reportTypeId] || 9;
    if (pa !== pb) return pa - pb;
    const sa = severityRank(a.status);
    const sb = severityRank(b.status);
    if (sa !== sb) return sb - sa;
    return String(a.name || "").localeCompare(String(b.name || ""), "zh-Hans-CN");
  });
}

export function ResultHero({
  user,
  report,
  model3d,
  subReports,
  onViewFullReport,
  onOpenSubReport,
  modelRegionSelected,
  onModelRegionActivate,
}) {
  const risk = riskMap[report.riskLevel] || riskMap.medium;
  const hasModel = Boolean(model3d?.hasModel && model3d?.coverImage);
  const useInteractive3d = Boolean(model3d?.hasModel && model3d?.useInteractiveViewer && (model3d?.modelUrl || model3d?.glbUrl));
  const reportCards = useMemo(() => sortSubReportsForList(subReports), [subReports]);
  const [expandReports, setExpandReports] = useState(false);
  const visibleCards = expandReports ? reportCards : reportCards.slice(0, 4);
  const hiddenCount = Math.max(reportCards.length - 4, 0);
  const conclusionTitle = getConclusionHeadline(report);
  const detailText = (report.conclusionShort || report.summary || "").replace(/\s+/g, " ").trim();
  const adviceText = (report.priorityAdvice || report.oneLineConclusion || "").replace(/\s+/g, " ").trim();

  return html`
    <section className="relative overflow-hidden rounded-[28px] border border-fxPrimary/20 bg-[linear-gradient(180deg,#1a244b_0%,#131d3d_45%,#0e1733_100%)] shadow-[0_18px_48px_rgba(0,0,0,0.35)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_12%,rgba(0,229,255,0.16),transparent_32%),radial-gradient(circle_at_88%_0%,rgba(167,139,250,0.16),transparent_28%)]"></div>

      <div className="relative p-3.5 pb-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="mt-0.5 text-[14px] font-semibold text-white">${user.name}</div>
            <div className="mt-1 text-[11px] leading-relaxed text-fxSub">身高 ${user.height || "--"} · 年龄 ${user.age || "--"} 岁 · ${user.latestAssessmentTime}</div>
          </div>
          <span className=${`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] ${risk.className}`}>${risk.label}</span>
        </div>

        <div
          role="button"
          tabIndex=${0}
          onClick=${() => onModelRegionActivate?.()}
          onKeyDown=${(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onModelRegionActivate?.();
            }
          }}
          className=${`group relative mt-2.5 w-full cursor-pointer rounded-[24px] outline-none transition-all focus-visible:ring-2 focus-visible:ring-fxPrimary/50 ${
            modelRegionSelected ? "ring-2 ring-fxPrimary/45 shadow-[0_0_24px_rgba(0,229,255,0.14)]" : "ring-2 ring-transparent"
          }`}
        >
          <div className="relative overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.03]">
            ${useInteractive3d
              ? html`
                  <${InteractiveBodyModel}
                    modelUrl=${model3d.modelUrl}
                    glbUrl=${model3d.glbUrl}
                    modelViewModes=${model3d.modelViewModes}
                    subReports=${subReports || []}
                    onOpenSubReport=${onOpenSubReport}
                    className="h-[38vh] min-h-[260px] w-full"
                  />
                `
              : hasModel
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
            ${!useInteractive3d &&
            html`<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(6,10,22,0.10)_0%,rgba(6,10,22,0.16)_28%,rgba(6,10,22,0.88)_100%)]"></div>`}
          </div>
        </div>

        <div className="mt-3 rounded-[20px] border border-white/10 bg-white/[0.04] p-3 backdrop-blur-[12px]">
          <div className="flex items-start justify-between gap-3">
            <h2 className="flex min-w-0 items-center gap-1.5 text-left">
              <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-fxPrimary/90 via-fxPurple/80 to-fxPink/70">
                <${FxIconFilled} name="sparkle" className="h-3 w-3" />
              </span>
              <span className="bg-gradient-to-r from-white via-fxPrimary to-fxPurple bg-clip-text text-[15px] font-bold tracking-[0.03em] text-transparent">综合结论</span>
            </h2>
            <button type="button" onClick=${onViewFullReport} className="shrink-0 text-[12px] font-semibold text-fxPrimary hover:underline">
              查看完整报告
            </button>
          </div>
          <div className="mt-2 h-[2px] w-8 rounded-sm bg-gradient-to-r from-fxPrimary to-fxPurple opacity-90"></div>
          <h3 className="mt-3 text-[15px] font-semibold leading-snug text-white">${conclusionTitle}</h3>
          ${detailText &&
          html`<p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-white/58">${detailText}</p>`}
          ${adviceText &&
          html`
            <p className="mt-2 border-t border-white/[0.07] pt-2 text-[11px] leading-relaxed text-white/78">
              <span className="font-semibold text-fxPrimary/95">建议</span>
              <span className="mx-1 text-white/35">·</span>
              ${adviceText}
            </p>
          `}
        </div>

        <div className="mt-3">
          <div className="mb-2 flex items-end justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-fxPrimary/90 via-fxPurple/80 to-fxPink/70">
                  <${FxIconFilled} name="doc" className="h-3 w-3" />
                </span>
                <span className="bg-gradient-to-r from-white via-fxPrimary to-fxPurple bg-clip-text text-[15px] font-bold tracking-[0.03em] text-transparent">分项报告</span>
              </div>
              <div className="mt-1.5 h-[2px] w-8 rounded-sm bg-gradient-to-r from-fxPrimary to-fxPurple opacity-90"></div>
            </div>
            <div className="max-w-[52%] shrink-0 pb-0.5 text-right text-[10px] leading-snug text-fxSub/90">快速打开你最关心的分项详情</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            ${reportCards.length === 0 &&
            html`<p className="col-span-2 rounded-[18px] border border-white/10 bg-white/[0.03] px-3 py-4 text-center text-[12px] text-fxSub">暂无可展示分项报告。</p>`}
            ${visibleCards.map(
              (rep) => html`
                <button
                  type="button"
                  key=${rep.id}
                  onClick=${() => onOpenSubReport?.(rep)}
                  className="rounded-[16px] border border-white/10 bg-[linear-gradient(150deg,rgba(6,14,40,0.82),rgba(7,20,56,0.62))] p-2.5 text-left backdrop-blur-[10px] transition hover:border-fxPrimary/40 hover:bg-[linear-gradient(150deg,rgba(7,18,52,0.86),rgba(9,24,62,0.7))]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0 text-[13px] font-semibold leading-snug text-white">${rep.name}</div>
                    <span className=${`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium tracking-wide ${otherReportStatusClass(rep.status)}`}>
                      ${otherReportStatusLabel(rep.status)}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-fxText/85">${compactIssueText(rep.summary || rep.detail?.conclusion)}</p>
                </button>
              `,
            )}
          </div>
          ${hiddenCount > 0 &&
          html`
            <button
              type="button"
              className="mt-2 w-full rounded-[12px] border border-white/10 bg-white/[0.04] py-2 text-[12px] font-semibold text-fxText"
              onClick=${() => setExpandReports((v) => !v)}
            >
              ${expandReports ? "收起分项报告" : `展开全部分项（+${hiddenCount}）`}
            </button>
          `}
        </div>
      </div>
    </section>
  `;
}
