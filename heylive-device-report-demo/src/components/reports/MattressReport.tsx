import spineVisualization from "@/assets/mattress-spine-visualization.jpg";
import pressureSupine from "@/assets/mattress-pressure-supine.png";
import { MattressRecommendation } from "./MattressRecommendation";

/* ---------- 小标题 ---------- */
function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 mt-5 mb-3 px-1">
      <span
        aria-hidden="true"
        className="h-5 w-5 shrink-0 rounded-full border-[5px] border-white bg-[#d9efff] shadow-[0_1px_3px_rgba(84,132,180,0.08)]"
      />
      <span className="sr-only">{icon}</span>
      <h2 className="text-[16px] font-semibold text-slate-800">{title}</h2>
    </div>
  );
}

function SubHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex items-center gap-1.5 mt-1 mb-3 px-1 text-[13px] text-slate-500">
      <span>{icon}</span>
      <span>{title}</span>
    </div>
  );
}

/* ---------- 问卷信息 单卡 ---------- */
function SurveyCard({
  icon,
  iconBg,
  title,
  value,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-white border border-slate-100 shadow-[0_4px_16px_rgba(15,23,42,0.04)] p-4 flex flex-col items-center">
      <div className="flex items-center gap-2 self-start">
        <span
          className={`w-7 h-7 rounded-lg ${iconBg} flex items-center justify-center text-white`}
        >
          {icon}
        </span>
        <span className="text-[14px] text-slate-700">{title}</span>
      </div>
      <div className="mt-3 pt-3 w-full border-t border-dashed border-slate-100 text-center text-[15px] text-sky-600 font-medium">
        {value}
      </div>
    </div>
  );
}
/* ---------- AI 选床助手 单卡 ---------- */
function AICard({
  icon,
  title,
  value,
  gradient,
}: {
  icon: string;
  title: string;
  value: string;
  gradient: string;
}) {
  return (
    <div className="rounded-2xl overflow-hidden border border-slate-100 bg-white">
      <div className={`px-3 py-2 text-white text-[13px] flex items-center gap-1.5 ${gradient}`}>
        <span>{icon}</span> {title}
      </div>
      <div className="p-3">
        <div className="rounded-lg bg-slate-50 py-2.5 text-center text-slate-700 text-[15px]">
          {value}
        </div>
      </div>
    </div>
  );
}

