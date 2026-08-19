import { useRef, useState } from "react";
import hero3d from "@/assets/posture/hero-3d.png";

/* 3D 旋转人体模型 */
function Model3D() {
  const [angle, setAngle] = useState(0);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startAngle = useRef(0);

  const onDown = (e: React.PointerEvent) => {
    dragging.current = true;
    startX.current = e.clientX;
    startAngle.current = angle;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    setAngle(startAngle.current + (e.clientX - startX.current) * 0.6);
  };
  const onUp = () => {
    dragging.current = false;
  };

  return (
    <div
      className="absolute inset-0 flex items-center justify-center select-none touch-none cursor-grab active:cursor-grabbing"
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      <div
        style={{
          height: 320,
          transformStyle: "preserve-3d",
          transform: `rotateY(${angle}deg)`,
          transition: dragging.current ? "none" : "transform 0.4s ease",
        }}
      >
        <img
          src={hero3d}
          alt="3D 人体模型"
          draggable={false}
          className="h-full w-auto object-contain drop-shadow-[0_10px_18px_rgba(120,140,180,0.35)] pointer-events-none"
        />
      </div>
    </div>
  );
}

function Hero() {
  return (
    <div className="relative w-full h-[360px] bg-gradient-to-b from-sky-50 to-white overflow-hidden rounded-2xl border border-slate-100">
      <Model3D />
      <div className="absolute left-3 top-4 z-10">
        <button className="w-11 h-11 rounded-full bg-white shadow-md border border-slate-200 flex flex-col items-center justify-center text-slate-500">
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="8" r="3.5" />
            <path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5" />
          </svg>
          <span className="text-[10px] mt-0.5">我的</span>
        </button>
      </div>
      <div className="absolute right-3 bottom-4 z-10 inline-flex rounded-full bg-sky-500 text-white shadow px-3 py-1.5 text-[12px]">
        扫描模型
      </div>
    </div>
  );
}

/* ---------- 分段进度条 ----------
   背景三段：低标准（蓝）/ 正常（绿）/ 超标准（红），均为浅色
   填充条：蓝色实色，宽度按 percent (0-100) */
function SegmentedBar({ value, unit, percent }: { value: string; unit: string; percent: number }) {
  const clamped = Math.min(98, Math.max(2, percent));
  return (
    <div className="relative h-2.5 rounded-full overflow-hidden flex">
      <div className="flex-1 bg-sky-100/70" />
      <div className="flex-1 bg-emerald-100/70" />
      <div className="flex-1 bg-rose-100/70" />
      {/* 填充 */}
      <div
        className="absolute left-0 top-0 h-full bg-sky-500 rounded-full"
        style={{ width: `${clamped}%` }}
      />
      {/* 数值气泡 */}
      <div
        className="absolute -top-5 -translate-x-1/2 text-[11px] font-semibold text-sky-600 whitespace-nowrap"
        style={{ left: `${clamped}%` }}
      >
        {value}
        {unit}
      </div>
    </div>
  );
}

function BarRow({
  label,
  value,
  unit,
  range,
  percent,
}: {
  label: string;
  value: string;
  unit: string;
  range: string;
  percent: number;
}) {
  return (
    <div className="grid grid-cols-[64px_1fr_84px] items-center gap-3 py-3">
      <span className="text-[13px] text-slate-700">{label}</span>
      <div className="pt-4">
        <SegmentedBar value={value} unit={unit} percent={percent} />
      </div>
      <span className="text-[12px] text-slate-500 text-right tabular-nums">{range}</span>
    </div>
  );
}

/* 三段表头：低标准 / 正常 / 超标准 */
function SegmentHeader({ unit = "kg" }: { unit?: string }) {
  return (
    <div className="grid grid-cols-[64px_1fr_84px] items-center gap-3 mb-1">
      <span className="text-[12px] text-slate-400">部位</span>
      <div className="flex h-6 rounded overflow-hidden text-[11px]">
        <div className="flex-1 bg-sky-100/70 text-sky-600 flex items-center justify-center">
          低标准
        </div>
        <div className="flex-1 bg-emerald-100/70 text-emerald-600 flex items-center justify-center">
          正常
        </div>
        <div className="flex-1 bg-rose-100/70 text-rose-500 flex items-center justify-center">
          超标准
        </div>
      </div>
      <span className="text-[12px] text-slate-400 text-right">标准区间</span>
    </div>
  );
}

