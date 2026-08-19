import { useRef, useState } from "react";
import hero3d from "@/assets/posture/hero-3d.png";
import shoulderBackAsset from "@/assets/posture/shoulder-back.png";
import upperSideAsset from "@/assets/posture/upper-side.png";
import miniPlaceholder from "@/assets/posture/mini-leg-knee.svg";

/* ============ 3D 旋转人体模型（与体态评估一致） ============ */
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
  const [view, setView] = useState("正面视察");
  return (
    <div className="relative w-full h-[360px] bg-white overflow-hidden rounded-2xl border border-slate-100">
      <Model3D />

      <div className="absolute left-3 top-4 flex flex-col gap-3 z-10">
        <button className="w-9 h-9 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center text-slate-500">
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
        </button>
      </div>

      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2.5 z-10">
        {["正面视察", "背面视察", "侧面视察"].map((label) => (
          <button
            key={label}
            onClick={() => setView(label)}
            className={`px-3 py-1.5 text-[12px] rounded-full border shadow-sm ${view === label ? "bg-sky-500 text-white border-sky-500" : "bg-white text-slate-600 border-slate-200"}`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

/** 三态滑块（红 - 蓝 - 红），中点为标准 */
function TriSlider({
  position = "center",
  labels,
}: {
  position?: "left" | "center" | "right";
  labels: [string, string, string];
}) {
  const left = position === "left" ? "8%" : position === "right" ? "92%" : "50%";
  return (
    <div className="px-2">
      <div className="relative h-1.5 rounded-full overflow-hidden flex">
        <div className="flex-1 bg-rose-400" />
        <div className="flex-1 bg-sky-500" />
        <div className="flex-1 bg-rose-400" />
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-sky-500 shadow"
          style={{ left }}
        />
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-slate-500">
        <span>{labels[0]}</span>
        <span className="text-sky-600 font-medium">{labels[1]}</span>
        <span>{labels[2]}</span>
      </div>
    </div>
  );
}

/** 三联线稿身体示意图：复用体态评估中的占位图 */
function TriSilhouette() {
  return (
    <div className="grid grid-cols-3 gap-3 px-3 h-[110px]">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center justify-center">
          <img
            src={miniPlaceholder}
            alt=""
            className="h-full w-auto object-contain"
            style={
              i === 1 ? { filter: "hue-rotate(140deg) saturate(2.2) brightness(0.95)" } : undefined
            }
          />
        </div>
      ))}
    </div>
  );
}

/** 综合健康评估表格 */
function EvalTable({ rows }: { rows: { item: string; tendency: string; status: string }[] }) {
  return (
    <div className="rounded-xl overflow-hidden border border-sky-100 bg-white">
      <div className="grid grid-cols-3 bg-sky-50 text-[12px] text-slate-500">
        <div className="py-2 text-center">评估项目</div>
        <div className="py-2 text-center">倾向性</div>
        <div className="py-2 text-center">状态</div>
      </div>
      {rows.map((r, i) => (
        <div
          key={r.item}
          className={`grid grid-cols-3 text-[13px] text-slate-700 ${i > 0 ? "border-t border-sky-50" : ""}`}
        >
          <div className="py-2.5 text-center">{r.item}</div>
          <div className="py-2.5 text-center text-slate-500">{r.tendency}</div>
          <div className="py-2.5 text-center text-sky-600 font-medium">{r.status}</div>
        </div>
      ))}
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_rgba(15,23,42,0.04)] border border-slate-100">
      <div className="flex items-center gap-1.5 mb-3">
        <span className="w-1 h-4 rounded bg-sky-500"></span>
        <h3 className="text-[15px] font-semibold text-slate-800">{title}</h3>
        <span className="text-slate-300 text-xs">ⓘ</span>
      </div>
      {children}
    </div>
  );
}

function Analysis({
  title,
  labels,
  position,
}: {
  title: string;
  labels: [string, string, string];
  position?: "left" | "center" | "right";
}) {
  return (
    <div className="mt-4">
      <div className="text-center text-[13px] text-slate-700 mb-2">{title}</div>
      <TriSilhouette />
      <div className="mt-3">
        <TriSlider position={position} labels={labels} />
      </div>
    </div>
  );
}

export function SpineReport() {
  return (
    <div className="px-4 pt-4 space-y-4">
      {/* 3D 模型 Hero */}
      <Hero />

      {/* 提示 banner */}
      <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5">
        <span className="w-5 h-5 rounded-full bg-amber-400 text-white text-[12px] font-bold flex items-center justify-center flex-none">
          !
        </span>
        <span className="text-[12.5px] text-amber-700">由于您穿着衣物，本次测量仅作为参考使用</span>
      </div>

      {/* 脊柱综合健康评估 */}
      <div className="relative bg-white rounded-2xl p-4 shadow-[0_4px_20px_rgba(15,23,42,0.04)] border border-slate-100 overflow-hidden">
        <div className="absolute top-3 right-3 flex flex-col items-center">
          <div className="w-14 h-14 rounded-full border-2 border-dashed border-emerald-300 flex items-center justify-center bg-emerald-50">
            <span className="text-[12px] font-semibold text-emerald-600">低风险</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 mb-3">
          <span className="w-1 h-4 rounded bg-sky-500"></span>
          <h3 className="text-[15px] font-semibold text-slate-800">脊柱综合健康评估</h3>
          <span className="text-slate-300 text-xs">ⓘ</span>
        </div>

        <div className="text-[13px] font-medium text-slate-700 mb-2 mt-2">脊柱背面评估</div>
        <EvalTable
          rows={[
            { item: "软组织", tendency: "标准", status: "标准" },
            { item: "胸型平衡", tendency: "标准", status: "标准" },
            { item: "身体重心(左右)", tendency: "标准", status: "标准" },
          ]}
        />

        <div className="text-[13px] font-medium text-slate-700 mb-2 mt-4">脊柱侧面评估</div>
        <EvalTable
          rows={[
            { item: "软组织", tendency: "标准", status: "标准" },
            { item: "胸椎曲度", tendency: "标准", status: "标准" },
            { item: "身体重心(前后)", tendency: "标准", status: "标准" },
          ]}
        />
      </div>

      {/* 脊柱背面分析 */}
      <Card title="脊柱背面分析">
        <div className="bg-slate-50 rounded-xl flex items-center justify-center py-2">
          <img src={shoulderBackAsset} alt="脊柱背面" className="max-h-44 object-contain" />
        </div>
        <Analysis title="肩部平衡" labels={["左高右低", "标准", "左低右高"]} position="center" />
        <Analysis title="骨盆平衡" labels={["左高右低", "标准", "左低右高"]} position="center" />
      </Card>

      {/* 脊柱侧面分析 */}
      <Card title="脊柱侧面分析">
        <div className="bg-slate-50 rounded-xl flex items-center justify-center py-2">
          <img src={upperSideAsset} alt="脊柱侧面" className="max-h-48 object-contain" />
        </div>
        <Analysis title="颈椎曲度" labels={["后倾", "标准", "前倾"]} position="center" />
        <Analysis title="腰椎曲度" labels={["后倾", "标准", "前倾"]} position="center" />
      </Card>

      <p className="text-[11px] text-slate-400 text-center leading-relaxed pt-1 pb-2">
        本报告由人体姿态扫描测得的分段数据生成，仅供作为参考，不可作为医学诊断使用。
      </p>
    </div>
  );
}
