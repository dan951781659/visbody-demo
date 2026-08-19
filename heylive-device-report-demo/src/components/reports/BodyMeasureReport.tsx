import { useRef, useState } from "react";
import hero3d from "@/assets/posture/hero-3d.png";
import miniPlaceholder from "@/assets/posture/mini-leg-knee.svg";

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

/* 顶部数据卡：身高/体重/BMI */
function BodyStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(15,23,42,0.04)] p-3 flex flex-col items-center justify-center">
      <div className="w-9 h-9 mb-1 text-sky-500 flex items-center justify-center">{icon}</div>
      <div className="text-[12px] text-slate-500">{label}</div>
      <div className="mt-1 text-[20px] font-semibold text-slate-800 tabular-nums">{value}</div>
    </div>
  );
}

/* 围度小卡：左上点 + 大数字 + 标签 + 右侧小人 */
function MeasureCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(15,23,42,0.04)] p-3 relative">
      <span className="absolute top-3 left-3 w-1.5 h-1.5 rounded-full bg-sky-500" />
      <div className="flex items-center">
        <div className="flex-1 pl-3">
          <div className="text-[22px] font-semibold text-slate-800 tabular-nums leading-none">
            {value}
          </div>
          <div className="mt-1.5 text-[12px] text-slate-500">{label}</div>
        </div>
        <img
          src={miniPlaceholder}
          alt=""
          className="h-14 w-auto object-contain"
          style={{ filter: "hue-rotate(140deg) saturate(2.2) brightness(0.95)" }}
        />
      </div>
    </div>
  );
}

export function BodyMeasureReport() {
  const stats: { value: string; label: string }[] = [
    { value: "38.6", label: "颈围" },
    { value: "39.4", label: "肩宽" },
    { value: "15.1", label: "左腕围" },
    { value: "15.1", label: "右腕围" },
    { value: "55.1", label: "小腿围-左" },
    { value: "55.4", label: "小腿围-右" },
    { value: "56.8", label: "膝围" },
    { value: "32.6", label: "足踝围" },
  ];

  return (
    <div className="px-4 pt-4 space-y-4">
      {/* 3D Hero */}
      <Hero />

      {/* 顶部提示 */}
      <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5">
        <span className="w-5 h-5 rounded-full bg-amber-400 text-white text-[12px] font-bold flex items-center justify-center flex-none mt-0.5">
          !
        </span>
        <span className="text-[12.5px] text-amber-700 leading-relaxed">
          由于您未按照规范扫描（穿着衣物过厚或动作不标准），本页面采用
          AI+三维立体融合算法，为您呈现更接近真实净体测量的数据结果。
        </span>
      </div>

      {/* 身体数据 */}
      <div>
        <div className="flex items-center gap-1.5 mb-3 px-1">
          <span className="w-1 h-4 rounded bg-sky-500"></span>
          <h3 className="text-[15px] font-semibold text-slate-800">身体数据</h3>
          <span className="text-slate-300 text-xs">ⓘ</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <BodyStat
            label="身高(cm)"
            value="157.8"
            icon={
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="w-7 h-7"
              >
                <rect x="6" y="3" width="6" height="18" rx="1" />
                <path d="M12 6h2M12 9h3M12 12h2M12 15h3M12 18h2" />
              </svg>
            }
          />
          <BodyStat
            label="体重(kg)"
            value="46.9"
            icon={
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="w-7 h-7"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <circle cx="12" cy="12" r="3" />
                <path d="M12 9v3" />
              </svg>
            }
          />
          <BodyStat
            label="BMI"
            value="18.8"
            icon={
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="w-7 h-7"
              >
                <path d="M4 20a8 8 0 1 1 16 0" />
                <path d="M12 20l4-6" />
                <circle cx="12" cy="20" r="0.8" fill="currentColor" />
              </svg>
            }
          />
        </div>
      </div>

      {/* 详细数据 */}
      <div>
        <div className="flex items-center gap-1.5 mb-3 px-1">
          <span className="w-1 h-4 rounded bg-sky-500"></span>
          <h3 className="text-[15px] font-semibold text-slate-800">详细数据</h3>
          <span className="text-[12px] text-slate-400">(单位：cm)</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {stats.map((s) => (
            <MeasureCard key={s.label} value={s.value} label={s.label} />
          ))}
        </div>
      </div>

      {/* 底部提示 */}
      <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5">
        <span className="w-5 h-5 rounded-full bg-amber-400 text-white text-[12px] font-bold flex items-center justify-center flex-none mt-0.5">
          !
        </span>
        <div className="text-[12.5px] text-amber-700 leading-relaxed">
          系统检测到您本次测量状态异常，可能是因为穿着衣物过厚或动作不标准。测量状态异常可能会导致量体数据偏差，若想获得更精准的体征数据，建议您穿着贴身衣物重新测量。
        </div>
      </div>
    </div>
  );
}
