import React from "https://esm.sh/react@18.3.1";
import htm from "https://esm.sh/htm@3.1.1";
import { Card } from "../common/Card.js";

const html = htm.bind(React.createElement);
const { useMemo, useState } = React;

function inferAreaLabel(text = "") {
  const t = String(text);
  if (/腰|腹|脂肪/.test(t)) return "腹腰";
  if (/肩|颈/.test(t)) return "肩颈";
  if (/脊柱|腰椎|胸椎/.test(t)) return "脊柱";
  if (/膝|下肢|平衡/.test(t)) return "下肢";
  return "全身";
}

function areaFocusPos(area) {
  if (area === "腹腰") return { x: 66, y: 66 };
  if (area === "肩颈") return { x: 66, y: 44 };
  if (area === "脊柱") return { x: 66, y: 54 };
  if (area === "下肢") return { x: 66, y: 78 };
  return { x: 66, y: 58 };
}

/** 示意缩略图：深色底 + 轮廓 + 关注区域光晕（核心问题/亮点每条都有） */
function buildAreaThumb(area, type) {
  const { x, y } = areaFocusPos(area);
  const ring = type === "issue" ? "#ff5e7d" : "#36cfc9";
  const glow = type === "issue" ? "rgba(255,94,125,0.38)" : "rgba(54,207,201,0.38)";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="72" viewBox="0 0 120 72">
    <defs>
      <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="#10264d"/>
        <stop offset="1" stop-color="#0b1733"/>
      </linearGradient>
      <filter id="g"><feGaussianBlur stdDeviation="4"/></filter>
    </defs>
    <rect width="120" height="72" rx="12" fill="url(#bg)"/>
    <circle cx="${x}" cy="${y}" r="12" fill="${glow}" filter="url(#g)"/>
    <circle cx="${x}" cy="${y}" r="8" fill="none" stroke="${ring}" stroke-width="2"/>
    <path d="M40 22c4-2 10-2 14 0l2 6v9l-2 8 2 8v9c-4 2-10 2-14 0v-9l2-8-2-8v-9z" fill="rgba(216,230,255,0.5)"/>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function Item({ item, type, onOpen }) {
  const chipClass = type === "issue" ? "text-fxRed bg-fxRed/10 border-fxRed/20" : "text-fxGreen bg-fxGreenSoft border-fxGreen/20";
  const chipText = type === "issue" ? "关注项" : "正常/优秀";
  const area = inferAreaLabel(`${item.title} ${item.summary}`);
  const thumb = buildAreaThumb(area, type);

  return html`
    <button className="fx-listItem min-w-[272px] p-3 text-left" onClick=${() => onOpen(item.targetReportId)}>
      <span className=${`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] ${chipClass}`}>
        ${type === "issue" ? "!" : "✓"} ${chipText}
      </span>
      <div className="mt-3 flex w-full flex-col gap-2">
        <img src=${thumb} alt=${`${area}示意`} className="h-[100px] w-full rounded-[12px] border border-white/10 object-cover" />
        <div className="min-w-0 text-left">
          <h4 className="text-sm font-medium text-fxText">${item.title}</h4>
          <p className="mt-1 text-xs leading-relaxed text-fxSub">${item.summary}</p>
          <p className="mt-1 text-[10px] text-fxSub/90">示意部位：${area}</p>
        </div>
      </div>
    </button>
  `;
}

export function HighlightsSection({ highlights, onOpenReport }) {
  const [tab, setTab] = useState("issues");
  const list = useMemo(() => {
    if (tab === "strengths") return (highlights.strengths || []).map((it) => ({ it, type: "strength" }));
    return (highlights.issues || []).map((it) => ({ it, type: "issue" }));
  }, [tab, highlights]);

  return html`
    <${Card} title="核心问题 / 亮点" titleIcon="sparkle" subtitle="优先看到最值得行动的部分，也看见你的优势所在">
      <div className="hide-scrollbar -mx-1 mb-3 flex gap-2 overflow-x-auto px-1">
        <button className=${`fx-pill px-3 py-1 text-xs ${tab === "issues" ? "fx-pill--active" : ""}`} onClick=${() => setTab("issues")}>
          核心问题
        </button>
        <button className=${`fx-pill px-3 py-1 text-xs ${tab === "strengths" ? "fx-pill--active" : ""}`} onClick=${() => setTab("strengths")}>
          核心亮点
        </button>
      </div>
      <div className="hide-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
        ${list.map(({ it, type }) => html`<${Item} key=${it.id} item=${it} type=${type} onOpen=${onOpenReport} />`)}
      </div>
    </${Card}>
  `;
}
