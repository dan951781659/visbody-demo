import React from "https://esm.sh/react@18.3.1";
import htm from "https://esm.sh/htm@3.1.1";
import { Card } from "../common/Card.js";
const html = htm.bind(React.createElement);

const statusText = {
  outline_only: "已生成训练大纲",
  not_started: "建议尽快开始训练",
  in_progress: "训练进行中",
  completed: "训练阶段已完成",
  unavailable: "暂不可用",
};

export function NextActionSection({ trainingEntry, nextActions, expandedId, onToggle, onStartTraining, onOpenAction }) {
  return html`
    <${Card} title="下一步建议" titleIcon="⚡" subtitle="看完结果后，直接进入行动">
      <div className="rounded-card border border-fxLine bg-white/[0.03] p-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs text-fxSub">${statusText[trainingEntry.status]}</p>
            <h4 className="mt-1 text-sm font-semibold text-fxText">${trainingEntry.stageName}</h4>
            <p className="mt-1 text-xs text-fxSub">${trainingEntry.progressText}</p>
          </div>
          <button
            onClick=${onStartTraining}
            className="fx-cta px-4 py-2 text-sm font-semibold"
          >
            ${trainingEntry.entryText}
          </button>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        ${nextActions.map(
          (action) => html`
            <article key=${action.id} className="rounded-card border border-fxLine bg-white/[0.03] p-3 transition-colors hover:border-white/20">
              <button className="w-full text-left" onClick=${() => onToggle(action.id)}>
                <h4 className="text-sm font-medium text-fxText">${action.title}</h4>
                <p className="mt-1 text-xs text-fxSub">${action.summary}</p>
              </button>
              ${expandedId === action.id &&
              html`
                <div className="mt-2 border-t border-fxLine pt-2">
                  <button
                    onClick=${() => onOpenAction(action.url)}
                    className="text-xs text-fxText underline decoration-white/25 underline-offset-2"
                  >
                    查看详情与执行说明
                  </button>
                </div>
              `}
            </article>
          `,
        )}
      </div>
    </${Card}>
  `;
}
