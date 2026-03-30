import React from "https://esm.sh/react@18.3.1";
import htm from "https://esm.sh/htm@3.1.1";
import { Card } from "../common/Card.js";
import { EmptyState } from "../common/EmptyState.js";
const html = htm.bind(React.createElement);

const trendMeta = {
<<<<<<< HEAD
  up: { icon: "↗", className: "text-fxGreen" },
  down: { icon: "↘", className: "text-fxRed" },
  flat: { icon: "→", className: "text-fxSub" },
=======
  up: { icon: "↗", className: "text-fxGreen", stroke: "#36cfc9" },
  down: { icon: "↘", className: "text-fxRed", stroke: "#ff4d6a" },
  flat: { icon: "→", className: "text-fxSub", stroke: "#7a8baa" },
>>>>>>> f1ef4b3 (Update HTML structure and styles for PRO权益与积分 page; remove unused CSS and optimize layout. Update .DS_Store files.)
};

export function TrendSection({ trends, onOpenHistory }) {
  if (!trends || trends.length === 0) {
    return html`
      <${Card} title="历史变化" subtitle="近 2-3 次评估变化趋势">
        <${EmptyState}
          title="首次评估，暂无历史趋势"
          desc="完成后续评估后，你将看到关键指标的趋势变化。"
          actionText="查看评估说明"
          onAction=${onOpenHistory}
        />
      </${Card}>
    `;
  }

  return html`
    <${Card}
      title="历史变化"
      titleIcon="📈"
      subtitle="近 2-3 次核心指标趋势"
      footer=${html`
        <button
          onClick=${onOpenHistory}
          className="w-full fx-pill px-3 py-2 text-sm text-white"
        >
          查看全部历史记录
        </button>
      `}
    >
<<<<<<< HEAD
      <div className="space-y-2">
        ${trends.map((trend) => {
          const meta = trendMeta[trend.trend] || trendMeta.flat;
          return html`
            <div key=${trend.metricName} className="rounded-card border border-fxLine bg-white/[0.03] px-3 py-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-fxText">${trend.metricName}</span>
                <span className=${`text-xs ${meta.className}`}>${meta.icon} ${trend.previousValue} → ${trend.currentValue}</span>
=======
      <div className="space-y-3">
        ${trends.map((trend) => {
          const meta = trendMeta[trend.trend] || trendMeta.flat;
          const points = (trend.points || [trend.previousValue, trend.currentValue]).map((v) =>
            typeof v === "number" ? v : Number.parseFloat(v),
          );
          const max = Math.max(...points, 1);
          const min = Math.min(...points, 0);
          const range = Math.max(max - min, 1);
          const width = 220;
          const height = 44;
          const step = points.length > 1 ? width / (points.length - 1) : width;
          const path = points
            .map((p, idx) => {
              const x = Math.round(idx * step);
              const y = Math.round(height - ((p - min) / range) * (height - 6) - 3);
              return `${x},${y}`;
            })
            .join(" ");
          return html`
            <div key=${trend.metricName} className="fx-cardInner rounded-card px-3 py-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm text-fxText">${trend.metricName}</div>
                  <div className="mt-1 text-[11px] text-fxSub">较上次评估</div>
                </div>
                <div className="text-right">
                  <div className=${`text-xs ${meta.className}`}>${meta.icon} ${trend.previousValue} → ${trend.currentValue}</div>
                </div>
              </div>
              <div className="mt-3 overflow-hidden rounded-[10px] border border-white/8 bg-black/18 px-2 py-1.5">
                <svg viewBox="0 0 220 44" className="h-[44px] w-full">
                  <polyline points=${path} fill="none" stroke=${meta.stroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"></polyline>
                  ${points.map((p, idx) => {
                    const cx = Math.round(idx * step);
                    const cy = Math.round(height - ((p - min) / range) * (height - 6) - 3);
                    return html`<circle key=${idx} cx=${cx} cy=${cy} r="2.2" fill=${meta.stroke}></circle>`;
                  })}
                </svg>
>>>>>>> f1ef4b3 (Update HTML structure and styles for PRO权益与积分 page; remove unused CSS and optimize layout. Update .DS_Store files.)
              </div>
            </div>
          `;
        })}
      </div>
    </${Card}>
  `;
}
