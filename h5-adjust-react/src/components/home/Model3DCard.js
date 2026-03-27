import React from "https://esm.sh/react@18.3.1";
import htm from "https://esm.sh/htm@3.1.1";
import { Card } from "../common/Card.js";
import { EmptyState } from "../common/EmptyState.js";
const html = htm.bind(React.createElement);

export function Model3DCard({ model3d, onViewModel }) {
  if (!model3d.hasModel) {
    return html`
      <${Card} title="3D 模型" titleIcon="🧍" subtitle="当前暂无可展示模型">
        <${EmptyState}
          title="3D 模型尚未生成"
          desc="你仍可先阅读结论与建议，后续评估将自动生成模型。"
          actionText="了解模型生成"
          onAction=${() => onViewModel("help")}
        />
      </${Card}>
    `;
  }

  return html`
    <${Card} title="3D 模型" titleIcon="🧍" subtitle="使用图片替代 3D 模型（点击可进入详情）">
      <button className="group block w-full text-left" onClick=${() => onViewModel(model3d.modelUrl)}>
        <div className="relative overflow-hidden rounded-card">
          <img
            src=${model3d.coverImage}
            alt="3D 模型封面"
            className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
          <div className="absolute bottom-3 left-3 rounded-full border border-white/15 bg-black/35 px-3 py-1 text-xs text-white backdrop-blur-[12px]">
            点击查看模型细节
          </div>
        </div>
      </button>
    </${Card}>
  `;
}
