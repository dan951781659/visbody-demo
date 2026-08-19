import { createFileRoute } from "@tanstack/react-router";
import { BaseReport } from "@/components/reports/BaseReport";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "好奈 AI 睡眠专家分析报告" },
      { name: "description", content: "HEYLIVE 好奈个性化枕头与床垫推荐报告" },
    ],
  }),
  component: ReportPage,
});

function ReportPage() {
  return (
    <div className="min-h-screen bg-background">
      <BaseReport />
    </div>
  );
}
