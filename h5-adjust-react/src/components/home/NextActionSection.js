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

const defaultPhases = [
  { title: "基础适应期", weeksLabel: "2周", desc: "建立运动习惯，提升基础体能" },
  { title: "强化训练期", weeksLabel: "4周", desc: "针对性训练，改善核心力量" },
  { title: "巩固提升期", weeksLabel: "2周", desc: "稳固成果，优化体态表现" },
];

function hasTrainingOutline(entry) {
  return entry && entry.status !== "unavailable" && entry.status !== "not_started";
}

export function NextActionSection({ trainingEntry, nextStepsAdvice, onStartTraining, selected, onActivate }) {
  const noOutline = !hasTrainingOutline(trainingEntry);
  const phases = trainingEntry?.outlinePhases?.length ? trainingEntry.outlinePhases : defaultPhases;
  const advice =
    nextStepsAdvice ||
    "结合评估异常：优先安排低冲击有氧与核心/髋膝稳定训练，每周至少 3 次；穿插颈肩放松与臀中肌激活；饮食控糖控夜宵并保证蛋白。联系教练生成训练大纲后按阶段执行，4 周内复测验证改善。";

  const stop = (e) => e.stopPropagation();

  if (noOutline) {
    return html`
      <${Card}
        title="下一步建议"
        titleIcon="bolt"
        subtitle="暂无训练大纲时的行动参考"
        selected=${selected}
        onClick=${onActivate}
      >
        <p className="text-[13px] leading-relaxed text-fxText/90">${advice}</p>
      </${Card}>
    `;
  }

  return html`
    <${Card}
      title="训练大纲"
      titleIcon="clipboard"
      subtitle="基于您的测量报告、身体档案。AI 解读数据生成专属训练大纲"
      selected=${selected}
      onClick=${onActivate}
    >
      <div className="mt-1 rounded-[14px] border border-white/[0.07] bg-white/[0.05] px-3 py-4 backdrop-blur-sm">
        <p className="mb-3 text-[11px] text-fxSub">${statusText[trainingEntry.status]}</p>
        <div className="space-y-0">
          ${phases.map(
            (phase, i) => html`
              <div key=${`${phase.title}-${i}`} className="flex gap-3">
                <div className="flex w-8 shrink-0 flex-col items-center">
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-[#3b9eff] bg-[rgba(8,14,32,0.9)] text-[12px] font-bold text-[#5eb0ff]"
                    style=${{ boxShadow: "0 0 0 1px rgba(59,158,255,0.25)" }}
                  >
                    ${i + 1}
                  </div>
                  ${i < phases.length - 1 &&
                  html`<div className="min-h-[28px] w-[2px] flex-1 bg-gradient-to-b from-[#3b9eff]/75 to-[#3b9eff]/12" />`}
                </div>
                <div className=${`min-w-0 flex-1 ${i < phases.length - 1 ? "pb-5" : ""}`}>
                  <div className="text-[14px] font-semibold leading-snug text-white">
                    ${phase.title}
                    <span className="font-normal text-white/45"> | ${phase.weeksLabel}</span>
                  </div>
                  <p className="mt-1 text-[12px] leading-relaxed text-white/55">${phase.desc}</p>
                </div>
              </div>
            `,
          )}
        </div>
      </div>
      <button
        type="button"
        onClick=${(e) => {
          stop(e);
          onStartTraining?.();
        }}
        className="fx-cta-training mt-4 flex w-full items-center justify-center gap-2 rounded-[14px] py-3.5 text-[14px] font-semibold text-white shadow-[0_8px_24px_rgba(43,140,255,0.28)]"
      >
        查看完整训练大纲
        <span className="text-base leading-none" aria-hidden="true">→</span>
      </button>
    </${Card}>
  `;
}
