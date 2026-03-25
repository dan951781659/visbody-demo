import React from "https://esm.sh/react@18.3.1";
import htm from "https://esm.sh/htm@3.1.1";
import { Card } from "../common/Card.js";
import { EmptyState } from "../common/EmptyState.js";
const html = htm.bind(React.createElement);

const trendMeta = {
  up: { icon: "↗", className: "text-fxGreen" },
  down: { icon: "↘", className: "text-fxRed" },
  flat: { icon: "→", className: "text-fxSub" },
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
      <div className="space-y-2">
        ${trends.map((trend) => {
          const meta = trendMeta[trend.trend] || trendMeta.flat;
          return html`
            <div key=${trend.metricName} className="rounded-card border border-fxLine bg-white/[0.03] px-3 py-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-fxText">${trend.metricName}</span>
                <span className=${`text-xs ${meta.className}`}>${meta.icon} ${trend.previousValue} → ${trend.currentValue}</span>
              </div>
            </div>
          `;
        })}
      </div>
    </${Card}>
  `;
}
