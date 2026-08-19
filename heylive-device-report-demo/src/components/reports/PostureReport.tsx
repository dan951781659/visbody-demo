import { useRef, useState } from "react";
import hero3d from "@/assets/posture/hero-3d.png";
import upperSideImg from "@/assets/posture/upper-side.png";
import shoulderBackImg from "@/assets/posture/shoulder-back.png";
import lowerSideImg from "@/assets/posture/lower-side.png";
import lowerBackImg from "@/assets/posture/lower-back.png";
import miniPlaceholder from "@/assets/posture/mini-leg-knee.svg";

/* ============ 3D 旋转人体模型 ============ */
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

/* ============ 顶部 Hero 区 ============ */
function Hero() {
  const [view, setView] = useState("正面");
  return (
    <div className="relative w-full h-[360px] bg-white overflow-hidden">
      <Model3D />

      <div className="absolute left-3 top-4 flex flex-col gap-3 z-10">
        <button className="w-9 h-9 rounded-full bg-white shadow-md border border-border flex items-center justify-center text-slate-500">
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
            className="px-3 py-1.5 text-[12px] rounded-full bg-white text-slate-600 border border-slate-200 shadow-sm"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ============ 子 Tab 栏（已移除，统一使用顶部共用 ReportTabs） ============ */

/* ============ 渐变滑块 ============ */
function GradientSlider({
  labels,
  position = 0.5,
}: {
  labels: [string, string, string];
  position?: number;
}) {
  return (
    <div className="px-2 pt-3 pb-1">
      <div
        className="relative h-2 rounded-full"
        style={{
          background:
            "linear-gradient(90deg,#ef4d5e 0%,#ef4d5e 35%,#3b82f6 35%,#3b82f6 65%,#ef4d5e 65%,#ef4d5e 100%)",
        }}
      >
        <div
          className="absolute -top-1.5 w-5 h-5 rounded-full bg-white border-2 border-sky-500 shadow"
          style={{ left: `calc(${position * 100}% - 10px)` }}
        />
      </div>
      <div className="mt-2 flex justify-between text-[12px] text-slate-500 px-0.5">
        {labels.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </div>
    </div>
  );
}

/* ============ 3 联小图（统一占位） ============ */
function MiniFigures({
  variant: _variant,
}: {
  variant: "shoulder" | "leg-knee" | "leg-back" | "calf";
}) {
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

/* ============ 带注释的主体姿态图 ============ */
function PostureFigure({
  variant,
}: {
  variant: "upper-side" | "shoulder-back" | "lower-side" | "lower-back";
}) {
  const imgMap = {
    "upper-side": upperSideImg,
    "shoulder-back": shoulderBackImg,
    "lower-side": lowerSideImg,
    "lower-back": lowerBackImg,
  };

  const overlays: Record<typeof variant, React.ReactNode> = {
    "upper-side": (
      <svg
        viewBox="0 0 110 200"
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="xMidYMid meet"
      >
        <line
          x1="55"
          y1="10"
          x2="55"
          y2="195"
          stroke="#86b4f0"
          strokeDasharray="3 3"
          strokeWidth="1"
        />
      </svg>
    ),
    "shoulder-back": (
      <svg
        viewBox="0 0 120 200"
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="xMidYMid meet"
      >
        <line
          x1="20"
          y1="48"
          x2="100"
          y2="48"
          stroke="#86b4f0"
          strokeDasharray="3 3"
          strokeWidth="1"
        />
      </svg>
    ),
    "lower-side": (
      <svg
        viewBox="0 0 110 200"
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="xMidYMid meet"
      >
        <line
          x1="55"
          y1="5"
          x2="55"
          y2="195"
          stroke="#86b4f0"
          strokeDasharray="3 3"
          strokeWidth="1"
        />
      </svg>
    ),
    "lower-back": (
      <svg
        viewBox="0 0 120 200"
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="xMidYMid meet"
      >
        <line
          x1="20"
          y1="50"
          x2="100"
          y2="50"
          stroke="#86b4f0"
          strokeDasharray="3 3"
          strokeWidth="1"
        />
      </svg>
    ),
  };

  return (
    <div
      className="relative w-full h-[240px] flex items-center justify-center"
      style={{
        backgroundImage:
          "repeating-linear-gradient(90deg, rgba(150,170,200,0.18) 0 1px, transparent 1px 24px)," +
          "repeating-linear-gradient(0deg, rgba(150,170,200,0.14) 0 1px, transparent 1px 24px)",
      }}
    >
      {overlays[variant]}
      <img src={imgMap[variant]} alt="" className="h-[92%] w-auto object-contain relative" />
    </div>
  );
}

function Badge3D() {
  return (
    <span className="ml-2 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-sky-500 text-white text-[10px] font-semibold">
      3D
    </span>
  );
}

/* ============ 整页 ============ */
export function PostureReport() {
  return (
    <div className="bg-[#eef3fa] min-h-screen">
      <Hero />

      <div className="px-4 pb-10">
        <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-[13px] px-3 py-2.5 flex items-start gap-2">
          <span className="text-amber-500">⚠</span>
          <span>由于您姿势变形原因，扫描数据可能存在一定的误差。</span>
        </div>

        <div
          className="mt-3 rounded-2xl p-4 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg,#dfeaf8 0%,#c9dcf5 60%,#b8d3f3 100%)" }}
        >
          <div className="text-[13px] text-slate-600">体型分析</div>
          <div className="mt-1 text-[20px] font-bold text-slate-800">您属于 H 型身材。</div>
          <p className="mt-2 text-[12px] leading-relaxed text-slate-600 max-w-[68%]">
            上下分布宽臀人数较少，整体曲线感不足，
            <br />
            肩、腰、臀宽度基本相近，需要通过穿搭优化。
          </p>
          <svg viewBox="0 0 60 120" className="absolute right-3 bottom-10 w-14 h-24 opacity-90">
            <ellipse cx="30" cy="14" rx="9" ry="11" fill="#94a3b8" />
            <path d="M16 28 Q30 22 44 28 L40 70 L20 70 Z" fill="#94a3b8" />
            <rect x="20" y="70" width="8" height="46" rx="3" fill="#94a3b8" />
            <rect x="32" y="70" width="8" height="46" rx="3" fill="#94a3b8" />
          </svg>
          <div className="mt-3 flex flex-wrap gap-2">
            {["轻度圆肩", "H型", "骨盆后倾", "含胸", "弓背"].map((t) => (
              <span
                key={t}
                className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-[11px] border border-amber-200"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <h3 className="mt-5 mb-2 px-1 text-[15px] font-semibold text-slate-800">头颈肩评估</h3>
        <div className="bg-white rounded-xl overflow-hidden border border-border">
          <div className="grid grid-cols-2 bg-sky-50 text-sky-700 text-[13px] font-medium">
            <div className="py-2.5 px-4">评估项目</div>
            <div className="py-2.5 px-4 text-right">状态</div>
          </div>
          {[
            ["长短颈", "标准"],
            ["XO 型腿", "标准"],
            ["弓背形态", "标准"],
            ["小腿形态", "标准"],
          ].map(([k, v]) => (
            <div key={k} className="grid grid-cols-2 border-t border-border text-[13px]">
              <div className="py-3.5 px-4 text-slate-700">{k}</div>
              <div className="py-3.5 px-4 text-right text-sky-600">{v}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 bg-white rounded-xl border border-border overflow-hidden">
          <PostureFigure variant="upper-side" />
          <div className="py-2.5 text-center text-[13px] text-slate-700 flex items-center justify-center">
            头颈形态
            <Badge3D />
          </div>
          <div className="text-center text-slate-400">⌄</div>
          <div className="py-2.5 text-center text-[13px] text-slate-700">肩背形态</div>
          <MiniFigures variant="shoulder" />
          <GradientSlider labels={["平肩", "较左", "较右"]} position={0.5} />
        </div>

        <h3 className="mt-5 mb-2 px-1 text-[15px] font-semibold text-slate-800">肩颈背面体态</h3>
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <PostureFigure variant="shoulder-back" />
          <div className="py-2.5 text-center text-[13px] text-slate-700">肩斜度</div>
          <MiniFigures variant="shoulder" />
          <GradientSlider labels={["平肩", "较左", "较右"]} position={0.5} />
          <div className="text-center text-slate-400 pb-2">⌄</div>
        </div>

        <h3 className="mt-5 mb-2 px-1 text-[15px] font-semibold text-slate-800">下肢侧面体态</h3>
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <PostureFigure variant="lower-side" />
          <div className="py-2.5 text-center text-[13px] text-slate-700 flex items-center justify-center">
            腿型形态
            <Badge3D />
          </div>
          <div className="py-2.5 text-center text-[13px] text-slate-700 flex items-center justify-center">
            膝盖形态
            <Badge3D />
          </div>
          <MiniFigures variant="leg-knee" />
          <GradientSlider labels={["", "", ""]} position={0.5} />
        </div>

        <h3 className="mt-5 mb-2 px-1 text-[15px] font-semibold text-slate-800">下肢背面体态</h3>
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <PostureFigure variant="lower-back" />
          <div className="py-2.5 text-center text-[13px] text-slate-700 flex items-center justify-center">
            XO 型腿
            <Badge3D />
          </div>
          <MiniFigures variant="leg-back" />
          <GradientSlider labels={["O 型腿", "标准", "X 型腿"]} position={0.5} />

          <div className="py-2.5 text-center text-[13px] text-slate-700 border-t border-border mt-2">
            小腿形态
          </div>
          <MiniFigures variant="calf" />
          <GradientSlider labels={["标准", "轻度小腿外翻", "重度小腿外翻"]} position={0.15} />
        </div>

        <p className="text-[12px] text-slate-400 text-center mt-6 leading-relaxed">
          ⓘ 小提示：人体姿态数据仅供参考，不作为医学诊断依据。
        </p>
      </div>
    </div>
  );
}