function SectionHeader({ title, unit }: { title: string; unit?: string }) {
  return (
    <div className="flex items-center justify-between mb-3 px-1">
      <div className="flex items-center gap-1.5">
        <span className="w-1 h-4 rounded bg-sky-500" />
        <h3 className="text-[15px] font-semibold text-slate-800">{title}</h3>
      </div>
      {unit && <span className="text-[12px] text-slate-400">单位：{unit}</span>}
    </div>
  );
}

function Definitions({ items }: { items: { term: string; desc: string }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-3 pt-3 border-t border-slate-100">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between text-[13px] text-slate-600"
      >
        <span>指标定义说明</span>
        <span className="flex items-center gap-1 text-slate-400">
          {open ? "收起" : "展开"}
          <svg
            viewBox="0 0 24 24"
            className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>
      {open && (
        <ul className="mt-2 space-y-1.5">
          {items.map((it) => (
            <li key={it.term} className="text-[12px] text-slate-500 leading-relaxed">
              <span className="text-slate-700 font-medium">· {it.term}：</span>
              {it.desc}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(15,23,42,0.04)] p-4">
      {children}
    </div>
  );
}

/* 体重正常 印章 */
function Stamp() {
  return (
    <div className="absolute -top-1 right-2 w-[110px] h-[110px] flex items-center justify-center pointer-events-none select-none">
      <div className="relative w-full h-full rounded-full border-2 border-sky-400/70 flex items-center justify-center rotate-[-12deg] opacity-90">
        <div className="absolute inset-1.5 rounded-full border border-sky-400/50" />
        <div className="absolute left-2 right-2 h-[2px] bg-sky-400/70 rotate-[-6deg]" />
        <span className="relative px-2 py-0.5 text-sky-500 font-bold text-[14px] bg-white/0">
          体重正常
        </span>
      </div>
    </div>
  );
}

export function BodyCompositionReport() {
  return (
    <div className="px-4 pt-4 space-y-4">
      <Hero />

      {/* 身体成分总览 —— 按参考图实现 */}
      <div>
        <SectionHeader title="身体成分总览" />
        <div className="relative bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(15,23,42,0.04)] p-4 overflow-hidden">
          {/* 顶部：体重 + 印章 */}
          <div className="relative">
            <div className="flex items-center gap-1 text-[12px] text-slate-500">
              体重
              <span className="inline-flex w-3.5 h-3.5 rounded-full border border-slate-300 items-center justify-center text-[9px] text-slate-400">
                ?
              </span>
            </div>
            <div className="mt-1 flex items-baseline">
              <span className="text-[44px] font-bold text-slate-800 leading-none tabular-nums">
                46.9
              </span>
              <span className="ml-1 text-[14px] text-slate-400">kg</span>
            </div>
            <Stamp />
          </div>

          {/* 下方：左侧两小卡 + 右侧明细列表 */}
          <div className="mt-4 grid grid-cols-[88px_1fr] gap-3">
            <div className="space-y-3">
              <div className="rounded-xl bg-sky-50/70 px-3 py-2.5">
                <div className="text-[11px] text-slate-500">体脂率</div>
                <div className="text-[20px] font-bold text-slate-800 tabular-nums leading-tight">
                  22.1<span className="text-[12px] font-medium text-slate-400">%</span>
                </div>
                <div className="text-[10.5px] text-slate-400">标准</div>
              </div>
              <div className="rounded-xl bg-sky-50/70 px-3 py-2.5">
                <div className="text-[11px] text-slate-500">BMI</div>
                <div className="text-[20px] font-bold text-slate-800 tabular-nums leading-tight">
                  18.8
                </div>
                <div className="text-[10.5px] text-slate-400">标准</div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-100 divide-y divide-slate-100 text-[13px]">
              {[
                ["当前体重", "46.9kg"],
                ["目标体重", "52.3kg", true],
                ["体重控制", "5.4kg"],
                ["脂肪控制", "1.4kg"],
                ["肌肉控制", "4kg"],
                ["基础代谢", "1088.0kcal/d"],
                ["身体年龄", "18.0岁"],
              ].map(([k, v, hint]) => (
                <div key={k as string} className="flex items-center justify-between px-3 py-2">
                  <span className="flex items-center gap-1 text-slate-600">
                    {k}
                    {hint && (
                      <span className="inline-flex w-3.5 h-3.5 rounded-full border border-slate-300 items-center justify-center text-[9px] text-slate-400">
                        ?
                      </span>
                    )}
                  </span>
                  <span className="text-slate-800 tabular-nums">{v as string}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 身体成分分析 */}
      <div>
        <SectionHeader title="身体成分分析" unit="kg" />
        <Card>
          <SegmentHeader />
          <BarRow label="水分" value="24.9" unit="kg" range="21.1~28.1" percent={45} />
          <BarRow label="蛋白质" value="6.8" unit="kg" range="6.0~8.0" percent={48} />
          <BarRow label="无机盐" value="3.2" unit="kg" range="2.5~3.5" percent={52} />
          <BarRow label="体脂重量" value="10.4" unit="kg" range="9.4~14.1" percent={40} />
          <Definitions
            items={[
              { term: "水分", desc: "人体组织中水的总量，反映机体水合状态。" },
              { term: "蛋白质", desc: "构成肌肉与器官的主要成分，维持细胞结构与功能。" },
              { term: "无机盐", desc: "骨骼和体液中的矿物质，参与代谢与神经传导。" },
              { term: "体脂重量", desc: "身体脂肪的总重量，包括皮下与内脏脂肪。" },
            ]}
          />
        </Card>
      </div>

      {/* 肌肉脂肪分析 */}
      <div>
        <SectionHeader title="肌肉脂肪分析" unit="kg" />
        <Card>
          <SegmentHeader />
          <BarRow label="体重" value="46.9" unit="kg" range="42.0~56.7" percent={48} />
          <BarRow label="骨骼肌量" value="17.5" unit="kg" range="15.4~18.8" percent={72} />
          <BarRow label="体脂重量" value="10.4" unit="kg" range="9.4~14.1" percent={40} />
          <div className="mt-3 rounded-lg bg-sky-50/70 px-3 py-2 text-[12px] text-slate-600 leading-relaxed">
            💡 <span className="font-medium text-slate-700">体脂肪重量</span>
            ：身体脂肪总量，过低或过高都不利于健康，建议保持在标准区间。
          </div>
          <Definitions
            items={[
              { term: "体重", desc: "身体的总质量，包含水分、肌肉、脂肪与骨骼等。" },
              { term: "骨骼肌量", desc: "附着于骨骼的肌肉总量，是力量与代谢的关键指标。" },
              { term: "体脂重量", desc: "身体脂肪的总重量，反映能量储存水平。" },
            ]}
          />
        </Card>
      </div>

      {/* 肥胖分析 */}
      <div>
        <SectionHeader title="肥胖分析" />
        <Card>
          <SegmentHeader />
          <BarRow label="BMI" value="18.8" unit="" range="18.5~24.0" percent={35} />
          <BarRow label="体脂率" value="22.1" unit="%" range="18~28" percent={48} />
          <BarRow label="内脏脂肪" value="1.2" unit="" range="1~9" percent={18} />
          <Definitions
            items={[
              { term: "BMI", desc: "体质指数，体重(kg) / 身高(m)²，用于评估总体胖瘦。" },
              { term: "体脂率", desc: "脂肪重量占体重的百分比，反映身体组成。" },
              { term: "内脏脂肪", desc: "包裹腹部脏器周围的脂肪，过高会增加代谢疾病风险。" },
            ]}
          />
        </Card>
      </div>
    </div>
  );
}
