import React from "https://esm.sh/react@18.3.1";
import htm from "https://esm.sh/htm@3.1.1";
import { Card } from "../components/common/Card.js";

const html = htm.bind(React.createElement);
const { useState } = React;

export function TrainingOutlinePage({ data, onBack, onGoPlan }) {
  const [activePhase, setActivePhase] = useState(data.outline.phases[1]?.id || data.outline.phases[0]?.id);
  const [activeWeek, setActiveWeek] = useState(data.outline.currentWeek || 1);

  const currentPhase = data.outline.phases.find((p) => p.id === activePhase) || data.outline.phases[0];
  const currentWeekSummary = data.outline.weekSummaries.find((w) => w.week === activeWeek);

  return html`
    <div className="space-y-3 px-4 pb-24 pt-4">
      <button onClick=${onBack} className="text-sm text-fxSub hover:text-fxText">← 返回</button>

      <${Card}
        title="训练大纲详情"
        titleIcon="🧭"
        subtitle=${`${data.outline.periodWeeks} 周周期 · 每周 ${data.outline.frequencyPerWeek} 次 · 当前第 ${data.outline.currentWeek} 周`}
      >
<<<<<<< HEAD
        <div className="rounded-card border border-fxLine bg-white/[0.03] p-3">
=======
        <div className="fx-cardInner rounded-card p-3">
>>>>>>> f1ef4b3 (Update HTML structure and styles for PRO权益与积分 page; remove unused CSS and optimize layout. Update .DS_Store files.)
          <p className="text-xs text-fxSub">核心目标</p>
          <p className="mt-1 text-[14px] leading-relaxed text-fxText">${data.outline.coreGoal}</p>
          <p className="mt-2 text-xs text-fxSub">预计可见变化：${data.outline.expectedChange}</p>
        </div>
      </${Card}>

      <${Card} title="关键目标" titleIcon="🎯" subtitle="改善前 vs 改善后（最多 3 项）">
        <div className="space-y-2">
          ${data.outline.targets.map(
            (target) => html`
<<<<<<< HEAD
              <article key=${target.id} className="rounded-card border border-fxLine bg-white/[0.03] p-3">
=======
              <article key=${target.id} className="fx-cardInner rounded-card p-3">
>>>>>>> f1ef4b3 (Update HTML structure and styles for PRO权益与积分 page; remove unused CSS and optimize layout. Update .DS_Store files.)
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-fxText">${target.title}</p>
                  <span className="rounded-full border border-white/15 px-2 py-0.5 text-[11px] text-fxSub">${target.type}</span>
                </div>
                <p className="mt-1 text-xs text-fxSub">${target.value}</p>
              </article>
            `,
          )}
        </div>
      </${Card}>

      <${Card} title="阶段路线" titleIcon="🛤" subtitle="只讲阶段目标与进入条件，不展示每日动作">
        <div className="hide-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          ${data.outline.phases.map(
            (phase) => html`
              <button
                key=${phase.id}
                className=${`fx-pill min-w-[180px] px-3 py-2 text-left text-xs ${activePhase === phase.id ? "fx-pill--active" : ""}`}
                onClick=${() => setActivePhase(phase.id)}
              >
                <div className="font-semibold text-fxText">${phase.name}</div>
                <div className="mt-1 text-fxSub">${phase.weeks}</div>
              </button>
            `,
          )}
        </div>
<<<<<<< HEAD
        <div className="mt-3 rounded-card border border-fxLine bg-white/[0.03] p-3">
=======
        <div className="fx-cardInner mt-3 rounded-card p-3">
>>>>>>> f1ef4b3 (Update HTML structure and styles for PRO权益与积分 page; remove unused CSS and optimize layout. Update .DS_Store files.)
          <p className="text-xs text-fxSub">阶段目标</p>
          <p className="mt-1 text-sm text-fxText">${currentPhase.goal}</p>
          <p className="mt-2 text-xs text-fxSub">阶段收益：${currentPhase.benefit}</p>
          <p className="mt-1 text-xs text-fxSub">进入下一阶段条件：${currentPhase.gate}</p>
        </div>
      </${Card}>

      <${Card} title="周度框架" titleIcon="🗂" subtitle="仅展示周重点/预期变化/复测点">
        <div className="hide-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          ${data.outline.weekSummaries.map(
            (week) => html`
              <button
                key=${week.week}
                className=${`fx-pill px-3 py-1 text-xs ${activeWeek === week.week ? "fx-pill--active" : ""}`}
                onClick=${() => setActiveWeek(week.week)}
              >
                第${week.week}周
              </button>
            `,
          )}
        </div>
        ${currentWeekSummary &&
        html`
<<<<<<< HEAD
          <div className="mt-3 rounded-card border border-fxLine bg-white/[0.03] p-3">
=======
          <div className="fx-cardInner mt-3 rounded-card p-3">
>>>>>>> f1ef4b3 (Update HTML structure and styles for PRO权益与积分 page; remove unused CSS and optimize layout. Update .DS_Store files.)
            <p className="text-xs text-fxSub">本周重点</p>
            <p className="mt-1 text-sm text-fxText">${currentWeekSummary.focus}</p>
            <p className="mt-2 text-xs text-fxSub">应期待变化：${currentWeekSummary.expected}</p>
            <p className="mt-1 text-xs text-fxSub">建议复测点：${currentWeekSummary.retestHint}</p>
          </div>
        `}
      </${Card}>

      <${Card} title="进入训练" titleIcon="▶" subtitle="准备好后进入训练计划页执行每日任务">
        <button onClick=${onGoPlan} className="w-full fx-cta px-4 py-3 text-sm font-semibold">
          查看本周训练计划
        </button>
        <p className="mt-2 text-xs leading-relaxed text-fxSub">${data.outline.disclaimer}</p>
      </${Card}>
    </div>
  `;
}
<<<<<<< HEAD

=======
>>>>>>> f1ef4b3 (Update HTML structure and styles for PRO权益与积分 page; remove unused CSS and optimize layout. Update .DS_Store files.)
