/* ---------- 共用 ---------- */
function SectionHeader({ title, extra }: { title: string; extra?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-3 px-1">
      <div className="flex items-center gap-1.5">
        <span className="w-1 h-4 rounded bg-sky-500" />
        <h3 className="text-[15px] font-semibold text-slate-800">{title}</h3>
      </div>
      {extra}
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(15,23,42,0.04)] p-4 ${className}`}>
      {children}
    </div>
  );
}

/* A. 双圈复古印章（优化版） */
function Stamp() {
  return (
    <div className="absolute top-3 right-3 w-[92px] h-[92px] pointer-events-none select-none">
      <div className="relative w-full h-full rotate-[-14deg]">
        {/* 外圈 */}
        <div className="absolute inset-0 rounded-full border-[2.5px] border-sky-500/80" />
        {/* 内圈 */}
        <div className="absolute inset-[6px] rounded-full border border-sky-500/50" />
        {/* 上下细弧装饰点 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full">
            <span className="absolute top-[10px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-sky-500/70" />
            <span className="absolute bottom-[10px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-sky-500/70" />
          </div>
        </div>
        {/* 文字 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sky-600 font-bold text-[15px] tracking-[0.15em] [text-shadow:0_0_1px_rgba(56,189,248,0.4)]">
            体重正常
          </span>
        </div>
        {/* 横划 */}
        <div className="absolute left-3 right-3 top-1/2 h-[1.5px] bg-sky-500/40 -translate-y-1/2 rotate-[-4deg]" />
      </div>
    </div>
  );
}

/* 指标小卡（5段进度条） */
function MetricMiniCard({
  icon, label, value, unit, badge, percent,
}: {
  icon: React.ReactNode; label: string; value: string; unit?: string;
  badge: string; percent: number;
}) {
  const seg = Math.min(4, Math.max(0, Math.round((percent / 100) * 5 - 0.5)));
  return (
    <div className="rounded-2xl bg-slate-50/80 p-3.5">
      <div className="flex items-center gap-1.5 text-[13px] text-slate-600">
        <span className="text-slate-500">{icon}</span>
        {label}
      </div>
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-baseline gap-0.5">
          <span className="text-[22px] font-bold text-slate-800 tabular-nums leading-none">{value}</span>
          {unit && <span className="text-[12px] text-slate-500">{unit}</span>}
        </div>
        <span className="text-[11px] text-white bg-sky-500 px-2 py-0.5 rounded-md font-medium">{badge}</span>
      </div>
      <div className="mt-3 flex gap-1">
        {[0,1,2,3,4].map((i) => (
          <div key={i} className={`flex-1 h-1.5 rounded-full ${i === seg ? "bg-sky-500" : "bg-slate-200/80"}`} />
        ))}
      </div>
      <div className="mt-1 flex justify-between text-[10.5px] text-slate-400">
        <span>低</span><span>高</span>
      </div>
    </div>
  );
}

/* 警示提示 */
function ClothingHint() {
  return (
    <div className="mt-3 flex items-center gap-1.5 text-[12px] text-amber-600">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
      由于您穿着衣物，测量数据可能存在一定的偏差
    </div>
  );
}

/* 跳转按钮 */
function DetailLink({ onClick }: { onClick?: () => void }) {
  return (
    <button onClick={onClick} className="text-[12px] text-slate-400 flex items-center gap-0.5 hover:text-sky-500 transition-colors">
      查看详情
      <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 6 15 12 9 18"/></svg>
    </button>
  );
}

/* ---------- 体围测量（图标 + 部位 + 数值） ---------- */
const GIRTH: { name: string; value: string; icon: React.ReactNode }[] = [
  { name: "头围", value: "56.0", icon: <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="9" r="5"/><path d="M7 14c-2 1.5-3 3.5-3 6h16c0-2.5-1-4.5-3-6"/></svg> },
  { name: "颈围", value: "35.2", icon: <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="6" r="3"/><path d="M8 11c-1 2-1 4 0 6h8c1-2 1-4 0-6"/><path d="M7 17l-2 3M17 17l2 3"/></svg> },
  { name: "胸围", value: "92.0", icon: <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M5 7c2-2 5-2 7 0 2-2 5-2 7 0v6c0 4-3 6-7 6s-7-2-7-6z"/></svg> },
  { name: "腰围", value: "76.4", icon: <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M7 4c-1 3-1 6 0 8 0 2-1 5 0 8M17 4c1 3 1 6 0 8 0 2 1 5 0 8"/><path d="M5 12h14"/></svg> },
  { name: "臀围", value: "94.1", icon: <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M6 4v6c-2 2-2 6 0 8 1 1 3 2 6 2s5-1 6-2c2-2 2-6 0-8V4"/><path d="M12 10v8"/></svg> },
  { name: "大腿", value: "52.0", icon: <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M8 3c0 4-1 8 0 12 0 3 1 5 2 6M16 3c0 4 1 8 0 12 0 3-1 5-2 6"/></svg> },
  { name: "小腿", value: "35.5", icon: <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M9 3c-1 4-2 8-1 12l1 6M15 3c1 4 2 8 1 12l-1 6"/></svg> },
];

/* ---------- 体型人体线稿 ---------- */
function BodyFigure() {
  return (
    <svg viewBox="0 0 80 160" className="w-[88px] h-[160px]" fill="none" stroke="rgb(148 163 184)" strokeWidth="1.5">
      <circle cx="40" cy="14" r="10" />
      <path d="M28 28 Q22 38 24 60 L24 92 Q26 100 30 100 L30 150" fill="rgb(186 230 253 / 0.5)" stroke="rgb(148 163 184)" />
      <path d="M52 28 Q58 38 56 60 L56 92 Q54 100 50 100 L50 150" fill="rgb(186 230 253 / 0.5)" stroke="rgb(148 163 184)" />
      <path d="M30 100 L30 150 M50 100 L50 150" />
      <path d="M40 100 L40 150" />
    </svg>
  );
}

/* ---------- 身体成分（方案A：单栏仪表盘列表） ---------- */
type CompRow = {
  label: string; value: string; unit: string;
  low: string; high: string; percent: number; // percent of bar (0~100)
};
const COMP_ROWS: CompRow[] = [
  { label: "体重",     value: "46.9", unit: "kg", low: "42.5", high: "57.4", percent: 42 },
  { label: "身体水分", value: "24.9", unit: "kg", low: "21.1", high: "28.1", percent: 45 },
  { label: "蛋白质",   value: "6.8",  unit: "kg", low: "6.0",  high: "8.0",  percent: 48 },
  { label: "无机盐",   value: "3.2",  unit: "kg", low: "2.5",  high: "3.5",  percent: 52 },
  { label: "体脂肪",   value: "10.4", unit: "kg", low: "9.4",  high: "14.1", percent: 40 },
  { label: "体脂率",   value: "22.1", unit: "%",  low: "18",   high: "28",   percent: 42 },
  { label: "BMI",      value: "18.8", unit: "",   low: "18.5", high: "24.0", percent: 32 },
  { label: "骨骼肌",   value: "17.5", unit: "kg", low: "15.4", high: "18.8", percent: 72 },
];

function CompMetricRow({ label, value, unit, low, high, percent }: CompRow) {
  const p = Math.min(98, Math.max(2, percent));
  const inNormal = p >= 33 && p <= 66;
  const status = p < 33 ? "偏低" : p > 66 ? "偏高" : "标准";
  const capsuleTone =
    inNormal ? "bg-sky-500 text-white"
    : p < 33 ? "bg-amber-400 text-white"
    : "bg-rose-400 text-white";
  return (
    <div className="py-4 first:pt-1 last:pb-1">
      {/* 标签 + 状态 + 大数值胶囊 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[14px] text-slate-700 font-medium">{label}</span>
          <span className={`text-[10.5px] px-1.5 py-0.5 rounded ${
            inNormal ? "bg-sky-50 text-sky-600"
            : p < 33 ? "bg-amber-50 text-amber-600"
            : "bg-rose-50 text-rose-500"
          }`}>{status}</span>
        </div>
        <div className={`inline-flex items-baseline gap-0.5 px-3 py-1 rounded-full ${capsuleTone}`}>
          <span className="text-[16px] font-bold tabular-nums leading-none">{value}</span>
          {unit && <span className="text-[11px] opacity-90">{unit}</span>}
        </div>
      </div>

      {/* 三色分段条 + 倒三角指示器 */}
      <div className="relative mt-3 px-0.5">
        <div className="flex h-2 rounded-full overflow-hidden">
          <div className="flex-1 bg-sky-200/80" />
          <div className="flex-1 bg-emerald-300/80" />
          <div className="flex-1 bg-rose-300/80" />
        </div>
        {/* 段间分隔白线 */}
        <div className="absolute top-0 left-1/3 w-px h-2 bg-white" />
        <div className="absolute top-0 left-2/3 w-px h-2 bg-white" />
        {/* 倒三角 */}
        <div className="absolute -top-1 -translate-x-1/2" style={{ left: `${p}%` }}>
          <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-l-transparent border-r-transparent border-t-slate-700" />
        </div>
      </div>

      {/* 下方标尺：低 / 标准区间 / 高 */}
      <div className="mt-2 grid grid-cols-3 text-[10.5px] text-slate-400">
        <span className="text-left">低</span>
        <span className="text-center tabular-nums text-slate-500">{low}~{high}{unit}</span>
        <span className="text-right">高</span>
      </div>
    </div>
  );
}

/* ---------- 主组件 ---------- */
export function OverviewReport({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  return (
    <div className="px-4 pt-4 space-y-4">
      {/* 体重健康评估 */}
      <div>
        <Card className="relative overflow-hidden">
          <div className="flex items-center gap-1 text-[13px] text-slate-600">
            体重健康评估
            <span className="inline-flex w-3.5 h-3.5 rounded-full border border-slate-300 items-center justify-center text-[9px] text-slate-400">?</span>
          </div>
          <div className="mt-2 flex items-baseline">
            <span className="text-[44px] font-bold text-slate-800 leading-none tabular-nums">46.9</span>
            <span className="ml-1 text-[14px] text-slate-400">kg</span>
          </div>
          <Stamp />

          <div className="mt-4 grid grid-cols-2 gap-3">
            <MetricMiniCard
              icon={<svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="9" width="18" height="6" rx="1"/><path d="M7 9v6M11 9v6M15 9v6M19 9v6"/></svg>}
              label="体脂率" value="22.1" unit="%" badge="标准" percent={42}
            />
            <MetricMiniCard
              icon={<span className="text-[11px] font-bold text-slate-500">BMI</span>}
              label="BMI" value="18.8" badge="标准" percent={32}
            />
            <MetricMiniCard
              icon={<svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6c4 3 8 3 12 0M6 18c4-3 8-3 12 0M6 6v12M18 6v12"/></svg>}
              label="腰围" value="75.9" unit="cm" badge="标准" percent={55}
            />
            <MetricMiniCard
              icon={<svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 4c-2 4-2 8 0 12M16 4c2 4 2 8 0 12M8 16h8v4H8z"/></svg>}
              label="腰臀比例" value="0.83" badge="标准" percent={58}
            />
          </div>

          <ClothingHint />
        </Card>
      </div>

      {/* 体型体态 */}
      <div>
        <Card>
          <div className="flex items-center justify-between">
            <h3 className="text-[16px] font-bold text-slate-800">体型体态</h3>
            <DetailLink onClick={() => onNavigate?.("体态评估")} />
          </div>
          <div className="mt-3 grid grid-cols-[100px_1fr] gap-3">
            <div className="flex items-end justify-center">
              <BodyFigure />
            </div>
            <div>
              <p className="text-[13px] text-slate-700 leading-relaxed">
                您属于 H 型身材。<br />
                上下身的宽度大致相当，身体曲线感不明显。穿搭上要制造身体曲线，突出展现纤长的四肢。
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {["轻度圆肩","H型","骨盆后倾","平臀","平肩"].map((t) => (
                  <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-50 text-[12px] text-slate-600">
                    <span className="w-1 h-1 rounded-full bg-amber-500" />{t}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <ClothingHint />
        </Card>
      </div>

      {/* 体围测量值 */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-1.5">
            <span className="w-1 h-4 rounded bg-sky-500" />
            <h3 className="text-[15px] font-semibold text-slate-800">体围测量值</h3>
            <span className="text-[12px] text-slate-400">(单位：cm)</span>
          </div>
          <DetailLink onClick={() => onNavigate?.("体围测量")} />
        </div>
        <Card>
          <div className="divide-y divide-slate-50">
            {GIRTH.map((g) => (
              <div key={g.name} className="grid grid-cols-[36px_1fr_auto] items-center py-3">
                <span className="w-9 h-9 rounded-xl bg-sky-50 text-sky-500 flex items-center justify-center">
                  {g.icon}
                </span>
                <span className="text-[14px] text-slate-700 ml-1">{g.name}</span>
                <span className="text-[15px] font-semibold text-slate-800 tabular-nums">
                  {g.value}<span className="text-[12px] text-slate-400 font-normal ml-0.5">cm</span>
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 身体成分 */}
      <div>
        <SectionHeader
          title="身体成分"
          extra={<DetailLink onClick={() => onNavigate?.("身体成分")} />}
        />
        <Card>
          <div className="divide-y divide-slate-100">
            {COMP_ROWS.map((r) => (
              <CompMetricRow key={r.label} {...r} />
            ))}
          </div>
        </Card>
      </div>

      {/* 推荐枕头 */}
      <div>
        <SectionHeader title="推荐枕头" />
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white border border-slate-100 p-3.5">
            <div className="text-[12px] text-slate-500 flex items-center gap-1">🛌 已匹配枕型</div>
            <div className="mt-1.5 text-[15px] font-semibold text-slate-800">颈托 · 中等支撑</div>
          </div>
          <div className="rounded-2xl bg-white border border-slate-100 p-3.5">
            <div className="text-[12px] text-slate-500 flex items-center gap-1">📏 推荐枕高</div>
            <div className="mt-1.5 text-[15px] font-semibold text-sky-600 tabular-nums">9 / 10 cm</div>
          </div>
        </div>
        <p className="mt-3 text-[12px] text-slate-500 leading-relaxed px-1">
          ℹ 推荐基于您的颈椎曲度、单侧肩宽与睡姿习惯，综合给出枕高与枕型建议。
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <button onClick={() => onNavigate?.("枕型智配")} className="rounded-full bg-sky-500 text-white text-[13px] py-2.5 shadow-[0_6px_16px_rgba(56,189,248,0.35)]">查看枕型方案</button>
          <button onClick={() => onNavigate?.("床垫智配")} className="rounded-full bg-white border border-sky-200 text-sky-600 text-[13px] py-2.5">查看床垫方案</button>
        </div>
      </div>
    </div>
  );
}
