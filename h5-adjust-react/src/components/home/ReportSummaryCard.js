import React from "https://esm.sh/react@18.3.1";
import htm from "https://esm.sh/htm@3.1.1";
import { Card } from "../common/Card.js";
const html = htm.bind(React.createElement);

const riskMap = {
  low: { label: "低风险", color: "text-fxGreen" },
  medium: { label: "中风险", color: "text-amber-300" },
  high: { label: "高风险", color: "text-fxRed" },
};

export function ReportSummaryCard({ report, expanded, onToggle, onViewFullReport }) {
  const risk = riskMap[report.riskLevel] || riskMap.medium;
  return html`
    <${Card}
      title=${report.title}
      titleIcon="📄"
      subtitle="优先查看关键结论与风险等级"
      onClick=${onToggle}
      footer=${html`
        <button
          onClick=${(e) => {
            e.stopPropagation();
            onViewFullReport();
          }}
          className="w-full fx-pill px-3 py-2 text-sm text-white"
        >
          查看完整报告
        </button>
      `}
    >
      <div className="flex items-end justify-between gap-2">
        <div>
          <p className="text-xs text-fxSub">总体评分</p>
          <p className="text-3xl font-semibold text-white">${report.score}</p>
        </div>
        <span className=${`rounded-full bg-white/5 px-3 py-1 text-sm ${risk.color}`}>${risk.label}</span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-fxText/90">${report.summary}</p>
      ${expanded &&
      html`<div className="mt-3 rounded-card border border-fxLine bg-white/[0.03] p-3 text-xs text-fxSub">完整报告包含分项证据链与可执行建议动作。</div>`}
      <p className="mt-2 text-xs text-fxSub">${expanded ? "点击卡片可收起详情" : "点击卡片展开详情"}</p>
    </${Card}>
  `;
}
