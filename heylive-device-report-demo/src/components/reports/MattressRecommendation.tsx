import { useState } from "react";
import sidianMattress from "@/assets/heylive-sidian-mattress.jpg";

const ALL_MATERIALS = [
  "进口贝卡特600G高密36针针织印花面料",
  "4分25#深圳高密棉",
  "30g环保白色无纺布",
  "4分高密度亲柔软棉",
  "2分高密度亲柔软棉",
  "2分红色高密度慢回弹静音深睡棉",
  "500g弹力静音软棉毯",
  "七区独立袋装加固网",
  "500g抗菌棉",
  "2500g按摩有氧棉",
  "双循环3D透气底 / 豪华直立三边设计",
  "侧边高亮光机绣花工艺 + 1.5CM高密棉",
];

const CORE_MATERIALS = [ALL_MATERIALS[0], ALL_MATERIALS[3], ALL_MATERIALS[5], ALL_MATERIALS[7]];

function MaterialList({
  materials,
  numbered = false,
}: {
  materials: string[];
  numbered?: boolean;
}) {
  return (
    <div className={numbered ? "space-y-2" : "grid grid-cols-2 gap-x-3 gap-y-2"}>
      {materials.map((material, index) => (
        <div
          key={material}
          className="flex items-start gap-2 text-[11px] leading-[1.55] text-slate-600"
        >
          {numbered ? (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-50 text-[10px] font-semibold text-[#c9152f]">
              {index + 1}
            </span>
          ) : (
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#e31937]" />
          )}
          <span>{material}</span>
        </div>
      ))}
    </div>
  );
}

export function MattressRecommendation() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="mt-5" aria-labelledby="mattress-recommendation-title">
      <div className="mb-3 flex items-center gap-2 px-1">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-[14px] text-[#c9152f]">
          ✦
        </span>
        <h2 id="mattress-recommendation-title" className="text-[16px] font-semibold text-slate-800">
          床垫推荐
        </h2>
      </div>

      <div className="overflow-hidden rounded-2xl border border-red-100 bg-white shadow-[0_14px_36px_rgba(80,18,28,0.08)]">
        <div className="relative flex h-[220px] items-center justify-center overflow-hidden bg-[#fbfaf8] px-2">
          <img src={sidianMattress} alt="好奈斯蒂安床垫" className="h-full w-full object-contain" />
          <div className="absolute left-3 top-3 rounded-full bg-[#e31937] px-3 py-1 text-[12px] font-semibold text-white shadow-lg">
            AI 推荐
          </div>
          <div className="absolute right-3 top-3 rounded-full border border-emerald-200 bg-emerald-50/95 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
            绿色标签
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-[#c9152f]">
                HEYLIVE MATTRESS
              </div>
              <h3 className="mt-1 text-[22px] font-bold tracking-tight text-slate-900">斯蒂安</h3>
            </div>
            <div className="rounded-xl bg-red-50 px-3 py-2 text-right">
              <div className="text-[10px] text-red-400">适配 BMI</div>
              <div className="mt-0.5 text-[16px] font-bold tabular-nums text-[#c9152f]">16–24</div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2 text-[12px]">
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">
              1.8 × 2.0 × 30 cm
            </span>
            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-amber-700">软</span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">价格等级 3</span>
          </div>

          <div className="mt-4 rounded-xl bg-[#faf7f7] p-3">
            <div className="text-[12px] font-semibold text-slate-800">为什么适合您</div>
            <p className="mt-1.5 text-[12px] leading-5 text-slate-600">
              您的 BMI 为 18.8，处于斯蒂安 16–24
              的适配区间。软感亲柔层配合慢回弹静音深睡棉，能够缓释肩臀压力；七区独立袋装结构提供分区承托，符合当前软硬度偏好。
            </p>
          </div>

          <div className="mt-4">
            <div className="mb-2 text-[12px] font-semibold text-slate-800">核心配置</div>
            <MaterialList materials={CORE_MATERIALS} />
          </div>

          <button
            type="button"
            aria-expanded={expanded}
            aria-controls="sidian-full-configuration"
            onClick={() => setExpanded((value) => !value)}
            className="mt-4 flex w-full items-center justify-center gap-1.5 border-t border-slate-100 pt-3 text-[12px] font-medium text-[#c9152f] transition-colors hover:text-[#a81128]"
          >
            {expanded ? "收起完整配置" : "查看完整配置（12项）"}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`h-3.5 w-3.5 transition-transform ${expanded ? "rotate-180" : ""}`}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {expanded && (
            <div id="sidian-full-configuration" className="mt-3 rounded-xl bg-slate-50 p-3">
              <MaterialList materials={ALL_MATERIALS} numbered />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
