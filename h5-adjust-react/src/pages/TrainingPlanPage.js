import React from "https://esm.sh/react@18.3.1";
import htm from "https://esm.sh/htm@3.1.1";
import { Card } from "../components/common/Card.js";
import { EmptyState } from "../components/common/EmptyState.js";

const html = htm.bind(React.createElement);
const { useMemo, useState } = React;

function TaskRow({ task, onToggleTask }) {
  return html`
    <button
      onClick=${() => onToggleTask(task.id)}
      className="fx-listItem flex w-full items-center justify-between p-3 text-left"
    >
      <div>
        <p className="text-sm text-fxText">${task.name}</p>
        <p className="mt-1 text-xs text-fxSub">${task.sets} · ${task.duration}</p>
      </div>
      <span className=${`text-xs ${task.status === "done" ? "text-fxGreen" : "text-fxSub"}`}>
        ${task.status === "done" ? "已完成" : "待完成"}
      </span>
    </button>
  `;
}

export function TrainingPlanPage({ data, onBackHome, onToast, onToggleTask }) {
  if (!data || data.plan.status === "not_started") {
    return html`
      <div className="px-4 pt-4">
        <${EmptyState}
          title="暂无训练计划"
          desc="根据最新报告先生成训练方向，再进入每日训练任务。"
          actionText="生成训练建议"
          onAction=${() => onToast("跳转：生成训练建议")}
        />
      </div>
    `;
  }

  const [activeWeek, setActiveWeek] = useState(data.weeks[2] || data.weeks[0]);
  const [activeDay, setActiveDay] = useState(data.days[0]);
  const [activeTab, setActiveTab] = useState("train"); // train | diet | review

  const progressPct = Math.round(data.plan.progress * 100);
  const todayType = data.dayTypeMap[activeDay] || "light_activity";
  const dayTypeLabel = {
    power: "力量日",
    cardio: "有氧日",
    recovery: "恢复日",
    light_activity: "轻活动",
    rest: "休息日",
    mobility: "灵活性",
  }[todayType];

  const trainList = useMemo(() => data.trainingTabs.train || [], [data]);
  const diet = data.trainingTabs.diet;
  const review = data.trainingTabs.review;

  return html`
    <div className="space-y-3 px-4 pb-24 pt-4">
      <button onClick=${onBackHome} className="text-sm text-fxSub hover:text-fxText">← 返回</button>

      <${Card} title=${data.plan.name} titleIcon="⚡" subtitle=${data.plan.goal}>
        <div className="space-y-2">
          <p className="text-xs text-fxSub">${data.plan.duration} · ${data.plan.currentStage} · ${activeWeek}</p>
          <div className="fx-progressTrack h-2 w-full">
            <div
              className="fx-progressFill h-2"
              style=${{ width: `${progressPct}%` }}
            ></div>
          </div>
          <p className="text-xs text-fxSub">执行进度 ${progressPct}%</p>
        </div>
      </${Card}>

      <${Card} title="周选择" titleIcon="📅" subtitle="切换周后联动训练/饮食/复盘">
        <div className="hide-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          ${data.weeks.map(
            (week) => html`
              <button className=${`fx-pill px-3 py-1 text-xs ${activeWeek === week ? "fx-pill--active" : ""}`} onClick=${() => setActiveWeek(week)}>
                ${week}
              </button>
            `,
          )}
        </div>
      </${Card}>

      <${Card} title="日选择" titleIcon="🧭" subtitle="周内按天查看计划">
        <div className="hide-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          ${data.days.map(
            (day) => html`
              <button className=${`fx-pill px-3 py-1 text-xs ${activeDay === day ? "fx-pill--active" : ""}`} onClick=${() => setActiveDay(day)}>
                ${day}
              </button>
            `,
          )}
        </div>
        <div className="fx-cardInner mt-3 rounded-card p-3">
          <p className="text-xs text-fxSub">${activeDay} · 计划类型</p>
          <p className="mt-1 text-sm font-semibold text-fxText">${dayTypeLabel}</p>
        </div>
      </${Card}>

      <${Card} title="执行内容" titleIcon="🧩" subtitle="训练计划 / 饮食计划 / 进度复盘">
        <div className="hide-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          ${[
            ["train", "训练计划"],
            ["diet", "饮食计划"],
            ["review", "进度复盘"],
          ].map(
            ([key, label]) => html`
              <button className=${`fx-pill px-3 py-1 text-xs ${activeTab === key ? "fx-pill--active" : ""}`} onClick=${() => setActiveTab(key)}>
                ${label}
              </button>
            `,
          )}
        </div>

        ${activeTab === "train" &&
        html`
          <div className="mt-3 space-y-2">
            ${trainList.map((t) => html`<${TaskRow} key=${t.id} task=${t} onToggleTask=${onToggleTask} />`)}
            ${trainList.map(
              (t) => html`
                <article key=${`${t.id}-detail`} className="fx-cardInner rounded-card p-3">
                  <p className="text-sm font-medium text-fxText">${t.name} · 动作详情</p>
                  <p className="mt-1 text-xs text-fxSub">器械：${t.equip} · ${t.sets} · ${t.duration}</p>
                  <p className="mt-1 text-xs text-fxSub">执行提示：${t.tips}</p>
                </article>
              `,
            )}
          </div>
        `}

        ${activeTab === "diet" &&
        html`
          <div className="mt-3 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="fx-cardInner rounded-card p-3">
                <p className="text-xs text-fxSub">热量目标</p>
                <p className="mt-1 text-lg font-extrabold fx-gradText">${diet.kcal} kcal</p>
              </div>
              <div className="fx-cardInner rounded-card p-3">
                <p className="text-xs text-fxSub">饮水目标</p>
                <p className="mt-1 text-lg font-extrabold fx-gradText">${diet.water}</p>
              </div>
            </div>
            <div className="fx-cardInner rounded-card p-3">
              <p className="text-xs text-fxSub">宏量营养素</p>
              <p className="mt-1 text-sm text-fxText">蛋白 ${diet.macro.protein}g · 碳水 ${diet.macro.carb}g · 脂肪 ${diet.macro.fat}g</p>
            </div>
            ${diet.meals.map(
              (m) => html`
                <article key=${m.id} className="fx-cardInner rounded-card p-3">
                  <p className="text-sm font-medium text-fxText">${m.name}</p>
                  <p className="mt-1 text-xs text-fxSub">${m.desc}</p>
                  <p className="mt-1 text-xs text-fxSub">${m.kcal} kcal</p>
                </article>
              `,
            )}
            <p className="text-xs text-fxSub">${diet.disclaimer}</p>
          </div>
        `}

        ${activeTab === "review" &&
        html`
          <div className="mt-3 space-y-2">
            <article className="fx-cardInner rounded-card p-3">
              <p className="text-xs text-fxSub">本周应看到的变化</p>
              <p className="mt-1 text-sm text-fxText">${review.expected}</p>
            </article>
            <article className="fx-cardInner rounded-card p-3">
              <p className="text-xs text-fxSub">正常波动说明</p>
              <p className="mt-1 text-sm text-fxText">${review.normalFluctuation}</p>
            </article>
            <article className="fx-cardInner rounded-card p-3">
              <p className="text-xs text-fxSub">建议复测时间</p>
              <p className="mt-1 text-sm text-fxText">${review.retestTime}</p>
            </article>
            <article className="fx-cardInner rounded-card p-3">
              <p className="text-xs text-fxSub">建议关注指标</p>
              <p className="mt-1 text-sm text-fxText">${review.focusMetrics}</p>
            </article>
          </div>
        `}
      </${Card}>

      <${Card} title="后续动作" titleIcon="✅" subtitle="后续可扩展打卡与反馈能力">
        <button onClick=${() => onToast("演示：进入打卡流程")} className="w-full fx-cta px-4 py-3 text-sm font-semibold">
          完成训练并打卡（预留）
        </button>
      </${Card}>
    </div>
  `;
}
