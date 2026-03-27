import React from "https://esm.sh/react@18.3.1";
import htm from "https://esm.sh/htm@3.1.1";
import { ResultHero } from "../components/home/ResultHero.js";
import { HighlightsSection } from "../components/home/HighlightsSection.js";
import { SubReportsSection } from "../components/home/SubReportsSection.js";
import { TrendSection } from "../components/home/TrendSection.js";
import { NextActionSection } from "../components/home/NextActionSection.js";
import { HomeSkeleton } from "../components/common/Skeleton.js";
import { EmptyState } from "../components/common/EmptyState.js";

const html = htm.bind(React.createElement);
const { useState } = React;

export function HomePage({ loading, data, onNavigateOutline, onToast }) {
  const [expandedSubReportId, setExpandedSubReportId] = useState(null);
  const [expandedActionId, setExpandedActionId] = useState(null);

  if (loading) return html`<${HomeSkeleton} />`;

  if (!data) {
    return html`
      <div className="px-4 pt-4">
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
    <div className="space-y-3 px-4 pb-24 pt-4">
      ${data.dataQuality?.hasConflict &&
      html`
        <div className="rounded-card border border-fxOrange/20 bg-fxOrange/10 p-3 text-xs text-fxSub">
          数据冲突已自动降级处理：${(data.dataQuality.conflictNotes || []).join("；")}
        </div>
      `}
      <${ResultHero}
        user=${data.user}
        report=${data.latestReport}
        model3d=${data.model3d}
        onViewModel=${() => onToast("跳转：3D 模型详情")}
      />
      <${HighlightsSection} highlights=${data.highlights} onOpenReport=${() => onToast("跳转：分报告详情")} />
      <${SubReportsSection}
        reports=${data.subReports}
        expandedId=${expandedSubReportId}
        onToggle=${(id) => setExpandedSubReportId(expandedSubReportId === id ? null : id)}
        onOpenReport=${() => onToast("跳转：分报告详情")}
      />
      <${TrendSection} trends=${data.trends} onOpenHistory=${() => onToast("跳转：评估记录页")} />
      <${NextActionSection}
        trainingEntry=${data.trainingEntry}
        nextActions=${data.nextActions}
        expandedId=${expandedActionId}
        onToggle=${(id) => setExpandedActionId(expandedActionId === id ? null : id)}
        onStartTraining=${onNavigateOutline}
        onOpenAction=${() => onToast("跳转：建议详情页")}
      />
    </div>
  `;
}
