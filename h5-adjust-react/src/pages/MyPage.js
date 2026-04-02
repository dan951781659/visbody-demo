import React from "https://esm.sh/react@18.3.1";
import htm from "https://esm.sh/htm@3.1.1";
import { FxIconFilled, FxIconLinear } from "../components/common/FxIcons.js";

const html = htm.bind(React.createElement);

const accentBar = {
  rose: "border-l-rose-400/90",
  violet: "border-l-violet-400/90",
  emerald: "border-l-emerald-400/90",
};

function AssessmentRecordsCard({ assessment, onOpenList }) {
  const { totalCount, latest } = assessment || {};
  const mods = latest?.modules || [];

  return html`
    <section className="overflow-hidden rounded-none border-x-0 border-b border-t-0 border-emerald-500/20 bg-[linear-gradient(180deg,rgba(8,22,28,0.35),rgba(10,18,40,0.25))] shadow-none">
      <button
        type="button"
        onClick=${onOpenList}
        className="flex w-full items-center justify-between border-b border-emerald-500/25 bg-[linear-gradient(145deg,rgba(8,115,82,0.48),rgba(10,22,52,0.94))] px-3 py-3.5 text-left text-white transition hover:brightness-[1.06] active:brightness-95"
      >
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/18 ring-1 ring-white/20">
            <${FxIconFilled} name="doc" className="h-5 w-5 text-white" />
          </span>
          <span className="text-[15px] font-semibold tracking-tight">评估记录</span>
        </div>
        <span className="text-[13px] font-medium text-emerald-50/95">${totalCount ?? 0} 条记录 ›</span>
      </button>
      <div className="border-t border-white/[0.08] bg-white/[0.04] px-3 py-3 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-2 text-[12px]">
          <div className="flex min-w-0 items-center gap-1.5 text-fxSub">
            <${FxIconLinear} name="lineTrend" className="h-4 w-4 shrink-0 opacity-80" />
            <span className="truncate text-fxText/90">${latest?.time || "--"}</span>
          </div>
          <span className="shrink-0 font-medium text-fxPrimary">${latest?.device || "--"}</span>
        </div>
        <div className="mt-3 rounded-xl border-0 bg-white/[0.05] px-2 py-2.5">
          <div className="flex flex-wrap gap-x-3 gap-y-2 text-[11px] text-fxText/88">
            ${mods.map(
              (m) => html`
                <span key=${m.id} className=${`inline-flex border-l-2 pl-2 ${accentBar[m.accent] || "border-l-white/30"}`}>${m.label}</span>
              `,
            )}
          </div>
        </div>
      </div>
    </section>
  `;
}

/** 身体档案：次级入口，交互与「设置」行一致（面板内 hover:bg-white/[0.04]） */
function BodyDataPanel({ title, subtitle, onClick }) {
  return html`
    <div className="overflow-hidden rounded-none border-x-0 border-b border-t-0 border-white/[0.06] bg-white/[0.02]">
      <button
        type="button"
        onClick=${onClick}
        className="flex w-full items-center gap-3 px-3 py-3.5 text-left transition hover:bg-white/[0.04]"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/14">
          <${FxIconFilled} name="clipboard" className="h-5 w-5 text-emerald-100/90" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-semibold text-fxText">${title}</p>
          ${subtitle && html`<p className="mt-0.5 text-[11px] leading-relaxed text-fxSub">${subtitle}</p>`}
        </div>
        <span className="shrink-0 text-fxSub/75">›</span>
      </button>
    </div>
  `;
}

