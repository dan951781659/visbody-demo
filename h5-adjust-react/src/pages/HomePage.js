import React from "https://esm.sh/react@18.3.1";
import htm from "https://esm.sh/htm@3.1.1";
import { ResultHero } from "../components/home/ResultHero.js";
import { HighlightsSection } from "../components/home/HighlightsSection.js";
import { TrendSection } from "../components/home/TrendSection.js";
import { NextActionSection } from "../components/home/NextActionSection.js";
import { HomeSkeleton } from "../components/common/Skeleton.js";
import { EmptyState } from "../components/common/EmptyState.js";

const html = htm.bind(React.createElement);
const { useState } = React;

export function HomePage({ loading, data, onNavigateOutline, onToast }) {
  const [homeFocus, setHomeFocus] = useState(null);

  if (loading) return html`<${HomeSkeleton} />`;

  if (!data) {
    return html`
      <div className="px-0 pb-4 pt-4">
        <${EmptyState}
          title="暂无最新评估报告"
          desc="完成首次评估后，这里将展示你的结论、变化与训练建议。"
          actionText="去预约评估"
          onAction=${() => onToast("跳转：评估预约页")}
        />
      </div>
    `;
  }

  return html`
    <div className="space-y-3 px-0 pb-4 pt-2">
      <${ResultHero}
        user=${data.user}
        report=${data.latestReport}
        model3d=${data.model3d}
        subReports=${data.subReports}
        modelRegionSelected=${homeFocus === "model"}
        onModelRegionActivate=${() => setHomeFocus("model")}
        onViewFullReport=${() => onToast("跳转：完整报告页")}
        onOpenSubReport=${(r) => onToast(`跳转：${r?.name || "分项"}报告 ${r?.url || ""}`)}
      />
      <${HighlightsSection} highlights=${data.highlights} onOpenReport=${() => onToast("跳转：完整报告对应章节")} />
      <${TrendSection} trends=${data.trends} onOpenHistory=${() => onToast("跳转：评估记录页")} />
      <${NextActionSection}
        trainingEntry=${data.trainingEntry}
        nextStepsAdvice=${data.nextStepsAdviceWhenNoOutline}
        onStartTraining=${onNavigateOutline}
        selected=${homeFocus === "outline"}
        onActivate=${() => setHomeFocus("outline")}
      />
    </div>
  `;
}