/* ---------- 三段渐变滑块 ---------- */
function GradientSlider({
  min,
  max,
  value,
  label,
  tone = "green",
}: {
  min: number;
  max: number;
  value: number;
  label: string;
  tone?: "green" | "blue";
}) {
  const pct = ((value - min) / (max - min)) * 100;
  const bg =
    tone === "green"
      ? "from-emerald-300 via-amber-200 to-rose-300"
      : "from-sky-300 via-emerald-300 to-rose-300";
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_16px_rgba(15,23,42,0.04)] p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[14px] font-medium text-slate-700">{label}</span>
      </div>
      <div className="grid grid-cols-[40px_1fr_60px] items-center gap-3">
        <span className="text-[12px] text-slate-400">{min}</span>
        <div className="relative h-2.5">
          <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${bg}`} />
          <div
            className="absolute -top-5 -translate-x-1/2 text-[12px] font-semibold text-slate-700 tabular-nums"
            style={{ left: `${pct}%` }}
          >
            {value}
          </div>
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-sky-500 shadow"
            style={{ left: `${pct}%` }}
          />
        </div>
        <span className="text-[12px] text-emerald-600 text-right">
          <span className="tabular-nums font-semibold mr-1">{value}</span>
          {tone === "green" ? "中间偏" : "贴合"}
        </span>
      </div>
    </div>
  );
}

/* ---------- 床垫硬度定制 - 分区柱状 ---------- */
const ZONES = [
  { name: "头部", v: 4 },
  { name: "肩部", v: 3 },
  { name: "背部", v: 5 },
  { name: "腰部", v: 6 },
  { name: "臀部", v: 6 },
  { name: "大腿", v: 5 },
  { name: "小腿", v: 4 },
];

function ZoneTable() {
  const max = 10;
  return (
    <div className="rounded-xl border border-slate-100 overflow-hidden">
      <div className="grid grid-cols-[64px_repeat(7,1fr)] text-[12px] text-slate-600">
        <div className="bg-slate-50 px-2 py-2 border-b border-slate-100">分区</div>
        {ZONES.map((z) => (
          <div
            key={`zone-label-${z.name}`}
            className="bg-slate-50 px-1 py-2 text-center border-b border-l border-slate-100"
          >
            {z.name}
          </div>
        ))}

        <div className="bg-white px-2 py-2 border-b border-slate-100 text-slate-500 leading-tight">
          支撑
          <br />
          硬度
        </div>
        {ZONES.map((z) => (
          <div
            key={`zone-bar-${z.name}`}
            className="bg-white border-b border-l border-slate-100 flex items-end justify-center py-2 h-20"
          >
            <div
              className="w-3.5 rounded-t bg-gradient-to-t from-sky-500 to-sky-300"
              style={{ height: `${(z.v / max) * 100}%` }}
            />
          </div>
        ))}

        <div className="bg-white px-2 py-2 text-slate-500 leading-tight">
          硬度
          <br />
          等级
        </div>
        {ZONES.map((z) => (
          <div
            key={`zone-value-${z.name}`}
            className="bg-white border-l border-slate-100 text-center py-2 text-[13px] text-slate-800 tabular-nums"
          >
            {z.v}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- 主组件 ---------- */
export function MattressReport() {
  return (
    <div className="px-4 pt-4">
      {/* 脊柱结构可视化 */}
      <SectionHeader
        icon={
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="5" width="18" height="12" rx="2" />
            <path d="M8 21h8" />
          </svg>
        }
        title="脊柱结构可视化"
      />
      <div className="w-full overflow-hidden rounded-2xl border border-[#e7eef7] bg-[#f0f3f8]">
        <img src={spineVisualization} alt="彩色脊柱结构可视化" className="block h-auto w-full" />
      </div>

      {/* 客户情况 */}
      <SectionHeader
        icon={
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="4" y="3" width="16" height="18" rx="2" />
            <path d="M8 7h8M8 11h8M8 15h5" />
          </svg>
        }
        title="客户情况"
      />
      <SubHeader icon="📝" title="问卷信息" />
      <div className="grid grid-cols-2 gap-3">
        <SurveyCard
          icon={
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 17h18M5 17V9a4 4 0 014-4h6a4 4 0 014 4v8" />
            </svg>
          }
          iconBg="bg-sky-400"
          title="主睡姿"
          value="侧卧"
        />
        <SurveyCard
          icon={
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="8" width="18" height="9" rx="2" />
            </svg>
          }
          iconBg="bg-sky-400"
          title="床垫硬度"
          value="软"
        />
        <SurveyCard
          icon={
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 4c4 4 8 4 12 0M6 20c4-4 8-4 12 0" />
            </svg>
          }
          iconBg="bg-sky-400"
          title="颈椎曲度"
          value="正常"
        />
        <SurveyCard
          icon={
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 13A9 9 0 0111 3a7 7 0 1010 10z" />
            </svg>
          }
          iconBg="bg-indigo-400"
          title="睡眠问题"
          value="入睡困难"
        />
      </div>

      {/* AI 选床助手 */}
      <SectionHeader icon={<span className="text-[14px]">✨</span>} title="AI选床助手" />
      <div className="grid grid-cols-2 gap-3">
        <AICard
          icon="♂"
          title="性别"
          value="男"
          gradient="bg-gradient-to-r from-sky-400 to-blue-500"
        />
        <AICard
          icon="📘"
          title="BMI"
          value="18.8"
          gradient="bg-gradient-to-r from-purple-400 to-indigo-500"
        />
        <AICard
          icon="↑"
          title="身材"
          value="A型身材"
          gradient="bg-gradient-to-r from-teal-400 to-cyan-500"
        />
        <AICard
          icon="↑"
          title="胸椎"
          value="轻度异常"
          gradient="bg-gradient-to-r from-teal-400 to-cyan-500"
        />
      </div>
      <div className="mt-3">
        <div className="rounded-2xl overflow-hidden border border-slate-100 bg-white">
          <div className="px-3 py-2 text-white text-[13px] flex items-center gap-1.5 bg-gradient-to-r from-teal-400 to-cyan-500">
            <span>↑</span> 腰椎
          </div>
          <div className="p-3">
            <div className="rounded-lg bg-slate-50 py-2.5 text-center text-slate-700 text-[15px]">
              轻度异常
            </div>
          </div>
        </div>
      </div>

      {/* 滑块两个 */}
      <div className="mt-4 space-y-3">
        <GradientSlider label="建议床垫软硬度（1~10）" min={1} max={10} value={5} tone="green" />
        <GradientSlider label="建议床垫贴合度（1~5）" min={1} max={5} value={4} tone="blue" />
      </div>

      {/* 床垫硬度定制 */}
      <SectionHeader icon={<span className="text-[14px]">🛏</span>} title="床垫硬度定制" />
      <div className="rounded-2xl bg-white border border-slate-100 p-4 shadow-[0_4px_16px_rgba(15,23,42,0.04)]">
        <div className="mb-4 overflow-hidden rounded-xl bg-black">
          <img
            src={pressureSupine}
            alt="仰卧人体分区压力分布"
            className="block h-auto w-full object-contain"
          />
        </div>
        <ZoneTable />
      </div>

      <MattressRecommendation />

      <p className="mt-4 text-[12px] text-slate-400 leading-relaxed px-1">
        本报告仅针对人体体表信息进行分析。床垫分区硬度推荐基于体态评估和身体成分数据。硬度值范围
        1（最硬）~ 10（最软）。实际生产中可视乳胶 / 记忆棉等材质特性 ±1 级浮动。
      </p>
    </div>
  );
}
