import React from "https://esm.sh/react@18.3.1";
import htm from "https://esm.sh/htm@3.1.1";
import { Card } from "../common/Card.js";
import { EmptyState } from "../common/EmptyState.js";
import { FxIconLinear, trendLinearIconForMetric } from "../common/FxIcons.js";

const html = htm.bind(React.createElement);
const { useState } = React;

const trendMeta = {
  up: { icon: "↗", className: "text-fxGreen", stroke: "#36cfc9" },
  down: { icon: "↘", className: "text-fxRed", stroke: "#ff4d6a" },
  flat: { icon: "→", className: "text-fxSub", stroke: "#7a8baa" },
};

const VB_W = 320;
const VB_H = 102;
const PAD_L = 38;
const PAD_R = 14;
const PAD_T = 10;
const PAD_B = 28;
const PLOT_H = 46;

function getUnit(valueText) {
  const text = String(valueText || "");
  const m = text.match(/[^\d.\-]+$/);
  return m ? m[0] : "";
}

function formatPointValue(raw, unit) {
  if (Number.isNaN(raw)) return "--";
  if (Number.isInteger(raw)) return `${raw}${unit}`;
  return `${raw.toFixed(1)}${unit}`;
}

function buildChartPaths(points, min, max, plotW, plotH) {
  const range = Math.max(max - min, 1e-6);
  const n = points.length;
  const step = n > 1 ? plotW / (n - 1) : 0;
  const coords = points.map((p, idx) => {
    const x = PAD_L + idx * step;
    const y = PAD_T + plotH - ((p - min) / range) * (plotH - 4) - 2;
    return { x, y, p, idx };
  });
  const linePts = coords.map((c) => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(" ");
  const baseY = PAD_T + plotH;
  const areaD =
    coords.length > 0
      ? `M ${coords[0].x},${baseY} L ${coords.map((c) => `${c.x},${c.y}`).join(" L ")} L ${coords[coords.length - 1].x},${baseY} Z`
      : "";
  return { coords, linePts, areaD, step };
}

export function TrendSection({ trends, onOpenHistory }) {
  const [activeDayByMetric, setActiveDayByMetric] = useState({});
  const [hoverIdxByMetric, setHoverIdxByMetric] = useState({});

  if (!trends || trends.length === 0) {
    return html`
      <${Card} title="历史变化" titleIcon="trend" subtitle="有多次数据后，这里会呈现你的变化曲线">
        <${EmptyState}
          title="首次评估，暂无历史趋势"
          desc="完成后续评估后，你将看到关键指标的趋势变化。"
          actionText="查看评估说明"
          onAction=${onOpenHistory}
        />
      </${Card}>
    `;
  }

  const headerRight = html`
    <button type="button" onClick=${onOpenHistory} className="text-[12px] font-semibold text-fxPrimary hover:underline">
      查看全部
    </button>
  `;

  const plotW = VB_W - PAD_L - PAD_R;

  return html`
    <${Card}
      title="历史变化"
      titleIcon="trend"
      subtitle="看清关键指标走势，把握身体变化节奏"
      headerRight=${headerRight}
    >
      <div className="space-y-3">
        ${trends.slice(0, 3).map((trend, trendIdx) => {
          const meta = trendMeta[trend.trend] || trendMeta.flat;
          const historyRaw = trend.history?.length
            ? trend.history
            : (trend.points || [trend.previousValue, trend.currentValue]).map((v, idx) => ({
                day: `第${idx + 1}次`,
                value: v,
              }));
          const history = historyRaw
            .slice(-7)
            .map((it) => ({
              day: String(it.day || "").slice(0, 6) || "--",
              value: typeof it.value === "number" ? it.value : Number.parseFloat(it.value),
            }))
            .filter((it) => Number.isFinite(it.value));
          if (!history.length) return null;

          const pts = history.map((it) => it.value);
          const unit = getUnit(trend.currentValue);
          const defaultIdx = history.length - 1;
          const pickedIdx = Number.isInteger(activeDayByMetric[trend.metricName]) ? activeDayByMetric[trend.metricName] : defaultIdx;
          const safeIdx = Math.max(0, Math.min(pickedIdx, history.length - 1));
          const hoverIdx = hoverIdxByMetric[trend.metricName];
          const displayIdx = hoverIdx != null ? Math.max(0, Math.min(hoverIdx, history.length - 1)) : safeIdx;
          const selected = history[displayIdx];
          const selectedText = formatPointValue(selected.value, unit);
          const prevInSeries = displayIdx > 0 ? history[displayIdx - 1] : null;
          const prevText = prevInSeries ? formatPointValue(prevInSeries.value, unit) : null;

          const max = Math.max(...pts, 1);
          const min = Math.min(...pts, 0);
          const { coords, linePts, areaD } = buildChartPaths(pts, min, max, plotW, PLOT_H);

          const gridYs = [0, 0.33, 0.66, 1].map((t) => PAD_T + 2 + t * (PLOT_H - 4));

          const setHover = (idx) => () => setHoverIdxByMetric((prev) => ({ ...prev, [trend.metricName]: idx }));
          const clearHover = () =>
            setHoverIdxByMetric((prev) => {
              const next = { ...prev };
              delete next[trend.metricName];
              return next;
            });
          const pickDay = (idx) => () => setActiveDayByMetric((prev) => ({ ...prev, [trend.metricName]: idx }));

          return html`
            <div key=${trend.metricName} className="fx-cardInner rounded-card px-3 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/[0.06]">
                    <${FxIconLinear}
                      name=${trendLinearIconForMetric(trend.metricName)}
                      className="h-4 w-4 text-fxPrimary/85"
                    />
                  </span>
                  <div>
                    <div className="text-sm text-fxText">${trend.metricName}</div>
                    <div className="mt-1 text-[11px] text-fxSub/95">对比每次变化，更清楚进步方向</div>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-[11px] text-fxSub">${selected.day}</div>
                  <div className="text-base font-bold text-white">${selectedText}</div>
                  ${prevText &&
                  html`<div className="mt-0.5 text-[10px] text-fxSub">较上点 ${prevText} → ${selectedText}</div>`}
                </div>
              </div>
              <div className="mt-3 overflow-hidden rounded-[12px] bg-[linear-gradient(180deg,rgba(0,0,0,0.22)_0%,rgba(0,0,0,0.08)_100%)] px-0 py-2">
                <svg
                  viewBox=${`0 0 ${VB_W} ${VB_H}`}
                  className="h-[102px] w-full touch-manipulation select-none"
                  style=${{ touchAction: "pan-y" }}
                >
                  <defs>
                    <linearGradient id=${`trend-area-${trendIdx}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color=${meta.stroke} stop-opacity="0.35" />
                      <stop offset="100%" stop-color=${meta.stroke} stop-opacity="0.02" />
                    </linearGradient>
                  </defs>
                  ${gridYs.map(
                    (gy, gi) => html`
                      <line
                        key=${`g-${gi}`}
                        x1=${PAD_L}
                        y1=${gy}
                        x2=${VB_W - PAD_R}
                        y2=${gy}
                        stroke="rgba(255,255,255,0.07)"
                        stroke-width="1"
                        stroke-dasharray="4 5"
                      />
                    `,
                  )}
                  <line
                    x1=${PAD_L}
                    y1=${PAD_T + PLOT_H}
                    x2=${VB_W - PAD_R}
                    y2=${PAD_T + PLOT_H}
                    stroke="rgba(255,255,255,0.12)"
                    stroke-width="1"
                  />
                  ${areaD &&
                  html`<path d=${areaD} fill=${`url(#trend-area-${trendIdx})`} stroke="none" pointer-events="none" />`}
                  <polyline
                    fill="none"
                    stroke=${meta.stroke}
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    points=${linePts}
                    pointer-events="none"
                  />
                  ${coords.map((c) => {
                    const isActive = c.idx === displayIdx;
                    const tip = formatPointValue(c.p, unit);
                    return html`
                      <g key=${`pt-${c.idx}`}>
                        <circle
                          cx=${c.x}
                          cy=${c.y}
                          r="16"
                          fill="transparent"
                          className="cursor-pointer"
                          onMouseEnter=${setHover(c.idx)}
                          onMouseLeave=${clearHover}
                          onClick=${pickDay(c.idx)}
                          onTouchStart=${(e) => {
                            e.stopPropagation();
                            setHoverIdxByMetric((prev) => ({ ...prev, [trend.metricName]: c.idx }));
                            setActiveDayByMetric((prev) => ({ ...prev, [trend.metricName]: c.idx }));
                          }}
                        >
                          <title>${trend.metricName} ${history[c.idx].day}: ${tip}</title>
                        </circle>
                        <circle
                          cx=${c.x}
                          cy=${c.y}
                          r=${isActive ? "5" : "3.5"}
                          fill=${meta.stroke}
                          fill-opacity=${isActive ? "1" : "0.55"}
                          pointer-events="none"
                        />
                      </g>
                    `;
                  })}
                  ${history.map((h, idx) => {
                    const cx = coords[idx]?.x ?? PAD_L;
                    const label = String(h.day || "").slice(0, 5);
                    return html`
                      <text
                        key=${`xl-${idx}`}
                        x=${cx}
                        y=${VB_H - 8}
                        text-anchor="middle"
                        fill="rgba(216,230,255,0.55)"
                        font-size="9"
                      >
                        ${label}
                      </text>
                    `;
                  })}
                </svg>
              </div>
              <div className="hide-scrollbar mt-2 -mx-1 flex gap-1 overflow-x-auto px-1 pb-0.5">
                ${history.map(
                  (p, idx) => html`
                    <button
                      key=${`${trend.metricName}-${p.day}-${idx}`}
                      type="button"
                      onClick=${pickDay(idx)}
                      className=${`rounded-full px-2 py-1 text-[10px] ${
                        idx === safeIdx
                          ? "bg-fxPrimary/24 text-white shadow-[0_0_12px_rgba(0,229,255,0.22)]"
                          : "bg-white/[0.07] text-fxSub"
                      }`}
                    >
                      ${p.day}
                    </button>
                  `,
                )}
              </div>
            </div>
          `;
        })}
      </div>
    </${Card}>
  `;
}