/** 系统类入口：收进同一面板，表示「配置与说明」而非个人数据中心 */
function SystemServicePanel({ settingsTitle, settingsSubtitle, helpEyebrow, helpTitle, helpSubtitle, onSettings, onHelp }) {
  return html`
    <div className="overflow-hidden rounded-none border-x-0 border-b border-t-0 border-white/[0.06] bg-white/[0.02]">
      <button
        type="button"
        onClick=${onSettings}
        className="flex w-full items-center gap-3 border-b border-white/[0.06] px-3 py-3.5 text-left transition hover:bg-white/[0.04]"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/14">
          <${FxIconFilled} name="gear" className="h-5 w-5 text-violet-100/90" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-semibold text-fxText">${settingsTitle}</p>
          ${settingsSubtitle && html`<p className="mt-0.5 text-[11px] leading-relaxed text-fxSub">${settingsSubtitle}</p>`}
        </div>
        <span className="shrink-0 text-fxSub/75">›</span>
      </button>
      <button
        type="button"
        onClick=${onHelp}
        className="flex w-full items-center gap-3 px-3 py-3.5 text-left transition hover:bg-amber-500/[0.06]"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/12">
          <${FxIconLinear} name="docHelp" className="h-5 w-5 text-amber-100/88" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-medium uppercase tracking-wider text-amber-200/75">${helpEyebrow}</p>
          <p className="mt-0.5 text-[14px] font-semibold text-fxText">${helpTitle}</p>
          ${helpSubtitle && html`<p className="mt-0.5 text-[11px] leading-relaxed text-fxSub">${helpSubtitle}</p>`}
        </div>
        <span className="shrink-0 self-center text-fxSub/75">›</span>
      </button>
    </div>
  `;
}

export function MyPage({ data, onOpenAssessmentList, onOpenHelp, onOpenHealthProfile, onOpenSettings, onToast }) {
  const openList = onOpenAssessmentList || (() => onToast?.("跳转：评估记录列表"));
  const openHelp = onOpenHelp || (() => onToast?.("跳转：测试帮助"));
  const openHealth = onOpenHealthProfile || (() => onToast?.("跳转：身体档案"));
  const openSettings = onOpenSettings || (() => onToast?.("跳转：设置"));

  return html`
    <div className="space-y-4 px-0 pb-4 pt-2">
      <div className="border-x-0 border-b border-t-0 border-white/[0.07] bg-[linear-gradient(180deg,rgba(20,30,60,0.5),rgba(14,22,46,0.45))] px-3 py-4 shadow-none">
        <div className="flex items-center gap-3">
          <img src=${data.user.avatar} alt="" className="h-14 w-14 rounded-full object-cover ring-2 ring-white/15" />
          <div className="min-w-0">
            <h2 className="text-[16px] font-semibold text-white">${data.user.name}</h2>
            <p className="mt-0.5 text-[13px] text-fxSub">${data.user.phone}</p>
          </div>
        </div>
      </div>

      <div>
        <p className="mb-2 px-3 text-[12px] font-medium text-fxSub/95">测量与报告</p>
        <p className="mb-2.5 px-3 text-[11px] leading-snug text-fxSub/70">最常查看：历史评估、各模块结果摘要</p>
        <${AssessmentRecordsCard} assessment=${data.assessment} onOpenList=${openList} />
      </div>

      <div className="space-y-5">
        <div>
          <p className="mb-2 px-3 text-[12px] font-medium text-fxSub/95">身体数据</p>
          <p className="mb-2.5 px-3 text-[11px] leading-snug text-fxSub/70">身高体重、目标等基础信息，按需维护</p>
          <${BodyDataPanel}
            title=${data.healthProfileEntry.title}
            subtitle=${data.healthProfileEntry.subtitle}
            onClick=${openHealth}
          />
        </div>
        <div>
          <p className="mb-2 px-3 text-[12px] font-medium text-fxSub/95">系统与服务</p>
          <p className="mb-2.5 px-3 text-[11px] leading-snug text-fxSub/70">应用偏好与实体设备上的使用说明</p>
          <${SystemServicePanel}
            settingsTitle=${data.settingsEntry.title}
            settingsSubtitle=${data.settingsEntry.subtitle}
            helpEyebrow=${data.helpEntry.eyebrow}
            helpTitle=${data.helpEntry.title}
            helpSubtitle=${data.helpEntry.subtitle}
            onSettings=${openSettings}
            onHelp=${openHelp}
          />
        </div>
      </div>
    </div>
  `;
}
