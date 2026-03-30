import React from "https://esm.sh/react@18.3.1";
import htm from "https://esm.sh/htm@3.1.1";
import { Card } from "../common/Card.js";
const html = htm.bind(React.createElement);
const { useMemo, useState } = React;

function Item({ item, type, onOpen }) {
  const chipClass =
    type === "issue" ? "text-fxRed bg-fxRed/10 border-fxRed/20" : "text-fxGreen bg-fxGreenSoft border-fxGreen/20";
  const chipText = type === "issue" ? "关注项" : "正常/优秀";
  return html`
    <button
      className="fx-listItem min-w-[272px] p-3 text-left"
      onClick=${() => onOpen(item.targetReportId)}
    >
      <span className=${`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] ${chipClass}`}>
        ${type === "issue" ? "⚠" : "✓"} ${chipText}
      </span>
      <h4 className="mt-2 text-sm font-medium text-fxText">${item.title}</h4>
      <p className="mt-1 text-xs leading-relaxed text-fxSub">${item.summary}</p>
    </button>
  `;
}

export function HighlightsSection({ highlights, onOpenReport }) {
  const [tab, setTab] = useState("issues"); // issues | strengths

  const list = useMemo(() => {
    if (tab === "strengths") return (highlights.strengths || []).map((it) => ({ it, type: "strength" }));
    return (highlights.issues || []).map((it) => ({ it, type: "issue" }));
  }, [tab, highlights]);

  return html`
    <${Card} title="核心问题 / 亮点" titleIcon="✨" subtitle="先看最该关注的，再看你做得好的地方">
      <div className="hide-scrollbar -mx-1 mb-3 flex gap-2 overflow-x-auto px-1">
        <button className=${`fx-pill px-3 py-1 text-xs ${tab === "issues" ? "fx-pill--active" : ""}`} onClick=${() => setTab("issues")}>
          核心问题
        </button>
        <button
          className=${`fx-pill px-3 py-1 text-xs ${tab === "strengths" ? "fx-pill--active" : ""}`}
          onClick=${() => setTab("strengths")}
        >
          核心亮点
        </button>
      </div>

      <div className="hide-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
        ${list.map(({ it, type }) => html`<${Item} key=${it.id} item=${it} type=${type} onOpen=${onOpenReport} />`)}
      </div>
    </${Card}>
  `;
}
