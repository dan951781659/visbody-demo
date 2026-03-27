import React from "https://esm.sh/react@18.3.1";
import htm from "https://esm.sh/htm@3.1.1";
import { Card } from "../common/Card.js";
const html = htm.bind(React.createElement);

const statusMap = {
  normal: { label: "稳定", color: "text-fxGreen", chip: "bg-fxGreenSoft border-fxGreen/20" },
  warning: { label: "关注", color: "text-amber-300" },
  danger: { label: "风险", color: "text-fxRed", chip: "bg-fxRed/10 border-fxRed/20" },
};

export function SubReportsSection({ reports, expandedId, onToggle, onOpenReport }) {
  return html`
    <${Card} title="分报告入口" titleIcon="🧩" subtitle="横向滑动查看分项，点击展开详情">
      <div className="hide-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
        ${reports.map((report) => {
          const status = statusMap[report.status] || statusMap.warning;
          const expanded = expandedId === report.id;
          return html`
            <article
              key=${report.id}
              className=${`min-w-[260px] rounded-card border border-fxCardBorder bg-white/[0.03] p-3 transition-all hover:border-white/20 ${
                expanded ? "shadow-[0_0_22px_rgba(0,229,255,0.10)]" : ""
              }`}
            >
              <button className="w-full text-left" onClick=${() => onToggle(report.id)}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="truncate text-sm font-semibold text-fxText">${report.name}</h4>
                    <p className="mt-1 line-clamp-2 text-xs text-fxSub">${report.summary}</p>
                  </div>
                  <span className=${`shrink-0 rounded-full border px-2 py-0.5 text-[11px] ${status.color} ${status.chip || "bg-white/5 border-white/10"}`}>
                    ${status.label}
                  </span>
                </div>
                <p className="mt-2 text-[11px] text-fxSub">${expanded ? "点击收起" : "点击展开详情"}</p>
              </button>
            </article>
          `;
        })}
      </div>

      ${expandedId &&
      (() => {
        const report = (reports || []).find((r) => r.id === expandedId);
        const detail = report?.detail;
        if (!report || !detail) {
          return html`
            <div className="mt-3 rounded-card border border-fxLine bg-white/[0.03] p-3">
              <div className="text-sm font-semibold text-fxText">${report?.name || "分报告"}</div>
              <div className="mt-1 text-xs text-fxSub">暂无详情结构（mock 可扩展）。</div>
              <button onClick=${() => onOpenReport(report?.url)} className="mt-2 fx-pill px-3 py-2 text-sm text-white">进入分报告</button>
            </div>
          `;
        }

        const chips = {
          normal: "text-fxGreen bg-fxGreenSoft border-fxGreen/20",
          warning: "text-fxOrange bg-fxOrangeSoft border-fxOrange/20",
          danger: "text-fxRed bg-fxRed/10 border-fxRed/20",
        };

        return html`
          <div className="mt-3 rounded-card border border-fxCardBorder bg-white/[0.03] p-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-sm font-semibold text-fxText">${report.name} · 详情</div>
                ${detail.score != null &&
                html`
                  <div className="mt-1 text-xs text-fxSub">
                    评分 <span className="ml-1 text-[18px] font-extrabold fx-gradText">${detail.score}</span>
                  </div>
                `}
              </div>
              <button onClick=${() => onOpenReport(report.url)} className="fx-pill px-3 py-2 text-xs text-white">进入报告</button>
            </div>

            ${(detail.modelImage || detail.heroImage) &&
            html`
              <div className="mt-3 overflow-hidden rounded-card border border-fxLine">
                <img src=${detail.modelImage || detail.heroImage} alt=${report.name} className="h-44 w-full object-cover opacity-95" />
              </div>
            `}

            ${detail.keyMetrics &&
            html`
              <div className="mt-3 grid grid-cols-2 gap-2">
                ${detail.keyMetrics.slice(0, 4).map((m) => {
                  const chip = chips[m.status] || "text-fxSub bg-white/5 border-white/10";
                  return html`
                    <div className="rounded-[10px] border border-fxLine bg-white/[0.03] p-3">
                      <div className="text-[12px] text-fxSub">${m.label}</div>
                      <div className="mt-1 flex items-end justify-between gap-2">
                        <div className="text-[16px] font-extrabold fx-gradText">${m.value}</div>
                        <span className=${`rounded-full border px-2 py-0.5 text-[11px] ${chip}`}>${m.status === "danger" ? "异常" : m.status === "warning" ? "关注" : "正常"}</span>
                      </div>
                    </div>
                  `;
                })}
              </div>
            `}

            ${detail.findings &&
            html`
              <div className="mt-3 space-y-2">
                ${detail.findings.map((f) => {
                  const status = f.status || "warning";
                  const chip = chips[status] || "text-fxSub bg-white/5 border-white/10";
                  return html`
                    <div className="rounded-card border border-fxLine bg-white/[0.02] p-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-sm text-fxText">${f.name}</div>
                        <span className=${`rounded-full border px-2 py-0.5 text-[11px] ${chip}`}>${f.note || ""}</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="text-[12px] text-fxSub">指标值</div>
                        <div className="text-[15px] font-extrabold fx-gradText">${f.value}</div>
                      </div>
                    </div>
                  `;
                })}
              </div>
            `}

            ${(detail.conclusion || detail.suggestion) &&
            html`
              <div className="mt-3 grid grid-cols-1 gap-2">
                ${detail.conclusion &&
                html`
                  <div className="rounded-card border border-fxLine bg-white/[0.02] p-3">
                    <div className="text-[12px] text-fxSub">结论</div>
                    <div className="mt-1 text-[13px] leading-relaxed text-fxText/90">${detail.conclusion}</div>
                  </div>
                `}
                ${detail.suggestion &&
                html`
                  <div className="rounded-card border border-fxLine bg-white/[0.02] p-3">
                    <div className="text-[12px] text-fxSub">建议</div>
                    <div className="mt-1 text-[13px] leading-relaxed text-fxText/90">${detail.suggestion}</div>
                  </div>
                `}
              </div>
            `}
          </div>
        `;
      })()}
    </${Card}>
  `;
}
