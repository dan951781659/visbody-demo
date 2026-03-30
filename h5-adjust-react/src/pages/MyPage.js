import React from "https://esm.sh/react@18.3.1";
import htm from "https://esm.sh/htm@3.1.1";
import { Card } from "../components/common/Card.js";

const html = htm.bind(React.createElement);

function GroupItem({ title, subtitle, onClick }) {
  return html`
    <button
      onClick=${onClick}
      className="fx-listItem flex w-full items-center justify-between px-3 py-3 text-left"
    >
      <div>
        <p className="text-sm text-fxText">${title}</p>
        ${subtitle && html`<p className="mt-0.5 text-xs text-fxSub">${subtitle}</p>`}
      </div>
      <span className="text-fxSub">›</span>
    </button>
  `;
}

export function MyPage({ data, onNavigateOutline, onNavigatePlan, onToast }) {
  return html`
    <div className="space-y-3 px-4 pb-24 pt-4">
      <${Card} title="我的" titleIcon="◎" subtitle="低频能力统一收纳" className="bg-[linear-gradient(135deg,rgba(0,229,255,0.10),rgba(167,139,250,0.08))]">
        <div className="flex items-center gap-3">
          <img src=${data.user.avatar} alt=${data.user.name} className="h-12 w-12 rounded-full object-cover ring-2 ring-white/20" />
          <div>
            <h2 className="text-lg font-semibold text-white">${data.user.name}</h2>
            <p className="text-xs text-fxText/80">${data.user.phone}</p>
            <p className="mt-1 text-[11px] text-fxText/70">${data.user.memberLevel}</p>
          </div>
        </div>
      </${Card}>

      <${Card} title="我的训练" titleIcon="⚡" subtitle=${data.training.progressSummary}>
        <div className="space-y-2">
          <${GroupItem} title="训练大纲" subtitle="目标与阶段路线" onClick=${onNavigateOutline} />
          <${GroupItem} title="训练计划" subtitle="每日训练、饮食与复盘" onClick=${onNavigatePlan} />
          <${GroupItem} title="训练记录" subtitle="查看完成情况与反馈" onClick=${() => onToast("跳转：训练记录")} />
        </div>
      </${Card}>

      <${Card} title="我的报告" titleIcon="📄" subtitle="评估记录与重点回顾">
        <div className="space-y-2">
          <${GroupItem}
            title="评估记录"
            subtitle=${`累计 ${data.reports.latestCount} 条`}
            onClick=${() => onToast("跳转：评估记录")}
          />
          <${GroupItem} title="历史报告" subtitle="查看全部报告详情" onClick=${() => onToast("跳转：历史报告")} />
          <${GroupItem} title="重点指标回顾" subtitle="追踪关键风险变化" onClick=${() => onToast("跳转：重点指标")} />
        </div>
      </${Card}>

      <${Card} title="工具与设置" titleIcon="⚙" subtitle="低频功能统一收纳">
        <div className="space-y-2">
          ${data.tools.map(
            (tool) => html`<${GroupItem} key=${tool.name} title=${tool.name} onClick=${() => onToast(`跳转：${tool.name}`)} />`,
          )}
        </div>
      </${Card}>
    </div>
  `;
}
